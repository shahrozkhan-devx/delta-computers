"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { saveProduct } from "@/lib/admin-actions";
import ImageUploader from "./ImageUploader";

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#080e18] px-3.5 py-3 text-sm text-white outline-none transition focus:border-cyan/50";

export default function ProductForm({ product = {}, categories, brands }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productId, setProductId] = useState(product.id || "");
  const [thumbnail, setThumbnail] = useState(product.thumbnail_url || product.image || "");
  const [categoryId, setCategoryId] = useState(product.category_id || categories[0]?.id || "");
  const [specRows, setSpecRows] = useState(() => {
    const entries = Object.entries(product.specs || {}).map(([key, value]) => ({ key, value: String(value) }));
    return entries.length ? entries : [{ key: "", value: "" }];
  });
  function applySpecs(template) {
    setSpecRows(Object.entries(template).map(([key, value]) => ({ key, value })));
  }
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      id: productId || undefined,
      name: data.get("name"),
      slug: data.get("slug"),
      category_id: data.get("category_id"),
      brand_id: data.get("brand_id") || null,
      condition: data.get("condition"),
      price: data.get("price"),
      discount_price: data.get("discount_price"),
      stock_qty: data.get("stock_qty"),
      stock_status: data.get("stock_status"),
      short_desc: data.get("short_desc"),
      description: data.get("description"),
      warranty: data.get("warranty"),
      thumbnail_url: thumbnail || data.get("thumbnail_url"),
      specs: Object.fromEntries(specRows.filter((row) => row.key.trim() && row.value.trim()).map((row) => [row.key.trim(), row.value.trim()])),
      is_featured: data.get("is_featured") === "on",
      is_new_arrival: data.get("is_new_arrival") === "on",
      is_active: data.get("is_active") === "on",
    };
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const result = await saveProduct(payload);
        setProductId(result.id);
        setSuccess("Product saved successfully.");
        router.replace(`/admin/products/${result.id}/edit`);
        router.refresh();
      } catch (saveError) {
        setError(saveError.message || "Could not save product.");
      }
    });
  }
  return (
    <form onSubmit={submit}>
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan"><ArrowLeft size={15} />Back to products</Link>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Catalog</p><h1 className="mt-2 font-display text-3xl font-semibold">{product.id ? "Edit product" : "Add a product"}</h1></div><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-bold disabled:opacity-50"><Save size={16} />{pending ? "Saving…" : "Save product"}</button></div>
      {error && <p role="alert" className="mb-5 rounded-xl border border-rose-300/20 bg-rose-400/[.06] p-4 text-sm text-rose-200">{error}</p>}
      {success && <p role="status" className="mb-5 rounded-xl border border-emerald-300/20 bg-emerald-400/[.06] p-4 text-sm text-emerald-200">{success}</p>}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="admin-card grid gap-4 sm:grid-cols-2">
            <label className="admin-label sm:col-span-2">Product name<input name="name" required maxLength={180} defaultValue={product.name || ""} className={inputClass} /></label>
            <label className="admin-label">Slug<input name="slug" defaultValue={product.slug || ""} placeholder="Auto-generated from name" className={inputClass} /></label>
            <label className="admin-label">Category<select name="category_id" required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={inputClass}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="admin-label">Brand<select name="brand_id" defaultValue={product.brand_id || ""} className={inputClass}><option value="">Generic / unbranded</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
            <label className="admin-label">Condition<select name="condition" defaultValue={product.condition || "new"} className={inputClass}><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select></label>
          </section>
          <section className="admin-card grid gap-4 sm:grid-cols-2">
            <label className="admin-label">Price (PKR)<input name="price" type="number" min="0" step="1" required defaultValue={product.price || ""} className={inputClass} /></label>
            <label className="admin-label">Discount price (optional)<input name="discount_price" type="number" min="0" step="1" defaultValue={product.discount_price || product.discount || ""} className={inputClass} /></label>
            <label className="admin-label">Stock quantity<input name="stock_qty" type="number" min="0" step="1" required defaultValue={product.stock_qty ?? product.stock ?? 0} className={inputClass} /></label>
            <label className="admin-label">Stock status<select name="stock_status" defaultValue={product.stock_status || "in_stock"} className={inputClass}><option value="in_stock">In stock</option><option value="out_of_stock">Out of stock</option><option value="on_order">Available on order</option></select></label>
            <label className="admin-label sm:col-span-2">Warranty<input name="warranty" maxLength={120} defaultValue={product.warranty || ""} className={inputClass} /></label>
          </section>
          <section className="admin-card space-y-4">
            <label className="admin-label block">Short description<input name="short_desc" maxLength={500} defaultValue={product.short_desc || ""} className={inputClass} /></label>
            <label className="admin-label block">Full description<textarea name="description" rows={5} maxLength={5000} defaultValue={product.description || ""} className={`${inputClass} resize-y`} /></label>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3"><label className="admin-label">Specifications</label><div className="flex flex-wrap gap-2"><button type="button" onClick={() => applySpecs({ cpu: "Core i5 12th Gen", ram: "16GB", storage: "512GB SSD", screen: "15.6 FHD", gpu: "Integrated", os: "Windows 11" })} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-slate-300 hover:border-cyan/40 hover:text-cyan">Laptop template</button><button type="button" onClick={() => applySpecs({ cpu: "Ryzen 5 5600", ram: "16GB", storage: "512GB NVMe", gpu: "RTX 4060", psu: "550W", case: "ATX" })} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-slate-300 hover:border-cyan/40 hover:text-cyan">Desktop template</button></div></div>
              <div className="mt-3 space-y-2">{specRows.map((row, index) => <div key={index} className="grid grid-cols-[.8fr_1.2fr_auto] gap-2"><input aria-label="Specification name" value={row.key} onChange={(event) => setSpecRows((current) => current.map((item, i) => i === index ? { ...item, key: event.target.value } : item))} placeholder="e.g. RAM" className="rounded-lg border border-white/10 bg-[#080e18] px-3 py-2.5 text-xs text-white outline-none focus:border-cyan/50" /><input aria-label="Specification value" value={row.value} onChange={(event) => setSpecRows((current) => current.map((item, i) => i === index ? { ...item, value: event.target.value } : item))} placeholder="e.g. 16GB DDR4" className="rounded-lg border border-white/10 bg-[#080e18] px-3 py-2.5 text-xs text-white outline-none focus:border-cyan/50" /><button type="button" onClick={() => setSpecRows((current) => current.filter((_, i) => i !== index))} aria-label="Remove specification" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:border-rose-300/30 hover:text-rose-300"><Trash2 size={14} /></button></div>)}</div>
              <button type="button" onClick={() => setSpecRows((current) => [...current, { key: "", value: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan"><Plus size={14} />Add specification</button>
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="admin-card"><h2 className="font-display font-semibold">Product images</h2><p className="mt-1 text-xs leading-5 text-slate-500">Save the product first. Upload order sets the listing thumbnail.</p><input type="hidden" name="thumbnail_url" value={thumbnail} /><ImageUploader productId={productId} initialImages={product.images || (product.thumbnail_url ? [product.thumbnail_url] : [])} onPrimaryChange={setThumbnail} /></section>
          <section className="admin-card space-y-4">
            {[["is_active", "Visible in the shop", product.is_active !== false], ["is_featured", "Featured product", Boolean(product.is_featured ?? product.featured)], ["is_new_arrival", "New arrival", Boolean(product.is_new_arrival ?? product.isNew !== false)]].map(([name, label, checked]) => <label key={name} className="flex items-center justify-between gap-3 text-sm text-slate-300">{label}<input type="checkbox" name={name} defaultChecked={checked} className="h-4 w-4 accent-cyan" /></label>)}
          </section>
        </aside>
      </div>
      <style jsx>{`.admin-card{border:1px solid rgba(255,255,255,.07);border-radius:18px;background:#0a111d;padding:20px}.admin-label{color:#cbd5e1;font-size:12px;font-weight:600}`}</style>
    </form>
  );
}
