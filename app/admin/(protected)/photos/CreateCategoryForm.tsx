"use client";

import { useActionState, useRef } from "react";
import { Plus } from "lucide-react";
import { createCategory } from "./actions";

export default function CreateCategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: { error?: string } | undefined, formData: FormData) => {
    const result = await createCategory(prev, formData);
    if (!result?.error) formRef.current?.reset();
    return result;
  }, undefined);

  return (
    <form ref={formRef} action={formAction} className="flex items-end gap-3">
      <div>
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Nouvelle catégorie
        </label>
        <input
          required
          name="name"
          type="text"
          placeholder="Ex. Boudoir"
          className="rounded-sm border border-border bg-background-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-full border border-accent px-4 py-2.5 text-xs tracking-[0.3em] uppercase text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-60"
      >
        <Plus className="h-3.5 w-3.5" />
        Ajouter
      </button>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
