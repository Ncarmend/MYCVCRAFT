import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { TermsClient } from "../../terms/TermsClient";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Les conditions générales qui régissent votre utilisation du générateur de CV par IA de CVixeo et des services associés.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/terms",
    languages: {
      en: "https://www.cvixeo.com/terms",
      fr: "https://www.cvixeo.com/fr/terms",
      nl: "https://www.cvixeo.com/nl/terms",
      "x-default": "https://www.cvixeo.com/terms",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Conditions d'utilisation — CVixeo",
    description: "Les conditions générales qui régissent votre utilisation de CVixeo.",
    url: "https://www.cvixeo.com/fr/terms",
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
