import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { JobMatchDemo } from "@/components/landing/JobMatchDemo";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { translations } from "@/lib/translations";
import { graph, webPageNode, softwareApplicationNode, faqPageNode, SOFTWARE_ID } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, OG_DEFAULTS, OG_LOCALE, localePath, localizedAlternates, type Locale } from "@/lib/seo";

const HOME_META: Record<Locale, { title: string; description: string; ogDescription: string }> = {
  en: {
    title: "AI CV Builder & ATS Resume Optimizer | CVixeo",
    description:
      "Build an ATS-optimized CV with AI, match it to any job description, find missing keywords and get a match score. Free plan, 15 templates, PDF export.",
    ogDescription:
      "Create an ATS-optimized CV with AI and match it to any job description: missing keywords, match score and concrete improvements.",
  },
  fr: {
    title: "Créateur de CV IA & Optimisation ATS | CVixeo",
    description:
      "Créez un CV optimisé ATS avec l'IA, comparez-le à une offre d'emploi, trouvez les mots-clés manquants et obtenez un score. Gratuit, 15 modèles, export PDF.",
    ogDescription:
      "Créez un CV optimisé ATS avec l'IA et adaptez-le à chaque offre : mots-clés manquants, score de correspondance et améliorations concrètes.",
  },
  nl: {
    title: "AI cv-maker & ATS cv-optimalisatie | CVixeo",
    description:
      "Maak met AI een ATS-geoptimaliseerd cv, vergelijk het met een vacature, vind ontbrekende zoekwoorden en krijg een matchscore. Gratis, 15 sjablonen, pdf-export.",
    ogDescription:
      "Maak met AI een ATS-geoptimaliseerd cv en stem het af op elke vacature: ontbrekende zoekwoorden, matchscore en concrete verbeteringen.",
  },
};

export function homeMetadata(lang: Locale): Metadata {
  const m = HOME_META[lang];
  const alternates = localizedAlternates(lang, "/");
  return {
    // Absolute: the root layout's "%s | CVixeo" template would otherwise double the brand.
    title: { absolute: m.title },
    description: m.description,
    alternates,
    openGraph: {
      ...OG_DEFAULTS,
      title: m.title,
      description: m.ogDescription,
      url: alternates.canonical,
      locale: OG_LOCALE[lang],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.ogDescription,
    },
  };
}

function homeJsonLd(lang: Locale) {
  const url = `${SITE_URL}${localePath(lang, "/")}`.replace(/\/$/, "");
  const T = translations[lang];
  return graph(
    webPageNode({ url, name: HOME_META[lang].title, description: HOME_META[lang].description, lang, about: SOFTWARE_ID }),
    softwareApplicationNode(lang, T.features.items.map((f) => f.title)),
    faqPageNode(url, lang, T.faq.items),
  );
}

export function HomePage({ lang }: { lang: Locale }) {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={homeJsonLd(lang)} />
      <NavbarServer />
      <main className="flex-1">
        <Hero />
        <JobMatchDemo />
        <Features />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}
