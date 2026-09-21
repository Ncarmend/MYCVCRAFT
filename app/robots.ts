import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No trailing slash: robots.txt Disallow is a prefix match, and these
        // routes render at the bare path (e.g. "/login", not "/login/") since
        // the app doesn't use trailingSlash. A rule like "/login/" only
        // matches sub-paths and never blocks "/login" itself; the bare prefix
        // blocks both the route and anything nested under it.
        disallow: [
          "/dashboard",
          "/api/",
          "/cv/",
          "/onboarding",
          "/login",
          "/signup",
          "/forgot-password",
          "/waitlist",
          "/account",
        ],
      },
    ],
    sitemap: "https://cvixeo.com/sitemap.xml",
  };
}
