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
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl tracking-[0.2em] uppercase"
          >
            <Camera className="h-5 w-5 text-white" strokeWidth={1.5} />
            Prima<span className="text-white">Photo</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            {s["footer.tagline"]}
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href={s["social.instagram"]}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white hover:text-white"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={s["social.facebook"]}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white hover:text-white"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={s["social.pinterest"]}
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white hover:text-white"
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.3em] uppercase text-white">
            Explorer
          </h3>
          <ul className="mt-5 space-y-3">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="link-underline text-sm text-white/50 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.3em] uppercase text-white">
            Catégories
          </h3>
          <ul className="mt-5 space-y-3">
            {categoryNames.map((name) => (
              <li key={name}>
                <Link
                  href={`/portfolio?cat=${encodeURIComponent(name)}`}
                  className="link-underline text-sm text-white/50 transition-colors hover:text-white"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.3em] uppercase text-white">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-white/50">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              {s["contact.address"]}
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              {s["contact.phone"]}
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              {s["contact.email"]}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-center text-xs tracking-widest text-white/30 sm:flex-row sm:text-left lg:px-10">
          <p>© {new Date().getFullYear()} PRIMA PHOTO. TOUS DROITS RÉSERVÉS.</p>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p>CONÇU AVEC SOIN POUR RACONTER VOTRE HISTOIRE.</p>
            <p>
              PROPULSÉ PAR{" "}
              <a
                href="https://cognito-inc.ca"
                target="_blank"
                rel="noreferrer"
                className="link-underline text-white/50 transition-colors hover:text-white"
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
