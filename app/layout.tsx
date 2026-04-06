import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CVCraft — AI-Powered CV Generator",
    template: "%s | CVCraft",
  },
  description:
    "Create professional, ATS-optimized CVs in minutes with AI. Stand out from the crowd with beautiful templates and intelligent career insights.",
  keywords: ["CV generator", "resume builder", "AI CV", "ATS optimization", "job application"],
  authors: [{ name: "CVCraft" }],
  creator: "CVCraft",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "CVCraft",
    title: "CVCraft — AI-Powered CV Generator",
    description: "Create professional, ATS-optimized CVs in minutes with AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVCraft — AI-Powered CV Generator",
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
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
