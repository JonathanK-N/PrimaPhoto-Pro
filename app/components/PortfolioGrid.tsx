"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Lightbox from "./Lightbox";
import { categories, portfolioImages, type Category } from "../lib/portfolio-data";

type PortfolioGridProps = {
  initialCategory?: Category | "Tous";
};

const filters: (Category | "Tous")[] = ["Tous", ...categories];

export default function PortfolioGrid({ initialCategory = "Tous" }: PortfolioGridProps) {
  const [active, setActive] = useState<Category | "Tous">(initialCategory);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = useMemo(
    () =>
      active === "Tous"
        ? portfolioImages
        : portfolioImages.filter((img) => img.category === active),
    [active]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`rounded-full border px-5 py-2 text-xs tracking-[0.25em] uppercase transition-colors duration-300 ${
              active === filter
                ? "border-accent bg-accent text-background"
                : "border-border text-foreground/70 hover:border-accent hover:text-accent"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3"
      >
        {images.map((img, i) => (
          <motion.button
            layout
            key={img.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            onClick={() => setLightboxIndex(i)}
            className={`group relative mb-4 block w-full overflow-hidden rounded-sm break-inside-avoid ${
              i % 5 === 0 ? "aspect-[3/4]" : i % 3 === 0 ? "aspect-square" : "aspect-[4/5]"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <Plus className="h-6 w-6 text-accent" strokeWidth={1.5} />
              <span className="px-4 text-center text-xs tracking-[0.3em] uppercase text-foreground">
                {img.category}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
