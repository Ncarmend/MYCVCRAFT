import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JobMatchClient } from "@/components/job-match/JobMatchClient";

export const metadata: Metadata = {
  title: "Job Match – Stem je cv af op een vacature | CVIXEO",
  description:
    "Vergelijk je cv met een vacature, meet je matchingsscore en ontdek welke vaardigheden en zoekwoorden je kan verbeteren met CVIXEO.",
  alternates: {
    canonical: "https://cvixeo.com/nl/job-match",
    languages: {
      en: "https://cvixeo.com/job-match",
      fr: "https://cvixeo.com/fr/job-match",
      nl: "https://cvixeo.com/nl/job-match",
      "x-default": "https://cvixeo.com/job-match",
    },
  },
  openGraph: {
    title: "Job Match – Stem je cv af op een vacature | CVIXEO",
    description: "Vergelijk je cv met een vacature en ontdek precies wat je kan verbeteren.",
    url: "https://cvixeo.com/nl/job-match",
    locale: "nl_BE",
  },
};

export default function JobMatchPageNl() {
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
