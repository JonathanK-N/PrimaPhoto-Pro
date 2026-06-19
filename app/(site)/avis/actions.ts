"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";

export type ReviewState = { success?: boolean; error?: string } | undefined;

export async function submitTestimonial(
  _state: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const quote = String(formData.get("quote") || "").trim();
  const rating = Number(formData.get("rating") || 5);

  if (!name || !quote) {
    return { error: "Veuillez remplir votre nom et votre avis." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Note invalide." };
  }

  await prisma.testimonial.create({
    data: { name, role: role || null, quote, rating, status: "PENDING" },
  });

  revalidatePath("/admin/testimonials");
  return { success: true };
}
