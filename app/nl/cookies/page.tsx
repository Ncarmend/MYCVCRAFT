import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CookiesClient } from "../../cookies/CookiesClient";

export const metadata: Metadata = {
  title: "Cookiebeleid — Cvixeo",
  description: "Hoe Cvixeo cookies gebruikt en hoe je je voorkeuren beheert. AVG-conform cookiebeleid voor Europese gebruikers.",
  alternates: {
    canonical: "https://cvixeo.com/nl/cookies",
    languages: {
      en: "https://cvixeo.com/cookies",
      fr: "https://cvixeo.com/fr/cookies",
      nl: "https://cvixeo.com/nl/cookies",
      "x-default": "https://cvixeo.com/cookies",
    },
  },
  openGraph: {
    title: "Cookiebeleid — Cvixeo",
    description: "Hoe Cvixeo cookies gebruikt en hoe je je voorkeuren beheert.",
    url: "https://cvixeo.com/nl/cookies",
    locale: "nl_BE",
  },
};

export default function CookiesPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <CookiesClient />
      </main>
      <LandingFooter />
    </div>
  );
}
