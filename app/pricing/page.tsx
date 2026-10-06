import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing – Free AI CV Builder & Premium Plans",
  description:
    "Choose the Cvixeo plan that fits your needs. Start for free or unlock unlimited ATS-optimized CVs with Premium.",
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
    title: "Pricing | Cvixeo",
    description: "Start free or go Premium — create unlimited ATS-optimized CVs with Cvixeo.",
    url: "https://www.cvixeo.com/pricing",
  },
};

export default function PricingPage() {
  return (
    <>
      <NavbarServer />
      <PricingClient />
    </>
  );
}
