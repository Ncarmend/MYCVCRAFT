import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LegalClient } from "../../legal/LegalClient";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales pour Cvixeo — informations sur l'éditeur, l'hébergement et la propriété intellectuelle.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/legal",
    languages: {
      en: "https://www.cvixeo.com/legal",
      fr: "https://www.cvixeo.com/fr/legal",
      nl: "https://www.cvixeo.com/nl/legal",
      "x-default": "https://www.cvixeo.com/legal",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Mentions légales — Cvixeo",
    description: "Mentions légales pour Cvixeo — informations sur l'éditeur, l'hébergement et la propriété intellectuelle.",
    url: "https://www.cvixeo.com/fr/legal",
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
