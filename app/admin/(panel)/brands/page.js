import { createClient } from "@/lib/supabase/server";
import ManageList from "@/components/admin/ManageList";

export default async function AdminBrands() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("brands").select("*").order("name");
  if (error) throw new Error(`Could not load brands: ${error.message}`);
  return <ManageList kind="brand" items={data || []} />;
}
