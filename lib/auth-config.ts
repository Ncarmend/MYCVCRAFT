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
