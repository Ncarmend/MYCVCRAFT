"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { translations } from "@/lib/translations";
export { translations };

type Lang = "en" | "fr";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const pathname = usePathname();
  const isFrenchRoute = pathname === "/fr" || pathname.startsWith("/fr/");

  useEffect(() => {
    // French marketing routes (/fr/...) are locked to French for SEO — the URL
    // is the source of truth there, not the stored preference.
    if (isFrenchRoute) return;

    const stored = localStorage.getItem("cv-lang") as Lang | null;
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
    } else {
      const browserFr = navigator.language.startsWith("fr");
      setLangState(browserFr ? "fr" : "en");
    }
  }, [isFrenchRoute]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("cv-lang", l);
    document.cookie = `cv-lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <LanguageContext.Provider value={{ lang: isFrenchRoute ? "fr" : lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
