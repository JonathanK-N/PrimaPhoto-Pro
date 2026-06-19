import { Check, Star, X } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import { approveTestimonial, rejectTestimonial } from "./actions";
import DeleteTestimonialButton from "./DeleteTestimonialButton";

export default async function AdminTestimonialsPage() {
  const [pending, others] = await Promise.all([
    prisma.testimonial.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" } }),
    prisma.testimonial.findMany({
      where: { status: { in: ["APPROVED", "REJECTED"] } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl italic">Avis clients</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Approuvez les avis qui apparaîtront sur le site, ou rejetez ceux que vous ne souhaitez pas publier.
      </p>

      <h2 className="mt-10 font-display text-xl italic text-accent">
        En attente ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/50">Aucun avis en attente.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {pending.map((t) => (
            <div key={t.id} className="rounded-sm border border-border bg-background-soft p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-accent" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    {t.name}
                    {t.role && <span className="text-muted"> · {t.role}</span>}
                  </p>
                  <p className="mt-2 max-w-xl text-sm text-foreground/70">{t.quote}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={approveTestimonial}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-full border border-accent px-4 py-2 text-xs tracking-widest uppercase text-accent transition-colors hover:bg-accent hover:text-background"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approuver
                    </button>
                  </form>
                  <form action={rejectTestimonial}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs tracking-widest uppercase text-foreground/70 transition-colors hover:border-red-400 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                      Rejeter
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-12 font-display text-xl italic">Historique</h2>
      {others.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/50">Aucun avis traité pour le moment.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-sm border border-border">
          {others.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background-soft px-5 py-4 last:border-b-0"
            >
              <div>
                <p className="text-sm">
                  {t.name}
                  {t.role && <span className="text-muted"> · {t.role}</span>}
                </p>
                <p className="mt-1 max-w-xl truncate text-xs text-foreground/60">{t.quote}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-widest uppercase ${
                    t.status === "APPROVED"
                      ? "border border-accent text-accent"
                      : "border border-border text-muted"
                  }`}
                >
                  {t.status === "APPROVED" ? "Publié" : "Rejeté"}
                </span>
                <DeleteTestimonialButton id={t.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
