import { NextResponse } from "next/server";

// Placeholder — user settings are managed via /api/user/profile
export async function GET() {
  return NextResponse.json({ ok: true });
}
