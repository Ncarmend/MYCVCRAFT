import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JobMatchClient } from "@/components/job-match/JobMatchClient";

export const metadata: Metadata = {
  title: "Outil Job Match – Score de correspondance CV / offre",
  description:
    "Comparez votre CV à une offre d'emploi, mesurez votre score de correspondance et découvrez les compétences et mots-clés à améliorer avec CVixeo.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/job-match",
    languages: {
      en: "https://www.cvixeo.com/job-match",
      fr: "https://www.cvixeo.com/fr/job-match",
      nl: "https://www.cvixeo.com/nl/job-match",
      "x-default": "https://www.cvixeo.com/job-match",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Outil Job Match – Score de correspondance CV / offre | CVixeo",
    description: "Comparez votre CV à une offre d'emploi et découvrez exactement quoi améliorer.",
    url: "https://www.cvixeo.com/fr/job-match",
    locale: "fr_BE",
  },
};

export default function JobMatchPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageJsonLd lang="fr" path="/job-match" metadata={metadata} />
      <NavbarServer />
      <main className="flex-1">
        <JobMatchClient />
      </main>
      <LandingFooter />
    </div>
  );
}
