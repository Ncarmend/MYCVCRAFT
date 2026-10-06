import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/components/landing/LanguageContext";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
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
    default: "AI CV Builder & ATS Resume Optimizer | Cvixeo",
    template: "%s | Cvixeo",
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
    title: "AI CV Builder & ATS Resume Optimizer | Cvixeo",
    description:
      "Create an ATS-optimized CV with AI and match it to any job description: missing keywords, match score and concrete improvements.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI CV Builder & ATS Resume Optimizer | Cvixeo",
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
  // (SoftwareApplication, FAQPage, Article) are emitted by the pages themselves.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        email: "support@cvixeo.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@cvixeo.com",
          availableLanguage: ["English", "French", "Dutch"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ["en", "fr", "nl"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
