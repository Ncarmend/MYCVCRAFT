import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { TermsClient } from "../../terms/TermsClient";

export const metadata: Metadata = {
  title: "Gebruiksvoorwaarden",
  description: "De voorwaarden die je gebruik van Cvixeo's AI-gestuurde cv-generator en bijbehorende diensten regelen.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/terms",
    languages: {
      en: "https://www.cvixeo.com/terms",
      fr: "https://www.cvixeo.com/fr/terms",
      nl: "https://www.cvixeo.com/nl/terms",
      "x-default": "https://www.cvixeo.com/terms",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Gebruiksvoorwaarden — Cvixeo",
    description: "De voorwaarden die je gebruik van Cvixeo regelen.",
    url: "https://www.cvixeo.com/nl/terms",
    locale: "nl_BE",
  },
};

export default function TermsPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <TermsClient />
      </main>
      <LandingFooter />
    </div>
  );
}
