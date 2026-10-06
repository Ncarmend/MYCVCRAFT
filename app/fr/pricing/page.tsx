import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { PricingClient } from "../../pricing/PricingClient";

export const metadata: Metadata = {
  title: "Tarifs – Créateur de CV IA gratuit & offres Premium",
  description:
    "Choisissez l'offre Cvixeo adaptée à vos besoins. Démarrez gratuitement ou débloquez des CV illimités optimisés ATS avec Premium.",
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
    title: "Tarifs | Cvixeo",
    description: "Démarrez gratuitement ou passez à Premium — créez des CV illimités optimisés ATS avec Cvixeo.",
    url: "https://www.cvixeo.com/fr/pricing",
    locale: "fr_FR",
  },
};

export default function PricingPageFr() {
  return (
    <>
      <NavbarServer />
      <PricingClient />
    </>
  );
}
