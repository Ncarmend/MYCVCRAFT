import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JobMatchClient } from "@/components/job-match/JobMatchClient";

export const metadata: Metadata = {
  title: "Job Match – Match Your CV to a Job Offer | CVIXEO",
  description:
    "Compare your CV with a job offer, measure your match score, and discover which skills and keywords to improve with CVIXEO.",
  alternates: {
    canonical: "https://cvixeo.com/job-match",
    languages: {
      en: "https://cvixeo.com/job-match",
      fr: "https://cvixeo.com/fr/job-match",
      nl: "https://cvixeo.com/nl/job-match",
      "x-default": "https://cvixeo.com/job-match",
    },
  },
  openGraph: {
    title: "Job Match – Match Your CV to a Job Offer | CVIXEO",
    description: "Compare your CV with a job offer and see exactly what to improve.",
    url: "https://cvixeo.com/job-match",
  },
};

export default function JobMatchPage() {
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
