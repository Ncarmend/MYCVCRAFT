/**
 * POST /api/ai/bullets
 * Generate achievement bullet points for a job experience entry
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAIBullets } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role, company, description } = await request.json();
    if (!role) return NextResponse.json({ error: "Role is required" }, { status: 400 });

    const bullets = await getOpenAIBullets({ role, company, description });
    return NextResponse.json({ bullets });
  } catch (err) {
    console.error("[POST /api/ai/bullets]", err);
    return NextResponse.json({ error: "Bullet generation failed" }, { status: 500 });
  }
}
