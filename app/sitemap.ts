import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";

const BASE = "https://cvixeo.com";

// Routes available in both English (unprefixed) and French (/fr prefix),
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
    const languages = { en, fr, "x-default": en };

    return [
      { url: en, lastModified: new Date(), changeFrequency, priority, alternates: { languages } },
      { url: fr, lastModified: new Date(), changeFrequency, priority, alternates: { languages } },
    ];
  });

  // Career articles have no French translation yet — English only, no alternates.
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE}/careers/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...localizedPages, ...articlePages];
}
