"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const title = ["Chaque", "Instant", "Raconte", "une", "Histoire"];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.4 },
  },
};

const word = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative flex h-svh min-h-[640px] w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2400&auto=format&fit=crop"
          alt="Photographie artistique au coucher du soleil"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 inline-block text-xs tracking-[0.5em] uppercase text-accent"
        >
          Studio de Photographie Professionnel
        </motion.span>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display text-5xl leading-[1.1] font-medium italic sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {title.map((w, i) => (
            <span key={i} className="mr-3 inline-block overflow-hidden align-bottom last:mr-0 sm:mr-4">
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-8 max-w-xl text-balance text-base leading-relaxed text-foreground/75 sm:text-lg"
        >
          Mariages, portraits, mode et événements — Prima Photo capture la
          lumière, l&apos;émotion et le détail pour transformer vos moments en
          œuvres intemporelles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/portfolio"
            className="rounded-full border border-foreground/30 px-8 py-3.5 text-sm tracking-widest uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Voir le Portfolio
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-accent px-8 py-3.5 text-sm tracking-widest text-background uppercase transition-transform duration-300 hover:scale-105"
          >
            Réserver une Séance
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-foreground/60"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase">Découvrir</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
