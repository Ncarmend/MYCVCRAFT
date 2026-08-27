import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PrivacyClient } from "../../privacy/PrivacyClient";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Cvixeo",
  description: "Comment Cvixeo collecte, utilise et protège vos données personnelles. Politique de confidentialité conforme au RGPD pour les utilisateurs européens.",
  alternates: {
    canonical: "https://cvixeo.com/fr/privacy",
    languages: {
      en: "https://cvixeo.com/privacy",
      fr: "https://cvixeo.com/fr/privacy",
      "x-default": "https://cvixeo.com/privacy",
    },
  },
  openGraph: {
    title: "Politique de confidentialité — Cvixeo",
    description: "Comment Cvixeo collecte, utilise et protège vos données personnelles.",
    url: "https://cvixeo.com/fr/privacy",
    locale: "fr_FR",
  },
};

export default function PrivacyPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <PrivacyClient />
      </main>
      <LandingFooter />
    </div>
  );
}
