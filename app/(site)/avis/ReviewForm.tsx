"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { submitTestimonial } from "./actions";

const inputClasses =
  "w-full rounded-sm border border-border bg-background-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [state, formAction, pending] = useActionState(submitTestimonial, undefined);

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-sm border border-accent/40 bg-background-card px-8 py-16 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-accent" strokeWidth={1.25} />
        <h3 className="mt-6 font-display text-2xl italic">Merci pour votre avis !</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/70">
          Il sera publié sur le site après validation par notre équipe.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Votre note *
        </label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = value <= (hoverRating || rating);
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                className="p-1"
              >
                <Star
                  className={`h-7 w-7 transition-colors ${filled ? "fill-accent text-accent" : "text-border"}`}
                />
              </button>
            );
          })}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="name" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Votre nom *
        </label>
        <input id="name" required name="name" type="text" placeholder="Votre nom" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="role" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Type de séance
        </label>
        <input
          id="role"
          name="role"
          type="text"
          placeholder="Ex. Mariage, Portrait..."
          className={inputClasses}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="quote" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Votre avis *
        </label>
        <textarea
          id="quote"
          required
          name="quote"
          rows={5}
          placeholder="Partagez votre expérience avec Prima Photo..."
          className={`${inputClasses} resize-none`}
        />
      </div>

      {state?.error && <p className="sm:col-span-2 text-sm text-red-400">{state.error}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-10 py-4 text-sm tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Envoyer mon avis
        </button>
      </div>
    </form>
  );
}
