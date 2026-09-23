import type { Metadata } from "next";
import { getPublicProductsAsync } from "@/lib/products";
import { ProductsClientView } from "@/components/products/products-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Đặc Sản & OCOP A Lưới | Highland Specialties & Crafts",
  description:
    "Khám phá Zèng truyền thống, mật ong rừng, trà núi thảo mộc, thủ công tre, sản phẩm OCOP và quà lưu niệm từ A Lưới."
};

export default async function ProductsPage() {
  const products = await getPublicProductsAsync();
  return <ProductsClientView products={products} />;
}
