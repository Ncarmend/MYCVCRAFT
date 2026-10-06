import { AboutPageShell, aboutMetadata } from "@/components/seo/AboutPageShell";

export const metadata = aboutMetadata("en");

export default function AboutPage() {
  return <AboutPageShell lang="en" />;
}
