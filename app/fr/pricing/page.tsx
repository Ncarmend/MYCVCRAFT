import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { PricingClient } from "../../pricing/PricingClient";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Choisissez l'offre Cvixeo adaptée à vos besoins. Démarrez gratuitement ou débloquez des CV illimités optimisés ATS avec Premium.",
  alternates: {
    canonical: "https://cvixeo.com/fr/pricing",
    languages: {
      en: "https://cvixeo.com/pricing",
      fr: "https://cvixeo.com/fr/pricing",
      "x-default": "https://cvixeo.com/pricing",
    },
  },
  openGraph: {
    title: "Tarifs | Cvixeo",
    description: "Démarrez gratuitement ou passez à Premium — créez des CV illimités optimisés ATS avec Cvixeo.",
    url: "https://cvixeo.com/fr/pricing",
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
