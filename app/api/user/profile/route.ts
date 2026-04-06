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

    await prisma.user.update({
      where: { supabaseId: user.id },
      data: { name: name || undefined },
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
