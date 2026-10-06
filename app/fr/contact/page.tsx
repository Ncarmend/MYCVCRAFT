import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactClient } from "../../contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe Cvixeo. Nous sommes là pour répondre à toutes vos questions sur notre générateur de CV propulsé par l'IA.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/contact",
    languages: {
      en: "https://www.cvixeo.com/contact",
      fr: "https://www.cvixeo.com/fr/contact",
      nl: "https://www.cvixeo.com/nl/contact",
      "x-default": "https://www.cvixeo.com/contact",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Contact | Cvixeo",
    description: "Contactez l'équipe Cvixeo — nous serions ravis de vous entendre.",
    url: "https://www.cvixeo.com/fr/contact",
    locale: "fr_FR",
  },
};

export default function ContactPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <ContactClient />
      <LandingFooter />
    </div>
  );
}
