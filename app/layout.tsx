import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/components/landing/LanguageContext";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { graph, organizationNode, websiteNode } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const GTM_ID = "GTM-NHGQGDP7";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI CV Builder & ATS Resume Optimizer | CVixeo",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Build an ATS-optimized CV with AI, match it to any job description, find missing keywords and get a match score. Free plan, 15 templates, PDF export.",
  applicationName: SITE_NAME,
  keywords: [
    "AI CV builder",
    "AI resume builder",
    "AI CV generator",
    "ATS CV builder",
    "ATS resume optimizer",
    "CV optimizer",
    "job description matching",
    "tailor CV to job description",
    "ATS score",
    "cover letter generator",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Productivity",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "AI CV Builder & ATS Resume Optimizer | CVixeo",
    description:
      "Create an ATS-optimized CV with AI and match it to any job description: missing keywords, match score and concrete improvements.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI CV Builder & ATS Resume Optimizer | CVixeo",
    description:
      "Create an ATS-optimized CV with AI and match it to any job description: missing keywords, match score and concrete improvements.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-locale") ?? "en";

  // Site-wide entity graph (Organization + WebSite). Page-specific schemas
  // (WebPage, SoftwareApplication, FAQPage, BreadcrumbList, Article) are
  // emitted by the pages themselves via lib/structured-data.ts.
  const jsonLd = graph(organizationNode(), websiteNode());

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <head>
        <JsonLd data={jsonLd} />
      </head>
      <GoogleTagManager gtmId={GTM_ID} />
      <body className="min-h-full bg-white text-gray-900">
        {/* Google Tag Manager (noscript) — must be immediately after <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LanguageProvider>
          {children}
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
