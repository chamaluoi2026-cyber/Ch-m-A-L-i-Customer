import type { Metadata } from "next";
import { products } from "@/data/site";
import { ProductsClientView } from "@/components/products/products-client-view";

export const metadata: Metadata = {
  title: "Sản phẩm A Lưới | Highland Specialties & Crafts",
  description:
    "Khám phá Zèng truyền thống, mật ong rừng, trà núi thảo mộc, thủ công tre, sản phẩm OCOP và quà lưu niệm từ A Lưới."
};

export default function ProductsPage() {
  return <ProductsClientView products={products} />;
}
