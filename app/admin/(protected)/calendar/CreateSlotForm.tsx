"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { createSlots } from "./actions";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function CreateSlotForm() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(90);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const today = toDateStr(new Date());

  // Build calendar grid
  const year = month.getFullYear();
  const mo = month.getMonth();
  const firstDay = new Date(year, mo, 1).getDay();
  const offset = (firstDay + 6) % 7; // Monday-based
  const daysInMonth = new Date(year, mo + 1, 0).getDate();

  function toggleDay(dateStr: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
    setSuccess(false);
  }

  function handleSubmit() {
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const result = await createSlots(Array.from(selected).sort(), time, duration);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setSelected(new Set());
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth(new Date(year, mo - 1, 1))}
          className="rounded-full border border-border p-2 text-foreground/70 transition-colors hover:border-accent hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-display text-lg capitalize">
          {month.toLocaleDateString("fr-CA", { month: "long", year: "numeric" })}
        </h3>
        <button
          type="button"
          onClick={() => setMonth(new Date(year, mo + 1, 1))}
          className="rounded-full border border-border p-2 text-foreground/70 transition-colors hover:border-accent hover:text-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs tracking-widest uppercase text-muted">
        {DAYS.map((d) => (
          <span key={d} className="py-2">{d}</span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${pad(mo + 1)}-${pad(day)}`;
          const isPast = dateStr < today;
          const isSelected = selected.has(dateStr);

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isPast}
              onClick={() => toggleDay(dateStr)}
              className={`relative rounded-sm py-3 text-sm transition-all ${
                isPast
                  ? "cursor-not-allowed text-foreground/20"
                  : isSelected
                  ? "bg-accent text-background font-medium"
                  : "border border-border text-foreground/80 hover:border-accent hover:text-accent"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Time & duration */}
      <div className="flex flex-wrap items-end gap-4 border-t border-border pt-6">
        <div>
          <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
            Heure
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-sm border border-border bg-background-card px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
            Durée
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="rounded-sm border border-border bg-background-card px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value={60}>1 heure</option>
            <option value={90}>1h30</option>
            <option value={120}>2 heures</option>
            <option value={180}>3 heures</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending || selected.size === 0}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Ajouter {selected.size > 1 ? `${selected.size} créneaux` : "le créneau"}
        </button>
      </div>

      {selected.size > 0 && (
        <p className="text-xs text-muted">
          {selected.size} jour{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""} · {time} · {duration} min
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="flex items-center gap-2 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" /> Créneaux ajoutés avec succès !
        </p>
      )}
    </div>
  );
}
