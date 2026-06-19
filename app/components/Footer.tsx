import Link from "next/link";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, PinterestIcon } from "./SocialIcons";
import { getSettings } from "@/app/lib/settings";
import { getCategoryNames } from "@/app/lib/data";

const exploreLinks = [
  { href: "/", label: "Accueil" },
  { href: "/#histoire", label: "Notre histoire" },
  { href: "/#services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/avis", label: "Avis clients" },
  { href: "/contact", label: "Rendez-vous" },
];

export default async function Footer() {
  const [s, categoryNames] = await Promise.all([getSettings(), getCategoryNames()]);

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
            {s["footer.tagline"]}
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href={s["social.instagram"]}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={s["social.facebook"]}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={s["social.pinterest"]}
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
            {categoryNames.map((name) => (
              <li key={name}>
                <Link
                  href={`/portfolio?cat=${encodeURIComponent(name)}`}
                  className="link-underline text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {name}
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
              {s["contact.address"]}
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {s["contact.phone"]}
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {s["contact.email"]}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-center text-xs tracking-widest text-muted sm:flex-row sm:text-left lg:px-10">
          <p>© {new Date().getFullYear()} PRIMA PHOTO. TOUS DROITS RÉSERVÉS.</p>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p>CONÇU AVEC SOIN POUR RACONTER VOTRE HISTOIRE.</p>
            <p>
              PROPULSÉ PAR{" "}
              <a
                href="https://cognito-inc.ca"
                target="_blank"
                rel="noreferrer"
                className="link-underline text-foreground/80 transition-colors hover:text-accent"
              >
                COGNITO INC.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
