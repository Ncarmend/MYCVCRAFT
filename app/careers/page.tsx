import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CareersClient } from "./CareersClient";

export const metadata: Metadata = {
  title: "Career Advice & Resources",
  description:
    "Expert career tips, CV writing guides, and job search advice to help you land your dream job faster.",
  alternates: {
    canonical: "https://www.cvixeo.com/careers",
    languages: {
      en: "https://www.cvixeo.com/careers",
      fr: "https://www.cvixeo.com/fr/careers",
      nl: "https://www.cvixeo.com/nl/careers",
      "x-default": "https://www.cvixeo.com/careers",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Career Advice & Resources | CVixeo",
    description: "Expert CV writing guides and job search advice from the CVixeo team.",
    url: "https://www.cvixeo.com/careers",
  },
};

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageJsonLd lang="en" path="/careers" metadata={metadata} type="CollectionPage" />
      <NavbarServer />
      <CareersClient />
      <LandingFooter />
    </div>
  );
}
