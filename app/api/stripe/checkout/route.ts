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

    const { priceId } = await request.json();
    if (!priceId) return NextResponse.json({ error: "Price ID required" }, { status: 400 });

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
