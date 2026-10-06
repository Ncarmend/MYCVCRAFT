import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AboutClient } from "../../about/AboutClient";

export const metadata: Metadata = {
  title: "À propos de Cvixeo — Notre mission, vision et valeurs",
  description:
    "La mission de Cvixeo est d'aider chaque candidat à décrocher plus d'entretiens grâce à l'IA. Découvrez notre vision produit, nos valeurs fondamentales et l'équipe derrière la plateforme.",
  alternates: {
    canonical: "https://www.cvixeo.com/fr/about",
    languages: {
      en: "https://www.cvixeo.com/about",
      fr: "https://www.cvixeo.com/fr/about",
      nl: "https://www.cvixeo.com/nl/about",
      "x-default": "https://www.cvixeo.com/about",
    },
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "À propos de Cvixeo",
    description: "La mission de Cvixeo est d'aider chaque candidat à décrocher plus d'entretiens grâce à l'IA.",
    url: "https://www.cvixeo.com/fr/about",
    locale: "fr_FR",
  },
};

export default function AboutPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <AboutClient />
      <LandingFooter />
    </div>
  );
}
