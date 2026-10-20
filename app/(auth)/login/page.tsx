import LoginForm from "./LoginForm";
import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";
import { safeNextPath } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "Sign in",
  robots: NOINDEX,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const { redirectTo, error } = await searchParams;
  return <LoginForm redirectTo={safeNextPath(redirectTo)} callbackError={!!error} />;
}
