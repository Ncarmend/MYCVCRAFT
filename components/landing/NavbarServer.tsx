import { createClient } from "@/lib/supabase/server";
import { Navbar } from "./Navbar";

export async function NavbarServer() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;
    const userName = (user?.user_metadata?.full_name as string | undefined)
      ?? user?.email?.split("@")[0];
    return <Navbar isLoggedIn={isLoggedIn} userName={userName} />;
  } catch {
    return <Navbar isLoggedIn={false} />;
  }
}
