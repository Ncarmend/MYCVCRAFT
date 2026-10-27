/**
 * CV document language — separate from the interface language.
 *
 * Every CV stores its own `language`. Section headings and other
 * application-generated labels in the preview, print and PDF come from
 * translations[cvLanguage].cvTemplateLabels. User-entered content is never
 * translated.
 */
import { translations } from "@/lib/translations";

export const CV_LANGUAGES = ["en", "fr", "nl"] as const;
export type CvLanguage = (typeof CV_LANGUAGES)[number];

export type CvLabels = (typeof translations)[CvLanguage]["cvTemplateLabels"];

export function parseCvLanguage(value: unknown): CvLanguage | null {
  return typeof value === "string" && (CV_LANGUAGES as readonly string[]).includes(value) ? (value as CvLanguage) : null;
}

/**
 * The CV's own language when set. Only CVs created before per-CV languages
 * existed have none; for those the caller's fallback (the language the user
 * is working in) keeps the previous behaviour until the CV is saved with an
 * explicit language.
 */
export function resolveCvLanguage(stored: unknown, fallback: CvLanguage): CvLanguage {
  return parseCvLanguage(stored) ?? fallback;
}

export function cvLabels(lang: CvLanguage): CvLabels {
  return translations[lang].cvTemplateLabels;
}

/** Language levels are stored as fixed codes ("Native", "Fluent"…); print them translated. */
export function proficiencyLabel(L: CvLabels, value: unknown): string {
  const levels = L.proficiencyLevels as Record<string, string>;
  return typeof value === "string" ? levels[value] ?? value : "";
}
