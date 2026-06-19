"use client";

import { useActionState, useRef } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { uploadPhoto } from "./actions";

type Category = { id: string; name: string };

export default function UploadPhotoForm({ categories }: { categories: Category[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: { error?: string } | undefined, formData: FormData) => {
    const result = await uploadPhoto(prev, formData);
    if (!result?.error) {
      formRef.current?.reset();
    }
    return result;
  }, undefined);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 gap-4 rounded-sm border border-border bg-background-soft p-6 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="sm:col-span-2 lg:col-span-2">
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

      <div className="lg:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Catégorie *
        </label>
        <select
          required
          name="categoryId"
          defaultValue=""
          className="w-full rounded-sm border border-border bg-background-card px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="" disabled>
            Choisir
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2 lg:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Description (alt) *
        </label>
        <input
          required
          name="alt"
          type="text"
          placeholder="Description courte"
          className="w-full rounded-sm border border-border bg-background-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col justify-between lg:col-span-1">
        <label className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted">
          <input type="checkbox" name="featured" className="h-4 w-4" style={{ accentColor: "var(--accent)" }} />
          Mettre en avant
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Ajouter
        </button>
      </div>

      {state?.error && (
        <p className="sm:col-span-2 lg:col-span-5 text-sm text-red-400">{state.error}</p>
      )}
    </form>
  );
}
