import { NextResponse } from "next/server";

// Public endpoint: report only whether each variable is configured.
// Never echo any part of a secret, nor raw error messages (they can contain
// connection details).
const present = (v: string | undefined) => (v ? "set" : "MISSING");

export async function GET() {
  const checks: Record<string, string> = {};

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  checks.NEXT_PUBLIC_SUPABASE_URL = present(supabaseUrl);
  checks.NEXT_PUBLIC_SUPABASE_ANON_KEY = present(anonKey);
  checks.SUPABASE_SERVICE_ROLE_KEY = present(serviceKey);
  checks.DATABASE_URL = process.env.DATABASE_URL ? "set" : "MISSING";
  checks.OPENAI_API_KEY = process.env.OPENAI_API_KEY ? "set" : "MISSING";
  checks.PADDLE_API_KEY = process.env.PADDLE_API_KEY ? "set" : "MISSING";
  checks.NEXT_PUBLIC_APP_URL = present(process.env.NEXT_PUBLIC_APP_URL);

  // Test Supabase auth endpoint connectivity
  let supabaseStatus = "not tested";
  if (supabaseUrl && anonKey) {
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: { apikey: anonKey },
        signal: AbortSignal.timeout(5000),
      });
      supabaseStatus = res.ok ? `ok (${res.status})` : `error (${res.status})`;
    } catch (e: unknown) {
      console.error("[healthz] supabase auth check failed", e);
      supabaseStatus = "error (unreachable)";
    }
  } else {
    supabaseStatus = "skipped — missing url or key";
  }
  checks.supabase_auth = supabaseStatus;

  // Test Prisma / database connectivity
  let prismaStatus = "not tested";
  try {
    const prisma = (await import("@/lib/prisma")).default;
    await prisma.$queryRaw`SELECT 1`;
    prismaStatus = "connected";
  } catch (e: unknown) {
    console.error("[healthz] database check failed", e);
    prismaStatus = "error (database unreachable)";
  }
  checks.prisma = prismaStatus;

  const allOk = Object.values(checks).every(
    (v) =>
      v !== "MISSING" &&
      !v.startsWith("Error") &&
      !v.startsWith("Can") &&
      !v.includes("error") &&
      v !== "skipped — missing url or key"
  );

  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 500 });
}
