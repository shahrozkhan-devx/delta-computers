import { NextResponse } from "next/server";
import { getCategories, getProducts, getBrands, getShopSettings } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const [result, categories, brands, shop] = await Promise.all([
    getProducts({
      category: params.get("category") || "",
      search: params.get("search") || "",
      condition: params.get("condition") || "",
      min: params.get("min") || "",
      max: params.get("max") || "",
      inStock: params.get("stock") === "1",
      sort: params.get("sort") || "",
      page: params.get("page") || 1,
      pageSize: params.get("pageSize") || 200,
    }),
    getCategories(),
    getBrands(),
    getShopSettings(),
  ]);
  return NextResponse.json({ ...result, categories, brands, shop, isDemo: !isSupabaseConfigured() || result.total === 0 });
}
