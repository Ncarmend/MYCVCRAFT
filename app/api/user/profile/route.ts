/**
 * PATCH /api/user/profile
 * Updates user profile (name, job title from onboarding)
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, jobTitle } = await request.json();

    // Upsert: right after sign-up (onboarding) the Prisma record may not exist
    // yet — it was previously only created by the dashboard layout, so update()
    // threw and the onboarding answers were lost. Same create fields as there.
    await prisma.user.upsert({
      where: { supabaseId: user.id },
      create: {
        supabaseId: user.id,
        email: user.email!,
        name: name || user.user_metadata?.full_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      },
      update: { name: name || undefined },
    });

    // Also update Supabase user metadata
    await supabase.auth.updateUser({
      data: { full_name: name, job_title: jobTitle },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/user/profile]", err);
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
  }
}
