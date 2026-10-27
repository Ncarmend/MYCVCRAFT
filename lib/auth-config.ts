/**
 * Auth helpers shared by the auth pages and the Supabase callback routes.
 */

/**
 * OAuth providers shown on /login and /signup (only Google is offered; the
 * GitHub button was removed). The provider must also be enabled in Supabase
 * (Authentication → Providers), otherwise the button leads to a raw Supabase
 * "provider is not enabled" error page.
 */
export const OAUTH_PROVIDERS: readonly "google"[] = ["google"];

/**
 * Only allow same-site relative paths as post-auth destinations. Values like
 * "@evil.com" or ".evil.com" would otherwise turn `${origin}${next}` into an
 * external URL (open redirect); "//host" and "/\host" are protocol-relative.
 */
export function safeNextPath(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

/**
 * Login-failure redirect that keeps the reason. Supabase sends
 * ?error=&error_code=&error_description= when the provider step fails; without
 * this, every failure looked the same ("link invalid or expired"). The full
 * detail goes to the server logs (Vercel → Logs); only a short, sanitized code
 * is put in the URL and shown on the login page.
 */
export function authFailureRedirect(
  origin: string,
  route: string,
  params: URLSearchParams,
  exchangeError?: { message?: string; code?: string } | null,
): string {
  const reason =
    params.get("error_code") || params.get("error") || exchangeError?.code || (params.get("code") ? "exchange_failed" : "missing_code");
  console.error(`[${route}] sign-in failed`, {
    reason,
    error: params.get("error"),
    error_description: params.get("error_description"),
    exchange_error: exchangeError?.message,
  });
  const safeReason = reason.replace(/[^a-z0-9_]/gi, "").slice(0, 40) || "unknown";
  return `${origin}/login?error=auth_callback_failed&reason=${safeReason}`;
}
