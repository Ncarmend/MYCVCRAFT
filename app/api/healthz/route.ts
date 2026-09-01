import { NextResponse } from "next/server";

function maskKey(key: string | undefined): string {
  if (!key) return "MISSING";
  if (key.length <= 12) return key.slice(0, 4) + "...";
  return key.slice(0, 8) + "..." + key.slice(-4);
}

export async function GET() {
  const checks: Record<string, string> = {};

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  checks.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl || "MISSING";
  checks.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey ? maskKey(anonKey) : "MISSING";
  checks.SUPABASE_SERVICE_ROLE_KEY = serviceKey ? maskKey(serviceKey) : "MISSING";
  checks.DATABASE_URL = process.env.DATABASE_URL ? "set" : "MISSING";
  checks.OPENAI_API_KEY = process.env.OPENAI_API_KEY ? "set" : "MISSING";
  checks.PADDLE_API_KEY = process.env.PADDLE_API_KEY ? "set" : "MISSING";
  checks.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "MISSING";

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
      supabaseStatus = e instanceof Error ? e.message : String(e);
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
    prismaStatus = e instanceof Error ? e.message : String(e);
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
