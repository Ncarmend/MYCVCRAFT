import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CookiesClient } from "../../cookies/CookiesClient";

export const metadata: Metadata = {
  title: "Politique de cookies — Cvixeo",
  description: "Comment Cvixeo utilise les cookies et comment gérer vos préférences. Politique de cookies conforme au RGPD pour les utilisateurs européens.",
  alternates: {
    canonical: "https://cvixeo.com/fr/cookies",
    languages: {
      en: "https://cvixeo.com/cookies",
      fr: "https://cvixeo.com/fr/cookies",
      "x-default": "https://cvixeo.com/cookies",
    },
  },
  openGraph: {
    title: "Politique de cookies — Cvixeo",
    description: "Comment Cvixeo utilise les cookies et comment gérer vos préférences.",
    url: "https://cvixeo.com/fr/cookies",
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
