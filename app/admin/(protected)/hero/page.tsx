import Image from "next/image";
import { Trash2, Check } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import UploadHeroForm from "./UploadHeroForm";
import { deleteHero, setActiveHero } from "./actions";

export default async function AdminHeroPage() {
  const images = await prisma.heroImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl italic">Image du Hero</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Gérez l&apos;image d&apos;arrière-plan de la section Hero sur la page d&apos;accueil.
        L&apos;image active sera affichée aux visiteurs.
      </p>

      <div className="mt-8">
        <UploadHeroForm />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <p className="text-sm text-foreground/50 col-span-full">
            Aucune image. L&apos;image par défaut sera utilisée.
          </p>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden rounded-sm border ${
                img.active ? "border-accent" : "border-border"
              }`}
            >
              <div className="relative aspect-video">
                <Image src={img.url} alt={img.alt} fill sizes="400px" className="object-cover" />
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-muted truncate">{img.alt}</span>
                {img.active && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] tracking-widest uppercase text-background">
                    Active
                  </span>
                )}
              </div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.active && (
                  <form action={setActiveHero}>
                    <input type="hidden" name="id" value={img.id} />
                    <button
                      type="submit"
                      title="Définir comme active"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </form>
                )}
                {img.active && <div />}
                <form
                  action={deleteHero}
                  onSubmit={(e) => {
                    if (!confirm("Supprimer cette image ?")) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={img.id} />
                  <button
                    type="submit"
                    title="Supprimer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:border-red-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
