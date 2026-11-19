/**
 * Cloudflare Turnstile — server-side verification for the contact form.
 *
 * Kept free of app imports so it can be unit-tested with Node's built-in test
 * runner (tests/turnstile.test.mjs). Server-only: it reads TURNSTILE_SECRET_KEY.
 *
 * Policy:
 *  - Secret set                → every submission needs a valid token.
 *  - Secret missing, deployed  → submissions are refused ("misconfigured");
 *    Turnstile is never silently switched off on Vercel (production or preview).
 *  - Secret missing, local dev → skipped, with a warning.
 *  - Production also checks the token was issued for the CVixeo hostname and
 *    by the contact widget (action "contact").
 */

export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** Passed to the widget and required back from Siteverify in production. */
export const TURNSTILE_ACTION = "contact";
export const PRODUCTION_HOSTNAMES = ["www.cvixeo.com", "cvixeo.com"];
/** Cloudflare tokens are at most 2048 characters. */
const MAX_TOKEN_LENGTH = 2048;

type Env = Record<string, string | undefined>;

export type TurnstileConfig =
  | { mode: "enforce"; secret: string; hostnames: string[] | null }
  | { mode: "skip" }
  | { mode: "misconfigured" };

export function turnstileConfig(env: Env = process.env): TurnstileConfig {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  // Deployed = any Vercel environment, or a production build (`next start`).
  const deployed = Boolean(env.VERCEL_ENV) || env.NODE_ENV === "production";
  if (!secret) return deployed ? { mode: "misconfigured" } : { mode: "skip" };

  // Optional override, e.g. "localhost" or a preview domain. Without it, the
  // hostname is checked in production only: preview URLs change per deploy and
  // Cloudflare's test keys report "example.com".
  const configured = env.TURNSTILE_ALLOWED_HOSTNAMES?.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
  const hostnames = configured?.length ? configured : env.VERCEL_ENV === "production" ? PRODUCTION_HOSTNAMES : null;
  return { mode: "enforce", secret, hostnames };
}

export type TurnstileResult =
  | { ok: true }
  | {
      ok: false;
      /** "unavailable" = Cloudflare or our configuration failed, not the visitor. */
      reason: "missing_token" | "invalid_token" | "hostname_mismatch" | "action_mismatch" | "unavailable";
      errorCodes?: string[];
    };

type SiteverifyResponse = {
  success?: unknown;
  "error-codes"?: unknown;
  hostname?: unknown;
  action?: unknown;
};

// Errors on our side (secret) or Cloudflare's — the visitor did nothing wrong.
const SERVICE_ERRORS = new Set(["missing-input-secret", "invalid-input-secret", "internal-error"]);

export async function verifyTurnstileToken(
  token: unknown,
  opts: { secret: string; hostnames: string[] | null; remoteIp?: string; fetchImpl?: typeof fetch; timeoutMs?: number },
): Promise<TurnstileResult> {
  if (typeof token !== "string" || !token.trim() || token.length > MAX_TOKEN_LENGTH) return { ok: false, reason: "missing_token" };

  let data: SiteverifyResponse;
  try {
    const body = new URLSearchParams({ secret: opts.secret, response: token });
    if (opts.remoteIp) body.set("remoteip", opts.remoteIp);
    const res = await (opts.fetchImpl ?? fetch)(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(opts.timeoutMs ?? 5000),
    });
    if (!res.ok) return { ok: false, reason: "unavailable", errorCodes: [`http_${res.status}`] };
    data = (await res.json()) as SiteverifyResponse;
  } catch {
    return { ok: false, reason: "unavailable", errorCodes: ["network_error"] };
  }
  if (!data || typeof data !== "object" || typeof data.success !== "boolean") {
    return { ok: false, reason: "unavailable", errorCodes: ["malformed_response"] };
  }

  const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"].filter((c): c is string => typeof c === "string") : [];
  if (!data.success) {
    // e.g. "timeout-or-duplicate" (expired or already used), "invalid-input-response"
    return { ok: false, reason: errorCodes.some((c) => SERVICE_ERRORS.has(c)) ? "unavailable" : "invalid_token", errorCodes };
  }

  if (opts.hostnames) {
    const hostname = typeof data.hostname === "string" ? data.hostname.toLowerCase() : "";
    if (!opts.hostnames.includes(hostname)) return { ok: false, reason: "hostname_mismatch" };
    if (data.action !== TURNSTILE_ACTION) return { ok: false, reason: "action_mismatch" };
  } else if (typeof data.action === "string" && data.action && data.action !== TURNSTILE_ACTION) {
    return { ok: false, reason: "action_mismatch" };
  }
  return { ok: true };
}
