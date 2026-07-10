"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";

export type SlotState = { error?: string; success?: boolean } | undefined;

export async function createSlots(
  dates: string[],
  time: string,
  duration: number
): Promise<SlotState> {
  await requireAdmin();

  if (!dates.length || !time) {
    return { error: "Veuillez sélectionner au moins un jour et une heure." };
  }

  const now = Date.now();
  const slots: { start: Date; end: Date }[] = [];

  for (const date of dates) {
    const start = new Date(`${date}T${time}:00`);
    if (Number.isNaN(start.getTime())) return { error: `Date invalide : ${date}` };
    if (start.getTime() < now) continue;
    slots.push({ start, end: new Date(start.getTime() + duration * 60_000) });
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
