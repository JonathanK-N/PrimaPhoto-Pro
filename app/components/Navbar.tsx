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
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl tracking-[0.2em] uppercase"
          onClick={() => setOpen(false)}
        >
          <Camera className="h-5 w-5 text-accent" strokeWidth={1.5} />
          Prima<span className="text-accent">Photo</span>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm tracking-widest uppercase text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden rounded-full border border-accent px-6 py-2.5 text-sm tracking-widest uppercase text-accent transition-colors duration-300 hover:bg-accent hover:text-background lg:inline-block"
        >
          Prendre rendez-vous
        </Link>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground lg:hidden"
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-border bg-background/95 px-6 pb-8 pt-4 backdrop-blur-md lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-4 text-base tracking-widest uppercase text-foreground/80 transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full border border-accent px-6 py-3 text-center text-sm tracking-widest uppercase text-accent transition-colors duration-300 hover:bg-accent hover:text-background"
            >
              Prendre rendez-vous
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
