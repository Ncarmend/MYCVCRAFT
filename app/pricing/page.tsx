import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingJsonLd } from "@/components/seo/PricingJsonLd";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing – Free AI CV Builder & Premium Plans",
  description:
    "Choose the CVixeo plan that fits your needs. Start for free or unlock unlimited ATS-optimized CVs with Premium.",
  alternates: {
    canonical: "https://www.cvixeo.com/pricing",
    languages: {
      en: "https://www.cvixeo.com/pricing",
      fr: "https://www.cvixeo.com/fr/pricing",
      nl: "https://www.cvixeo.com/nl/pricing",
      "x-default": "https://www.cvixeo.com/pricing",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Pricing | CVixeo",
    description: "Start free or go Premium — create unlimited ATS-optimized CVs with CVixeo.",
    url: "https://www.cvixeo.com/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PricingJsonLd lang="en" name={String(metadata.title)} description={metadata.description ?? ""} />
      <NavbarServer />
      <PricingClient />
      <LandingFooter />
    </div>
  );
}
