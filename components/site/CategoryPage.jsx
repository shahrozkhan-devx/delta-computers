"use client";

import { useCatalog } from "./CatalogProvider";
import ShopPage from "./ShopPage";

export default function CategoryPage({ slug }) {
  const { categories } = useCatalog();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return <div className="mx-auto max-w-4xl px-5 pb-24 pt-40 text-center">Category not found.</div>;
  return <ShopPage initialCategory={slug} />;
}
