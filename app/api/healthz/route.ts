import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING";
  checks.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "MISSING";
  checks.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "MISSING";
  checks.DATABASE_URL = process.env.DATABASE_URL ? "set" : "MISSING";
  checks.OPENAI_API_KEY = process.env.OPENAI_API_KEY ? "set" : "MISSING";
  checks.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ? "set" : "MISSING";
  checks.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "MISSING";

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
    (v) => v !== "MISSING" && !v.startsWith("Error") && !v.startsWith("Can")
  );

  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 500 });
}
