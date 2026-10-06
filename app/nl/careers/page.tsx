import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CareersClient } from "../../careers/CareersClient";

export const metadata: Metadata = {
  title: "Carrièretips en advies",
  description:
    "Praktische carrièretips, cv-schrijfgidsen en advies voor je jobzoektocht — geschreven door experts, om sneller de job van je dromen te vinden.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/careers",
    languages: {
      en: "https://www.cvixeo.com/careers",
      fr: "https://www.cvixeo.com/fr/careers",
      nl: "https://www.cvixeo.com/nl/careers",
      "x-default": "https://www.cvixeo.com/careers",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Carrièretips en advies | Cvixeo",
    description: "Cv-schrijfgidsen en advies voor je jobzoektocht, geschreven door het Cvixeo-team.",
    url: "https://www.cvixeo.com/nl/careers",
    locale: "nl_BE",
  },
};

export default function CareersPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <CareersClient />
      <LandingFooter />
    </div>
  );
}
