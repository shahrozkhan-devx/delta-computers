import CategoryPage from "@/components/site/CategoryPage";
import { categories } from "@/lib/demo-data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  return { title: category ? `${category.name} | Delta Computers` : "Category" };
}

export default async function Category({ params }) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}
