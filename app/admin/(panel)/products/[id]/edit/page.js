import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditProduct({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product, error: productError }, { data: categories, error: categoriesError }, { data: brands, error: brandsError }] = await Promise.all([
    supabase.from("products").select("*,product_images(url,sort_order)").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id,name").order("sort_order"),
    supabase.from("brands").select("id,name").order("name"),
  ]);
  if (productError) throw new Error(`Could not load product: ${productError.message}`);
  if (categoriesError) throw new Error(`Could not load categories: ${categoriesError.message}`);
  if (brandsError) throw new Error(`Could not load brands: ${brandsError.message}`);
  if (!product) notFound();
  product.images = (product.product_images || []).sort((a, b) => a.sort_order - b.sort_order).map((image) => image.url);
  return <ProductForm product={product} categories={categories || []} brands={brands || []} />;
}
