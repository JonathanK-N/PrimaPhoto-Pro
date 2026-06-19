"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/session";
import { uploadImage, deleteImage } from "@/app/lib/cloudinary";

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/portfolio");
}

export async function uploadPhoto(_state: { error?: string } | undefined, formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const alt = String(formData.get("alt") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const featured = formData.get("featured") === "on";

  if (!file || file.size === 0) return { error: "Veuillez choisir une image." };
  if (!alt) return { error: "Veuillez décrire l'image (texte alternatif)." };
  if (!categoryId) return { error: "Veuillez choisir une catégorie." };

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { url, publicId } = await uploadImage(buffer, file.type, alt);
    const count = await prisma.photo.count({ where: { categoryId } });

    await prisma.photo.create({
      data: { url, publicId, alt, categoryId, featured, order: count },
    });
  } catch (err) {
    console.error(err);
    return { error: "Échec de l'envoi de l'image. Vérifiez la configuration Cloudinary." };
  }

  revalidatePath("/admin/photos");
  revalidatePublicPages();
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return;

  if (photo.publicId) {
    try {
      await deleteImage(photo.publicId);
    } catch (err) {
      console.error("Échec suppression Cloudinary:", err);
    }
  }

  await prisma.photo.delete({ where: { id } });
  revalidatePath("/admin/photos");
  revalidatePublicPages();
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return;

  await prisma.photo.update({ where: { id }, data: { featured: !photo.featured } });
  revalidatePath("/admin/photos");
  revalidatePublicPages();
}

export async function createCategory(_state: { error?: string } | undefined, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Veuillez entrer un nom de catégorie." };

  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) return { error: "Cette catégorie existe déjà." };

  const count = await prisma.category.count();
  await prisma.category.create({ data: { name, order: count } });

  revalidatePath("/admin/photos");
  revalidatePublicPages();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const photos = await prisma.photo.findMany({ where: { categoryId: id } });
  await Promise.all(
    photos
      .filter((p) => p.publicId)
      .map((p) => deleteImage(p.publicId!).catch((err) => console.error(err)))
  );

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/photos");
  revalidatePublicPages();
}
