import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AboutClient } from "../../about/AboutClient";

export const metadata: Metadata = {
  title: "Over Cvixeo — Onze missie, visie & waarden",
  description:
    "Cvixeo's missie is om elke werkzoekende te helpen meer sollicitatiegesprekken te krijgen dankzij AI. Ontdek onze productvisie, kernwaarden en het team achter het platform.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/about",
    languages: {
      en: "https://www.cvixeo.com/about",
      fr: "https://www.cvixeo.com/fr/about",
      nl: "https://www.cvixeo.com/nl/about",
      "x-default": "https://www.cvixeo.com/about",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Over Cvixeo",
    description: "Cvixeo's missie is om elke werkzoekende te helpen meer sollicitatiegesprekken te krijgen dankzij AI.",
    url: "https://www.cvixeo.com/nl/about",
    locale: "nl_BE",
  },
};

export default function AboutPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <AboutClient />
      <LandingFooter />
    </div>
  );
}
