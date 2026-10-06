import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { PricingClient } from "../../pricing/PricingClient";

export const metadata: Metadata = {
  title: "Prijzen – Gratis AI cv-maker & Premium-plannen",
  description:
    "Kies het Cvixeo-plan dat bij je past. Start gratis of ontgrendel onbeperkt ATS-geoptimaliseerde cv's met Premium.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/pricing",
    languages: {
      en: "https://www.cvixeo.com/pricing",
      fr: "https://www.cvixeo.com/fr/pricing",
      nl: "https://www.cvixeo.com/nl/pricing",
      "x-default": "https://www.cvixeo.com/pricing",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Prijzen | Cvixeo",
    description: "Start gratis of ga voor Premium — maak onbeperkt ATS-geoptimaliseerde cv's met Cvixeo.",
    url: "https://www.cvixeo.com/nl/pricing",
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
