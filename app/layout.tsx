import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/components/landing/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cvixeo.com"),
  title: {
    default: "Cvixeo — AI-Powered CV Generator",
    template: "%s | Cvixeo",
  },
  description:
    "Create professional, ATS-optimized CVs in minutes with AI. Stand out from the crowd with beautiful templates and intelligent career insights.",
  keywords: ["CV generator", "resume builder", "AI CV", "ATS optimization", "job application"],
  authors: [{ name: "Cvixeo" }],
  creator: "Cvixeo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cvixeo.com",
    siteName: "Cvixeo",
    title: "Cvixeo — AI-Powered CV Generator",
    description: "Create professional, ATS-optimized CVs in minutes with AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvixeo — AI-Powered CV Generator",
    description: "Create professional, ATS-optimized CVs in minutes with AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-locale") ?? "en";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cvixeo",
    url: "https://cvixeo.com",
    description: "Create professional, ATS-optimized CVs in minutes with AI.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://cvixeo.com/careers?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  
  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-white text-gray-900">
        <LanguageProvider>
          {children}
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
