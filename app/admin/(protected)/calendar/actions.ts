"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";

export type SlotState = { error?: string } | undefined;

export async function createSlot(_state: SlotState, formData: FormData): Promise<SlotState> {
  await requireAdmin();

  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const duration = Number(formData.get("duration") || 90);

  if (!date || !time) {
    return { error: "Veuillez choisir une date et une heure." };
  }

  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) {
    return { error: "Date ou heure invalide." };
  }
  if (start.getTime() < Date.now()) {
    return { error: "Le créneau doit être dans le futur." };
  }

  const end = new Date(start.getTime() + duration * 60_000);

  await prisma.availabilitySlot.create({ data: { start, end } });

  revalidatePath("/admin/calendar");
  revalidatePath("/contact");
  return undefined;
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
