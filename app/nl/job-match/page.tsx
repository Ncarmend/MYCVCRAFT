import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JobMatchClient } from "@/components/job-match/JobMatchClient";

export const metadata: Metadata = {
  title: "Cv vergelijken met een vacature – Matching & ATS-score",
  description:
    "Vergelijk je cv met een vacature, meet je matchingsscore en ontdek welke vaardigheden en zoekwoorden je kan verbeteren met CVixeo.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/job-match",
    languages: {
      en: "https://www.cvixeo.com/job-match",
      fr: "https://www.cvixeo.com/fr/job-match",
      nl: "https://www.cvixeo.com/nl/job-match",
      "x-default": "https://www.cvixeo.com/job-match",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Job Match – Stem je cv af op een vacature | CVixeo",
    description: "Vergelijk je cv met een vacature en ontdek precies wat je kan verbeteren.",
    url: "https://www.cvixeo.com/nl/job-match",
    locale: "nl_BE",
  },
};

export default function JobMatchPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageJsonLd lang="nl" path="/job-match" metadata={metadata} />
      <NavbarServer />
      <main className="flex-1">
        <JobMatchClient />
      </main>
      <LandingFooter />
    </div>
  );
}
