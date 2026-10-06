import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CareersClient } from "../../careers/CareersClient";

export const metadata: Metadata = {
  title: "Conseils et ressources carrière",
  description:
    "Conseils de carrière d'experts, guides de rédaction de CV et conseils de recherche d'emploi pour décrocher le poste de vos rêves plus rapidement.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/careers",
    languages: {
      en: "https://www.cvixeo.com/careers",
      fr: "https://www.cvixeo.com/fr/careers",
      nl: "https://www.cvixeo.com/nl/careers",
      "x-default": "https://www.cvixeo.com/careers",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Conseils et ressources carrière | CVixeo",
    description: "Guides experts de rédaction de CV et conseils de recherche d'emploi de l'équipe CVixeo.",
    url: "https://www.cvixeo.com/fr/careers",
    locale: "fr_FR",
  },
};

export default function CareersPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageJsonLd lang="fr" path="/careers" metadata={metadata} type="CollectionPage" />
      <NavbarServer />
      <CareersClient />
      <LandingFooter />
    </div>
  );
}
