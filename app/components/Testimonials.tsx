"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Reveal from "./Reveal";

const testimonials = [
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

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="temoignages" className="relative overflow-hidden bg-background-soft py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <span className="text-xs tracking-[0.5em] uppercase text-accent">
            Témoignages
          </span>
          <h2 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
            Ils Nous Ont Confié Leurs Souvenirs
          </h2>
        </Reveal>

        <div className="relative mt-16 flex min-h-[280px] flex-col items-center justify-center sm:min-h-[240px]">
          <Quote className="mb-6 h-10 w-10 text-accent" strokeWidth={1.25} />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <p className="font-display text-xl italic leading-relaxed sm:text-2xl lg:text-3xl">
                &ldquo;{testimonials[index].quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent" />
                ))}
              </div>
              <p className="mt-4 text-sm tracking-widest uppercase">
                {testimonials[index].name}
              </p>
              <p className="mt-1 text-xs tracking-widest uppercase text-muted">
                {testimonials[index].role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              aria-label={`Témoignage de ${t.name}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-accent" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
