"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { translations } from "@/lib/translations";
export { translations };

type Lang = "en" | "fr" | "nl";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: "en", setLang: () => {} });

function localeFromPath(pathname: string): "fr" | "nl" | null {
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  if (pathname === "/nl" || pathname.startsWith("/nl/")) return "nl";
  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const pathname = usePathname();
  const routeLocale = localeFromPath(pathname);

  useEffect(() => {
    // Prefixed marketing routes (/fr/..., /nl/...) are locked to that language for SEO —
    // the URL is the source of truth there, not the stored preference.
    if (routeLocale) return;

    const stored = localStorage.getItem("cv-lang") as Lang | null;
    if (stored === "fr" || stored === "en" || stored === "nl") {
      setLangState(stored);
    } else if (navigator.language.startsWith("fr")) {
      setLangState("fr");
    } else if (navigator.language.startsWith("nl")) {
      setLangState("nl");
    } else {
      setLangState("en");
    }
  }, [routeLocale]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("cv-lang", l);
    document.cookie = `cv-lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <LanguageContext.Provider value={{ lang: routeLocale ?? lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
