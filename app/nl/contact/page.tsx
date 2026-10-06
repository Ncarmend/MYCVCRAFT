import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactClient } from "../../contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact opnemen – Support en vragen",
  description:
    "Neem contact op met het CVixeo-team. We helpen je graag verder met al je vragen over onze AI-gestuurde cv-generator.",
  alternates: {
    canonical: "https://www.cvixeo.com/nl/contact",
    languages: {
      en: "https://www.cvixeo.com/contact",
      fr: "https://www.cvixeo.com/fr/contact",
      nl: "https://www.cvixeo.com/nl/contact",
      "x-default": "https://www.cvixeo.com/contact",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Contact | CVixeo",
    description: "Neem contact op met het CVixeo-team — we horen graag van je.",
    url: "https://www.cvixeo.com/nl/contact",
    locale: "nl_BE",
  },
};

export default function ContactPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageJsonLd lang="nl" path="/contact" metadata={metadata} type="ContactPage" />
      <NavbarServer />
      <ContactClient />
      <LandingFooter />
    </div>
  );
}
