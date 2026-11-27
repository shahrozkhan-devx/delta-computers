"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function adminClient() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured. Add the public URL and anonymous key to .env.local.");
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Your session has expired. Please sign in again.");
  const { data: admin, error } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error) throw new Error(`Could not verify admin access: ${error.message}`);
  if (!admin) throw new Error("This account is not authorized to manage the shop.");
  return supabase;
}

function requiredText(value, label, max = 180) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || text.length > max) throw new Error(`${label} is required and must be under ${max} characters.`);
  return text;
}

function validatePrice(value, label, allowEmpty = false) {
  if (allowEmpty && (value === "" || value == null)) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${label} must be a non-negative number.`);
  return number;
}

export async function loginAdmin(formData) {
  const email = requiredText(formData.get("email"), "Email", 254).toLowerCase();
  const password = requiredText(formData.get("password"), "Password", 200);
  const supabase = await createClient();
  if (!supabase) return { error: "Admin login needs Supabase configuration. Add the project URL and anonymous key to .env.local." };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Sign-in failed. Check your email and password." };
  const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (adminError || !admin) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) return { error: `This account is not authorized, and its session could not be cleared: ${signOutError.message}` };
    return { error: adminError ? `Could not verify admin access: ${adminError.message}` : "This account is not authorized to manage the shop." };
  }
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Sign-out failed: ${error.message}`);
  }
  redirect("/admin/login");
}

export async function saveProduct(input) {
  const supabase = await adminClient();
  const name = requiredText(input?.name, "Product name", 180);
  const slug = slugify(input?.slug || name);
  if (!slug) throw new Error("Enter a valid product slug.");
  const categoryId = requiredText(input?.category_id, "Category", 80);
  const price = validatePrice(input?.price, "Price");
  const discountPrice = validatePrice(input?.discount_price, "Discount price", true);
  if (discountPrice != null && discountPrice > price) throw new Error("Discount price cannot exceed the regular price.");
  const stockQty = Number(input?.stock_qty);
  if (!Number.isInteger(stockQty) || stockQty < 0) throw new Error("Stock quantity must be a non-negative whole number.");
  const condition = ["new", "used", "refurbished"].includes(input?.condition) ? input.condition : "new";
  let specs = {};
  try {
    specs = typeof input.specs === "string" ? JSON.parse(input.specs || "{}") : input.specs || {};
  } catch {
    throw new Error("Specifications must be valid JSON.");
  }
  if (!specs || Array.isArray(specs) || typeof specs !== "object") throw new Error("Specifications must be a JSON object.");
  const entries = Object.entries(specs);
  if (entries.length > 30) throw new Error("A product can have up to 30 specifications.");
  specs = Object.fromEntries(entries.map(([key, value]) => {
    const safeKey = requiredText(key, "Specification name", 60);
    const safeValue = String(value).trim();
    if (!safeValue || safeValue.length > 300) throw new Error("Specification values are required and must be under 300 characters.");
    return [safeKey, safeValue];
  }));
  const payload = {
    name,
    slug,
    category_id: categoryId,
    brand_id: input.brand_id || null,
    condition,
    price,
    discount_price: discountPrice,
    stock_qty: stockQty,
    stock_status: input.stock_status || (stockQty > 0 ? "in_stock" : "out_of_stock"),
    short_desc: String(input.short_desc || "").slice(0, 500),
    description: String(input.description || "").slice(0, 5000),
    specs,
    warranty: String(input.warranty || "").slice(0, 120),
    thumbnail_url: input.thumbnail_url || null,
    is_featured: Boolean(input.is_featured),
    is_new_arrival: Boolean(input.is_new_arrival),
    is_active: Boolean(input.is_active),
  };
  let query = supabase.from("products").upsert(input.id ? { ...payload, id: input.id } : payload).select("id").single();
  const { data, error } = await query;
  if (error) throw new Error(`Could not save product: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/product/${slug}`);
  return { id: data.id };
}

