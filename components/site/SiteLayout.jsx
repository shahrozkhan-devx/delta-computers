"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MapPin, Menu, MessageCircle, Phone, Search, X } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import LanguageSwitch from "./LanguageSwitch";
import { useCatalog } from "./CatalogProvider";

const navItems = [
  ["home", "/"], ["shop", "/shop"], ["laptops", "/category/laptops"],
  ["desktops", "/category/desktop-pcs"], ["accessories", "/category/accessories"], ["contact", "/contact"],
];

export function SiteFrame({ children }) {
  const { t } = useLanguage();
  const { shop } = useCatalog();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="min-h-screen overflow-hidden bg-ink">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/[.06] py-2" : "border-b border-transparent py-4"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Delta Computers home" className="flex items-center gap-3">
            <Image src="/logo.png" width={48} height={48} alt="Delta Computers" className="h-10 w-10 rounded-full object-contain sm:h-12 sm:w-12" priority />
            <span className="leading-none"><span className="block font-display text-sm font-bold tracking-[.14em] text-white sm:text-base">DELTA</span><span className="mt-1 block text-[9px] font-semibold tracking-[.24em] text-cyan">COMPUTERS</span></span>
          </Link>
          <nav className="hidden items-center gap-5 xl:flex">
            {navItems.map(([key, href]) => (
              <Link key={href} href={href} className={`text-xs font-medium transition hover:text-cyan ${pathname === href ? "text-cyan" : "text-slate-300"}`}>{t(key)}</Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitch />
            <Link href="/shop" aria-label={t("search")} title={t("search")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:border-cyan/40 hover:text-cyan"><Search size={16} /></Link>
            <a href="tel:03012783495" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-[#2879ff] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(30,107,255,.2)] transition hover:shadow-[0_8px_32px_rgba(34,211,255,.28)]"><Phone size={14} />{t("callNow")}</a>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitch compact />
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t("close") : t("menu")} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {menuOpen && <nav className="glass absolute inset-x-3 top-[calc(100%+8px)] rounded-2xl p-3 md:hidden">{navItems.map(([key, href]) => <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-white/5">{t(key)}</Link>)}<a href="tel:03012783495" className="mt-2 flex items-center gap-2 rounded-xl bg-electric px-4 py-3 text-sm font-semibold"><Phone size={15} />{t("callNow")}</a></nav>}
      </header>
      <main className="min-h-[65vh]">{children}</main>
      <footer className="relative border-t border-white/[.07] bg-[#070c15]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_.7fr_1fr] md:py-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3"><Image src="/logo.png" width={54} height={54} alt="" className="h-12 w-12 rounded-full object-contain" /><span><b className="block font-display tracking-[.14em]">DELTA</b><small className="tracking-[.24em] text-cyan">COMPUTERS</small></span></Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted">{t("delivery")} {t("aboutBody")}</p>
          </div>
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-cyan">{t("shop")}</p><div className="grid gap-3 text-sm text-slate-300"><Link href="/shop" className="hover:text-cyan">{t("viewAll")} {t("shop")}</Link><Link href="/about" className="hover:text-cyan">{t("about")}</Link><Link href="/contact" className="hover:text-cyan">{t("contact")}</Link></div></div>
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-cyan">{t("contact")}</p><p className="flex gap-2 text-sm leading-6 text-slate-300"><MapPin size={16} className="mt-1 shrink-0 text-cyan" />{shop.address}</p><div className="mt-4 grid gap-2">{shop.contacts.map((person) => <a key={person.phone} href={`tel:${person.phone.replaceAll("-", "")}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-cyan"><Phone size={14} className="text-cyan" />{person.phone} · {person.name}</a>)}<a href={whatsappLink(shop.whatsapp, "Assalam-o-alaikum, I have a question.")} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-emerald-300"><MessageCircle size={15} />WhatsApp<ArrowUpRight size={13} /></a></div></div>
        </div>
        <div className="border-t border-white/[.06]"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© {new Date().getFullYear()} Delta Computers. All rights reserved.</span><span>Technology Providers · Karachi, Pakistan</span></div></div>
      </footer>
      <a href={whatsappLink(shop.whatsapp, "Assalam-o-alaikum, I would like to know more about your products.")} target="_blank" rel="noreferrer" aria-label="Chat with Delta Computers on WhatsApp" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1cbf6b] text-white shadow-[0_8px_34px_rgba(28,191,107,.35)] transition hover:scale-105">
        <span className="pulse-ring absolute inset-0 rounded-full border border-emerald-300" /><MessageCircle size={23} fill="white" className="relative" />
      </a>
    </div>
  );
}

export default function SiteLayout({ children }) {
  return <SiteFrame>{children}</SiteFrame>;
}
