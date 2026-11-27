"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { saveShopSettings } from "@/lib/admin-actions";

export default function SettingsForm({ settings }) {
  const router = useRouter();
  const [contacts, setContacts] = useState(settings.contacts || []);
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = { name: form.get("name"), tagline: form.get("tagline"), address: form.get("address"), whatsapp: form.get("whatsapp"), contacts };
    startTransition(async () => {
      setError("");
      try {
        await saveShopSettings(value);
        router.refresh();
      } catch (saveError) {
        setError(saveError.message || "Could not save shop settings.");
      }
    });
  }
  return <form onSubmit={submit} className="mt-7 max-w-3xl space-y-6">
    <section className="rounded-2xl border border-white/[.07] bg-[#0a111d] p-5 sm:p-7"><h2 className="font-display text-lg font-semibold">Shop profile</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
      {[["name", "Shop name"], ["tagline", "Tagline"], ["whatsapp", "WhatsApp (international format)"]].map(([key, label]) => <label key={key} className="text-xs font-semibold text-slate-300">{label}<input name={key} required defaultValue={settings[key] || ""} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080e18] px-3 py-3 text-sm text-white outline-none focus:border-cyan/50" /></label>)}
      <label className="text-xs font-semibold text-slate-300 sm:col-span-2">Address<textarea name="address" required rows={3} defaultValue={settings.address || ""} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080e18] px-3 py-3 text-sm text-white outline-none focus:border-cyan/50" /></label>
    </div></section>
    <section className="rounded-2xl border border-white/[.07] bg-[#0a111d] p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="font-display text-lg font-semibold">Phone contacts</h2><p className="mt-1 text-xs text-slate-500">Shown in the footer and contact page.</p></div><button type="button" onClick={() => setContacts((current) => [...current, { name: "", phone: "" }])} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-cyan"><Plus size={14} />Add</button></div>
      <div className="mt-4 space-y-3">{contacts.map((contact, index) => <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><input aria-label="Contact name" value={contact.name} onChange={(event) => setContacts((current) => current.map((item, i) => i === index ? { ...item, name: event.target.value } : item))} placeholder="Contact name" className="rounded-lg border border-white/10 bg-[#080e18] px-3 py-2.5 text-sm outline-none focus:border-cyan/50" /><input aria-label="Phone number" value={contact.phone} onChange={(event) => setContacts((current) => current.map((item, i) => i === index ? { ...item, phone: event.target.value } : item))} placeholder="Phone number" className="rounded-lg border border-white/10 bg-[#080e18] px-3 py-2.5 text-sm outline-none focus:border-cyan/50" /><button type="button" onClick={() => setContacts((current) => current.filter((_, i) => i !== index))} aria-label="Remove contact" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-rose-300"><Trash2 size={15} /></button></div>)}</div>
    </section>
    {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/[.06] p-3 text-sm text-rose-200">{error}</p>}
    <button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-bold disabled:opacity-50"><Save size={15} />{busy ? "Saving…" : "Save settings"}</button>
  </form>;
}
