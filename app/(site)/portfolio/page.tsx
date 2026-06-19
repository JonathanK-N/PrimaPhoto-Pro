import type { Metadata } from "next";
import PortfolioGrid from "@/app/components/PortfolioGrid";
import { getCategoryNames, getPhotos } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Portfolio | Prima Photo",
  description:
    "Explorez notre portfolio par catégorie : mariage, portrait, mode, événementiel, nature et studio.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const [categoryNames, images] = await Promise.all([getCategoryNames(), getPhotos()]);
  const initialCategory = cat && categoryNames.includes(cat) ? cat : "Tous";

  return (
    <div className="bg-background pb-28 pt-36 lg:pt-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs tracking-[0.5em] uppercase text-accent">
            Galerie
          </span>
          <h1 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
            Portfolio
          </h1>
          <p className="mt-6 text-base leading-relaxed text-foreground/70">
            Une sélection de nos réalisations, classées par univers. Chaque
            image est un fragment d&apos;une histoire vécue.
          </p>
        </div>

        <div className="mt-16">
          <PortfolioGrid
            key={initialCategory}
            images={images}
            categoryNames={categoryNames}
            initialCategory={initialCategory}
          />
        </div>
      </div>
    </div>
  );
}
