/**
 * Settings page — profile, password, billing, danger zone
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });
  if (!dbUser) redirect("/onboarding");

  return (
    <div>
      <Header title="Settings" subtitle="Manage your account and subscription" />
      <div className="p-8 max-w-2xl mx-auto space-y-8">
        <SettingsClient
          user={{
            name: dbUser.name ?? "",
            email: dbUser.email,
            plan: dbUser.subscription?.plan ?? "FREE",
            stripeCustomerId: dbUser.subscription?.stripeCustomerId ?? null,
            currentPeriodEnd: dbUser.subscription?.stripeCurrentPeriodEnd?.toISOString() ?? null,
          }}
        />
      </div>
    </div>
  );
}
