import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { TermsClient } from "../../terms/TermsClient";

export const metadata: Metadata = {
  title: "Gebruiksvoorwaarden — Cvixeo",
  description: "De voorwaarden die je gebruik van Cvixeo's AI-gestuurde cv-generator en bijbehorende diensten regelen.",
  alternates: {
    canonical: "https://cvixeo.com/nl/terms",
    languages: {
      en: "https://cvixeo.com/terms",
      fr: "https://cvixeo.com/fr/terms",
      nl: "https://cvixeo.com/nl/terms",
      "x-default": "https://cvixeo.com/terms",
    },
  },
  openGraph: {
    title: "Gebruiksvoorwaarden — Cvixeo",
    description: "De voorwaarden die je gebruik van Cvixeo regelen.",
    url: "https://cvixeo.com/nl/terms",
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
