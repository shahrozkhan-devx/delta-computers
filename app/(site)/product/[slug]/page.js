import ProductPage from "@/components/site/ProductPage";
import { products } from "@/lib/demo-data";
import { getProductBySlug } from "@/lib/queries";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.short_desc || `${product.name} from Delta Computers in Karachi.`,
    openGraph: { images: product.image ? [product.image] : [] },
  };
}

export default async function Product({ params }) {
  const { slug } = await params;
  return <ProductPage slug={slug} />;
}
