"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star, PenLine } from "lucide-react";
import Reveal from "./Reveal";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
};

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="temoignages" className="relative overflow-hidden bg-background-soft py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <span className="text-xs tracking-[0.5em] uppercase text-white/50">
            Témoignages
          </span>
          <h2 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
            Ils Nous Ont Confié Leurs Souvenirs
          </h2>
        </Reveal>

        {testimonials.length === 0 ? (
          <p className="mt-12 text-base text-white/60">
            Soyez le premier à partager votre expérience avec Prima Photo.
          </p>
        ) : (
          <>
            <div className="relative mt-16 flex min-h-[280px] flex-col items-center justify-center sm:min-h-[240px]">
              <Quote className="mb-6 h-10 w-10 text-white/20" strokeWidth={1} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonials[index].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center"
                >
                  <p className="font-display text-xl italic leading-relaxed sm:text-2xl lg:text-3xl">
                    &ldquo;{testimonials[index].quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-1 text-white">
                    {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-white" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm tracking-widest uppercase">
                    {testimonials[index].name}
                  </p>
                  {testimonials[index].role && (
                    <p className="mt-1 text-xs tracking-widest uppercase text-white/50">
                      {testimonials[index].role}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex justify-center gap-3">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  aria-label={`Témoignage de ${t.name}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-8 bg-white" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <Link
          href="/avis"
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-xs tracking-[0.3em] uppercase text-white transition-all duration-500 hover:bg-white hover:text-black"
        >
          <PenLine className="h-3.5 w-3.5" />
          Laisser un avis
        </Link>
      </div>
    </section>
  );
}
