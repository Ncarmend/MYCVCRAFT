import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CareersClient } from "../../careers/CareersClient";

export const metadata: Metadata = {
  title: "Carrièretips en advies",
  description:
    "Praktische carrièretips, cv-schrijfgidsen en advies voor je jobzoektocht — geschreven door experts, om sneller de job van je dromen te vinden.",
  alternates: {
    canonical: "https://cvixeo.com/nl/careers",
    languages: {
      en: "https://cvixeo.com/careers",
      fr: "https://cvixeo.com/fr/careers",
      nl: "https://cvixeo.com/nl/careers",
      "x-default": "https://cvixeo.com/careers",
    },
  },
  openGraph: {
    title: "Carrièretips en advies | Cvixeo",
    description: "Cv-schrijfgidsen en advies voor je jobzoektocht, geschreven door het Cvixeo-team.",
    url: "https://cvixeo.com/nl/careers",
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
