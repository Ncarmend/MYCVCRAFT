import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CareersClient } from "../../careers/CareersClient";

export const metadata: Metadata = {
  title: "Conseils et ressources carrière",
  description:
    "Conseils de carrière d'experts, guides de rédaction de CV et conseils de recherche d'emploi pour décrocher le poste de vos rêves plus rapidement.",
  alternates: {
    canonical: "https://cvixeo.com/fr/careers",
    languages: {
      en: "https://cvixeo.com/careers",
      fr: "https://cvixeo.com/fr/careers",
      "x-default": "https://cvixeo.com/careers",
    },
  },
  openGraph: {
    title: "Conseils et ressources carrière | Cvixeo",
    description: "Guides experts de rédaction de CV et conseils de recherche d'emploi de l'équipe Cvixeo.",
    url: "https://cvixeo.com/fr/careers",
    locale: "fr_FR",
  },
};

export default function CareersPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <CareersClient />
      <LandingFooter />
    </div>
  );
}
