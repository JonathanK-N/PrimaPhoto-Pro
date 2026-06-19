import { settingFields } from "@/app/lib/settings";
import { getSettings } from "@/app/lib/settings";
import SettingsForm from "./SettingsForm";

export default async function AdminContentPage() {
  const values = await getSettings();

  const groups = Array.from(new Set(settingFields.map((f) => f.group)));
  const groupedFields = groups.map(
    (group) => [group, settingFields.filter((f) => f.group === group)] as [string, typeof settingFields]
  );

  return (
    <div>
      <h1 className="font-display text-3xl italic">Contenu du site</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Modifiez les textes affichés sur le site public : accueil, histoire, contact et réseaux sociaux.
      </p>

      <div className="mt-8">
        <SettingsForm groupedFields={groupedFields} values={values} />
      </div>
    </div>
  );
}
