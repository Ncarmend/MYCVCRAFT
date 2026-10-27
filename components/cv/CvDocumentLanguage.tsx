"use client";

/**
 * Document language for CV templates — deliberately separate from the
 * interface language (LanguageContext).
 *
 * CVPreview wraps templates in <CvDocumentLanguageProvider language={cv.language}>.
 * Outside a provider (e.g. the template picker's sample CV) templates fall back
 * to the interface language.
 */
import { createContext, useContext } from "react";
import { useLanguage } from "@/components/landing/LanguageContext";
import { cvLabels, type CvLabels, type CvLanguage } from "@/lib/cv-language";

const CvDocumentLanguageContext = createContext<CvLanguage | null>(null);

export function CvDocumentLanguageProvider({ language, children }: { language: CvLanguage; children: React.ReactNode }) {
  return <CvDocumentLanguageContext.Provider value={language}>{children}</CvDocumentLanguageContext.Provider>;
}

export function useCvLanguage(): CvLanguage {
  const documentLanguage = useContext(CvDocumentLanguageContext);
  const { lang } = useLanguage();
  return documentLanguage ?? lang;
}

/** Section headings and labels for the CV being rendered. */
export function useCvLabels(): CvLabels {
  return cvLabels(useCvLanguage());
}
