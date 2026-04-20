/**
 * Dashboard shell layout — sidebar + main content area
 * All dashboard routes are rendered inside this layout
 */
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

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        supabaseId: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      },
    });
  }

  const plan = dbUser?.subscription?.plan ?? "FREE";

  return (
    <DashboardShell
      userEmail={user.email}
      userName={dbUser?.name || user.user_metadata?.full_name}
      plan={plan}
    >
      {children}
    </DashboardShell>
  );
}
