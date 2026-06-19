"use client";

import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { deletePhoto, toggleFeatured } from "./actions";

type Photo = {
  id: string;
  url: string;
  alt: string;
  featured: boolean;
};

export default function PhotoCard({ photo }: { photo: Photo }) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-border">
      <div className="relative aspect-square">
        <Image src={photo.url} alt={photo.alt} fill sizes="200px" className="object-cover" />
      </div>
      <p className="truncate px-2 py-1.5 text-xs text-foreground/70">{photo.alt}</p>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <form action={toggleFeatured}>
          <input type="hidden" name="id" value={photo.id} />
          <button
            type="submit"
            title="Mettre en avant"
            className={`flex h-8 w-8 items-center justify-center rounded-full border ${
              photo.featured ? "border-accent bg-accent text-background" : "border-border bg-background/80 text-foreground"
            }`}
          >
            <Star className="h-4 w-4" fill={photo.featured ? "currentColor" : "none"} />
          </button>
        </form>

        <form
          action={deletePhoto}
          onSubmit={(e) => {
            if (!confirm("Supprimer cette photo ?")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={photo.id} />
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
  );
}
