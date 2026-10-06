import { HomePage, homeMetadata } from "@/components/landing/HomePage";

export const metadata = homeMetadata("en");

export default function LandingPage() {
  return <HomePage lang="en" />;
}
