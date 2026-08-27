import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the Cvixeo plan that fits your needs. Start for free or unlock unlimited ATS-optimized CVs with Premium.",
  alternates: {
    canonical: "https://cvixeo.com/pricing",
    languages: {
      en: "https://cvixeo.com/pricing",
      fr: "https://cvixeo.com/fr/pricing",
      "x-default": "https://cvixeo.com/pricing",
    },
  },
  openGraph: {
    title: "Pricing | Cvixeo",
    description: "Start free or go Premium — create unlimited ATS-optimized CVs with Cvixeo.",
    url: "https://cvixeo.com/pricing",
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
