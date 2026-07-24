export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { isProUser } from "@/lib/isPro";
import { NewCVClient } from "./NewCVClient";

export default async function NewCVPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });

  const isPro = isProUser(dbUser?.subscription);

  return <NewCVClient isPro={isPro} />;
}
