"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Lightbox from "./Lightbox";
import type { PhotoDTO } from "../lib/data";

type PortfolioGridProps = {
  images: PhotoDTO[];
  categoryNames: string[];
  initialCategory?: string;
};

export default function PortfolioGrid({
  images: allImages,
  categoryNames,
  initialCategory = "Tous",
}: PortfolioGridProps) {
  const [active, setActive] = useState<string>(initialCategory);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = ["Tous", ...categoryNames];

  const images = useMemo(
    () => (active === "Tous" ? allImages : allImages.filter((img) => img.category === active)),
    [active, allImages]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`rounded-full border px-5 py-2 text-xs tracking-[0.25em] uppercase transition-all duration-500 ${
              active === filter
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/60 hover:border-white hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {images.length === 0 ? (
        <p className="mt-16 text-center text-sm text-white/50">
          Aucune photo dans cette catégorie pour le moment.
        </p>
      ) : (
        <motion.div layout className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img, i) => (
            <motion.button
              layout
              key={img.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.06 }}
              onClick={() => setLightboxIndex(i)}
              className={`group relative mb-4 block w-full overflow-hidden rounded-sm break-inside-avoid aspect-[4/5]`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 transition-all duration-500 group-hover:opacity-100">
                <Plus className="h-6 w-6 text-white" strokeWidth={1.5} />
                <span className="px-4 text-center text-xs tracking-[0.3em] uppercase text-white">
                  {img.category}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
