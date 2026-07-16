import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Fail fast at boot if the key is missing rather than getting a cryptic runtime error
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const toAddress = process.env.CONTACT_EMAIL;
    if (!toAddress) {
      console.error("[contact] CONTACT_EMAIL env var is not set");
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    // ── Notify the support inbox ─────────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: "Cvixeo Contact <onboarding@resend.dev>",
      to: toAddress,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:12px;">
            New contact message
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:100px;font-size:14px;"><strong>Name</strong></td>
                <td style="padding:8px 0;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:14px;"><strong>Email</strong></td>
                <td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:14px;"><strong>Subject</strong></td>
                <td style="padding:8px 0;font-size:14px;">${subject}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
            <p style="margin:0;font-size:14px;color:#334155;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#94a3b8;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    if (sendError) {
      console.error("[contact] Resend error (notification):", sendError);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    // ── Send confirmation to the user ────────────────────────────────────────
    await resend.emails.send({
      from: "Cvixeo Support <onboarding@resend.dev>",
      to: email,
      subject: "We received your message — Cvixeo",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#1e293b;">Thanks for reaching out, ${name}!</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;">
            We've received your message and will get back to you within <strong>24 hours</strong>
            (Mon–Fri, 9 am–6 pm CET).
          </p>
          <div style="margin:20px 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #16a34a;">
            <p style="margin:0 0 4px;font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Your message</p>
            <p style="margin:0;font-size:14px;color:#334155;font-style:italic;">"${subject}"</p>
          </div>
          <p style="color:#475569;font-size:14px;">
            If your request is urgent, you can also reach us directly at
            <a href="mailto:${toAddress}" style="color:#16a34a;">${toAddress}</a>.
          </p>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— The Cvixeo team</p>
        </div>
      `,
    });

    console.log("[contact] message sent from", email, "subject:", subject);
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
