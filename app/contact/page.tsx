import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import BookingForm from "../components/BookingForm";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Rendez-vous | Prima Photo",
  description:
    "Réservez votre séance photo avec Prima Photo. Mariage, portrait, mode, événementiel et plus.",
};

const infos = [
  {
    icon: MapPin,
    label: "Studio",
    value: "123 Rue de la Lumière, Montréal, QC",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+1 (514) 555-0192",
  },
  {
    icon: Mail,
    label: "Courriel",
    value: "hello@primaphoto.studio",
  },
  {
    icon: Clock,
    label: "Disponibilités",
    value: "Lun – Sam · 9h00 – 18h00",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-background pb-28 pt-36 lg:pt-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs tracking-[0.5em] uppercase text-accent">
            Contact
          </span>
          <h1 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
            Prenons Rendez-vous
          </h1>
          <p className="mt-6 text-base leading-relaxed text-foreground/70">
            Remplissez le formulaire ci-dessous avec les détails de votre
            projet. Nous reviendrons vers vous rapidement pour planifier
            votre séance et donner vie à votre vision.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          <Reveal className="lg:col-span-1">
            <div className="space-y-8">
              {infos.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent">
                    <info.icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-muted">
                      {info.label}
                    </p>
                    <p className="mt-1 text-sm text-foreground/80">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-border pt-8">
              <p className="font-display text-xl italic text-accent">
                &ldquo;Chaque rendez-vous est le point de départ d&apos;une
                nouvelle histoire.&rdquo;
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="rounded-sm border border-border bg-background-soft p-6 sm:p-10">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
