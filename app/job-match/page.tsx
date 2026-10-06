import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JobMatchClient } from "@/components/job-match/JobMatchClient";

export const metadata: Metadata = {
  title: "Job Match Tool – Compare Your CV with a Job Offer",
  description:
    "Compare your CV with a job offer, measure your match score, and discover which skills and keywords to improve with CVixeo.",
  alternates: {
    canonical: "https://www.cvixeo.com/job-match",
    languages: {
      en: "https://www.cvixeo.com/job-match",
      fr: "https://www.cvixeo.com/fr/job-match",
      nl: "https://www.cvixeo.com/nl/job-match",
      "x-default": "https://www.cvixeo.com/job-match",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Job Match Tool – Compare Your CV with a Job Offer | CVixeo",
    description: "Compare your CV with a job offer and see exactly what to improve.",
    url: "https://www.cvixeo.com/job-match",
  },
};

export default function JobMatchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageJsonLd lang="en" path="/job-match" metadata={metadata} />
      <NavbarServer />
      <main className="flex-1">
        <JobMatchClient />
      </main>
      <LandingFooter />
    </div>
  );
}
