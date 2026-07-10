/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session.
 *
 * Accepts { planType: "MONTHLY" | "ANNUAL" | "PASS" } in the request body.
 * All price IDs are resolved server-side — never exposed to the browser.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, createPassCheckoutSession } from "@/lib/stripe";
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

    const body = await request.json().catch(() => ({})) as { planType?: string };
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const customerId = dbUser.subscription?.stripeCustomerId || undefined;

    console.log("[stripe:checkout] Creating session", { userId: dbUser.id, planType: body.planType });

    if (body.planType === "PASS") {
      const priceId = process.env.STRIPE_PASS_PRICE_ID;
      if (!priceId) return NextResponse.json({ error: "Pass price not configured" }, { status: 500 });
      const session = await createPassCheckoutSession({
        customerId,
        priceId,
        successUrl: `${appUrl}/dashboard?success=true`,
        cancelUrl: `${appUrl}/pricing`,
        userId: dbUser.id,
      });
      console.log("[stripe:checkout] Pass session created", { sessionId: session.id });
      return NextResponse.json({ url: session.url });
    }

    // Monthly or Annual subscription
    const isAnnual = body.planType === "ANNUAL";
    const priceId = isAnnual
      ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price not configured for plan: ${body.planType ?? "MONTHLY"}` },
        { status: 500 }
      );
    }

    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${appUrl}/dashboard?success=true`,
      cancelUrl: `${appUrl}/pricing`,
      userId: dbUser.id,
    });

    console.log("[stripe:checkout] Subscription session created", { sessionId: session.id });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe:checkout] Error", err);
    return NextResponse.json({ error: "Checkout session creation failed" }, { status: 500 });
  }
}
