/**
 * Server-side protection for the public contact form (/api/contact).
 *
 * Everything here runs on the server, so it applies equally to the visible
 * form and to requests sent straight to the API:
 *   - strict validation of every field (types, lengths, control characters)
 *   - honeypot field
 *   - optional Cloudflare Turnstile verification
 *   - per-IP and global rate limits stored in Postgres (shared by all
 *     serverless instances; no in-memory counters)
 *   - a "possible spam" flag for random-looking submissions (flagged, never
 *     silently dropped)
 */
import { createHash } from "crypto";
import prisma from "@/lib/prisma";
import { CONTACT_LIMITS, HONEYPOT_FIELD } from "@/lib/contact-limits";

// ── Validation ────────────────────────────────────────────────────────────────

export { CONTACT_LIMITS, HONEYPOT_FIELD };

export type ContactInput = { name: string; email: string; subject: string; message: string };

// Single-line fields: no control characters at all (CR/LF would allow email
// header injection), no Unicode line/paragraph separators.
const LINE_SEPARATORS = String.fromCharCode(0x2028, 0x2029);
const SINGLE_LINE_FORBIDDEN = new RegExp(`[\\x00-\\x1F\\x7F-\\x9F${LINE_SEPARATORS}]`);
// Message: newlines and tabs are fine, other control characters (incl. NUL) are not.
const MULTI_LINE_FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/;

// Pragmatic address check: one "@", no spaces/brackets/quotes in the local
// part, and a dotted domain of valid labels (internationalized domains are
// accepted in their punycode "xn--" form).
const EMAIL_RE =
  /^[^\s@<>()[\]\\,;:"]{1,64}@(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

function cleanField(value: unknown, max: number, multiline: boolean): string | null {
  if (typeof value !== "string") return null;
  let s = value.normalize("NFC");
  if (multiline) s = s.replace(/\r\n?/g, "\n");
  s = s.trim();
  if (!s || s.length > max) return null;
  if ((multiline ? MULTI_LINE_FORBIDDEN : SINGLE_LINE_FORBIDDEN).test(s)) return null;
  return s;
}

/** Returns the cleaned fields, or the name of the first invalid field. */
export function validateContact(body: Record<string, unknown>): { ok: true; data: ContactInput } | { ok: false; field: keyof ContactInput } {
  const name = cleanField(body.name, CONTACT_LIMITS.name, false);
  if (!name) return { ok: false, field: "name" };
  const email = cleanField(body.email, CONTACT_LIMITS.email, false);
  if (!email || !EMAIL_RE.test(email)) return { ok: false, field: "email" };
  const subject = cleanField(body.subject, CONTACT_LIMITS.subject, false);
  if (!subject) return { ok: false, field: "subject" };
  const message = cleanField(body.message, CONTACT_LIMITS.message, true);
  if (!message) return { ok: false, field: "message" };
  return { ok: true, data: { name, email, subject, message } };
}

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const v = body[HONEYPOT_FIELD];
  return v !== undefined && v !== null && v !== "";
}

/** Escape user text before putting it in an HTML email. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Possible-spam flag ────────────────────────────────────────────────────────

/**
 * Random keyboard strings such as "dmDHtSFPRmlfMJDFPXDkgr": one long token of
 * plain ASCII letters that switches from lower to upper case several times.
 * Real names ("McDonald", "Jean-Baptiste"), words and sentences don't.
 */
function looksRandom(s: string): boolean {
  if (s.length < 12 || !/^[A-Za-z]+$/.test(s)) return false;
  const switches = s.match(/[a-z][A-Z]/g)?.length ?? 0;
  return switches >= 3;
}

/**
 * Flags (does not reject) submissions where at least two fields look like
 * random strings, or the message is mostly links. Flagged messages are still
 * delivered, marked, so a genuine enquiry is never lost.
 */
export function isSuspicious({ name, subject, message }: ContactInput): boolean {
  const randomFields = [name, subject, message].filter(looksRandom).length;
  const links = message.match(/https?:\/\//gi)?.length ?? 0;
  return randomFields >= 2 || links > 5;
}

// ── Client IP (trusted platform metadata only) ────────────────────────────────

/**
 * On Vercel, `x-real-ip` is set by the platform edge from the TCP connection
 * and overwrites any value sent by the client, so it can be trusted there
 * (it's what @vercel/functions' ipAddress() reads). Outside Vercel (local dev)
 * there is no trusted source, so every request shares one bucket instead of
 * trusting spoofable headers.
 */
export function clientIp(headers: Headers): string {
  if (process.env.VERCEL === "1") {
    const ip = headers.get("x-real-ip")?.trim();
    if (ip) return ip;
  }
  return "unknown";
}

// ── Rate limiting (Postgres, shared across serverless instances) ──────────────

/** Per visitor IP: 3 messages per 10 minutes (a sliding window — never a permanent block). */
export const IP_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
/** All visitors together: caps outbound notification emails if many IPs are used. */
export const GLOBAL_LIMIT = { max: 30, windowMs: 60 * 60 * 1000 };
const RETENTION_MS = 24 * 60 * 60 * 1000;
const GLOBAL_KEY = "global";

/** Only a hash of the IP is stored, never the address itself. */
function ipKey(ip: string): string {
  return "ip:" + createHash("sha256").update("cvixeo-contact:" + ip).digest("hex").slice(0, 32);
}

export type RateLimitResult = "ok" | "limited" | "unavailable";

/**
 * Counts this submission against the per-IP and global windows. A submission
 * is recorded only when it's allowed, so blocked retries don't extend the
 * block and can't grow the table.
 */
export async function consumeContactRateLimit(ip: string): Promise<RateLimitResult> {
  const key = ipKey(ip);
  const now = Date.now();
  try {
    const [perIp, global] = await Promise.all([
      prisma.contactRateLimit.count({ where: { key, createdAt: { gt: new Date(now - IP_LIMIT.windowMs) } } }),
      prisma.contactRateLimit.count({ where: { key: GLOBAL_KEY, createdAt: { gt: new Date(now - GLOBAL_LIMIT.windowMs) } } }),
    ]);
    if (perIp >= IP_LIMIT.max || global >= GLOBAL_LIMIT.max) return "limited";
    await prisma.contactRateLimit.createMany({ data: [{ key }, { key: GLOBAL_KEY }] });
    // Housekeeping: entries older than a day are never needed again.
    await prisma.contactRateLimit.deleteMany({ where: { createdAt: { lt: new Date(now - RETENTION_MS) } } });
    return "ok";
  } catch (err) {
    console.error("[contact] rate limiter unavailable:", err instanceof Error ? err.message : err);
    return "unavailable";
  }
}

// ── Cloudflare Turnstile (optional) ───────────────────────────────────────────

/** Turnstile is enforced only when the server-side secret is configured. */
export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") form.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) console.warn("[contact] turnstile rejected:", data["error-codes"]);
    return data.success === true;
  } catch (err) {
    console.error("[contact] turnstile verification failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
