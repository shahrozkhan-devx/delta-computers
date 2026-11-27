import { products, categories } from "@/lib/demo-data";

export default function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const routes = [
    "",
    "/shop",
    "/about",
    "/contact",
    ...categories.map((category) => `/category/${category.slug}`),
    ...products.map((product) => `/product/${product.slug}`),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
