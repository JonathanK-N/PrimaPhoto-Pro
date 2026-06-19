"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/avis");
}

export async function approveTestimonial(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.testimonial.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/admin/testimonials");
  revalidatePublicPages();
}

export async function rejectTestimonial(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.testimonial.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/testimonials");
  revalidatePublicPages();
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePublicPages();
}
