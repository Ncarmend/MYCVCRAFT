import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AboutClient } from "@/app/about/AboutClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { plain } from "@/components/seo/Rich";
import { translations } from "@/lib/translations";
import { OG_DEFAULTS, OG_LOCALE, localizedAlternates, type Locale } from "@/lib/seo";
import { graph, webPageNode, softwareApplicationNode, faqPageNode, ORG_ID } from "@/lib/structured-data";

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "About CVixeo – AI CV & Resume Platform",
    description:
      "CVixeo is an AI-powered CV and resume platform that helps job seekers create ATS-optimized resumes, analyze job descriptions and tailor their CVs to each job.",
  },
  fr: {
    title: "À propos de CVixeo – Plateforme de CV IA",
    description:
      "CVixeo est une plateforme de CV propulsée par l'IA : CV optimisés ATS, analyse d'offres d'emploi, mots-clés manquants et CV adaptés à chaque candidature.",
  },
  nl: {
    title: "Over CVixeo – AI-platform voor cv's",
    description:
      "CVixeo is een AI-platform voor cv's: ATS-geoptimaliseerde cv's, vacature-analyse, ontbrekende zoekwoorden en een cv afgestemd op elke vacature.",
  },
};

export function aboutMetadata(lang: Locale): Metadata {
  const alternates = localizedAlternates(lang, "/about");
  return {
    // Absolute: the title already names the brand, so skip the "| CVixeo" template.
    title: { absolute: META[lang].title },
    description: META[lang].description,
    alternates,
    openGraph: {
      ...OG_DEFAULTS,
      title: META[lang].title,
      description: META[lang].description,
      url: alternates.canonical,
      locale: OG_LOCALE[lang],
    },
  };
}

export function AboutPageShell({ lang }: { lang: Locale }) {
  const T = translations[lang].about;
  const url = localizedAlternates(lang, "/about").canonical;
  const jsonLd = graph(
    webPageNode({ type: "AboutPage", url, name: T.hero.heading, description: T.hero.subtext, lang, about: ORG_ID }),
    softwareApplicationNode(lang, T.whatItDoes.items.map((f) => f.title)),
    faqPageNode(url, lang, T.faq.items.map((f) => ({ q: f.q, a: plain(f.a) }))),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={jsonLd} />
      <NavbarServer />
      <AboutClient />
      <LandingFooter />
    </div>
  );
}
