"use client";

import { useState } from "react";
import { MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { whatsappLink } from "@/lib/utils";
import { useCatalog } from "./CatalogProvider";

export default function ContactPage() {
  const { t } = useLanguage();
  const { shop } = useCatalog();
  const business = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: shop.name,
    address: { "@type": "PostalAddress", streetAddress: shop.address, addressLocality: "Karachi", addressCountry: "PK" },
    telephone: shop.contacts.map((contact) => contact.phone),
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name"), phone: formData.get("phone"), message: formData.get("message") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your inquiry.");
      setStatus(t("sent"));
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="relative min-h-screen pt-32">
      <div className="blueprint-orb absolute -right-36 top-12 h-[450px] w-[550px]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan">{t("contact")}</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-[-.055em] sm:text-6xl">{t("contactTitle")}</h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-400">{t("contactBody")}</p></div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/[.07] bg-[#0a1220] p-6"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan/[.08] text-cyan"><MapPin size={19} /></span><div><h2 className="font-display font-semibold">{t("address")}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{shop.address}</p><a className="mt-3 inline-block text-xs font-semibold text-cyan" href="https://maps.google.com/?q=Main+Bazar+Golden+Town+Wireless+Gate+Karachi" target="_blank" rel="noreferrer">{t("directions")} ↗</a></div></div></div>
            <div className="rounded-2xl border border-white/[.07] bg-[#0a1220] p-6"><h2 className="font-display font-semibold">{t("callNow")}</h2><div className="mt-4 grid gap-3">{shop.contacts.map((person) => <a key={person.phone} href={`tel:${person.phone.replaceAll("-", "")}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan"><span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-cyan"><Phone size={15} /></span><span>{person.phone}<small className="ml-2 text-xs text-slate-500">{person.name}</small></span></a>)}</div><a href={whatsappLink(shop.whatsapp, "Assalam-o-alaikum, I have a question.")} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300"><MessageCircle size={16} />{t("whatsapp")}</a></div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }} />
          </div>
          <form onSubmit={submit} className="rounded-2xl border border-white/[.08] bg-[#0a1220] p-5 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">{t("sendInquiry")}</h2><p className="mt-2 text-sm text-slate-400">{t("contactBody")}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold text-slate-300">{t("name")}<input name="name" required maxLength={100} className="form-control" /></label><label className="grid gap-2 text-xs font-semibold text-slate-300">{t("phone")}<input name="phone" required type="tel" maxLength={30} className="form-control" /></label><label className="grid gap-2 text-xs font-semibold text-slate-300 sm:col-span-2">{t("message")}<textarea name="message" rows={5} maxLength={2000} required className="form-control resize-y" /></label></div>
            <button disabled={busy} className="mt-5 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-bold disabled:opacity-50"><Send size={15} />{busy ? "Sending…" : t("send")}</button>
            {status && <p role="status" className={`mt-4 text-sm ${status === t("sent") ? "text-emerald-300" : "text-amber-200"}`}>{status}</p>}
            <p className="mt-4 text-xs leading-5 text-slate-500">The inquiry form requires your Supabase project configuration. You can contact us directly through WhatsApp meanwhile.</p>
          </form>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1525]"><iframe title="Delta Computers location map" src="https://maps.google.com/maps?q=Main%20Bazar%20Golden%20Town%20Wireless%20Gate%20Karachi&t=&z=14&ie=UTF8&iwloc=&output=embed" className="h-[300px] w-full border-0 grayscale invert-[.88] hue-rotate-180 sm:h-[360px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      </div>
      <style jsx>{`.form-control{border:1px solid rgba(255,255,255,.1);border-radius:12px;background:#080e19;padding:12px;color:#f5f8ff;font-size:14px;outline:none}.form-control:focus{border-color:rgba(34,211,255,.55)}`}</style>
    </div>
  );
}
