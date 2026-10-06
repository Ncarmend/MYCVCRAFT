import LoginForm from "./LoginForm";
import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: NOINDEX,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo = "/dashboard" } = await searchParams;
  return <LoginForm redirectTo={redirectTo} />;
}
