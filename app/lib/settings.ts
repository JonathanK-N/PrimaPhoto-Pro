import { prisma } from "./prisma";

export type SettingField = {
  key: string;
  label: string;
  type: "text" | "textarea";
  group: string;
  default: string;
};

export const settingFields: SettingField[] = [
  { key: "hero.kicker", label: "Sur-titre", type: "text", group: "Hero", default: "Studio de Photographie Professionnel" },
  { key: "hero.title", label: "Titre principal", type: "text", group: "Hero", default: "Chaque Instant Raconte une Histoire" },
  { key: "hero.subtitle", label: "Sous-titre", type: "textarea", group: "Hero", default: "Mariages, portraits, mode et événements — Prima Photo capture la lumière, l'émotion et le détail pour transformer vos moments en œuvres intemporelles." },

  { key: "story.kicker", label: "Sur-titre", type: "text", group: "Histoire", default: "Notre Histoire" },
  { key: "story.title", label: "Titre", type: "text", group: "Histoire", default: "L'art de figer l'émotion dans le temps" },
  { key: "story.paragraph1", label: "Paragraphe 1", type: "textarea", group: "Histoire", default: "Tout a commencé par une vieille pellicule argentique et une fascination pour la lumière. Aujourd'hui, Prima Photo est devenu un studio reconnu, où chaque séance est pensée comme un chapitre d'une histoire plus grande : la vôtre." },
  { key: "story.paragraph2", label: "Paragraphe 2", type: "textarea", group: "Histoire", default: "Notre approche mêle élégance intemporelle et regard moderne. Nous ne photographions pas seulement des visages ou des lieux — nous racontons des récits, capturons des regards fugaces et révélons la beauté brute de chaque instant." },
  { key: "story.founded", label: "Badge fondation", type: "text", group: "Histoire", default: "Depuis 2013" },
  { key: "story.location", label: "Localisation du studio", type: "text", group: "Histoire", default: "Studio basé à Montréal" },
  { key: "story.stat1Value", label: "Statistique 1 — valeur", type: "text", group: "Histoire", default: "12+" },
  { key: "story.stat1Label", label: "Statistique 1 — libellé", type: "text", group: "Histoire", default: "Années d'expérience" },
  { key: "story.stat2Value", label: "Statistique 2 — valeur", type: "text", group: "Histoire", default: "850+" },
  { key: "story.stat2Label", label: "Statistique 2 — libellé", type: "text", group: "Histoire", default: "Séances réalisées" },
  { key: "story.stat3Value", label: "Statistique 3 — valeur", type: "text", group: "Histoire", default: "300+" },
  { key: "story.stat3Label", label: "Statistique 3 — libellé", type: "text", group: "Histoire", default: "Clients comblés" },
  { key: "story.stat4Value", label: "Statistique 4 — valeur", type: "text", group: "Histoire", default: "15" },
  { key: "story.stat4Label", label: "Statistique 4 — libellé", type: "text", group: "Histoire", default: "Prix & distinctions" },

  { key: "cta.title", label: "Titre", type: "text", group: "Appel à l'action", default: "Écrivons le prochain chapitre de votre histoire" },
  { key: "cta.subtitle", label: "Sous-titre", type: "textarea", group: "Appel à l'action", default: "Que ce soit pour un mariage, une séance portrait ou un projet de marque, réservons un moment pour discuter de votre vision." },

  { key: "footer.tagline", label: "Description (pied de page)", type: "textarea", group: "Pied de page", default: "Studio de photographie professionnel. Nous capturons vos instants précieux avec élégance et authenticité, pour qu'ils traversent le temps." },

  { key: "contact.address", label: "Adresse", type: "text", group: "Contact", default: "123 Rue de la Lumière, Montréal, QC" },
  { key: "contact.phone", label: "Téléphone", type: "text", group: "Contact", default: "+1 (514) 555-0192" },
  { key: "contact.email", label: "Courriel", type: "text", group: "Contact", default: "hello@primaphoto.studio" },
  { key: "contact.hours", label: "Disponibilités", type: "text", group: "Contact", default: "Lun – Sam · 9h00 – 18h00" },

  { key: "social.instagram", label: "Instagram (URL)", type: "text", group: "Réseaux sociaux", default: "https://instagram.com" },
  { key: "social.facebook", label: "Facebook (URL)", type: "text", group: "Réseaux sociaux", default: "https://facebook.com" },
  { key: "social.pinterest", label: "Pinterest (URL)", type: "text", group: "Réseaux sociaux", default: "https://pinterest.com" },
];

export const defaultSettings: Record<string, string> = Object.fromEntries(
  settingFields.map((f) => [f.key, f.default])
);

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { ...defaultSettings, ...stored };
}

export async function updateSettings(values: Record<string, string>) {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}
