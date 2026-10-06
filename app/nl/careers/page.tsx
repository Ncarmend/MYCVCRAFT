import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
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
    title: "Carrièretips en advies | CVixeo",
    description: "Cv-schrijfgidsen en advies voor je jobzoektocht, geschreven door het CVixeo-team.",
    url: "https://www.cvixeo.com/nl/careers",
    locale: "nl_BE",
  },
};

export default function CareersPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageJsonLd lang="nl" path="/careers" metadata={metadata} type="CollectionPage" />
      <NavbarServer />
      <CareersClient />
      <LandingFooter />
    </div>
  );
}
