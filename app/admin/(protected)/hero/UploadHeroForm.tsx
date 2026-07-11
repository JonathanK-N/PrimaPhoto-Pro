"use client";

import { useActionState, useRef } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { uploadHero } from "./actions";

export default function UploadHeroForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    async (prev: { error?: string } | undefined, formData: FormData) => {
      const result = await uploadHero(prev, formData);
      if (!result?.error) formRef.current?.reset();
      return result;
    },
    undefined
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-wrap items-end gap-4 rounded-sm border border-border bg-background-soft p-6"
    >
      <div className="flex-1 min-w-[200px]">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Image *
        </label>
        <input
          required
          type="file"
          name="file"
          accept="image/*"
          className="w-full rounded-sm border border-border bg-background-card px-3 py-2.5 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:uppercase file:text-background"
        />
      </div>
      <div className="min-w-[200px]">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Description (alt)
        </label>
        <input
          name="alt"
          type="text"
          placeholder="Description de l'image"
          className="w-full rounded-sm border border-border bg-background-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
        Ajouter
      </button>
      {state?.error && <p className="w-full text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
