import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?setup=1");
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: admin, error } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error) throw new Error(`Could not verify admin permissions: ${error.message}`);
  if (!admin) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw new Error(`Could not end unauthorized session: ${signOutError.message}`);
    redirect("/admin/login");
  }
  return <AdminShell email={user.email || "Administrator"}>{children}</AdminShell>;
}
