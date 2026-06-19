"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/session";
import { settingFields, updateSettings } from "@/app/lib/settings";

export type ContentState = { success?: boolean } | undefined;

export async function saveSiteSettings(_state: ContentState, formData: FormData): Promise<ContentState> {
  await requireAdmin();

  const values: Record<string, string> = {};
  for (const field of settingFields) {
    values[field.key] = String(formData.get(field.key) ?? "");
  }

  await updateSettings(values);

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/content");

  return { success: true };
}
