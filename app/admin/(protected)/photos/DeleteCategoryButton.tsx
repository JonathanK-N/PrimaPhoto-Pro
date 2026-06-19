"use client";

import { Trash2 } from "lucide-react";
import { deleteCategory } from "./actions";

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteCategory}
      onSubmit={(e) => {
        if (!confirm(`Supprimer la catégorie "${name}" et toutes ses photos ?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted transition-colors hover:text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Supprimer la catégorie
      </button>
    </form>
  );
}
