import { HomePage, homeMetadata } from "@/components/landing/HomePage";

export const metadata = homeMetadata("fr");

export default function LandingPageFr() {
  return <HomePage lang="fr" />;
}
