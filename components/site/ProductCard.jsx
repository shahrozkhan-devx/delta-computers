"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { formatPrice, whatsappLink, discountPercent } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { useCatalog } from "./CatalogProvider";

export default function ProductCard({ product }) {
  const { t } = useLanguage();
  const { shop } = useCatalog();
  const price = product.discount || product.discount_price || product.price;
  const oldPrice = product.discount ? product.price : product.discount_price;
  const discount = discountPercent(product.price, price);
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[.075] bg-[#0b1220] transition duration-300 hover:-translate-y-1.5 hover:border-cyan/30 hover:shadow-glow">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[1.19] overflow-hidden bg-[#101b30]">
        <Image src={product.image || product.thumbnail_url || "/product-placeholder.svg"} alt={product.name} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060b14]/70 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#07101dcc] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-md">{t(`condition-${(product.condition || "new").toLowerCase()}`)}</span>
        {discount > 0 && <span className="absolute right-3 top-3 rounded-full bg-cyan px-2.5 py-1 text-[10px] font-bold text-ink">−{discount}%</span>}
        <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] text-slate-200">{product.brand || product.brands?.name}</span>
        <span className={`absolute bottom-3 right-3 rounded-full border border-white/10 px-2.5 py-1 text-[10px] ${product.stock > 0 ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>{product.stock > 0 ? t("stock") : t("outStock")}</span>
      </Link>
      <div className="p-4 sm:p-5">
        <Link href={`/product/${product.slug}`} className="group/title flex min-h-12 items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-6 text-white group-hover/title:text-cyan">{product.name}</h3>
          <ArrowUpRight size={17} className="mt-1 shrink-0 text-slate-500 transition group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-cyan" />
        </Link>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-lg font-bold text-white">{formatPrice(price)}</p>
            {oldPrice > price && <p className="mt-0.5 text-xs text-slate-500 line-through">{formatPrice(oldPrice)}</p>}
          </div>
          <a
            href={whatsappLink(shop.whatsapp, `Assalam-o-alaikum, I am interested in ${product.name}.`)}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            aria-label={`${t("askPrice")}: ${product.name}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition hover:bg-emerald-400 hover:text-ink"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
