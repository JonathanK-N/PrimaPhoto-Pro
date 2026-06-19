import Link from "next/link";
import { Images, CalendarRange, BookOpenCheck, FolderTree } from "lucide-react";
import { prisma } from "@/app/lib/prisma";

export default async function AdminDashboardPage() {
  const [photoCount, categoryCount, upcomingSlots, bookings] = await Promise.all([
    prisma.photo.count(),
    prisma.category.count(),
    prisma.availabilitySlot.count({ where: { isBooked: false, start: { gte: new Date() } } }),
    prisma.booking.findMany({
      where: { status: "CONFIRMED" },
      include: { slot: true },
      orderBy: { slot: { start: "asc" } },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Photos", value: photoCount, href: "/admin/photos", icon: Images },
    { label: "Catégories", value: categoryCount, href: "/admin/photos", icon: FolderTree },
    { label: "Créneaux disponibles", value: upcomingSlots, href: "/admin/calendar", icon: CalendarRange },
    { label: "Réservations confirmées", value: bookings.length, href: "/admin/bookings", icon: BookOpenCheck },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl italic">Tableau de bord</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Vue d&apos;ensemble de votre studio Prima Photo.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-sm border border-border bg-background-soft p-6 transition-colors hover:border-accent"
          >
            <stat.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
            <p className="mt-4 font-display text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs tracking-widest uppercase text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-display text-xl italic">Prochains rendez-vous</h2>
        {bookings.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">Aucune réservation à venir.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-sm border border-border">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background-soft px-5 py-4 last:border-b-0"
              >
                <div>
                  <p className="text-sm">{booking.name}</p>
                  <p className="text-xs text-muted">
                    {booking.sessionType} · {booking.email}
                  </p>
                </div>
                <p className="text-xs tracking-widest uppercase text-accent">
                  {new Date(booking.slot.start).toLocaleString("fr-CA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
