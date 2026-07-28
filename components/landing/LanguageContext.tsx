"use client";

import { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    const stored = localStorage.getItem("cv-lang") as Lang | null;
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
    } else {
      const browserFr = navigator.language.startsWith("fr");
      setLangState(browserFr ? "fr" : "en");
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("cv-lang", l);
    document.cookie = `cv-lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
