import SignupForm from "./SignupForm";
import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";
import { safeNextPath } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "Create your account",
  robots: NOINDEX,
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  return <SignupForm returnTo={safeNextPath(returnTo, "/onboarding")} />;
}
