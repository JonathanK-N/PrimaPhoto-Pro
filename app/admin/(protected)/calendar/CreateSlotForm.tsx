"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, ChevronLeft, ChevronRight, CheckCircle2, X } from "lucide-react";
import { createSlots } from "./actions";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const TIME_OPTIONS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
];

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
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState(90);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const today = toDateStr(new Date());

  const year = month.getFullYear();
  const mo = month.getMonth();
  const firstDay = new Date(year, mo, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, mo + 1, 0).getDate();

  function toggleDay(dateStr: string) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
    setSuccess(false);
  }

  function toggleTime(time: string) {
    setSelectedTimes((prev) => {
      const next = new Set(prev);
      if (next.has(time)) next.delete(time);
      else next.add(time);
      return next;
    });
    setSuccess(false);
  }

  function handleSubmit() {
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const result = await createSlots(
        Array.from(selectedDays).sort(),
        Array.from(selectedTimes).sort(),
        duration
      );
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setSelectedDays(new Set());
        setSelectedTimes(new Set());
      }
    });
  }

  const totalSlots = selectedDays.size * selectedTimes.size;

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
          const isSelected = selectedDays.has(dateStr);

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

      {/* Time selection */}
      <div className="border-t border-border pt-6">
        <label className="mb-3 block text-xs tracking-[0.3em] uppercase text-muted">
          Heures (sélectionnez une ou plusieurs)
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTime(t)}
              className={`rounded-full border px-3 py-1.5 text-xs tracking-wider transition-colors ${
                selectedTimes.has(t)
                  ? "border-accent bg-accent text-background font-medium"
                  : "border-border text-foreground/70 hover:border-accent hover:text-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {selectedTimes.size > 0 && (
          <button
            type="button"
            onClick={() => setSelectedTimes(new Set())}
            className="mt-2 flex items-center gap-1 text-xs text-muted hover:text-accent"
          >
            <X className="h-3 w-3" /> Tout désélectionner
          </button>
        )}
      </div>

      {/* Duration & submit */}
      <div className="flex flex-wrap items-end gap-4 border-t border-border pt-6">
        <div>
          <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted">
            Durée par créneau
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
          disabled={pending || selectedDays.size === 0 || selectedTimes.size === 0}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Ajouter {totalSlots > 1 ? `${totalSlots} créneaux` : "le créneau"}
        </button>
      </div>

      {/* Summary */}
      {totalSlots > 0 && (
        <p className="text-xs text-muted">
          {selectedDays.size} jour{selectedDays.size > 1 ? "s" : ""} × {selectedTimes.size} heure{selectedTimes.size > 1 ? "s" : ""} = {totalSlots} créneau{totalSlots > 1 ? "x" : ""} · {duration} min chacun
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
