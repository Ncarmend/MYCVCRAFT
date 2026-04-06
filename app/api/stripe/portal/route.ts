/**
 * POST /api/stripe/portal
 * Creates a Stripe Customer Portal session for subscription management
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPortalSession } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (!dbUser?.subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const session = await createPortalSession({
      customerId: dbUser.subscription.stripeCustomerId,
      returnUrl: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[POST /api/stripe/portal]", err);
    return NextResponse.json({ error: "Portal session creation failed" }, { status: 500 });
  }
}
