/**
 * Supabase OAuth callback handler
 * Exchanges code for session, then creates/syncs Prisma user record
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Sync user to Prisma (upsert so it works for both new and returning)
      await prisma.user.upsert({
        where: { supabaseId: data.user.id },
        create: {
          supabaseId: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            null,
          avatarUrl: data.user.user_metadata?.avatar_url || null,
          // Create a free subscription by default
          subscription: {
            create: { plan: "FREE", status: "ACTIVE" },
          },
        },
        update: {
          email: data.user.email!,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            undefined,
          avatarUrl: data.user.user_metadata?.avatar_url || undefined,
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
