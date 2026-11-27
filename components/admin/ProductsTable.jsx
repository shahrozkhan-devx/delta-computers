"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { deleteProduct, toggleProductFlag } from "@/lib/admin-actions";
import { formatPrice } from "@/lib/utils";
import DeleteButton from "./DeleteButton";

export default function ProductsTable({ products }) {
  const router = useRouter();
  const [rows, setRows] = useState(products);
  const [search, setSearch] = useState("");
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState("");
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? rows.filter((product) => `${product.name} ${product.categories?.name || ""} ${product.brands?.name || ""}`.toLowerCase().includes(query)) : rows;
  }, [rows, search]);

  function toggle(product, field) {
    const value = !product[field];
    setError("");
    startTransition(async () => {
      try {
        await toggleProductFlag(product.id, field, value);
        setRows((current) => current.map((item) => item.id === product.id ? { ...item, [field]: value } : item));
        router.refresh();
      } catch (toggleError) {
        setError(toggleError.message || "Could not update product.");
      }
    });
  }

  return <>
    <label className="mt-7 flex max-w-md items-center gap-2 rounded-xl border border-white/10 bg-[#0a111d] px-3 py-2.5 text-slate-400"><Search size={15} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, brands, categories…" className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500" /></label>
    {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
    <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[.07] bg-[#0a111d]"><table className="w-full min-w-[940px] text-left text-sm"><thead className="border-b border-white/[.07] text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Product</th><th className="px-4 py-4">Category · Brand</th><th className="px-4 py-4">Price</th><th className="px-4 py-4">Stock</th><th className="px-4 py-4">Visible</th><th className="px-4 py-4">Featured</th><th className="px-4 py-4">Actions</th></tr></thead><tbody className="divide-y divide-white/[.05]">{filtered.map((product) => <tr key={product.id} className="hover:bg-white/[.02]"><td className="px-5 py-3"><div className="flex items-center gap-3">{product.thumbnail_url ? <Image src={product.thumbnail_url} alt="" width={44} height={44} className="h-11 w-11 rounded-lg object-cover" /> : <div className="h-11 w-11 rounded-lg bg-white/[.05]" />}<span className="font-medium">{product.name}</span></div></td><td className="px-4 py-3 text-xs text-slate-400">{product.categories?.name || "—"} · {product.brands?.name || "Generic"}</td><td className="px-4 py-3">{formatPrice(product.discount_price || product.price)}</td><td className="px-4 py-3 text-xs text-slate-400">{product.stock_qty} · {product.stock_status.replaceAll("_", " ")}</td><td className="px-4 py-3"><input type="checkbox" checked={product.is_active} disabled={busy} onChange={() => toggle(product, "is_active")} aria-label={`Set ${product.name} visibility`} className="h-4 w-4 accent-cyan" /></td><td className="px-4 py-3"><input type="checkbox" checked={product.is_featured} disabled={busy} onChange={() => toggle(product, "is_featured")} aria-label={`Feature ${product.name}`} className="h-4 w-4 accent-cyan" /></td><td className="px-4 py-3"><div className="flex items-center gap-2"><Link href={`/admin/products/${product.id}/edit`} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-200 hover:border-cyan/30">Edit</Link><DeleteButton action={deleteProduct} id={product.id} label="Delete" confirmText={`Delete ${product.name}?`} /></div></td></tr>)}</tbody></table>
      {!filtered.length && <p className="p-12 text-center text-sm text-slate-400">{rows.length ? "No products match your search." : "No products yet. Add one to get started."}</p>}</div>
  </>;
}
