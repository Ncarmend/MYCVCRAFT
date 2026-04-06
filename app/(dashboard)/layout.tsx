/**
 * Dashboard shell layout — sidebar + main content area
 * All dashboard routes are rendered inside this layout
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/Sidebar";

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

  // Fetch user profile with subscription
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });

  // If no DB record yet (first OAuth login before callback ran), create it
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed sidebar */}
      <Sidebar
        userEmail={user.email}
        userName={dbUser?.name || user.user_metadata?.full_name}
        plan={plan}
      />

      {/* Scrollable main area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
