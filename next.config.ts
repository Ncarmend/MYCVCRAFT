import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Keep these heavy server-only packages out of the Next.js webpack bundle.
  // pdfjs-dist is used for PDF text extraction in /api/resume/import.
  // mammoth is used for DOCX extraction.
  serverExternalPackages: ["@prisma/client", "pdfjs-dist", "mammoth"],
};

export default nextConfig;
