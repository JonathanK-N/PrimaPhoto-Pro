"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

type Slot = { id: string; start: string; end: string };

type SlotPickerProps = {
  value: string;
  onChange: (id: string) => void;
  refreshKey?: number;
};

export default function SlotPicker({ value, onChange, refreshKey }: SlotPickerProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, startLoading] = useTransition();

  useEffect(() => {
    startLoading(async () => {
      const res = await fetch("/api/slots");
      const data = await res.json();
      setSlots(data.slots ?? []);
    });
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-foreground/60">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement des disponibilités...
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        Aucun créneau disponible pour le moment. Écrivez-nous directement à
        hello@primaphoto.studio et nous trouverons un moment ensemble.
      </p>
    );
  }

  const groups = new Map<string, Slot[]>();
  for (const slot of slots) {
    const dateKey = new Date(slot.start).toLocaleDateString("fr-CA", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    groups.set(dateKey, [...(groups.get(dateKey) ?? []), slot]);
  }

  return (
    <div className="space-y-4">
      {Array.from(groups.entries()).map(([date, daySlots]) => (
        <div key={date}>
          <p className="mb-2 text-xs capitalize tracking-widest text-muted">{date}</p>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onChange(slot.id)}
                className={`rounded-full border px-4 py-2 text-xs tracking-widest uppercase transition-colors duration-300 ${
                  value === slot.id
                    ? "border-accent bg-accent text-background"
                    : "border-border text-foreground/70 hover:border-accent hover:text-accent"
                }`}
              >
                {new Date(slot.start).toLocaleTimeString("fr-CA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
