import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/components/landing/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
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
    url: process.env.NEXT_PUBLIC_APP_URL,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900">
        <LanguageProvider>
          {children}
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
