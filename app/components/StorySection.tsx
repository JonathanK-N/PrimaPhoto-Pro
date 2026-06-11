import Image from "next/image";
import Reveal from "./Reveal";

const stats = [
  { value: "12+", label: "Années d'expérience" },
  { value: "850+", label: "Séances réalisées" },
  { value: "300+", label: "Clients comblés" },
  { value: "15", label: "Prix & distinctions" },
];

export default function StorySection() {
  return (
    <section id="histoire" className="relative overflow-hidden bg-background py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1400&auto=format&fit=crop"
              alt="Le photographe de Prima Photo au travail"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale"
            />
          </div>
          <div className="absolute -bottom-8 -right-6 hidden w-48 rounded-sm border border-accent/40 bg-background-soft p-6 shadow-2xl sm:-right-10 sm:block">
            <p className="font-display text-3xl italic text-accent">Depuis 2013</p>
            <p className="mt-1 text-xs tracking-widest uppercase text-muted">
              Studio basé à Montréal
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="text-xs tracking-[0.5em] uppercase text-accent">
              Notre Histoire
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl leading-tight italic sm:text-5xl lg:text-6xl">
              L&apos;art de figer
              <br />
              l&apos;émotion dans le temps
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/70">
              <p>
                Tout a commencé par une vieille pellicule argentique et une
                fascination pour la lumière. Aujourd&apos;hui, Prima Photo est
                devenu un studio reconnu, où chaque séance est pensée comme un
                chapitre d&apos;une histoire plus grande : la vôtre.
              </p>
              <p>
                Notre approche mêle élégance intemporelle et regard moderne.
                Nous ne photographions pas seulement des visages ou des
                lieux — nous racontons des récits, capturons des regards
                fugaces et révélons la beauté brute de chaque instant.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-accent sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs tracking-widest uppercase text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
