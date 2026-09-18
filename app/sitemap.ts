import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";

const BASE = "https://cvixeo.com";

// Routes available in English (unprefixed), French (/fr prefix) and Dutch (/nl prefix),
// each with matching content in lib/translations.ts.
const LOCALIZED_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
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

  return [...localizedPages, ...articlePages];
}
