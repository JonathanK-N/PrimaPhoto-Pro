import Image from "next/image";
import Reveal from "./Reveal";
import { getSettings } from "@/app/lib/settings";

export default async function StorySection() {
  const s = await getSettings();

  const stats = [
    { value: s["story.stat1Value"], label: s["story.stat1Label"] },
    { value: s["story.stat2Value"], label: s["story.stat2Label"] },
    { value: s["story.stat3Value"], label: s["story.stat3Label"] },
    { value: s["story.stat4Value"], label: s["story.stat4Label"] },
  ];

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
            <p className="font-display text-3xl italic text-accent">{s["story.founded"]}</p>
            <p className="mt-1 text-xs tracking-widest uppercase text-muted">
              {s["story.location"]}
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="text-xs tracking-[0.5em] uppercase text-accent">
              {s["story.kicker"]}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl leading-tight italic sm:text-5xl lg:text-6xl">
              {s["story.title"]}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/70">
              <p>{s["story.paragraph1"]}</p>
              <p>{s["story.paragraph2"]}</p>
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
