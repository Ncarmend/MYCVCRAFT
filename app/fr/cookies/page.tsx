import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CookiesClient } from "../../cookies/CookiesClient";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Comment Cvixeo utilise les cookies et comment gérer vos préférences. Politique de cookies conforme au RGPD pour les utilisateurs européens.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/cookies",
    languages: {
      en: "https://www.cvixeo.com/cookies",
      fr: "https://www.cvixeo.com/fr/cookies",
      nl: "https://www.cvixeo.com/nl/cookies",
      "x-default": "https://www.cvixeo.com/cookies",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Politique de cookies — Cvixeo",
    description: "Comment Cvixeo utilise les cookies et comment gérer vos préférences.",
    url: "https://www.cvixeo.com/fr/cookies",
    locale: "fr_FR",
  },
};

export default function CookiesPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <CookiesClient />
      </main>
      <LandingFooter />
    </div>
  );
}
