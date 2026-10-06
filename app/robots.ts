import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Applies to all crawlers, including AI search crawlers (OAI-SearchBot,
        // PerplexityBot, ClaudeBot, Google-Extended…), which honour the "*" group.
        userAgent: "*",
        allow: "/",
        // Only block what must never be crawled: API endpoints, the OAuth
        // callback and auth-only areas (which redirect to /login anyway).
        //
        // Public utility pages (/login, /signup, /forgot-password, /waitlist)
        // are NOT blocked here on purpose: they carry <meta name="robots"
        // content="noindex">, and a robots.txt block would stop crawlers from
        // ever seeing that tag (a blocked URL can still be indexed from links).
        //
        // Prefix matching: "/cv/" blocks the editor (/cv/new, /cv/[id]) but not
        // the public /cv-optimizer page.
        disallow: ["/api/", "/auth/", "/dashboard", "/cv/", "/onboarding", "/account"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
