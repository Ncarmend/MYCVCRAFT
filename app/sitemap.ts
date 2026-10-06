import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { SITE_URL } from "@/lib/seo";
import { LANDING_IDS, LANDING_ROUTES, TOOLS_HUB } from "@/lib/landing-routes";

const BASE = SITE_URL;

// Routes available in English (unprefixed), French (/fr prefix) and Dutch (/nl prefix),
// each with matching content in lib/translations.ts.
const LOCALIZED_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/job-match", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedPages: MetadataRoute.Sitemap = LOCALIZED_ROUTES.flatMap(({ path, changeFrequency, priority }) => {
    const en = `${BASE}${path}`;
    const fr = `${BASE}/fr${path}`;
    const nl = `${BASE}/nl${path}`;
    const languages = { en, fr, nl, "x-default": en };

    return [
      { url: en, lastModified: new Date(), changeFrequency, priority, alternates: { languages } },
      { url: fr, lastModified: new Date(), changeFrequency, priority, alternates: { languages } },
      { url: nl, lastModified: new Date(), changeFrequency, priority, alternates: { languages } },
    ];
  });

  // Career articles are single-language content (no per-article translation), so each
  // gets its own URL under the matching locale prefix with no cross-language alternates.
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => {
    const prefix = article.lang === "fr" ? "/fr/careers" : article.lang === "nl" ? "/nl/careers" : "/careers";
    return {
      url: `${BASE}${prefix}/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // SEO landing pages (EN unprefixed, FR under /fr). Same-intent EN/FR pairs
  // get reciprocal hreflang alternates; unpaired pages are listed on their own.
  const landingPages: MetadataRoute.Sitemap = LANDING_IDS.map((id) => {
    const route = LANDING_ROUTES[id];
    const url = `${BASE}${route.path}`;
    const alt = route.alternate ? LANDING_ROUTES[route.alternate] : null;
    const languages = alt
      ? route.lang === "en"
        ? { en: url, fr: `${BASE}${alt.path}`, "x-default": url }
        : { en: `${BASE}${alt.path}`, fr: url, "x-default": `${BASE}${alt.path}` }
      : undefined;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: id === "job-description-matching" || id === "cv-offre-emploi" ? 0.9 : 0.8,
      ...(languages ? { alternates: { languages } } : {}),
    };
  });

  // "Resume Tools" hub (EN/FR pair) that links every landing page.
  const hubLanguages = {
    en: `${BASE}${TOOLS_HUB.en.path}`,
    fr: `${BASE}${TOOLS_HUB.fr.path}`,
    "x-default": `${BASE}${TOOLS_HUB.en.path}`,
  };
  const hubPages: MetadataRoute.Sitemap = (["en", "fr"] as const).map((l) => ({
    url: `${BASE}${TOOLS_HUB[l].path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: { languages: hubLanguages },
  }));

  // Private and utility routes (dashboard, /cv/*, auth, onboarding, waitlist,
  // API) are intentionally absent: only indexable public pages belong here.
  return [...localizedPages, ...hubPages, ...landingPages, ...articlePages];
}
