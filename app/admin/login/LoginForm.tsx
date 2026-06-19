"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Courriel
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className="w-full rounded-sm border border-border bg-background-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-sm border border-border bg-background-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-10 py-4 text-sm tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Connexion
      </button>
    </form>
  );
}
