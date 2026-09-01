/**
 * Settings page — profile, password, billing, danger zone
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { SettingsClient } from "./SettingsClient";
import { translations } from "@/lib/translations";
import { isProUser } from "@/lib/isPro";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("cv-lang")?.value === "fr" ? "fr" : "en";
  const T = translations[lang].settings;

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
      <Header title={T.title} subtitle={T.subtitle} />
      <div className="mx-auto max-w-2xl space-y-8 p-4 sm:p-8">
        <SettingsClient
          user={{
            name: dbUser.name ?? "",
            email: dbUser.email,
            // isProUser() also covers an active 7-Day Pass, not just a paid subscription —
            // otherwise Pass users would incorrectly see "Free / Upgrade" here.
            plan: isProUser(dbUser.subscription) ? "PRO" : "FREE",
            paddleCustomerId: dbUser.subscription?.paddleCustomerId ?? null,
            currentPeriodEnd: dbUser.subscription?.paddleCurrentPeriodEnd?.toISOString() ?? null,
          }}
        />
      </div>
    </div>
  );
}
