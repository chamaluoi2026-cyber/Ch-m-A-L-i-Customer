"use client";

import { useState } from "react";
import { ImageCard } from "@/components/image-card";
import { useLanguage } from "@/components/i18n-provider";
import {
  productTranslations,
  productPageTranslations
} from "@/lib/i18n/catalog-translations";

interface ProductsClientViewProps {
  products: any[];
}

export function ProductsClientView({ products }: ProductsClientViewProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const tPage = isEn ? productPageTranslations.en : productPageTranslations.vi;

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = isEn
    ? ["All", "Traditional Brocade", "Wild Forest Honey", "Mountain Herbal Tea", "Bamboo Crafts", "OCOP Certified", "Souvenirs"]
    : ["Tất cả", "Zèng truyền thống", "Mật ong rừng", "Trà núi", "Thủ công tre", "OCOP", "Quà lưu niệm"];

  return (
    <main className="pt-24">
      <section className="section-shell py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
            {tPage.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">
            {tPage.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">
            {tPage.description}
          </p>
        </header>

        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Danh mục sản phẩm">
          {categories.map((category, idx) => {
            const isSelected =
              category === selectedCategory ||
              (idx === 0 && (selectedCategory === "All" || selectedCategory === "Tất cả"));

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs md:text-sm font-bold transition shadow-sm ${
                  isSelected
                    ? "bg-forest text-white shadow-[0_4px_14px_rgba(15,92,74,0.3)]"
                    : "bg-white text-ink/75 hover:bg-beige hover:text-forest"
                }`}
              >
                {category}
              </button>
            );
          })}
        </nav>

        <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const prodTrans = productTranslations[product.slug];
            const title = isEn && prodTrans ? prodTrans.name : product.name;
            const subtitle = isEn && prodTrans ? prodTrans.description : product.description;
            const meta = isEn && prodTrans ? prodTrans.category : product.category;

            return (
              <ImageCard
                key={product.slug}
                href={`/products/${product.slug}#dat-hang`}
                image={product.image}
                alt={title}
                title={title}
                subtitle={subtitle}
                meta={meta}
                price={product.price}
                cta={tPage.orderNow}
              />
            );
          })}
        </section>
      </section>
    </main>
  );
}
