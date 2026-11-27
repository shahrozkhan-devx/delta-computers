import { categories as demoCategories, products as demoProducts, brands as demoBrands, shop as demoShop } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";

function mapProduct(product) {
  const imageUrls = (product.product_images || []).sort((a, b) => a.sort_order - b.sort_order).map((image) => image.url);
  return {
    ...product,
    brand: product.brands?.name || product.brand || "Generic",
    category: product.categories?.slug || product.category || "",
    image: product.thumbnail_url || product.image || "/product-placeholder.svg",
    images: imageUrls.length ? imageUrls : [product.thumbnail_url || product.image || "/product-placeholder.svg"],
    discount: product.discount_price || product.discount || null,
    condition: product.condition ? product.condition[0].toUpperCase() + product.condition.slice(1) : "New",
    stock: product.stock_qty ?? product.stock ?? 0,
    specs: product.specs || {},
    featured: product.is_featured ?? product.featured ?? false,
    isNew: product.is_new_arrival ?? product.isNew ?? false,
  };
}

export async function getShopSettings() {
  const supabase = await createClient();
  if (!supabase) return demoShop;
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "shop").maybeSingle();
  if (error) throw new Error(`Could not load shop settings: ${error.message}`);
  return data?.value || demoShop;
}

export async function getCategories() {
  const supabase = await createClient();
  if (!supabase) return demoCategories;
  const { data, error } = await supabase.from("categories").select("id,name,slug,description,image_url,sort_order").eq("is_active", true).order("sort_order");
  if (error) throw new Error(`Could not load categories: ${error.message}`);
  return data;
}

export async function getBrands() {
  const supabase = await createClient();
  if (!supabase) return demoBrands.map((name) => ({ name, slug: name.toLowerCase().replaceAll(" ", "-") }));
  const { data, error } = await supabase.from("brands").select("id,name,slug,logo_url").order("name");
  if (error) throw new Error(`Could not load brands: ${error.message}`);
  return data;
}

export async function getProducts(filters = {}) {
  const supabase = await createClient();
  if (!supabase) {
    let items = [...demoProducts];
    if (filters.category) items = items.filter((product) => product.category === filters.category);
    if (filters.search) items = items.filter((product) => product.name.toLowerCase().includes(filters.search.toLowerCase()));
    return { items: items.map(mapProduct), total: items.length };
  }
  let query = supabase.from("products").select("*, categories!inner(name,slug), brands(name,slug), product_images(url,alt,sort_order)", { count: "exact" }).eq("is_active", true);
  if (filters.category) query = query.eq("categories.slug", filters.category);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  if (filters.brands?.length) query = query.in("brand_id", filters.brands);
  if (filters.condition) query = query.eq("condition", filters.condition);
  if (filters.min) query = query.gte("price", filters.min);
  if (filters.max) query = query.lte("price", filters.max);
  if (filters.inStock) query = query.gt("stock_qty", 0);
  if (filters.ram) query = query.contains("specs", { ram: filters.ram });
  if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });
  const page = Math.max(1, Number(filters.page || 1));
  const pageSize = Math.min(200, Math.max(1, Number(filters.pageSize || 12)));
  const { data, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return { items: (data || []).map(mapProduct), total: count || 0 };
}

export async function getNewArrivals(limit = 8) {
  const supabase = await createClient();
  if (!supabase) return demoProducts.filter((product) => product.isNew).slice(0, limit);
  const { data, error } = await supabase.from("products").select("*,categories(name,slug),brands(name,slug)").eq("is_active", true).eq("is_new_arrival", true).order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(`Could not load new arrivals: ${error.message}`);
  return (data || []).map(mapProduct);
}

export async function getFeatured(limit = 8) {
  const supabase = await createClient();
  if (!supabase) return demoProducts.filter((product) => product.featured).slice(0, limit);
  const { data, error } = await supabase.from("products").select("*,categories(name,slug),brands(name,slug)").eq("is_active", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(`Could not load featured products: ${error.message}`);
  return (data || []).map(mapProduct);
}

export async function getProductBySlug(slug) {
  const supabase = await createClient();
  if (!supabase) return demoProducts.find((product) => product.slug === slug) || null;
  const { data, error } = await supabase.from("products").select("*,categories(name,slug),brands(name,slug),product_images(url,alt,sort_order)").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (error) throw new Error(`Could not load product: ${error.message}`);
  return data ? mapProduct({ ...data, image: data.product_images?.[0]?.url }) : null;
}

export async function getRelatedProducts(categoryId, excludeId, limit = 4) {
  const supabase = await createClient();
  if (!supabase) return demoProducts.filter((product) => product.category === categoryId && product.id !== excludeId).slice(0, limit);
  const { data, error } = await supabase.from("products").select("*,categories(name,slug),brands(name,slug)").eq("category_id", categoryId).eq("is_active", true).neq("id", excludeId).limit(limit);
  if (error) throw new Error(`Could not load related products: ${error.message}`);
  return (data || []).map(mapProduct);
}
