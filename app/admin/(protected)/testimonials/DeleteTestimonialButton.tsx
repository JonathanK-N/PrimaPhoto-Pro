"use client";

import { Trash2 } from "lucide-react";
import { deleteTestimonial } from "./actions";

export default function DeleteTestimonialButton({ id }: { id: string }) {
  return (
    <form
      action={deleteTestimonial}
      onSubmit={(e) => {
        if (!confirm("Supprimer définitivement cet avis ?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex items-center gap-1.5 text-xs uppercase text-muted transition-colors hover:text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Supprimer
      </button>
    </form>
  );
}
