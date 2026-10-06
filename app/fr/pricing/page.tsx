import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingJsonLd } from "@/components/seo/PricingJsonLd";
import { PricingClient } from "../../pricing/PricingClient";

export const metadata: Metadata = {
  title: "Tarifs – Créateur de CV IA gratuit & offres Premium",
  description:
    "Choisissez l'offre CVixeo adaptée à vos besoins. Démarrez gratuitement ou débloquez des CV illimités optimisés ATS avec Premium.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/pricing",
    languages: {
      en: "https://www.cvixeo.com/pricing",
      fr: "https://www.cvixeo.com/fr/pricing",
      nl: "https://www.cvixeo.com/nl/pricing",
      "x-default": "https://www.cvixeo.com/pricing",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Tarifs | CVixeo",
    description: "Démarrez gratuitement ou passez à Premium — créez des CV illimités optimisés ATS avec CVixeo.",
    url: "https://www.cvixeo.com/fr/pricing",
    locale: "fr_FR",
  },
};

export default function PricingPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <PricingJsonLd lang="fr" name={String(metadata.title)} description={metadata.description ?? ""} />
      <NavbarServer />
      <PricingClient />
      <LandingFooter />
    </div>
  );
}
