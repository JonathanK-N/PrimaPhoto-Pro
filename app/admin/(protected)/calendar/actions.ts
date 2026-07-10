"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";

const TZ = "America/Montreal";

function toUTC(date: string, time: string): Date {
  // Build a locale string in the target timezone then compute UTC
  const local = new Date(`${date}T${time}:00`);
  // Get the offset for that specific date/time in the target TZ
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  // Find offset by comparing: we know what local time we want in TZ,
  // so we iterate to find the UTC instant that corresponds.
  // Simpler approach: use the TZ offset for that date.
  const utcGuess = new Date(`${date}T${time}:00Z`);
  const parts = formatter.formatToParts(utcGuess);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const tzTime = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`;
  const rendered = new Date(tzTime);
  const offsetMs = rendered.getTime() - utcGuess.getTime();
  // The actual UTC time = desired local time - offset
  return new Date(local.getTime() - offsetMs);
}

export type SlotState = { error?: string; success?: boolean } | undefined;

export async function createSlots(
  dates: string[],
  times: string[],
  duration: number
): Promise<SlotState> {
  await requireAdmin();

  if (!dates.length || !times.length) {
    return { error: "Veuillez sélectionner au moins un jour et une heure." };
  }

  const now = Date.now();
  const slots: { start: Date; end: Date }[] = [];

  for (const date of dates) {
    for (const time of times) {
      const start = toUTC(date, time);
      if (Number.isNaN(start.getTime())) return { error: `Date invalide : ${date} ${time}` };
      if (start.getTime() < now) continue;
      slots.push({ start, end: new Date(start.getTime() + duration * 60_000) });
    }
  }

  if (!slots.length) return { error: "Tous les créneaux sélectionnés sont dans le passé." };

  await prisma.availabilitySlot.createMany({ data: slots });

  revalidatePath("/admin/calendar");
  revalidatePath("/contact");
  return { success: true };
}

export async function deleteSlot(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const slot = await prisma.availabilitySlot.findUnique({ where: { id } });
  if (!slot || slot.isBooked) return;

  await prisma.availabilitySlot.delete({ where: { id } });
  revalidatePath("/admin/calendar");
  revalidatePath("/contact");
}
