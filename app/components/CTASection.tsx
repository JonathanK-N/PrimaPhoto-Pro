import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { getSettings } from "@/app/lib/settings";

export default async function CTASection() {
  const s = await getSettings();

  return (
    <section className="relative overflow-hidden py-32 lg:py-40">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2400&auto=format&fit=crop"
          alt="Paysage de montagne au lever du soleil"
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="text-xs tracking-[0.5em] uppercase text-accent">
            Prêt à commencer ?
          </span>
          <h2 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
            {s["cta.title"]}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70">
            {s["cta.subtitle"]}
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-accent px-10 py-4 text-sm tracking-widest text-background uppercase transition-transform duration-300 hover:scale-105"
          >
            Prendre Rendez-vous
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
