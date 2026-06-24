/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for Pro subscription
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Accept either the monthly or annual price from the client; fall back to monthly.
    const body = await request.json().catch(() => ({})) as { priceId?: string };
    const validPriceIds = [
      process.env.STRIPE_PRO_PRICE_ID,
      process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    ].filter(Boolean) as string[];
    const priceId =
      body.priceId && validPriceIds.includes(body.priceId)
        ? body.priceId
        : process.env.STRIPE_PRO_PRICE_ID;
    if (!priceId) return NextResponse.json({ error: "Stripe price not configured" }, { status: 500 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const session = await createCheckoutSession({
      customerId: dbUser.subscription?.stripeCustomerId || undefined,
      priceId,
      successUrl: `${appUrl}/dashboard?success=true`,
      cancelUrl: `${appUrl}/pricing`,
      userId: dbUser.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[POST /api/stripe/checkout]", err);
    return NextResponse.json({ error: "Checkout session creation failed" }, { status: 500 });
  }
}
