"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useCatalog } from "./CatalogProvider";

export default function AboutPage() {
  const { t } = useLanguage();
  const { shop } = useCatalog();
  const trust = [t("trust1"), t("trust2"), t("trust3")];
  const icons = [BadgeCheck, Headphones, ShieldCheck];
  return (
    <div className="relative min-h-screen pt-32">
      <div className="site-grid absolute inset-x-0 top-0 h-[500px]" /><div className="blueprint-orb absolute -right-32 top-20 h-[480px] w-[550px]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.23em] text-cyan">{t("about")}</p><h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-[-.06em] sm:text-7xl">{t("aboutTitle")}</h1><p className="mt-7 max-w-2xl text-base leading-8 text-slate-300">{t("aboutBody")}</p><Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3.5 text-sm font-bold">{t("explore")}<ArrowRight size={16} /></Link></div>
        <div className="mt-20 grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <div className="rounded-[26px] border border-white/[.08] bg-gradient-to-br from-[#0d1b2c] to-[#080e19] p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">{t("about")}</p><h2 className="mt-4 font-display text-3xl font-semibold">{t("aboutStory")}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">{t("aboutStoryBody")}</p><p className="mt-5 flex items-center gap-2 text-sm text-slate-400"><MapPin size={16} className="text-cyan" />{shop.address}</p></div>
          <div className="rounded-[26px] border border-white/[.08] bg-[#0b1321] p-7 sm:p-10"><h2 className="font-display text-2xl font-semibold">{t("trustTitle")}</h2><div className="mt-6 space-y-3">{trust.map((item, index) => {const Icon = icons[index]; return <div key={item} className="flex items-center gap-3 rounded-xl border border-white/[.06] bg-white/[.02] p-4 text-sm text-slate-200"><span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan/[.07] text-cyan"><Icon size={17} /></span>{item}</div>;})}</div></div>
        </div>
      </div>
    </div>
  );
}
