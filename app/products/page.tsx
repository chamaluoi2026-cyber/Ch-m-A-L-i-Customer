import type { Metadata } from "next";
import { ImageCard } from "@/components/image-card";
import { products } from "@/data/site";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Khám phá Zèng truyền thống, mật ong rừng, trà núi, thủ công tre, sản phẩm OCOP và quà lưu niệm từ A Lưới."
};

const categories = ["Zèng truyền thống", "Mật ong rừng", "Trà núi", "Thủ công tre", "OCOP", "Quà lưu niệm"];

export default function ProductsPage() {
  return (
    <main className="pt-24">
      <section className="section-shell py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Gian hàng địa phương</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">Sản phẩm</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">Zèng truyền thống, mật ong rừng, trà núi, thủ công tre, OCOP và quà lưu niệm.</p>
        </header>
        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Danh mục sản phẩm">
          {categories.map((category) => <span key={category} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-forest shadow-sm">{category}</span>)}
        </nav>
        <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ImageCard key={product.slug} href={`/products/${product.slug}#dat-hang`} image={product.image} alt={product.name} title={product.name} subtitle={product.description} meta={product.category} price={product.price} cta="Đặt hàng" />
          ))}
        </section>
      </section>
    </main>
  );
}
