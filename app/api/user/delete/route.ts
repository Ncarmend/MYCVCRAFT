/**
 * DELETE /api/user/delete
 * Deletes the user's account and all associated data
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Delete from Prisma (cascades to cvs and subscription)
    await prisma.user.delete({ where: { supabaseId: user.id } });

    // Delete from Supabase Auth using service role
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await admin.auth.admin.deleteUser(user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/user/delete]", err);
    return NextResponse.json({ error: "Account deletion failed" }, { status: 500 });
  }
}
