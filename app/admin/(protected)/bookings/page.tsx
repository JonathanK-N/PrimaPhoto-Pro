import { Mail, Phone, X } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import { cancelBooking } from "./actions";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { slot: true },
    orderBy: { slot: { start: "desc" } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl italic">Réservations</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Liste de toutes les demandes de rendez-vous reçues via le site.
      </p>

      <div className="mt-8 overflow-hidden rounded-sm border border-border">
        {bookings.length === 0 ? (
          <p className="p-6 text-sm text-foreground/60">Aucune réservation pour le moment.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background-soft px-5 py-5 last:border-b-0"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium">{booking.name}</p>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] tracking-widest uppercase text-accent">
                    {booking.sessionType}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-widest uppercase ${
                      booking.status === "CONFIRMED"
                        ? "border border-accent text-accent"
                        : "border border-border text-muted"
                    }`}
                  >
                    {booking.status === "CONFIRMED" ? "Confirmé" : "Annulé"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {new Date(booking.slot.start).toLocaleString("fr-CA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-foreground/70">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {booking.email}
                  </span>
                  {booking.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {booking.phone}
                    </span>
                  )}
                </div>
                {booking.message && (
                  <p className="mt-2 max-w-xl text-xs text-foreground/60">{booking.message}</p>
                )}
              </div>

              {booking.status === "CONFIRMED" && (
                <form
                  action={cancelBooking}
                  onSubmit={(e) => {
                    if (!confirm("Annuler cette réservation ? Le créneau redeviendra disponible.")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={booking.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs tracking-widest uppercase text-foreground/70 transition-colors hover:border-red-400 hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                    Annuler
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
