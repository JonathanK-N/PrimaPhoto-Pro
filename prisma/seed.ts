import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";
import { defaultSettings } from "../app/lib/settings";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categoryNames = ["Mariage", "Portrait", "Mode", "Événementiel", "Nature", "Studio"];

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

const seedPhotos: { src: string; alt: string; category: string; featured?: boolean }[] = [
  { src: unsplash("photo-1519741497674-611481863552"), alt: "Portrait artistique en noir et blanc", category: "Portrait", featured: true },
  { src: unsplash("photo-1465495976277-4387d4b0b4c6"), alt: "Mariés s'embrassant au coucher du soleil", category: "Mariage", featured: true },
  { src: unsplash("photo-1485125639709-a60c3a500bf1"), alt: "Portrait de mode en studio", category: "Mode" },
  { src: unsplash("photo-1492684223066-81342ee5ff30"), alt: "Cérémonie de mariage en extérieur", category: "Mariage" },
  { src: unsplash("photo-1441986300917-64674bd600d8"), alt: "Forêt brumeuse en noir et blanc", category: "Nature", featured: true },
  { src: unsplash("photo-1517841905240-472988babdf9"), alt: "Portrait masculin en lumière naturelle", category: "Portrait" },
  { src: unsplash("photo-1529139574466-a303027c1d8b"), alt: "Concert et ambiance de foule", category: "Événementiel" },
  { src: unsplash("photo-1554151228-14d9def656e4"), alt: "Portrait artistique avec ombres", category: "Studio", featured: true },
  { src: unsplash("photo-1469474968028-56623f02e42e"), alt: "Chaîne de montagnes majestueuse", category: "Nature" },
  { src: unsplash("photo-1469371670807-013ccf25f16a"), alt: "Mariage, détails de robe", category: "Mariage" },
  { src: unsplash("photo-1529626455594-4ff0802cfb7e"), alt: "Portrait de mode élégant", category: "Mode" },
  { src: unsplash("photo-1511285560929-80b456fea0bc"), alt: "Mains des mariés avec alliances", category: "Mariage" },
  { src: unsplash("photo-1492691527719-9d1e07e534b4"), alt: "Lac de montagne au lever du soleil", category: "Nature" },
  { src: unsplash("photo-1503342217505-b0a15ec3261c"), alt: "Conférence et réseautage professionnel", category: "Événementiel" },
  { src: unsplash("photo-1500336624523-d727130c3328"), alt: "Modèle en pose éditoriale", category: "Mode" },
  { src: unsplash("photo-1500648767791-00dcc994a43e"), alt: "Couple de mariés en contre-jour", category: "Mariage" },
];

async function seedAdmin() {
  const count = await prisma.adminUser.count();
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD non définis, aucun admin créé.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({ data: { email, passwordHash } });
  console.log(`Admin créé: ${email}`);
}

async function seedCategories() {
  const count = await prisma.category.count();
  if (count > 0) return;

  await prisma.category.createMany({
    data: categoryNames.map((name, i) => ({ name, order: i })),
  });
  console.log("Catégories par défaut créées.");
}

async function seedPhotosFn() {
  const count = await prisma.photo.count();
  if (count > 0) return;

  const categories = await prisma.category.findMany();
  const byName = new Map(categories.map((c) => [c.name, c.id]));

  for (const [i, photo] of seedPhotos.entries()) {
    const categoryId = byName.get(photo.category);
    if (!categoryId) continue;
    await prisma.photo.create({
      data: {
        url: photo.src,
        alt: photo.alt,
        featured: Boolean(photo.featured),
        order: i,
        categoryId,
      },
    });
  }
  console.log("Photos de démonstration créées.");
}

const seedTestimonials = [
  {
    name: "Marie-Ève Tremblay",
    role: "Mariage — Domaine Lavande",
    quote:
      "Prima Photo a su capter l'émotion brute de notre mariage. Chaque photo raconte une partie de notre histoire. Un travail d'une élégance rare.",
  },
  {
    name: "Antoine Bélanger",
    role: "Portrait Corporate",
    quote:
      "Une approche professionnelle et un œil artistique impressionnant. Les portraits ont totalement transformé l'image de notre entreprise.",
  },
  {
    name: "Sofia Marchetti",
    role: "Shooting Mode & Éditorial",
    quote:
      "Une direction artistique impeccable, une ambiance détendue sur le plateau et un résultat final à couper le souffle. Je recommande sans hésiter.",
  },
  {
    name: "Julien Roy",
    role: "Lancement de Produit",
    quote:
      "Réactivité, créativité et sens du détail. Les photos de notre événement ont dépassé toutes nos attentes et ont fait sensation sur nos réseaux.",
  },
];

async function seedTestimonialsFn() {
  const count = await prisma.testimonial.count();
  if (count > 0) return;

  await prisma.testimonial.createMany({
    data: seedTestimonials.map((t) => ({ ...t, status: "APPROVED" })),
  });
  console.log("Témoignages de démonstration créés.");
}

async function seedSettings() {
  const existing = await prisma.siteSetting.findMany({ select: { key: true } });
  const existingKeys = new Set(existing.map((e) => e.key));
  const missing = Object.entries(defaultSettings).filter(([key]) => !existingKeys.has(key));
  if (missing.length === 0) return;

  await prisma.siteSetting.createMany({
    data: missing.map(([key, value]) => ({ key, value })),
  });
  console.log(`${missing.length} paramètre(s) de site initialisé(s).`);
}

async function main() {
  await seedAdmin();
  await seedCategories();
  await seedPhotosFn();
  await seedTestimonialsFn();
  await seedSettings();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
