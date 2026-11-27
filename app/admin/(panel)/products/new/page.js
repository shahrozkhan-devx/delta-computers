import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewProduct() {
  const supabase = await createClient();
  const [{ data: categories, error: categoriesError }, { data: brands, error: brandsError }] = await Promise.all([
    supabase.from("categories").select("id,name").order("sort_order"),
    supabase.from("brands").select("id,name").order("name"),
  ]);
  if (categoriesError) throw new Error(`Could not load categories: ${categoriesError.message}`);
  if (brandsError) throw new Error(`Could not load brands: ${brandsError.message}`);
  return <ProductForm categories={categories || []} brands={brands || []} />;
}
