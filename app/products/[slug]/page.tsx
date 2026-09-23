import { notFound } from "next/navigation";
import { getProductBySlugAsync, getPublicProductsAsync } from "@/lib/products";
import { siteUrl } from "@/lib/utils";
import { ProductDetailClientView } from "@/components/products/product-detail-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlugAsync(slug);

  if (!product || (product.isDeleted && !((await searchParams)?.preview === "true"))) {
    return { title: "Không tìm thấy sản phẩm | Chạm A Lưới" };
  }

  return {
    title: `${product.name} | Đặc sản A Lưới`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Chạm A Lưới`,
      description: product.description,
      images: [{ url: product.image }]
    }
  };
}

export default async function ProductDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
}) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : undefined;
  const isPreview = query?.preview === "true" || !!query?.token;

  const product = await getProductBySlugAsync(slug);
  if (!product || ((product as any).isDeleted && !isPreview)) {
    notFound();
  }

  // Bảo vệ bài ẩn: nếu status === "hidden" mà không phải preview -> 404
  if (product.status === "hidden" && !isPreview) {
    notFound();
  }

  const allPublic = await getPublicProductsAsync();
  const related = allPublic.filter((item) => item.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability:
        product.status === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Đặc sản & Sản phẩm", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 2, name: product.name, item: `${siteUrl}/products/${product.slug}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }}
      />
      <ProductDetailClientView product={product} related={related} />
    </>
  );
}
