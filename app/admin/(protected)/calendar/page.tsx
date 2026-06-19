import { Trash2 } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import CreateSlotForm from "./CreateSlotForm";
import { deleteSlot } from "./actions";

export default async function AdminCalendarPage() {
  const slots = await prisma.availabilitySlot.findMany({
    where: { start: { gte: new Date() } },
    include: { booking: true },
    orderBy: { start: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl italic">Calendrier de disponibilités</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Ajoutez les créneaux où vous êtes disponible. Vos clients ne pourront
        réserver que ces créneaux depuis la page de contact.
      </p>

      <div className="mt-8 rounded-sm border border-border bg-background-soft p-6">
        <CreateSlotForm />
      </div>

      <div className="mt-10 overflow-hidden rounded-sm border border-border">
        {slots.length === 0 ? (
          <p className="p-6 text-sm text-foreground/60">
            Aucun créneau à venir. Ajoutez-en un ci-dessus.
          </p>
        ) : (
          slots.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background-soft px-5 py-4 last:border-b-0"
            >
              <div>
                <p className="text-sm">
                  {new Date(slot.start).toLocaleString("fr-CA", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-xs text-muted">
                  Durée : {Math.round((slot.end.getTime() - slot.start.getTime()) / 60000)} min
                  {slot.booking && ` · Réservé par ${slot.booking.name}`}
                </p>
              </div>

              {slot.isBooked ? (
                <span className="rounded-full border border-accent px-3 py-1 text-xs tracking-widest uppercase text-accent">
                  Réservé
                </span>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-border px-3 py-1 text-xs tracking-widest uppercase text-foreground/60">
                    Disponible
                  </span>
                  <form action={deleteSlot}>
                    <input type="hidden" name="id" value={slot.id} />
                    <button
                      type="submit"
                      className="flex items-center gap-1 text-xs uppercase text-muted transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
