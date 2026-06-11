import Link from "next/link";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, PinterestIcon } from "./SocialIcons";

const exploreLinks = [
  { href: "/", label: "Accueil" },
  { href: "/#histoire", label: "Notre histoire" },
  { href: "/#services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Rendez-vous" },
];

const categoryLinks = [
  { href: "/portfolio?cat=Mariage", label: "Mariage" },
  { href: "/portfolio?cat=Portrait", label: "Portrait" },
  { href: "/portfolio?cat=Mode", label: "Mode" },
  { href: "/portfolio?cat=Événementiel", label: "Événementiel" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl tracking-[0.2em] uppercase"
          >
            <Camera className="h-5 w-5 text-accent" strokeWidth={1.5} />
            Prima<span className="text-accent">Photo</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Studio de photographie professionnel. Nous capturons vos
            instants précieux avec élégance et authenticité, pour qu&apos;ils
            traversent le temps.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.3em] uppercase text-accent">
            Explorer
          </h3>
          <ul className="mt-5 space-y-3">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="link-underline text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.3em] uppercase text-accent">
            Catégories
          </h3>
          <ul className="mt-5 space-y-3">
            {categoryLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="link-underline text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.3em] uppercase text-accent">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-foreground/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              123 Rue de la Lumière, Montréal, QC
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              +1 (514) 555-0192
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              hello@primaphoto.studio
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs tracking-widest text-muted sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} PRIMA PHOTO. TOUS DROITS RÉSERVÉS.</p>
          <p>CONÇU AVEC SOIN POUR RACONTER VOTRE HISTOIRE.</p>
        </div>
      </div>
    </footer>
  );
}
