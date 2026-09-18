import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PrivacyClient } from "../../privacy/PrivacyClient";

export const metadata: Metadata = {
  title: "Privacybeleid — Cvixeo",
  description: "Hoe Cvixeo je persoonsgegevens verzamelt, gebruikt en beschermt. AVG-conform privacybeleid voor Europese gebruikers.",
  alternates: {
    canonical: "https://cvixeo.com/nl/privacy",
    languages: {
      en: "https://cvixeo.com/privacy",
      fr: "https://cvixeo.com/fr/privacy",
      nl: "https://cvixeo.com/nl/privacy",
      "x-default": "https://cvixeo.com/privacy",
    },
  },
  openGraph: {
    title: "Privacybeleid — Cvixeo",
    description: "Hoe Cvixeo je persoonsgegevens verzamelt, gebruikt en beschermt.",
    url: "https://cvixeo.com/nl/privacy",
    locale: "nl_BE",
  },
};

export default function PrivacyPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <PrivacyClient />
      </main>
      <LandingFooter />
    </div>
  );
}
