"use client";

import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { FAQSection } from "@/components/landing/FAQSection";

/** Homepage FAQ, driven by the current UI language. */
export function FAQ() {
  const { lang } = useLanguage();
  const T = translations[lang].faq;

  return <FAQSection sectionLabel={T.sectionLabel} headline={T.headline} items={T.items} />;
}
