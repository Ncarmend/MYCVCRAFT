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
  searchParams: Promise<{ redirectTo?: string; error?: string; reason?: string }>;
}) {
  const { redirectTo, error, reason } = await searchParams;
  const errorCode = error ? (reason ?? "").replace(/[^a-z0-9_]/gi, "").slice(0, 40) : "";
  return <LoginForm redirectTo={safeNextPath(redirectTo)} callbackError={!!error} errorCode={errorCode} />;
}
