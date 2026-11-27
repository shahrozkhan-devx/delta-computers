import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductsTable from "@/components/admin/ProductsTable";

export default async function AdminProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from("products").select("id,name,slug,price,discount_price,stock_qty,stock_status,is_active,is_featured,thumbnail_url,categories(name),brands(name)").order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Catalog</p><h1 className="mt-2 font-display text-3xl font-semibold">Products</h1><p className="mt-2 text-sm text-slate-400">{products.length} items in your catalog</p></div><Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-electric px-4 py-2.5 text-sm font-bold"><Plus size={16} />Add product</Link></div>
    <ProductsTable key={(products || []).map((product) => `${product.id}:${product.is_active}:${product.is_featured}`).join("|")} products={products || []} />
  </div>;
}
