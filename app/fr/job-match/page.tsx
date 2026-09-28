import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JobMatchClient } from "@/components/job-match/JobMatchClient";

export const metadata: Metadata = {
  title: "Job Match – Adaptez votre CV à une offre d'emploi | CVIXEO",
  description:
    "Comparez votre CV à une offre d'emploi, mesurez votre score de correspondance et découvrez les compétences et mots-clés à améliorer avec CVIXEO.",
  alternates: {
    canonical: "https://cvixeo.com/fr/job-match",
    languages: {
      en: "https://cvixeo.com/job-match",
      fr: "https://cvixeo.com/fr/job-match",
      nl: "https://cvixeo.com/nl/job-match",
      "x-default": "https://cvixeo.com/job-match",
    },
  },
  openGraph: {
    title: "Job Match – Adaptez votre CV à une offre d'emploi | CVIXEO",
    description: "Comparez votre CV à une offre d'emploi et découvrez exactement quoi améliorer.",
    url: "https://cvixeo.com/fr/job-match",
    locale: "fr_BE",
  },
};

export default function JobMatchPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1">
        <JobMatchClient />
      </main>
      <LandingFooter />
    </div>
  );
}
