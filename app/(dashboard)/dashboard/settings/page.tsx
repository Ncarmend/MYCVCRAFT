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
            plan: dbUser.subscription?.plan ?? "FREE",
            stripeCustomerId: dbUser.subscription?.stripeCustomerId ?? null,
            currentPeriodEnd: dbUser.subscription?.stripeCurrentPeriodEnd?.toISOString() ?? null,
          }}
        />
      </div>
    </div>
  );
}
