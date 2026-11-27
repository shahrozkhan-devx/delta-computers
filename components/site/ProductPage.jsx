"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronRight, MessageCircle, Phone, ShieldCheck, Send } from "lucide-react";
import { formatPrice, whatsappLink } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import ProductCard from "./ProductCard";
import { useCatalog } from "./CatalogProvider";

export default function ProductPage({ slug }) {
  const { t } = useLanguage();
  const { products, shop } = useCatalog();
  const product = products.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [formStatus, setFormStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (!product) return <div className="mx-auto max-w-4xl px-5 pb-24 pt-40 text-center"><p className="font-display text-3xl font-semibold">This product is not available</p><Link href="/shop" className="mt-5 inline-block text-cyan">{t("viewAll")} {t("shop")}</Link></div>;
  const price = product.discount || product.price;
  const related = products.filter((item) => item.category === product.category && item.slug !== slug).slice(0, 3);
  const inquiry = `Assalam-o-alaikum, I am interested in ${product.name} (${formatPrice(price)}).`;
  async function submitInquiry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setFormStatus("");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name"), phone: formData.get("phone"), message: formData.get("message"), productId: product.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your inquiry.");
      setFormStatus(t("inquiryReceived"));
      form.reset();
    } catch (error) {
      setFormStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="relative min-h-screen pt-28">
      <div className="site-grid absolute inset-x-0 top-0 h-[360px]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <Link href="/shop" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan"><ArrowLeft size={15} />{t("viewAll")} {t("shop")}</Link>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div>
            <div className="relative aspect-[1.1] overflow-hidden rounded-[26px] border border-white/10 bg-[#0e1728]">
              <Image src={selectedImage || product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 95vw, 55vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs backdrop-blur-md">{product.condition}</span>
            </div>
            <div className="mt-3 flex gap-3">{(product.images?.length ? product.images : [product.image]).map((src, index) => <button key={`${src}-${index}`} onClick={() => setSelectedImage(src)} className={`relative h-20 w-24 overflow-hidden rounded-xl border ${selectedImage === src ? "border-cyan/50" : "border-white/10"}`}><Image src={src} alt={`${product.name} view ${index + 1}`} fill sizes="100px" className="object-cover" /></button>)}</div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan">{product.brand} · {product.condition}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">{product.name}</h1>
            <div className="mt-6 flex flex-wrap items-baseline gap-3"><span className="font-display text-3xl font-bold">{formatPrice(price)}</span>{product.discount && <span className="text-lg text-slate-500 line-through">{formatPrice(product.price)}</span>}<span className={`text-xs ${product.stock ? "text-emerald-300" : "text-rose-300"}`}>● {product.stock ? t("stock") : t("outStock")}</span></div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">{product.name}. {t("productDescription")}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a href={whatsappLink(shop.whatsapp, inquiry)} onClick={(event) => {
                event.preventDefault();
                window.open(whatsappLink(shop.whatsapp, `${inquiry} ${window.location.href}`), "_blank", "noopener,noreferrer");
              }} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3.5 text-sm font-bold text-[#032112] transition hover:bg-emerald-400"><MessageCircle size={17} />{t("orderWhatsapp")}</a>
              <a href="tel:03012783495" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-semibold transition hover:border-cyan/40 hover:text-cyan"><Phone size={16} />{t("callNow")}</a>
            </div>
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-cyan/10 bg-cyan/[.035] p-4 text-xs leading-5 text-slate-300"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-cyan" /><span>{t("warrantyLabel")}: ask our team about warranty coverage and current availability.</span></div>
            {(product.short_desc || product.description) && <section className="mt-8 border-t border-white/[.08] pt-6"><h2 className="font-display text-lg font-semibold">{t("details")}</h2>{product.short_desc && <p className="mt-3 text-sm leading-6 text-slate-300">{product.short_desc}</p>}{product.description && <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-400">{product.description}</p>}</section>}
            <div className="mt-10 border-t border-white/[.08] pt-7"><h2 className="font-display text-lg font-semibold">{t("specifications")}</h2><dl className="mt-4 grid grid-cols-2 gap-x-6">{Object.entries(product.specs).map(([key, value]) => <div key={key} className="flex justify-between gap-3 border-b border-white/[.06] py-3 text-xs"><dt className="text-slate-500">{key}</dt><dd className="text-right text-slate-200">{value}</dd></div>)}</dl></div>
          </div>
        </div>
        <section className="mt-14 rounded-2xl border border-white/[.08] bg-[#0a1220] p-5 sm:p-7">
          <h2 className="font-display text-xl font-semibold">{t("sendInquiry")}</h2>
          <p className="mt-2 text-sm text-slate-400">{t("contactBody")}</p>
          <form onSubmit={submitInquiry} className="mt-5 grid gap-3 sm:grid-cols-2">
            <input name="name" required maxLength={100} placeholder={t("name")} className="detail-input" />
            <input name="phone" required type="tel" maxLength={30} placeholder={t("phone")} className="detail-input" />
            <textarea name="message" required maxLength={2000} rows={3} defaultValue={inquiry} className="detail-input sm:col-span-2" />
            <button disabled={submitting} className="inline-flex w-fit items-center gap-2 rounded-full bg-electric px-5 py-3 text-sm font-bold disabled:opacity-50"><Send size={14} />{submitting ? "Sending…" : t("send")}</button>
            {formStatus && <p role="status" className="self-center text-xs text-amber-200">{formStatus}</p>}
          </form>
        </section>
        {related.length > 0 && <section className="mt-24 border-t border-white/[.07] pt-14"><div className="mb-7 flex items-end justify-between"><h2 className="font-display text-2xl font-semibold">{t("related")}</h2><Link href={`/category/${product.category}`} className="inline-flex items-center gap-1 text-sm text-cyan">{t("viewAll")}<ChevronRight size={14} /></Link></div><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
      </div>
      <style jsx>{`.detail-input{min-width:0;border:1px solid rgba(255,255,255,.1);border-radius:11px;background:#080e19;padding:12px;color:#f5f8ff;font-size:13px;outline:none}.detail-input:focus{border-color:rgba(34,211,255,.55)}`}</style>
    </div>
  );
}
