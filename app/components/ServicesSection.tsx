import Link from "next/link";
import { Heart, User, Sparkles, PartyPopper, Aperture, Mountain } from "lucide-react";
import Reveal from "./Reveal";

const services = [
  {
    icon: Heart,
    title: "Mariage",
    category: "Mariage",
    description:
      "De la préparation aux derniers feux d'artifice, nous immortalisons chaque émotion de votre plus beau jour.",
  },
  {
    icon: User,
    title: "Portrait",
    category: "Portrait",
    description:
      "Séances individuelles, familiales ou corporate, sublimées par une lumière naturelle et un style intemporel.",
  },
  {
    icon: Sparkles,
    title: "Mode & Éditorial",
    category: "Mode",
    description:
      "Collaborations avec créateurs et mannequins pour des shootings éditoriaux audacieux et raffinés.",
  },
  {
    icon: PartyPopper,
    title: "Événementiel",
    category: "Événementiel",
    description:
      "Conférences, lancements et célébrations couverts avec discrétion pour ne manquer aucun moment clé.",
  },
  {
    icon: Aperture,
    title: "Studio & Produit",
    category: "Studio",
    description:
      "Mise en scène en studio pour portraits dramatiques, packshots et campagnes publicitaires.",
  },
  {
    icon: Mountain,
    title: "Nature & Paysage",
    category: "Nature",
    description:
      "Explorations en pleine nature pour capturer la grandeur des paysages et la lumière qui les transforme.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-background-soft py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs tracking-[0.5em] uppercase text-accent">
            Ce que nous offrons
          </span>
          <h2 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
            Nos Services
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70">
            Chaque projet est unique. Découvrez nos domaines d&apos;expertise,
            pensés pour s&apos;adapter à votre univers et à votre histoire.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 0.1}>
              <Link
                href={`/portfolio?cat=${encodeURIComponent(service.category)}`}
                className="group relative flex h-full flex-col bg-background-card p-8 transition-colors duration-500 hover:bg-background lg:p-10"
              >
                <service.icon
                  className="h-8 w-8 text-accent transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.25}
                />
                <h3 className="mt-6 font-display text-2xl italic">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                  {service.description}
                </p>
                <span className="mt-6 inline-flex items-center text-xs tracking-[0.3em] uppercase text-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Découvrir →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
