/**
 * Dashboard shell layout — sidebar + main content area
 * All dashboard routes are rendered inside this layout
 */
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.upsert({
    where: { supabaseId: user.id },
    create: {
      supabaseId: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
    },
    update: {},
    include: { subscription: true },
  });

  const plan = dbUser.subscription?.plan ?? "FREE";
  // Pass as ISO string — client components cannot receive Date objects directly
  const trialEnd = dbUser.subscription?.trialEnd?.toISOString() ?? null;

  return (
    <DashboardShell
      userEmail={user.email}
      userName={dbUser?.name || user.user_metadata?.full_name}
      plan={plan}
      trialEnd={trialEnd}
    >
      {children}
    </DashboardShell>
  );
}
