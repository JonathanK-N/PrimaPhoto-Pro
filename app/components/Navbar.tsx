"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Camera } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/#histoire", label: "Histoire" },
  { href: "/#services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#temoignages", label: "Témoignages" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-black/90 backdrop-blur-lg border-b border-white/5 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl tracking-[0.2em] uppercase"
          onClick={() => setOpen(false)}
        >
          <Camera className="h-5 w-5 text-white" strokeWidth={1.5} />
          Pr<span className="lowercase">i</span>ma<span className="text-white">Photo</span>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm tracking-widest uppercase text-white/60 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden rounded-full border border-white/30 px-6 py-2.5 text-sm tracking-widest uppercase text-white transition-all duration-500 hover:bg-white hover:text-black lg:inline-block"
        >
          Prendre rendez-vous
        </Link>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="text-white lg:hidden"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-white/5 bg-black/95 px-6 pb-8 pt-4 backdrop-blur-lg lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-4 text-base tracking-widest uppercase text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full border border-white/30 px-6 py-3 text-center text-sm tracking-widest uppercase text-white transition-all duration-500 hover:bg-white hover:text-black"
            >
              Prendre rendez-vous
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
