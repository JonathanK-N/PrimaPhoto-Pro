"use client";

import { useActionState, useRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { createSlot } from "./actions";

export default function CreateSlotForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: { error?: string } | undefined, formData: FormData) => {
    const result = await createSlot(prev, formData);
    if (!result?.error) formRef.current?.reset();
    return result;
  }, undefined);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="date" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Date
        </label>
        <input
          required
          id="date"
          name="date"
          type="date"
          className="rounded-sm border border-border bg-background-card px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="time" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Heure
        </label>
        <input
          required
          id="time"
          name="time"
          type="time"
          className="rounded-sm border border-border bg-background-card px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="duration" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Durée
        </label>
        <select
          id="duration"
          name="duration"
          defaultValue="90"
          className="rounded-sm border border-border bg-background-card px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="60">1 heure</option>
          <option value="90">1h30</option>
          <option value="120">2 heures</option>
          <option value="180">3 heures</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Ajouter le créneau
      </button>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
