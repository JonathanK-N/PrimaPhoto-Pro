"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";
import { uploadHeroImage, deleteImage } from "@/app/lib/cloudinary";

export async function uploadHero(_state: { error?: string } | undefined, formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const alt = String(formData.get("alt") || "").trim() || "Image Hero";

  if (!file || file.size === 0) return { error: "Veuillez choisir une image." };

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { url, publicId } = await uploadHeroImage(buffer, file.type, alt);
    const count = await prisma.heroImage.count();

    await prisma.heroImage.create({
      data: { url, publicId, alt, active: count === 0, order: count },
    });
  } catch (err) {
    console.error(err);
    return { error: "Échec de l'envoi. Vérifiez la configuration Cloudinary." };
  }

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function deleteHero(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const image = await prisma.heroImage.findUnique({ where: { id } });
  if (!image) return;

  if (image.publicId) {
    try { await deleteImage(image.publicId); } catch (e) { console.error(e); }
  }

  await prisma.heroImage.delete({ where: { id } });
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function setActiveHero(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.heroImage.updateMany({ data: { active: false } });
  await prisma.heroImage.update({ where: { id }, data: { active: true } });

  revalidatePath("/admin/hero");
  revalidatePath("/");
}
