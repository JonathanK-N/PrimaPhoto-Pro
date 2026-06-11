export type Category =
  | "Mariage"
  | "Portrait"
  | "Mode"
  | "Événementiel"
  | "Nature"
  | "Studio";

export type PortfolioImage = {
  id: number;
  src: string;
  alt: string;
  category: Category;
  featured?: boolean;
};

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const categories: Category[] = [
  "Mariage",
  "Portrait",
  "Mode",
  "Événementiel",
  "Nature",
  "Studio",
];

export const portfolioImages: PortfolioImage[] = [
  {
    id: 1,
    src: unsplash("photo-1519741497674-611481863552"),
    alt: "Portrait artistique en noir et blanc",
    category: "Portrait",
    featured: true,
  },
  {
    id: 2,
    src: unsplash("photo-1465495976277-4387d4b0b4c6"),
    alt: "Mariés s'embrassant au coucher du soleil",
    category: "Mariage",
    featured: true,
  },
  {
    id: 3,
    src: unsplash("photo-1485125639709-a60c3a500bf1"),
    alt: "Portrait de mode en studio",
    category: "Mode",
  },
  {
    id: 4,
    src: unsplash("photo-1492684223066-81342ee5ff30"),
    alt: "Cérémonie de mariage en extérieur",
    category: "Mariage",
  },
  {
    id: 5,
    src: unsplash("photo-1441986300917-64674bd600d8"),
    alt: "Forêt brumeuse en noir et blanc",
    category: "Nature",
    featured: true,
  },
  {
    id: 6,
    src: unsplash("photo-1517841905240-472988babdf9"),
    alt: "Portrait masculin en lumière naturelle",
    category: "Portrait",
  },
  {
    id: 7,
    src: unsplash("photo-1529139574466-a303027c1d8b"),
    alt: "Concert et ambiance de foule",
    category: "Événementiel",
  },
  {
    id: 8,
    src: unsplash("photo-1496843916299-590492c751f4"),
    alt: "Portrait studio sur fond sombre",
    category: "Studio",
    featured: true,
  },
  {
    id: 9,
    src: unsplash("photo-1469474968028-56623f02e42e"),
    alt: "Chaîne de montagnes majestueuse",
    category: "Nature",
  },
  {
    id: 10,
    src: unsplash("photo-1469371670807-013ccf25f16a"),
    alt: "Mariage, détails de robe",
    category: "Mariage",
  },
  {
    id: 11,
    src: unsplash("photo-1529626455594-4ff0802cfb7e"),
    alt: "Portrait de mode élégant",
    category: "Mode",
  },
  {
    id: 12,
    src: unsplash("photo-1517841905240-472988babdf9", 800),
    alt: "Portrait en lumière dramatique",
    category: "Portrait",
  },
  {
    id: 13,
    src: unsplash("photo-1511285560929-80b456fea0bc"),
    alt: "Mains des mariés avec alliances",
    category: "Mariage",
  },
  {
    id: 14,
    src: unsplash("photo-1492691527719-9d1e07e534b4"),
    alt: "Lac de montagne au lever du soleil",
    category: "Nature",
  },
  {
    id: 15,
    src: unsplash("photo-1503342217505-b0a15ec3261c"),
    alt: "Conférence et réseautage professionnel",
    category: "Événementiel",
  },
  {
    id: 16,
    src: unsplash("photo-1506634064465-9609a8e5b985"),
    alt: "Portrait artistique avec ombres",
    category: "Studio",
  },
  {
    id: 17,
    src: unsplash("photo-1500336624523-d727130c3328"),
    alt: "Modèle en pose éditoriale",
    category: "Mode",
  },
  {
    id: 18,
    src: unsplash("photo-1500648767791-00dcc994a43e"),
    alt: "Couple de mariés en contre-jour",
    category: "Mariage",
  },
];

export const getImagesByCategory = (category: Category | "Tous") =>
  category === "Tous"
    ? portfolioImages
    : portfolioImages.filter((img) => img.category === category);

export const featuredImages = portfolioImages.filter((img) => img.featured);
