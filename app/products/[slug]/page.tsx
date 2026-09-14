import { AppImage } from "@/components/ui/app-image";
import { CheckCircle2, Leaf, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { ImageCard } from "@/components/image-card";
import { ProductOrderForm } from "@/components/product-order-form";
import { products } from "@/data/site";
import { getProductBySlug, getProductStaticParams } from "@/lib/travel-data";
import { formatCurrency, siteUrl } from "@/lib/utils";

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
    <main className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }} />
      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.82fr]">
        <figure className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-card">
            <AppImage src={product.image} alt={product.name} fill priority className="object-cover transition duration-700 hover:scale-105" />
          </div>
          <figcaption className="grid gap-4 sm:grid-cols-2">
            {product.gallery.map((image) => (
              <span key={image} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm">
                <AppImage src={image} alt={`Ảnh chi tiết sản phẩm ${product.name}`} fill className="object-cover" />
              </span>
            ))}
          </figcaption>
        </figure>
        <article className="lg:sticky lg:top-28 lg:h-fit">
          <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">{product.category}</p>
            <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">{product.name}</h1>
            <p className="mt-5 text-3xl font-extrabold text-forest">{formatCurrency(product.price)}</p>
            <p className="mt-6 text-lg leading-8 text-ink/65">{product.description}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                [Leaf, "Bản địa"],
                [ShieldCheck, "Chọn lọc"],
                [Truck, "Liên hệ giao hàng"]
              ].map(([Icon, label]) => (
                <p key={label as string} className="flex items-center gap-2 rounded-2xl bg-beige px-4 py-3 text-sm font-bold text-forest">
                  <Icon className="size-4" aria-hidden="true" />
                  {label as string}
                </p>
              ))}
            </div>
            <a href="#dat-hang" className="focus-ring mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-4 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink">
              Đặt hàng ngay
              <PackageCheck className="size-5" aria-hidden="true" />
            </a>
          </section>
        </article>
      </section>

      <section className="section-shell grid gap-8 pb-16 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
          <h2 className="text-2xl font-bold text-ink">Thông tin sản phẩm</h2>
          <ul className="mt-5 grid gap-3">
            {product.specs.map((spec) => (
              <li key={spec} className="flex items-center gap-3 rounded-xl bg-beige px-4 py-3 text-sm font-semibold text-ink/75">
                <CheckCircle2 className="size-5 text-forest" aria-hidden="true" />
                {spec}
              </li>
            ))}
          </ul>
          <aside className="mt-7 rounded-2xl bg-forest p-5 text-white">
            <h2 className="text-xl font-bold">Mua hàng hỗ trợ cộng đồng</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Mỗi đơn hàng giúp tăng đầu ra cho sản phẩm địa phương và tạo thêm thu nhập cho nghệ nhân, hộ gia đình tại A Lưới.
            </p>
          </aside>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Đặt hàng</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">Gửi yêu cầu mua {product.name}</h2>
          <p className="mt-3 text-sm leading-7 text-ink/65">
            Đây là form demo cho đồ án. Sau khi gửi, hệ thống hiển thị thông báo xác nhận và đội ngũ Chạm A Lưới sẽ liên hệ lại.
          </p>
          <ProductOrderForm productName={product.name} />
        </section>
      </section>

      <section className="section-shell pb-24">
        <h2 className="text-3xl font-bold text-ink">Sản phẩm liên quan</h2>
        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {related.map((item) => <ImageCard key={item.slug} href={`/products/${item.slug}#dat-hang`} image={item.image} alt={item.name} title={item.name} subtitle={item.description} meta={item.category} price={item.price} cta="Đặt hàng" />)}
        </div>
      </section>
    </main>
  );
}
