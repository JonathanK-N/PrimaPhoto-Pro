"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.5 },
  },
};

const word = {
  hidden: { y: "120%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type HeroProps = {
  kicker: string;
  title: string;
  subtitle: string;
};

export default function Hero({ kicker, title, subtitle }: HeroProps) {
  const words = title.split(" ");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.85]);

  return (
    <section
      ref={ref}
      className="relative flex h-svh min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2400&auto=format&fit=crop"
          alt="Photographie artistique"
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-6 inline-block text-xs uppercase text-white/70"
        >
          {kicker}
        </motion.span>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display text-5xl leading-[1.05] font-medium italic sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {words.map((w, i) => (
            <span key={i} className="mr-3 inline-block overflow-hidden align-bottom last:mr-0 sm:mr-4">
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-8 max-w-xl text-balance text-base leading-relaxed text-white/60 sm:text-lg"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/portfolio"
            className="rounded-full border border-white/30 px-8 py-3.5 text-sm tracking-widest uppercase transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
          >
            Voir le Portfolio
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-white px-8 py-3.5 text-sm tracking-widest text-black uppercase transition-all duration-500 hover:bg-white/90 hover:scale-105"
          >
            Réserver une Séance
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-[10px] tracking-[0.5em] uppercase">Découvrir</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
