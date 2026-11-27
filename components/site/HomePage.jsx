"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, BadgeCheck, Cpu, Headphones, Laptop, MapPin, Monitor, Router, ShieldCheck, WalletCards } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/lib/i18n";
import { useCatalog } from "./CatalogProvider";
import { formatPrice } from "@/lib/utils";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";

const categoryIcons = { laptop: Laptop, monitor: Monitor, headphones: Headphones, cpu: Cpu, router: Router };
const featureIcons = [BadgeCheck, ShieldCheck, WalletCards, Headphones];

export default function HomePage() {
  const { t } = useLanguage();
  const { products, categories, shop, isDemo } = useCatalog();
  const reduceMotion = useReducedMotion();
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const featureKeys = [["genuine", "genuineBody"], ["warranty", "warrantyBody"], ["fairPrices", "fairBody"], ["expert", "expertBody"]];
  const brandNames = ["HP", "DELL", "LENOVO", "ASUS", "ACER", "TP-LINK", "KINGSTON"];
  const business = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: shop.name,
    description: shop.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    telephone: shop.contacts.map((contact) => contact.phone),
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
  return (
    <>
      <section className="noise relative isolate flex min-h-[760px] items-center overflow-hidden pt-28 sm:min-h-[810px]">
        <div className="site-grid absolute inset-0 -z-10" />
        <div className="blueprint-orb absolute -right-52 top-10 -z-10 h-[680px] w-[760px]" />
        <div className="blueprint-orb absolute -left-64 top-60 -z-10 h-[440px] w-[560px] opacity-60" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-2">
          <div className="relative z-10 max-w-2xl">
            <Reveal><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/[.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan sm:text-xs"><span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_#22d3ff]" />{t("heroEyebrow")}</div></Reveal>
            <Reveal delay={0.08}><h1 className="font-display text-[clamp(3.2rem,7vw,6.6rem)] font-semibold leading-[.99] tracking-[-.075em] text-white">{t("heroTitle").split(" ").slice(0, 2).join(" ")} <span className="text-gradient">{t("heroTitle").split(" ").slice(2).join(" ")}</span></h1></Reveal>
            <Reveal delay={0.16}><p className="mt-7 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{t("heroBody")}</p></Reveal>
            <Reveal delay={0.24}><div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-electric to-[#248cff] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_36px_rgba(30,107,255,.25)] transition hover:shadow-[0_12px_44px_rgba(34,211,255,.33)]">{t("explore")}<ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link>
              <a href="https://wa.me/923012783495?text=Assalam-o-alaikum%2C%20I%20would%20like%20help%20choosing%20a%20computer." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-5 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-emerald-200"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">↗</span>{t("whatsapp")}</a>
            </div></Reveal>
            <Reveal delay={0.32}><div className="mt-11 flex items-center gap-3 text-xs text-slate-400"><span className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-[#122441] text-cyan"><MapPin size={14} /></span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-[#102433] text-cyan"><ShieldCheck size={14} /></span></span><span>{t("delivery")}<br /><span className="text-slate-500">{shop.address}</span></span></div></Reveal>
          </div>
          <div className="relative mx-auto flex w-full max-w-[620px] items-center justify-center lg:min-h-[570px]">
            <div className="absolute h-[440px] w-[440px] rounded-full border border-cyan/[.1] sm:h-[530px] sm:w-[530px]" />
            <div className="absolute h-[350px] w-[350px] rounded-full border border-blue-400/[.13] sm:h-[430px] sm:w-[430px]" />
            <motion.div className="hero-art relative z-10 h-[310px] w-[370px] overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#11284a] via-[#0d1729] to-[#07101c] shadow-[0_34px_110px_rgba(0,0,0,.62)] sm:h-[390px] sm:w-[480px]" initial={reduceMotion ? false : { opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : .8, ease: "easeOut" }}>
              <Image src={products[0].image} alt="Laptop from the Delta Computers collection" fill priority sizes="(max-width: 640px) 90vw, 46vw" className="object-cover opacity-85 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#07111e]/70 via-transparent to-cyan/10" />
              <div className="absolute inset-x-7 bottom-6 rounded-2xl border border-white/10 bg-[#07101dcc] p-4 backdrop-blur-xl sm:inset-x-8 sm:bottom-8 sm:p-5">
                <div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-cyan">{t("arrivals")}</p><p className="mt-1 font-display text-lg font-semibold">HP ProBook 450 G10</p></div><div className="grid h-10 w-10 place-items-center rounded-full border border-cyan/30 text-cyan"><Laptop size={18} /></div></div>
                <div className="mt-3 flex items-center justify-between border-t border-white/[.08] pt-3"><span className="text-xs text-slate-400">Core i5 · 16GB · 512GB SSD</span><span className="text-sm font-bold">{formatPrice(179000)}</span></div>
              </div>
            </motion.div>
            <div className="absolute -left-1 top-[21%] grid h-12 w-12 place-items-center rounded-xl border border-cyan/20 bg-[#081a28]/80 text-cyan shadow-glow sm:left-2"><Cpu size={21} /></div>
            <div className="absolute -right-1 top-[15%] grid h-10 w-10 place-items-center rounded-lg border border-blue-400/20 bg-[#0b1528]/90 text-blue-300 sm:right-0"><span className="h-3 w-3 rounded-sm bg-gradient-to-br from-cyan to-blue-600" /></div>
            <div className="absolute -right-2 bottom-[24%] rounded-2xl border border-white/10 bg-[#0a1322]/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:right-2"><p className="text-[9px] uppercase tracking-[.2em] text-slate-500">{t("stock")}</p><p className="mt-1 text-xs font-semibold text-emerald-300"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />{t("ready")}</p></div>
            <div className="absolute bottom-8 left-[8%] text-cyan/60"><ArrowDownRight size={28} /></div>
          </div>
        </div>
        <a href="#categories" aria-label="Scroll to categories" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-slate-500 transition hover:text-cyan md:block"><ArrowDownRight size={20} className="rotate-45" /></a>
      </section>

      <section id="categories" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><SectionTitle eyebrow={t("categories")} title={t("categories")} description={t("categoryIntro")} action={<Link href="/shop" className="inline-flex items-center gap-2 text-sm text-cyan hover:text-white">{t("viewAll")}<ArrowRight size={15} /></Link>} /></Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.icon] || Cpu;
            return <Reveal key={category.slug} delay={index * .06}><Link href={`/category/${category.slug}`} className="group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[.08] bg-[#0a1220] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan/30 hover:bg-[#0e1a2c]">
              <div className="absolute -right-7 -top-10 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-cyan/20" />
              <div className="relative flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.04] text-cyan transition group-hover:border-cyan/30"><Icon size={20} /></span><ArrowRight size={16} className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan" /></div>
              <div className="relative"><p className="font-display text-base font-semibold">{t(category.slug)}</p><p className="mt-1 text-xs text-slate-500">{products.filter((p) => p.category === category.slug).length} curated picks</p></div>
            </Link></Reveal>;
          })}
        </div>
      </section>

      <section className="border-y border-white/[.05] bg-[#080e19] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal><SectionTitle eyebrow={t("arrivals")} title={t("arrivals")} action={<Link href="/shop?sort=newest" className="inline-flex items-center gap-2 text-sm text-cyan">{t("viewAll")}<ArrowRight size={15} /></Link>} /></Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{newArrivals.map((product) => <Reveal key={product.id}><ProductCard product={product} /></Reveal>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><SectionTitle eyebrow={t("featured")} title={t("featured")} description={t("featuredBody")} /></Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{featured.map((product) => <Reveal key={product.id}><ProductCard product={product} /></Reveal>)}</div>
      </section>

      <section className="border-y border-white/[.05] bg-[#080e19] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="mb-9 text-center text-xs font-bold uppercase tracking-[.24em] text-slate-500">{t("brands")}</p><div className="relative overflow-hidden"><div className="marquee-track flex w-max items-center gap-16">{[...brandNames, ...brandNames].map((brand, i) => <span key={`${brand}-${i}`} className="font-display text-lg font-bold tracking-[.16em] text-slate-600 transition hover:text-slate-200">{brand}</span>)}</div></div></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><SectionTitle eyebrow={t("why")} title={t("whyTitle")} /></Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featureKeys.map(([title, body], i) => { const Icon = featureIcons[i]; return <Reveal key={title} delay={i * .06}><div className="h-full rounded-2xl border border-white/[.07] bg-gradient-to-br from-[#0d1728] to-[#080e19] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/20 bg-cyan/[.06] text-cyan"><Icon size={19} /></span><h3 className="mt-5 font-display text-lg font-semibold">{t(title)}</h3><p className="mt-2 text-sm leading-6 text-muted">{t(body)}</p></div></Reveal>; })}</div>
      </section>

      <section className="border-y border-white/[.05] bg-[#080e19] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal><div className="mb-8 text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan">{t("delivery")}</p><h2 className="mt-3 font-display text-2xl font-semibold">{t("whyTitle")}</h2></div></Reveal>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <CountUp value={categories.length} label={t("categoryCount")} />
            <CountUp value={products.length} label={isDemo ? t("sampleCount") : t("productCount")} />
            <CountUp value={shop.contacts.length} label={t("contactsCount")} />
            <CountUp value={1} label={t("locationCount")} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] border border-blue-300/15 bg-[#0b1525] px-6 py-10 sm:px-12 sm:py-14">
          <div className="blueprint-orb absolute -right-28 -top-48 h-[440px] w-[480px]" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div><p className="text-xs font-bold uppercase tracking-[.23em] text-cyan">{t("visit")}</p><h2 className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{t("address")}</h2><p className="mt-4 flex items-center gap-2 text-sm text-slate-400"><MapPin size={16} className="text-cyan" />{shop.address}</p></div>
            <div className="flex flex-wrap gap-3"><a href="tel:03012783495" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-cyan">{t("callNow")}</a><Link href="/contact" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan hover:text-cyan">{t("contact")}</Link></div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }} />
    </>
  );
}
