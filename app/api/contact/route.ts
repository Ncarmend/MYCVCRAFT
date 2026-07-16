import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // ── Send email here ──────────────────────────────────────────────────────
    // Wire up your preferred email provider:
    //   • Resend:     await resend.emails.send({ from, to, subject, html })
    //   • Nodemailer: await transporter.sendMail({ from, to, subject, text })
    //   • SendGrid:   await sgMail.send({ to, from, subject, text: message })
    // ────────────────────────────────────────────────────────────────────────

    console.log("[contact]", { name, email, subject, message: message.slice(0, 100) });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
