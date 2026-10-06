import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Cvixeo team. We're here to help with any questions about our AI-powered CV builder.",
  alternates: {
    canonical: "https://www.cvixeo.com/contact",
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
    description: "Reach out to the Cvixeo team — we'd love to hear from you.",
    url: "https://www.cvixeo.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <ContactClient />
      <LandingFooter />
    </div>
  );
}
