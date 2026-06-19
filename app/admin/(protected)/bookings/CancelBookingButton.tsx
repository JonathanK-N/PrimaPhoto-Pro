"use client";

import { X } from "lucide-react";
import { cancelBooking } from "./actions";

export default function CancelBookingButton({ id }: { id: string }) {
  return (
    <form
      action={cancelBooking}
      onSubmit={(e) => {
        if (!confirm("Annuler cette réservation ? Le créneau redeviendra disponible.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs tracking-widest uppercase text-foreground/70 transition-colors hover:border-red-400 hover:text-red-400"
      >
        <X className="h-3.5 w-3.5" />
        Annuler
      </button>
    </form>
  );
}
