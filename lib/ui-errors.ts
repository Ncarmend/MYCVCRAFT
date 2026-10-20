/**
 * Map server/API errors to localized UI messages.
 *
 * API routes don't know the user's language and return English text, so the
 * UI never shows `body.error` directly: it translates by error code / HTTP
 * status using translations[lang].ui.* instead.
 */
import type { translations } from "@/lib/translations";

type UI = (typeof translations)[keyof typeof translations]["ui"];

/** AI routes: aiGuard codes (QUOTA_EXCEEDED, RATE_LIMIT, NO_CREDITS…) and Premium 403s. */
export async function aiErrorMessage(res: Response, ui: UI, fallback: string): Promise<string> {
  let code: string | undefined;
  try {
    code = (await res.clone().json())?.code;
  } catch {
    /* non-JSON body */
  }
  if (res.status === 403 || code === "UPGRADE_REQUIRED") return ui.ai.premiumRequired;
  if (code === "QUOTA_EXCEEDED") return ui.ai.dailyLimit;
  if (res.status === 429 || code === "RATE_LIMIT") return ui.ai.busy;
  if (code && ["NO_CREDITS", "MISSING_KEY", "AUTH_ERROR", "CONNECTION_ERROR", "API_ERROR", "NOT_CONFIGURED"].includes(code)) {
    return ui.ai.unavailable;
  }
  return fallback;
}

/** Supabase Auth returns English messages; map the common ones. */
export function authErrorMessage(message: string | undefined, ui: UI): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) return ui.auth.errors.invalidCredentials;
  if (m.includes("already registered") || m.includes("already exists")) return ui.auth.errors.alreadyRegistered;
  if (m.includes("email not confirmed")) return ui.auth.errors.emailNotConfirmed;
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes")) return ui.auth.errors.rateLimit;
  if (m.includes("weak") || m.includes("password should")) return ui.auth.errors.weakPassword;
  return ui.auth.errors.generic;
}

/** "{title}"-style placeholder replacement for translated strings. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
}
