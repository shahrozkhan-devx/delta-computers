"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { brands as demoBrands, categories as demoCategories, products as demoProducts, shop as demoShop } from "@/lib/demo-data";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState({
    products: demoProducts,
    categories: demoCategories,
    brands: demoBrands,
    shop: demoShop,
    isDemo: true,
  });

  useEffect(() => {
    let active = true;
    fetch("/api/products?pageSize=200", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setCatalog({
          products: data.items?.length ? data.items : demoProducts,
          categories: data.categories?.length ? data.categories : demoCategories,
          brands: data.brands?.length ? data.brands : demoBrands,
          shop: data.shop || demoShop,
          isDemo: Boolean(data.isDemo),
        });
      })
      .catch((error) => {
        console.error("Could not refresh the product catalog; showing sample listings.", error);
      });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => catalog, [catalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("useCatalog must be used within CatalogProvider");
  return catalog;
}
