import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LegalClient } from "../../legal/LegalClient";

export const metadata: Metadata = {
  title: "Mentions légales — Cvixeo",
  description: "Mentions légales pour Cvixeo — informations sur l'éditeur, l'hébergement et la propriété intellectuelle.",
  alternates: {
    canonical: "https://cvixeo.com/fr/legal",
    languages: {
      en: "https://cvixeo.com/legal",
      fr: "https://cvixeo.com/fr/legal",
      "x-default": "https://cvixeo.com/legal",
    },
  },
  openGraph: {
    title: "Mentions légales — Cvixeo",
    description: "Mentions légales pour Cvixeo — informations sur l'éditeur, l'hébergement et la propriété intellectuelle.",
    url: "https://cvixeo.com/fr/legal",
    locale: "fr_FR",
  },
};

export default function LegalPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <LegalClient />
      </main>
      <LandingFooter />
    </div>
  );
}
