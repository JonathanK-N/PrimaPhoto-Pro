"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import SlotPicker from "./SlotPicker";

type Status = "idle" | "loading" | "success" | "error";

const inputClasses =
  "w-full rounded-sm border border-border bg-background-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors";

export default function BookingForm({ categories }: { categories: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [slotId, setSlotId] = useState("");
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!slotId) {
      setStatus("error");
      setErrorMessage("Veuillez choisir un créneau disponible.");
      return;
    }

    setStatus("loading");

    const form = e.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), slotId };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setSlotId("");
        setSlotsRefreshKey((k) => k + 1);
        throw new Error(result.error || "Échec de l'envoi");
      }

      setStatus("success");
      form.reset();
      setSlotId("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
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
          Votre créneau est réservé. Notre équipe vous contactera avant votre
          séance pour confirmer les derniers détails.
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
      <div className="sm:col-span-2">
        <label className="mb-3 block text-xs tracking-[0.3em] uppercase text-muted">
          Choisissez un créneau *
        </label>
        <SlotPicker value={slotId} onChange={setSlotId} refreshKey={slotsRefreshKey} />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="name" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Nom complet *
        </label>
        <input id="name" required name="name" type="text" placeholder="Votre nom" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="email" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Courriel *
        </label>
        <input id="email" required name="email" type="email" placeholder="vous@exemple.com" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="phone" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Téléphone
        </label>
        <input id="phone" name="phone" type="tel" placeholder="(514) 555-0192" className={inputClasses} />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="sessionType" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Type de séance *
        </label>
        <select id="sessionType" required name="sessionType" defaultValue="" className={inputClasses}>
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

      <div className="sm:col-span-2">
        <label htmlFor="location" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Lieu envisagé
        </label>
        <input id="location" name="location" type="text" placeholder="Ville, lieu..." className={inputClasses} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
          Votre projet
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Parlez-nous de votre vision, vos inspirations, le nombre de personnes..."
          className={`${inputClasses} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-red-400">{errorMessage}</p>
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