export async function saveProductImages(productId, urls) {
  const supabase = await adminClient();
  if (!Array.isArray(urls) || urls.length > 12 || urls.some((url) => typeof url !== "string" || !url.startsWith("https://"))) {
    throw new Error("Product image list is invalid.");
  }
  const { error: deleteError } = await supabase.from("product_images").delete().eq("product_id", productId);
  if (deleteError) throw new Error(`Could not update product images: ${deleteError.message}`);
  if (urls.length) {
    const { error } = await supabase.from("product_images").insert(urls.map((url, index) => ({ product_id: productId, url, sort_order: index, alt: "Product image" })));
    if (error) throw new Error(`Could not save product images: ${error.message}`);
    const { error: thumbnailError } = await supabase.from("products").update({ thumbnail_url: urls[0] }).eq("id", productId);
    if (thumbnailError) throw new Error(`Images uploaded but the thumbnail could not be updated: ${thumbnailError.message}`);
  } else {
    const { error } = await supabase.from("products").update({ thumbnail_url: null }).eq("id", productId);
    if (error) throw new Error(`Images were removed but the product thumbnail could not be cleared: ${error.message}`);
  }
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function deleteProduct(id) {
  const supabase = await adminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(`Could not delete product: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function toggleProductFlag(id, field, value) {
  const supabase = await adminClient();
  if (!["is_active", "is_featured"].includes(field) || typeof value !== "boolean") {
    throw new Error("Product flag update is invalid.");
  }
  const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
  if (error) throw new Error(`Could not update product: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function saveCategory(input) {
  const supabase = await adminClient();
  const name = requiredText(input?.name, "Category name", 100);
  const slug = slugify(input?.slug || name);
  const sortOrder = Number(input?.sort_order || 0);
  if (!Number.isInteger(sortOrder)) throw new Error("Sort order must be a whole number.");
  const payload = { name, slug, description: String(input.description || "").slice(0, 500), image_url: input.image_url || null, sort_order: sortOrder, is_active: Boolean(input.is_active) };
  const { error } = await supabase.from("categories").upsert(input.id ? { ...payload, id: input.id } : payload);
  if (error) throw new Error(`Could not save category: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id) {
  const supabase = await adminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(`Could not delete category: ${error.message}`);
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}

export async function saveBrand(input) {
  const supabase = await adminClient();
  const name = requiredText(input?.name, "Brand name", 100);
  const slug = slugify(input?.slug || name);
  const payload = { name, slug, logo_url: input.logo_url || null };
  const { error } = await supabase.from("brands").upsert(input.id ? { ...payload, id: input.id } : payload);
  if (error) throw new Error(`Could not save brand: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/brands");
}

export async function deleteBrand(id) {
  const supabase = await adminClient();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw new Error(`Could not delete brand: ${error.message}`);
  revalidatePath("/admin/brands");
}

export async function updateInquiry(id, status) {
  const supabase = await adminClient();
  if (!["new", "contacted", "closed"].includes(status)) throw new Error("Inquiry status is invalid.");
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(`Could not update inquiry: ${error.message}`);
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id) {
  const supabase = await adminClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw new Error(`Could not delete inquiry: ${error.message}`);
  revalidatePath("/admin/inquiries");
}

export async function saveShopSettings(input) {
  const supabase = await adminClient();
  const value = {
    name: requiredText(input?.name, "Shop name", 120),
    tagline: requiredText(input?.tagline, "Tagline", 180),
    address: requiredText(input?.address, "Address", 300),
    whatsapp: requiredText(input?.whatsapp, "WhatsApp number", 20).replace(/\D/g, ""),
    contacts: Array.isArray(input?.contacts) ? input.contacts.slice(0, 10).map((contact) => ({
      name: requiredText(contact.name, "Contact name", 100),
      phone: requiredText(contact.phone, "Phone number", 30),
    })) : [],
  };
  if (value.whatsapp.length < 10 || value.whatsapp.length > 15) throw new Error("WhatsApp must be an international phone number.");
  const { error } = await supabase.from("site_settings").upsert({ key: "shop", value });
  if (error) throw new Error(`Could not save shop settings: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}
