import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/cv/",
          "/onboarding/",
          "/login/",
          "/signup/",
          "/forgot-password/",
          "/waitlist/",
          "/account/",
        ],
      },
    ],
    sitemap: "https://cvixeo.com/sitemap.xml",
  };
}
