import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactClient } from "../../contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe Cvixeo. Nous sommes là pour répondre à toutes vos questions sur notre générateur de CV propulsé par l'IA.",
  alternates: {
    canonical: "https://cvixeo.com/fr/contact",
    languages: {
      en: "https://cvixeo.com/contact",
      fr: "https://cvixeo.com/fr/contact",
      "x-default": "https://cvixeo.com/contact",
    },
  },
  openGraph: {
    title: "Contact | Cvixeo",
    description: "Contactez l'équipe Cvixeo — nous serions ravis de vous entendre.",
    url: "https://cvixeo.com/fr/contact",
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
