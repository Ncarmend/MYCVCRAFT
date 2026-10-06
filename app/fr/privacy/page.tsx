import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PrivacyClient } from "../../privacy/PrivacyClient";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment CVixeo collecte, utilise et protège vos données personnelles. Politique de confidentialité conforme au RGPD pour les utilisateurs européens.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/privacy",
    languages: {
      en: "https://www.cvixeo.com/privacy",
      fr: "https://www.cvixeo.com/fr/privacy",
      nl: "https://www.cvixeo.com/nl/privacy",
      "x-default": "https://www.cvixeo.com/privacy",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Politique de confidentialité — CVixeo",
    description: "Comment CVixeo collecte, utilise et protège vos données personnelles.",
    url: "https://www.cvixeo.com/fr/privacy",
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
