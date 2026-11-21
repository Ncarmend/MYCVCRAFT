/**
 * Brevo transactional email — a thin wrapper over the REST API
 * (POST /v3/smtp/email). No SDK needed.
 *
 * Kept free of app imports so it can be unit-tested with Node's built-in test
 * runner (tests/brevo.test.mjs). Server-only: it reads BREVO_API_KEY.
 *
 * The sender address must belong to a domain authenticated in Brevo
 * (Senders, Domains & Dedicated IPs → Domains), otherwise Brevo refuses it.
 */

export const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

type Address = { email: string; name?: string };

export type BrevoEmail = {
  sender: Address;
  to: Address[];
  replyTo?: Address;
  subject: string;
  htmlContent: string;
};

export type BrevoResult =
  | { ok: true; messageId?: string }
  /** `code`/`message` come from Brevo's error body — safe to log (no content, no key). */
  | { ok: false; status: number; code: string; message: string };

export async function sendBrevoEmail(
  email: BrevoEmail,
  opts: { apiKey: string | undefined; fetchImpl?: typeof fetch; timeoutMs?: number },
): Promise<BrevoResult> {
  const apiKey = opts.apiKey?.trim();
  if (!apiKey) return { ok: false, status: 0, code: "missing_api_key", message: "BREVO_API_KEY is not set" };

  let res: Response;
  try {
    res = await (opts.fetchImpl ?? fetch)(BREVO_SEND_URL, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(opts.timeoutMs ?? 10_000),
    });
  } catch (err) {
    return { ok: false, status: 0, code: "network_error", message: err instanceof Error ? err.message : "fetch failed" };
  }

  const data = (await res.json().catch(() => ({}))) as { messageId?: unknown; code?: unknown; message?: unknown };
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      code: typeof data.code === "string" ? data.code : `http_${res.status}`,
      message: typeof data.message === "string" ? data.message : "",
    };
  }
  return { ok: true, messageId: typeof data.messageId === "string" ? data.messageId : undefined };
}
