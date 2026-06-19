import Link from "next/link";
import { Camera, LayoutDashboard, Images, FileText, CalendarRange, BookOpenCheck, LogOut } from "lucide-react";
import { requireAdmin } from "@/app/lib/session";
import { logout } from "@/app/admin/actions";

const navLinks = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/photos", label: "Photos", icon: Images },
  { href: "/admin/content", label: "Contenu du site", icon: FileText },
  { href: "/admin/calendar", label: "Calendrier", icon: CalendarRange },
  { href: "/admin/bookings", label: "Réservations", icon: BookOpenCheck },
];

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background-soft">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-display text-lg tracking-[0.2em] uppercase"
          >
            <Camera className="h-5 w-5 text-accent" strokeWidth={1.5} />
            Prima<span className="text-accent">Photo</span>
            <span className="ml-2 text-xs tracking-widest text-muted">ADMIN</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-widest uppercase text-foreground/70 transition-colors hover:bg-background-card hover:text-accent"
              >
                <link.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">{session.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs tracking-widest uppercase text-foreground/70 transition-colors hover:border-accent hover:text-accent"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                Quitter
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
