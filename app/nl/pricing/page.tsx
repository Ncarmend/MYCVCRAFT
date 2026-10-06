import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingJsonLd } from "@/components/seo/PricingJsonLd";
import { PricingClient } from "../../pricing/PricingClient";

export const metadata: Metadata = {
  title: "Prijzen – Gratis AI cv-maker & Premium-plannen",
  description:
    "Kies het CVixeo-plan dat bij je past. Start gratis of ontgrendel onbeperkt ATS-geoptimaliseerde cv's met Premium.",
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
    title: "Prijzen | CVixeo",
    description: "Start gratis of ga voor Premium — maak onbeperkt ATS-geoptimaliseerde cv's met CVixeo.",
    url: "https://www.cvixeo.com/nl/pricing",
    locale: "nl_BE",
  },
};

export default function PricingPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <PricingJsonLd lang="nl" name={String(metadata.title)} description={metadata.description ?? ""} />
      <NavbarServer />
      <PricingClient />
      <LandingFooter />
    </div>
  );
}
