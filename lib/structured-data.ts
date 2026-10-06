/**
 * Schema.org JSON-LD builders. Every value here must be verifiable and visible
 * somewhere on the page that emits it — no ratings, reviews, founders,
 * addresses or social profiles exist yet, so none are declared.
 *
 * Nodes are linked by @id so engines can merge them into one entity graph:
 *   #organization ← publisher of #website, #software, articles
 *   #software     ← "about" of landing pages and the About page
 */
import type { Article } from "@/lib/articles";
import { PLANS } from "@/lib/plans";
import { SITE_NAME, SITE_URL, type Locale } from "@/lib/seo";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

type Node = Record<string, unknown>;

export function graph(...nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function organizationNode(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    email: "support@cvixeo.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@cvixeo.com",
      url: `${SITE_URL}/contact`,
      availableLanguage: ["English", "French", "Dutch"],
    },
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: ["en", "fr", "nl"],
    publisher: { "@id": ORG_ID },
  };
}

const SOFTWARE_DESCRIPTION: Record<Locale, string> = {
  en: "An AI-powered CV and resume platform that helps job seekers create ATS-optimized resumes, analyze job descriptions, identify missing keywords, and tailor their CVs to specific job opportunities.",
  fr: "Une plateforme de CV propulsée par l'IA qui aide les candidats à créer des CV optimisés pour les ATS, analyser des offres d'emploi, repérer les mots-clés manquants et adapter leur CV à chaque opportunité.",
  nl: "Een AI-platform voor cv's dat werkzoekenden helpt ATS-geoptimaliseerde cv's te maken, vacatures te analyseren, ontbrekende zoekwoorden te vinden en hun cv af te stemmen op specifieke vacatures.",
};

/**
 * Only emit on pages that visibly show the features and prices
 * (home, About, pricing). Prices come from lib/plans.ts.
 */
export function softwareApplicationNode(lang: Locale, featureList: readonly string[]): Node {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SOFTWARE_DESCRIPTION[lang],
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "AI CV and resume builder",
    operatingSystem: "Web browser",
    availableLanguage: ["en", "fr", "nl"],
    featureList: [...featureList],
    publisher: { "@id": ORG_ID },
    offers: [
      { "@type": "Offer", name: PLANS.FREE.name, price: "0", priceCurrency: "EUR" },
      { "@type": "Offer", name: PLANS.PASS.name, price: PLANS.PASS.price.toFixed(2), priceCurrency: "EUR" },
      {
        "@type": "Offer",
        name: `${PLANS.PRO.name} (monthly)`,
        price: PLANS.PRO.priceMonthly.toFixed(2),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: PLANS.PRO.priceMonthly.toFixed(2),
          priceCurrency: "EUR",
          unitCode: "MON",
        },
      },
      {
        "@type": "Offer",
        name: `${PLANS.PRO.name} (annual)`,
        price: PLANS.PRO.priceAnnualTotal.toFixed(2),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: PLANS.PRO.priceAnnualTotal.toFixed(2),
          priceCurrency: "EUR",
          unitCode: "ANN",
        },
      },
    ],
  };
}

export function webPageNode(opts: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  url: string;
  name: string;
  description: string;
  lang: string;
  breadcrumb?: boolean;
  about?: string;
}): Node {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": opts.url,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { "@id": WEBSITE_ID },
    ...(opts.about ? { about: { "@id": opts.about } } : {}),
    ...(opts.breadcrumb ? { breadcrumb: { "@id": `${opts.url}#breadcrumb` } } : {}),
  };
}

/** `items` must mirror the visible breadcrumb trail; the last item is the current page. */
export function breadcrumbNode(pageUrl: string, items: { name: string; url: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** Only for FAQs rendered visibly on the same page. */
export function faqPageNode(pageUrl: string, lang: string, items: readonly { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    inLanguage: lang,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleNode(article: Article, url: string, lang: string): Node {
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@id": url },
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: lang,
    keywords: article.tags.join(", "),
    articleSection: article.category,
    image: `${SITE_URL}/opengraph-image`,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
