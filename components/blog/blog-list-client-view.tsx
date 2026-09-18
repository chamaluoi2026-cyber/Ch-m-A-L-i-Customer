"use client";

import { useState } from "react";
import { ImageCard } from "@/components/image-card";
import { useLanguage } from "@/components/i18n-provider";
import {
  blogTranslations,
  blogPageTranslations
} from "@/lib/i18n/catalog-translations";

interface BlogListClientViewProps {
  publishedPosts: any[];
}

export function BlogListClientView({ publishedPosts }: BlogListClientViewProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const tPage = isEn ? blogPageTranslations.en : blogPageTranslations.vi;

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = isEn
    ? ["All", "Travel Guide", "Culture", "Cuisine", "Experiences", "News"]
    : ["Tất cả", "Cẩm nang", "Văn hóa", "Ẩm thực", "Trải nghiệm", "Tin tức"];

  return (
    <main className="pt-24">
      <section className="section-shell py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
            {tPage.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-5xl">
            {tPage.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">
            {tPage.description}
          </p>
        </header>

        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Danh mục cẩm nang">
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

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {publishedPosts.map((post) => {
            const bTrans = blogTranslations[post.slug];
            const title = isEn ? (post.enTitle || bTrans?.title || post.title) : post.title;
            const excerpt = isEn ? (post.enExcerpt || bTrans?.excerpt || post.excerpt) : post.excerpt;
            const category = isEn ? (post.enCategory || bTrans?.category || post.category) : post.category;
            const readingTime = isEn ? (bTrans?.readingTime || post.readingTime.replace("phút đọc", "min read")) : post.readingTime;

            return (
              <ImageCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                image={post.image}
                alt={title}
                title={title}
                subtitle={excerpt}
                meta={`${category} · ${readingTime}`}
                cta={tPage.readGuide}
              />
            );
          })}
        </section>
      </section>
    </main>
  );
}
