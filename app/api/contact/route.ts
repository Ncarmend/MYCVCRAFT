import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  clientIp,
  consumeContactRateLimit,
  escapeHtml,
  isHoneypotFilled,
  isSuspicious,
  turnstileEnabled,
  validateContact,
  verifyTurnstile,
} from "@/lib/contact-protection";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Far above the largest valid submission (~5.5 KB of text + Turnstile token). */
const MAX_BODY_BYTES = 32 * 1024;

const fail = (status: number, code: string, error: string) => NextResponse.json({ error, code }, { status });

export async function POST(request: NextRequest) {
  try {
    // ── Parse: bounded size, JSON object only ───────────────────────────────
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail(413, "too_large", "Message is too long.");
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return fail(400, "invalid", "Invalid request."); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail(400, "invalid", "Invalid request.");
    const fields = body as Record<string, unknown>;

    // ── Honeypot: answer like a success so bots learn nothing; nothing is sent ─
    if (isHoneypotFilled(fields)) {
      console.warn("[contact] honeypot triggered — discarded");
      return NextResponse.json({ ok: true });
    }

    // ── Validate every field on the server ──────────────────────────────────
    const parsed = validateContact(fields);
    if (!parsed.ok) return fail(400, "invalid", `Invalid ${parsed.field}.`);
    const { name, email, subject, message } = parsed.data;

    const ip = clientIp(request.headers);

    // ── Turnstile (only when configured) ────────────────────────────────────
    if (turnstileEnabled() && !(await verifyTurnstile(fields["cf-turnstile-response"], ip))) {
      return fail(400, "verification_failed", "Verification failed. Please try again.");
    }

    // ── Rate limit: 3 per IP per 10 min, plus a global cap on emails ────────
    // If the limiter's table is unreachable the form stays usable (fail open);
    // the other checks above still apply.
    if ((await consumeContactRateLimit(ip)) === "limited") {
      return fail(429, "rate_limited", "Too many messages. Please try again in a few minutes.");
    }

    const toAddress = process.env.CONTACT_EMAIL;
    if (!toAddress) {
      console.error("[contact] CONTACT_EMAIL env var is not set");
      return fail(500, "server", "Server misconfiguration.");
    }

    // Random-looking submissions are still delivered — marked — so a genuine
    // enquiry is never lost; they can be filtered on the "[Possible spam]" prefix.
    const suspicious = isSuspicious(parsed.data);

    // ── Notify the support inbox (recipient fixed by server config) ─────────
    // No confirmation is emailed to the visitor's address: that let anyone
    // use the form to send mail from noreply@cvixeo.com to any third party.
    const h = { name: escapeHtml(name), email: escapeHtml(email), subject: escapeHtml(subject), message: escapeHtml(message) };
    const { error: sendError } = await resend.emails.send({
      from: "CVixeo Contact <noreply@cvixeo.com>",
      to: toAddress,
      replyTo: email,
      // subject has no CR/LF or control characters (validated above)
      subject: `${suspicious ? "[Possible spam] " : ""}[Contact] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:12px;">
            New contact message
          </h2>
          ${suspicious ? `<p style="padding:8px 12px;background:#fef3c7;border-radius:6px;font-size:13px;color:#92400e;">Flagged as possible spam (random-looking content). Delivered anyway in case it's genuine.</p>` : ""}
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:100px;font-size:14px;"><strong>Name</strong></td>
                <td style="padding:8px 0;font-size:14px;">${h.name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:14px;"><strong>Email</strong></td>
                <td style="padding:8px 0;font-size:14px;">${h.email}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:14px;"><strong>Subject</strong></td>
                <td style="padding:8px 0;font-size:14px;">${h.subject}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
            <p style="margin:0;font-size:14px;color:#334155;white-space:pre-wrap;">${h.message}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#94a3b8;">
            Reply directly to this email to respond to ${h.name}.
          </p>
        </div>
      `,
    });

    if (sendError) {
      console.error("[contact] Resend error (notification):", sendError.name, sendError.message);
      return fail(500, "send_failed", "Failed to send message. Please try again.");
    }

    // No visitor email/subject/IP in logs.
    console.log("[contact] message delivered", { suspicious });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error:", err instanceof Error ? err.message : err);
    return fail(500, "server", "Internal error.");
  }
}
