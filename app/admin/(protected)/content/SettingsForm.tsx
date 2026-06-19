"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { saveSiteSettings } from "./actions";
import type { SettingField } from "@/app/lib/settings";

type Props = {
  groupedFields: [string, SettingField[]][];
  values: Record<string, string>;
};

export default function SettingsForm({ groupedFields, values }: Props) {
  const [state, formAction, pending] = useActionState(saveSiteSettings, undefined);

  return (
    <form action={formAction} className="space-y-12">
      {groupedFields.map(([group, fields]) => (
        <div key={group}>
          <h2 className="font-display text-xl italic text-accent">{group}</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={field.key}
                  className="mb-2 block text-xs tracking-[0.3em] uppercase text-muted"
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    name={field.key}
                    rows={3}
                    defaultValue={values[field.key]}
                    className="w-full rounded-sm border border-border bg-background-card px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                ) : (
                  <input
                    id={field.key}
                    name={field.key}
                    type="text"
                    defaultValue={values[field.key]}
                    className="w-full rounded-sm border border-border bg-background-card px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 border-t border-border pt-8">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm tracking-[0.3em] uppercase text-background transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
        {state?.success && (
          <span className="flex items-center gap-2 text-sm text-accent">
            <CheckCircle2 className="h-4 w-4" />
            Modifications enregistrées
          </span>
        )}
      </div>
    </form>
  );
}
