import type { Metadata } from "next";
import { Star } from "lucide-react";
import { getApprovedTestimonials } from "@/app/lib/data";
import Reveal from "@/app/components/Reveal";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Avis clients | Prima Photo",
  description: "Découvrez les avis de nos clients et partagez votre propre expérience avec Prima Photo.",
};

export default async function AvisPage() {
  const testimonials = await getApprovedTestimonials();

  return (
    <div className="bg-background pb-28 pt-36 lg:pt-44">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs tracking-[0.5em] uppercase text-accent">Avis clients</span>
          <h1 className="mt-4 font-display text-4xl italic sm:text-5xl lg:text-6xl">
            Leurs Mots, Notre Fierté
          </h1>
          <p className="mt-6 text-base leading-relaxed text-foreground/70">
            Découvrez ce que nos clients pensent de leur expérience avec Prima Photo,
            et partagez la vôtre.
          </p>
        </div>

        {testimonials.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-sm border border-border bg-background-soft p-6">
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-xs tracking-widest uppercase">{t.name}</p>
                  {t.role && (
                    <p className="mt-1 text-xs tracking-widest uppercase text-muted">{t.role}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-20 border-t border-border pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl italic sm:text-4xl">Partagez votre expérience</h2>
            <p className="mt-4 text-sm text-foreground/70">
              Votre avis sera publié sur le site après validation par notre équipe.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl rounded-sm border border-border bg-background-soft p-6 sm:p-10">
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  );
}
