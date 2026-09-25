"use client";

import { AppImage } from "@/components/ui/app-image";
import { CheckCircle2, Leaf, PackageCheck, ShieldCheck, Truck, Play } from "lucide-react";
import { BlogVideoEmbed } from "@/components/blog/blog-video-embed";
import { ImageCard } from "@/components/image-card";
import { ProductOrderForm } from "@/components/product-order-form";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/i18n-provider";
import {
  productTranslations,
  productPageTranslations
} from "@/lib/i18n/catalog-translations";

interface ProductDetailClientViewProps {
  product: any;
  related: any[];
}

export function ProductDetailClientView({
  product,
  related
}: ProductDetailClientViewProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const tPage = isEn ? productPageTranslations.en : productPageTranslations.vi;

  const prodTrans = productTranslations[product.slug];
  const title = isEn ? (product.enName || prodTrans?.name || product.name) : product.name;
  const description = isEn ? (product.enDescription || prodTrans?.description || product.description) : product.description;
  const category = isEn ? (product.enCategory || prodTrans?.category || product.category) : product.category;
  const specs = isEn ? (product.enSpecs || prodTrans?.specs || product.specs) : product.specs;

  return (
    <main className="pt-24">
      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.82fr]">
        <figure className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-card">
            <AppImage
              src={product.image}
              alt={title}
              fill
              priority
              className="object-cover transition duration-700 hover:scale-105"
            />
          </div>
          <figcaption className="grid gap-4 sm:grid-cols-2">
            {product.gallery.map((image: string, idx: number) => (
              <span key={idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm">
                <AppImage
                  src={image}
                  alt={`${title} photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </span>
            ))}
          </figcaption>
          {product.videoUrl && (
            <div className="mt-2 rounded-3xl overflow-hidden shadow-card border border-forest/10 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 text-forest">
                <Play className="size-4 fill-forest" />
                <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider">
                  {isEn ? "Product Video" : "Video giới thiệu sản phẩm"}
                </h3>
              </div>
              <BlogVideoEmbed
                url={product.videoUrl}
                caption={isEn ? `Video about ${title}` : `Video quy trình làm ${product.name}`}
              />
            </div>
          )}
        </figure>
        <article className="lg:sticky lg:top-28 lg:h-fit">
          <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
                {category}
              </span>
              {product.isOcop && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-xs font-bold">
                  ⭐ OCOP {product.ocopStars || 3} sao
                </span>
              )}
              {product.status === "out_of_stock" && (
                <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-xs font-bold">
                  {isEn ? "Out of Stock" : "Tạm hết hàng"}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-5xl">
              {title}
            </h1>
            <div className="mt-5 flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-forest">
                {formatCurrency(product.price)}
              </p>
              {product.unit && (
                <span className="text-sm font-medium text-ink/60">/ {product.unit}</span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base line-through text-ink/40 font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="mt-6 text-base md:text-lg leading-8 text-ink/75 whitespace-pre-line space-y-3">
              {description}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                [Leaf, isEn ? "Indigenous" : "Bản địa"],
                [ShieldCheck, isEn ? "Hand-Selected" : "Chọn lọc"],
                [Truck, isEn ? "Delivery Inquiry" : "Liên hệ giao hàng"]
              ].map(([Icon, label]) => (
                <p
                  key={label as string}
                  className="flex items-center gap-2 rounded-2xl bg-beige px-4 py-3 text-sm font-bold text-forest"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label as string}
                </p>
              ))}
            </div>
            <a
              href="#dat-hang"
              className={`focus-ring mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 ${
                product.status === "out_of_stock"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-forest hover:bg-ink"
              }`}
            >
              {product.status === "out_of_stock"
                ? (isEn ? "Pre-order Inquiries" : "Liên hệ đặt hàng trước")
                : tPage.orderNow}
              <PackageCheck className="size-5" aria-hidden="true" />
            </a>
          </section>
        </article>
      </section>

      <section className="section-shell grid gap-8 pb-16 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
          <h2 className="text-2xl font-bold text-ink mb-4">
            {tPage.productInfoTitle}
          </h2>

          {/* Shopee-style Product Specifications Table */}
          <div className="mb-6 rounded-2xl bg-forest/5 p-4 text-xs divide-y divide-forest/10">
            <div className="py-2 flex items-center justify-between">
              <span className="text-ink/60">{isEn ? "Origin" : "Xuất xứ"}</span>
              <span className="font-bold text-ink">{product.origin || "Huyện A Lưới, Thừa Thiên Huế"}</span>
            </div>
            {product.weight && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-ink/60">{isEn ? "Weight / Volume" : "Khối lượng / Thể tích"}</span>
                <span className="font-bold text-ink">{product.weight}</span>
              </div>
            )}
            {product.expiryDate && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-ink/60">{isEn ? "Shelf Life" : "Hạn sử dụng"}</span>
                <span className="font-bold text-ink">{product.expiryDate}</span>
              </div>
            )}
            {product.storageGuide && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-ink/60">{isEn ? "Storage Guide" : "Hướng dẫn bảo quản"}</span>
                <span className="font-bold text-ink text-right max-w-[220px]">{product.storageGuide}</span>
              </div>
            )}
            {product.businessName && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-ink/60">{isEn ? "Producer / Co-op" : "Cơ sở sản xuất"}</span>
                <span className="font-bold text-ink">{product.businessName}</span>
              </div>
            )}
          </div>

          <h3 className="text-sm font-bold text-ink mb-3 uppercase tracking-wider">
            {isEn ? "Key Highlights" : "Đặc điểm nổi bật"}
          </h3>
          <ul className="grid gap-3">
            {specs.map((spec: string) => (
              <li
                key={spec}
                className="flex items-center gap-3 rounded-xl bg-beige px-4 py-3 text-sm font-semibold text-ink/75"
              >
                <CheckCircle2 className="size-5 text-forest" aria-hidden="true" />
                {spec}
              </li>
            ))}
          </ul>
          <aside className="mt-7 rounded-2xl bg-forest p-5 text-white">
            <h2 className="text-xl font-bold">
              {tPage.communitySupportTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              {tPage.communitySupportDesc}
            </p>
          </aside>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-card md:p-8" id="dat-hang">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
            {isEn ? "Order Request" : "Đặt hàng"}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            {isEn ? `Order ${title}` : `Gửi yêu cầu mua ${product.name}`}
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/65">
            {isEn
              ? "Submit your contact information. Our team will get in touch directly to confirm details and dispatch."
              : "Đây là form đặt hàng trực tiếp. Sau khi gửi, đội ngũ Chạm A Lưới sẽ liên hệ lại qua điện thoại / Zalo để xác nhận."}
          </p>
          <ProductOrderForm productName={title} />
        </section>
      </section>

      <section className="section-shell pb-24">
        <h2 className="text-3xl font-bold text-ink">
          {isEn ? "Related Specialties" : "Sản phẩm liên quan"}
        </h2>
        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {related.map((item) => {
            const rTrans = productTranslations[item.slug];
            const rTitle = isEn ? (item.enName || rTrans?.name || item.name) : item.name;
            const rDesc = isEn ? (item.enDescription || rTrans?.description || item.description) : item.description;
            const rCat = isEn ? (item.enCategory || rTrans?.category || item.category) : item.category;

            return (
              <ImageCard
                key={item.slug}
                href={`/products/${item.slug}#dat-hang`}
                image={item.image}
                alt={rTitle}
                title={rTitle}
                subtitle={rDesc}
                meta={rCat}
                price={item.price}
                cta={tPage.orderNow}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
