import SignupForm from "./SignupForm";
import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Create your account",
  robots: NOINDEX,
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo = "/onboarding" } = await searchParams;
  return <SignupForm returnTo={returnTo} />;
}
