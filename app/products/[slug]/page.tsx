import { notFound } from "next/navigation";
import { products } from "@/data/site";
import { getProductBySlug, getProductStaticParams } from "@/lib/travel-data";
import { siteUrl } from "@/lib/utils";
import { ProductDetailClientView } from "@/components/products/product-detail-client-view";

export function generateStaticParams() {
  return getProductStaticParams();
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    offers: { "@type": "Offer", price: product.price, priceCurrency: "VND", availability: "https://schema.org/InStock" }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sản phẩm", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 2, name: product.name, item: `${siteUrl}/products/${product.slug}` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }} />
      <ProductDetailClientView product={product} related={related} />
    </>
  );
}
