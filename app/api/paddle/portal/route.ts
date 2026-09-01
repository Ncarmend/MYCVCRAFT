/**
 * POST /api/paddle/portal
 * Creates a Paddle Customer Portal session for subscription management.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPortalSession } from "@/lib/paddle";
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
    if (!dbUser?.subscription?.paddleCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const session = await createPortalSession({
      customerId: dbUser.subscription.paddleCustomerId,
      subscriptionIds: dbUser.subscription.paddleSubscriptionId
        ? [dbUser.subscription.paddleSubscriptionId]
        : [],
    });

    return NextResponse.json({ url: session.urls.general.overview });
  } catch (err) {
    console.error("[POST /api/paddle/portal]", err);
    return NextResponse.json({ error: "Portal session creation failed" }, { status: 500 });
  }
}
