"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
export { translations };

type Lang = "en" | "fr" | "nl";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: "en", setLang: () => {} });

/** Save the preference (localStorage + cookie). Returns true if the cookie changed. */
function persist(l: Lang): boolean {
  try {
    localStorage.setItem("cv-lang", l);
  } catch {
    /* storage unavailable */
  }
  const current = document.cookie.match(/(?:^|; )cv-lang=([^;]*)/)?.[1];
  if (current === l) return false;
  document.cookie = `cv-lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
  return true;
}

function localeFromPath(pathname: string): "fr" | "nl" | null {
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  if (pathname === "/nl" || pathname.startsWith("/nl/")) return "nl";
  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const pathname = usePathname();
  const routeLocale = localeFromPath(pathname);
  const router = useRouter();

  useEffect(() => {
    // Prefixed marketing routes (/fr/..., /nl/...) are locked to that language for SEO —
    // the URL is the source of truth there. Visiting one also records it as the
    // user's preference, so the (unprefixed) app opens in the same language later.
    if (routeLocale) {
      persist(routeLocale);
      setLangState(routeLocale);
      return;
    }

    const stored = localStorage.getItem("cv-lang") as Lang | null;
    const detected: Lang =
      stored === "fr" || stored === "en" || stored === "nl"
        ? stored
        : navigator.language.startsWith("fr")
          ? "fr"
          : navigator.language.startsWith("nl")
            ? "nl"
            : "en";
    setLangState(detected);
    // Server components (dashboard, settings, CV view) read the cookie: keep it in
    // sync with the language shown client-side, and re-render them if it changed.
    if (persist(detected)) router.refresh();
  }, [routeLocale, router]);

  function setLang(l: Lang) {
    setLangState(l);
    if (persist(l)) router.refresh();
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
