"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { categories } from "../lib/portfolio-data";

type Status = "idle" | "loading" | "success" | "error";

const inputClasses =
  "w-full rounded-sm border border-border bg-background-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors";

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Échec de l'envoi");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-sm border border-accent/40 bg-background-card px-8 py-20 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-accent" strokeWidth={1.25} />
        <h3 className="mt-6 font-display text-2xl italic">
          Merci pour votre demande !
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/70">
          Nous avons bien reçu votre demande de rendez-vous. Notre équipe
          vous contactera dans les 24 à 48 heures pour confirmer les
          détails.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 rounded-full border border-accent px-6 py-2.5 text-xs tracking-[0.3em] uppercase text-accent transition-colors hover:bg-accent hover:text-background"
        >
          Envoyer une autre demande
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Nom complet *
        </label>
        <input required name="name" type="text" placeholder="Votre nom" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Courriel *
        </label>
        <input required name="email" type="email" placeholder="vous@exemple.com" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Téléphone
        </label>
        <input name="phone" type="tel" placeholder="(514) 555-0192" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Type de séance *
        </label>
        <select required name="sessionType" defaultValue="" className={inputClasses}>
          <option value="" disabled>
            Sélectionner
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div className="sm:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Date souhaitée
        </label>
        <input name="date" type="date" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Lieu envisagé
        </label>
        <input name="location" type="text" placeholder="Ville, lieu..." className={inputClasses} />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Votre projet
        </label>
        <textarea
          name="message"
          rows={5}
          placeholder="Parlez-nous de votre vision, vos inspirations, le nombre de personnes..."
          className={`${inputClasses} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-red-400">
          Une erreur est survenue. Veuillez réessayer ou nous écrire
          directement à hello@primaphoto.studio.
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-10 py-4 text-sm tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          Envoyer la demande
        </button>
      </div>
    </form>
  );
}
