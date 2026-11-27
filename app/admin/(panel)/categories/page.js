import { createClient } from "@/lib/supabase/server";
import ManageList from "@/components/admin/ManageList";

export default async function AdminCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw new Error(`Could not load categories: ${error.message}`);
  return <ManageList kind="category" items={data || []} />;
}
