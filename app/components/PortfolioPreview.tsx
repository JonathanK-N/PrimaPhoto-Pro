"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import type { PhotoDTO } from "../lib/data";

export default function PortfolioPreview({ images: featuredImages }: { images: PhotoDTO[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" className="bg-black py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-xs tracking-[0.5em] uppercase text-white/50">
              Portfolio
            </span>
            <h2 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
              Quelques Récits en Images
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex shrink-0 items-center gap-2 text-sm tracking-[0.3em] uppercase text-white/60 transition-colors hover:text-white"
          >
            Voir tout
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featuredImages.map((img, i) => (
            <Reveal
              key={img.id}
              delay={i * 0.1}
              className={i === 0 ? "col-span-2 row-span-2" : ""}
            >
              <button
                onClick={() => setLightboxIndex(i)}
                className={`group relative block w-full overflow-hidden rounded-sm ${
                  i === 0 ? "aspect-square sm:aspect-[4/3]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/40" />
                <span className="absolute bottom-4 left-4 text-xs tracking-[0.3em] uppercase text-white opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                  {img.category}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        images={featuredImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
