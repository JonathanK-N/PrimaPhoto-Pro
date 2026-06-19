import { prisma } from "./prisma";

export type PhotoDTO = {
  id: string;
  src: string;
  alt: string;
  category: string;
  featured?: boolean;
};

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getCategoryNames() {
  const categories = await getCategories();
  return categories.map((c) => c.name);
}

export async function getPhotos(categoryName?: string): Promise<PhotoDTO[]> {
  const photos = await prisma.photo.findMany({
    where: categoryName ? { category: { name: categoryName } } : undefined,
    include: { category: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return photos.map((p) => ({
    id: p.id,
    src: p.url,
    alt: p.alt,
    category: p.category.name,
    featured: p.featured,
  }));
}

export async function getFeaturedPhotos(limit = 4): Promise<PhotoDTO[]> {
  const photos = await prisma.photo.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { order: "asc" },
    take: limit,
  });

  return photos.map((p) => ({
    id: p.id,
    src: p.url,
    alt: p.alt,
    category: p.category.name,
  }));
}
