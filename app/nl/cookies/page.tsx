import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CookiesClient } from "../../cookies/CookiesClient";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description: "Hoe Cvixeo cookies gebruikt en hoe je je voorkeuren beheert. AVG-conform cookiebeleid voor Europese gebruikers.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/cookies",
    languages: {
      en: "https://www.cvixeo.com/cookies",
      fr: "https://www.cvixeo.com/fr/cookies",
      nl: "https://www.cvixeo.com/nl/cookies",
      "x-default": "https://www.cvixeo.com/cookies",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Cookiebeleid — Cvixeo",
    description: "Hoe Cvixeo cookies gebruikt en hoe je je voorkeuren beheert.",
    url: "https://www.cvixeo.com/nl/cookies",
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
