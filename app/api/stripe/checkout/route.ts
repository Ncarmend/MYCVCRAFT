/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for Pro subscription.
 *
 * Accepts { planType: "MONTHLY" | "ANNUAL" } in the request body.
 * Price IDs are resolved server-side so they are never exposed to the browser
 * (STRIPE_PRO_PRICE_ID / STRIPE_PRO_ANNUAL_PRICE_ID are not NEXT_PUBLIC_ vars).
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

    // Resolve planType → Stripe price ID entirely server-side.
    // Never trust a price ID sent from the client (it would be null anyway since
    // STRIPE_PRO_PRICE_ID is not exposed as a NEXT_PUBLIC_ variable).
    const body = await request.json().catch(() => ({})) as { planType?: string };
    const isAnnual = body.planType === "ANNUAL";
    const priceId = isAnnual
      ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID;

    console.log("[stripe:checkout] Creating session", {
      userId: dbUser.id,
      planType: body.planType ?? "MONTHLY",
      priceId: priceId ? "set" : "MISSING",
    });

    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price not configured for plan: ${body.planType ?? "MONTHLY"}` },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const session = await createCheckoutSession({
      customerId: dbUser.subscription?.stripeCustomerId || undefined,
      priceId,
      successUrl: `${appUrl}/dashboard?success=true`,
      cancelUrl: `${appUrl}/pricing`,
      userId: dbUser.id,
    });

    console.log("[stripe:checkout] Session created", { sessionId: session.id, url: session.url });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe:checkout] Error", err);
    return NextResponse.json({ error: "Checkout session creation failed" }, { status: 500 });
  }
}
