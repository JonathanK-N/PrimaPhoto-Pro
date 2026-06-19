"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";

export async function cancelBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return;

  await prisma.$transaction([
    prisma.booking.update({ where: { id }, data: { status: "CANCELED" } }),
    prisma.availabilitySlot.update({ where: { id: booking.slotId }, data: { isBooked: false } }),
  ]);

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin");
  revalidatePath("/contact");
}
