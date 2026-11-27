"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import { products as demoProducts, categories as demoCategories, brands as demoBrands } from "@/lib/demo-data";
import { useLanguage } from "@/lib/i18n";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";
import { useCatalog } from "./CatalogProvider";

export default function ShopPage({ initialCategory = "" }) {
  const { t } = useLanguage();
  const catalog = useCatalog();
  const products = catalog.products || demoProducts;
  const categories = catalog.categories || demoCategories;
  const brands = catalog.brands || demoBrands;
  const [filters, setFilters] = useState({ category: initialCategory, brands: [], condition: "", min: "", max: "", sort: "newest", stock: false, ram: "", cpu: "", storage: "", search: "", page: 1 });
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters((current) => ({
      ...current,
      category: initialCategory || params.get("category") || "",
      brands: params.get("brand") ? params.get("brand").split(",").filter(Boolean) : [],
      condition: params.get("condition") || "",
      min: params.get("min") || "",
      max: params.get("max") || "",
      sort: params.get("sort") || "newest",
      stock: params.get("stock") === "1",
      ram: params.get("ram") || "",
      cpu: params.get("cpu") || "",
      storage: params.get("storage") || "",
      search: params.get("search") || "",
      page: Number.isInteger(Number(params.get("page"))) && Number(params.get("page")) > 0 ? Number(params.get("page")) : 1,
    }));
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const activePrice = p.discount || p.price;
      return (!filters.category || p.category === filters.category)
        && (!filters.brands.length || filters.brands.includes(p.brand))
        && (!filters.condition || p.condition.toLowerCase() === filters.condition)
        && (!filters.min || activePrice >= Number(filters.min))
        && (!filters.max || activePrice <= Number(filters.max))
        && (!filters.stock || p.stock > 0)
        && (!filters.ram || p.specs.RAM === filters.ram || p.specs.ram === filters.ram)
        && (!filters.cpu || (p.specs.CPU || p.specs.cpu || "").toLowerCase().includes(filters.cpu.toLowerCase()))
        && (!filters.storage || (p.specs.Storage || p.specs.storage || "").toLowerCase().includes(filters.storage.toLowerCase()))
        && (!filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase()));
    });
    if (filters.sort === "price_asc") result = [...result].sort((a, b) => (a.discount || a.price) - (b.discount || b.price));
    if (filters.sort === "price_desc") result = [...result].sort((a, b) => (b.discount || b.price) - (a.discount || a.price));
    if (filters.sort === "newest") result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    return result;
  }, [filters, products]);

  function update(key, value) {
    setFilters((current) => {
      const next = { ...current, [key]: value, ...(key === "page" ? {} : { page: 1 }) };
      const params = new URLSearchParams();
      Object.entries(next).forEach(([name, val]) => {
        if (name === "brands" && val.length) params.set("brand", val.join(","));
        else if (val && val !== "newest" && val !== false && name !== "brands") params.set(name === "stock" ? "stock" : name, name === "stock" ? "1" : val);
      });
      const query = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
      return next;
    });
  }

  function clear() {
    const next = { category: initialCategory, brands: [], condition: "", min: "", max: "", sort: "newest", stock: false, ram: "", cpu: "", storage: "", search: "", page: 1 };
    setFilters(next);
    window.history.replaceState(null, "", initialCategory ? `/category/${initialCategory}` : "/shop");
  }

  const filterPanel = (
    <div className="space-y-6">
      {!initialCategory && <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">{t("category")}</span><select value={filters.category} onChange={(e) => update("category", e.target.value)} className="form-control"><option value="">{t("all")}</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{t(c.slug)}</option>)}</select></label>}
      <div><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">{t("brand")}</span><div className="max-h-36 space-y-2 overflow-y-auto">{brands.map((brand) => {const name = typeof brand === "string" ? brand : brand.name; return <label key={name} className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={filters.brands.includes(name)} onChange={(event) => update("brands", event.target.checked ? [...filters.brands, name] : filters.brands.filter((item) => item !== name))} className="h-3.5 w-3.5 accent-cyan" />{name}</label>;})}</div></div>
      <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">{t("condition")}</span><select value={filters.condition} onChange={(e) => update("condition", e.target.value)} className="form-control"><option value="">{t("all")}</option><option value="new">{t("condition-new")}</option><option value="used">{t("condition-used")}</option><option value="refurbished">{t("condition-refurbished")}</option></select></label>
      <div><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">{t("minPrice")} / {t("maxPrice")}</span><div className="grid grid-cols-2 gap-2"><input inputMode="numeric" placeholder={t("minPrice")} value={filters.min} onChange={(e) => update("min", e.target.value)} className="form-control min-w-0" /><input inputMode="numeric" placeholder={t("maxPrice")} value={filters.max} onChange={(e) => update("max", e.target.value)} className="form-control min-w-0" /></div></div>
      <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={filters.stock} onChange={(e) => update("stock", e.target.checked)} className="h-4 w-4 accent-cyan" />{t("inStock")}</label>
      <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">RAM</span><select value={filters.ram} onChange={(e) => update("ram", e.target.value)} className="form-control"><option value="">{t("all")}</option>{["8GB", "16GB"].map((ram) => <option key={ram}>{ram}</option>)}</select></label>
      <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">CPU</span><select value={filters.cpu} onChange={(e) => update("cpu", e.target.value)} className="form-control"><option value="">{t("all")}</option>{[...new Set(products.map((product) => product.specs?.CPU || product.specs?.cpu).filter(Boolean))].map((cpu) => <option key={cpu} value={cpu}>{cpu}</option>)}</select></label>
      <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Storage</span><select value={filters.storage} onChange={(e) => update("storage", e.target.value)} className="form-control"><option value="">{t("all")}</option>{[...new Set(products.map((product) => product.specs?.Storage || product.specs?.storage).filter(Boolean))].map((storage) => <option key={storage} value={storage}>{storage}</option>)}</select></label>
      <button onClick={clear} className="text-xs font-semibold text-cyan hover:text-white">{t("clear")}</button>
    </div>
  );

  return (
    <div className="relative min-h-screen pt-28">
      <div className="site-grid absolute inset-x-0 top-0 h-[430px] opacity-70" />
      <div className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <SectionTitle eyebrow={initialCategory ? categories.find((c) => c.slug === initialCategory)?.name : t("shop")} title={t("shopTitle")} description={t("shopBody")} />
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/[.07] bg-[#0a1220] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <label className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-slate-400 sm:max-w-sm sm:flex-1"><Search size={15} /><input type="search" value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder={t("search")} className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-500" /></label>
          <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-400"><strong className="text-white">{filtered.length}</strong> {t("results")} {catalog.isDemo && <span className="ml-1 rounded-full border border-cyan/20 bg-cyan/[.06] px-2 py-1 text-[9px] uppercase tracking-wider text-cyan">{t("demo")}</span>}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setMobileFilters(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-200 lg:hidden"><SlidersHorizontal size={14} />{t("filters")}</button>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300"><ArrowDownUp size={13} /><span className="hidden sm:inline">{t("sort")}</span><select value={filters.sort} onChange={(e) => update("sort", e.target.value)} className="max-w-[130px] bg-transparent text-xs text-white outline-none"><option value="newest">{t("newest")}</option><option value="price_asc">{t("priceLow")}</option><option value="price_desc">{t("priceHigh")}</option></select></label>
          </div>
          </div>
        </div>
        {(filters.brands.length > 0 || filters.condition || filters.min || filters.max || filters.stock || filters.ram || filters.cpu || filters.storage || filters.search) && <div className="mb-5 flex flex-wrap items-center gap-2">{[...filters.brands, filters.condition && t(`condition-${filters.condition}`), filters.min && `${t("minPrice")}: ${filters.min}`, filters.max && `${t("maxPrice")}: ${filters.max}`, filters.stock && t("inStock"), filters.ram, filters.cpu, filters.storage, filters.search && `“${filters.search}”`].filter(Boolean).map((chip, index) => <span key={`${chip}-${index}`} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-[10px] text-slate-300">{chip}</span>)}<button onClick={clear} className="px-2 py-1 text-[10px] font-semibold text-cyan">{t("clear")}</button></div>}
        <div className="grid gap-6 lg:grid-cols-[235px_1fr]">
          <aside className="hidden h-fit rounded-2xl border border-white/[.07] bg-[#0a1220] p-5 lg:block"><h2 className="mb-5 flex items-center gap-2 font-display font-semibold"><SlidersHorizontal size={16} className="text-cyan" />{t("filters")}</h2>{filterPanel}</aside>
          <div>{filtered.length ? <><div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">{filtered.slice((filters.page - 1) * 12, filters.page * 12).map((product) => <ProductCard key={product.id} product={product} />)}</div>{filtered.length > 12 && <div className="mt-8 flex justify-center gap-2">{Array.from({ length: Math.ceil(filtered.length / 12) }, (_, index) => <button key={index} onClick={() => update("page", index + 1)} aria-current={filters.page === index + 1 ? "page" : undefined} className={`grid h-10 w-10 place-items-center rounded-xl border text-sm ${filters.page === index + 1 ? "border-cyan bg-cyan/10 text-cyan" : "border-white/10 text-slate-400"}`}>{index + 1}</button>)}</div>}</> : <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/10 p-8 text-center"><div><p className="font-display text-xl font-semibold">{t("noResults")}</p><button onClick={clear} className="mt-4 text-sm text-cyan">{t("clear")}</button></div></div>}</div>
        </div>
      </div>
      {mobileFilters && <div className="fixed inset-0 z-[60] lg:hidden"><button className="absolute inset-0 bg-black/70" onClick={() => setMobileFilters(false)} aria-label={t("close")} /><div className="absolute inset-y-0 right-0 w-[min(90vw,390px)] overflow-y-auto border-l border-white/10 bg-[#080e19] p-6 shadow-2xl"><div className="mb-7 flex items-center justify-between"><h2 className="font-display text-xl font-semibold">{t("filters")}</h2><button onClick={() => setMobileFilters(false)} aria-label={t("close")}><X size={21} /></button></div>{filterPanel}<button onClick={() => setMobileFilters(false)} className="mt-7 w-full rounded-full bg-electric px-5 py-3 text-sm font-bold">{t("results")} ({filtered.length})</button></div></div>}
      <style jsx>{`.form-control{width:100%;border:1px solid rgba(255,255,255,.1);border-radius:11px;background:#0d1728;padding:10px 12px;color:#f5f8ff;font-size:12px;outline:none}.form-control:focus{border-color:rgba(34,211,255,.55)}.form-control option{background:#0d1728}`}</style>
    </div>
  );
}
