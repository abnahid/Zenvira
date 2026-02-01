import ProductDetailsClient from "@/components/shop/ProductDetailsClient";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetailsClient slug={params.slug} />;
}
