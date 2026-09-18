import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { PricingClient } from "../../pricing/PricingClient";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Kies het Cvixeo-plan dat bij je past. Start gratis of ontgrendel onbeperkt ATS-geoptimaliseerde cv's met Premium.",
  alternates: {
    canonical: "https://cvixeo.com/nl/pricing",
    languages: {
      en: "https://cvixeo.com/pricing",
      fr: "https://cvixeo.com/fr/pricing",
      nl: "https://cvixeo.com/nl/pricing",
      "x-default": "https://cvixeo.com/pricing",
    },
  },
  openGraph: {
    title: "Prijzen | Cvixeo",
    description: "Start gratis of ga voor Premium — maak onbeperkt ATS-geoptimaliseerde cv's met Cvixeo.",
    url: "https://cvixeo.com/nl/pricing",
    locale: "nl_BE",
  },
};

export default function PricingPageNl() {
  return (
    <>
      <NavbarServer />
      <PricingClient />
    </>
  );
}
