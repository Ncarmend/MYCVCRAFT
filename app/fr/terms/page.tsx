import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { TermsClient } from "../../terms/TermsClient";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Cvixeo",
  description: "Les conditions générales qui régissent votre utilisation du générateur de CV par IA de Cvixeo et des services associés.",
  alternates: {
    canonical: "https://cvixeo.com/fr/terms",
    languages: {
      en: "https://cvixeo.com/terms",
      fr: "https://cvixeo.com/fr/terms",
      "x-default": "https://cvixeo.com/terms",
    },
  },
  openGraph: {
    title: "Conditions d'utilisation — Cvixeo",
    description: "Les conditions générales qui régissent votre utilisation de Cvixeo.",
    url: "https://cvixeo.com/fr/terms",
    locale: "fr_FR",
  },
};

export default function TermsPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <TermsClient />
      </main>
      <LandingFooter />
    </div>
  );
}
