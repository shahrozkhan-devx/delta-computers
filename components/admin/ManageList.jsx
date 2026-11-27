"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { deleteBrand, deleteCategory, saveBrand, saveCategory } from "@/lib/admin-actions";
import DeleteButton from "./DeleteButton";

const fieldClass = "w-full rounded-lg border border-white/10 bg-[#080e18] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/50";

function ItemForm({ kind, item, onSaved }) {
  const action = kind === "category" ? saveCategory : saveBrand;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = Object.fromEntries(formData.entries());
    input.is_active = formData.get("is_active") === "on";
    setError("");
    startTransition(async () => {
      try {
        await action(input);
        onSaved();
      } catch (saveError) {
        setError(saveError.message || "Could not save this item.");
      }
    });
  }
  return <form onSubmit={submit} className="grid gap-3 rounded-xl border border-white/[.06] bg-[#080e18] p-4 sm:grid-cols-2">
    {item?.id && <input type="hidden" name="id" value={item.id} />}
    <label className="text-[11px] font-semibold text-slate-400">{kind === "category" ? "Category name" : "Brand name"}<input name="name" required maxLength={100} defaultValue={item?.name || ""} className={`${fieldClass} mt-1.5`} /></label>
    <label className="text-[11px] font-semibold text-slate-400">Slug<input name="slug" defaultValue={item?.slug || ""} placeholder="Auto-generated if blank" className={`${fieldClass} mt-1.5`} /></label>
    {kind === "category" ? <>
      <label className="text-[11px] font-semibold text-slate-400">Sort order<input name="sort_order" type="number" step="1" defaultValue={item?.sort_order ?? 0} className={`${fieldClass} mt-1.5`} /></label>
      <label className="text-[11px] font-semibold text-slate-400">Image URL<input name="image_url" type="url" defaultValue={item?.image_url || ""} className={`${fieldClass} mt-1.5`} /></label>
      <label className="text-[11px] font-semibold text-slate-400 sm:col-span-2">Description<input name="description" maxLength={500} defaultValue={item?.description || ""} className={`${fieldClass} mt-1.5`} /></label>
      <label className="flex items-center gap-2 text-xs text-slate-300"><input name="is_active" type="checkbox" defaultChecked={item?.is_active !== false} className="accent-cyan" />Visible in public catalog</label>
    </> : <label className="text-[11px] font-semibold text-slate-400">Logo URL<input name="logo_url" type="url" defaultValue={item?.logo_url || ""} className={`${fieldClass} mt-1.5`} /></label>}
    {error && <p role="alert" className="text-xs text-rose-300 sm:col-span-2">{error}</p>}
    <div className="flex items-center gap-3 sm:col-span-2"><button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-electric px-4 py-2.5 text-xs font-bold disabled:opacity-50"><Save size={14} />{pending ? "Saving…" : item?.id ? "Save changes" : `Add ${kind}`}</button>{item?.id && <span className="text-[10px] text-slate-500">ID: {item.id.slice(0, 8)}</span>}</div>
  </form>;
}

export default function ManageList({ kind, items }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const noun = kind === "category" ? "categories" : "brands";
  const remove = kind === "category" ? deleteCategory : deleteBrand;
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Catalog setup</p><h1 className="mt-2 font-display text-3xl font-semibold capitalize">{noun}</h1><p className="mt-2 text-sm text-slate-400">Manage the options shown across the storefront.</p></div><button onClick={() => setAdding((current) => !current)} className="inline-flex items-center gap-2 rounded-xl bg-electric px-4 py-2.5 text-sm font-bold"><Plus size={16} />Add {kind}</button></div>
    {adding && <div className="mt-6"><ItemForm kind={kind} onSaved={() => { setAdding(false); router.refresh(); }} /></div>}
    <div className="mt-6 space-y-3">{items.map((item) => <div key={item.id} className="rounded-2xl border border-white/[.07] bg-[#0a111d] p-4 sm:p-5"><div className="mb-3 flex items-center justify-between gap-4"><div><p className="font-display font-semibold">{item.name}</p><p className="mt-1 text-[11px] text-slate-500">/{item.slug}</p></div><DeleteButton action={remove} id={item.id} confirmText={`Delete ${item.name}? ${kind === "category" ? "Products using it may prevent deletion." : ""}`} /></div><ItemForm key={`${item.id}-${item.updated_at || ""}`} kind={kind} item={item} onSaved={() => router.refresh()} /></div>)}</div>
    {!items.length && <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-slate-500">No {noun} have been added.</div>}
  </div>;
}
