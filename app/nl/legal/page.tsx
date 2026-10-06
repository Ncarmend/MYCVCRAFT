import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LegalClient } from "../../legal/LegalClient";

export const metadata: Metadata = {
  title: "Wettelijke vermeldingen",
  description: "Wettelijke vermeldingen (mentions légales) voor Cvixeo — uitgeversinformatie, hostinggegevens en kennisgeving intellectuele eigendom.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/legal",
    languages: {
      en: "https://www.cvixeo.com/legal",
      fr: "https://www.cvixeo.com/fr/legal",
      nl: "https://www.cvixeo.com/nl/legal",
      "x-default": "https://www.cvixeo.com/legal",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Wettelijke vermeldingen — Cvixeo",
    description: "Wettelijke vermeldingen voor Cvixeo — uitgeversinformatie, hostinggegevens en kennisgeving intellectuele eigendom.",
    url: "https://www.cvixeo.com/nl/legal",
    locale: "nl_BE",
  },
};

export default function LegalPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <LegalClient />
      </main>
      <LandingFooter />
    </div>
  );
}
