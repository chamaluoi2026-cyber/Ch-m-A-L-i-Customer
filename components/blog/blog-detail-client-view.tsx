"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { useLanguage } from "@/components/i18n-provider";
import {
  blogTranslations,
  blogPageTranslations
} from "@/lib/i18n/catalog-translations";
import { Sparkles, Globe, RefreshCw } from "lucide-react";
import type { BlogContentBlock, BlogPostRecord } from "@/lib/server-store";

interface BlogDetailClientViewProps {
  post: BlogPostRecord;
  related: BlogPostRecord[];
  isPreview?: boolean;
}

export function BlogDetailClientView({
  post,
  related,
  isPreview = false
}: BlogDetailClientViewProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const tPage = isEn ? blogPageTranslations.en : blogPageTranslations.vi;

  // Manual override toggle: user can force viewing English or Vietnamese
  const [viewLang, setViewLang] = useState<"vi" | "en">(isEn ? "en" : "vi");

  // Keep viewLang in sync when language switcher in navbar changes
  useEffect(() => {
    setViewLang(isEn ? "en" : "vi");
  }, [isEn]);

  // Pre-compiled translation dictionary
  const bTrans = blogTranslations[post.slug];

  // Dynamic state for auto-translation if post doesn't have pre-compiled translation
  const [dynamicTrans, setDynamicTrans] = useState<{
    title?: string;
    excerpt?: string;
    content?: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Auto-translate on the fly if needed
  useEffect(() => {
    if (viewLang === "en" && !bTrans && !post.enTitle && !dynamicTrans && !isTranslating) {
      setIsTranslating(true);
      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content || (post.blocks?.map((b) => ("content" in b ? b.content : "")).join("\n\n")),
          targetLang: "en"
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.translation) {
            setDynamicTrans(data.translation);
          }
        })
        .catch((err) => console.warn("Auto-translate error:", err))
        .finally(() => setIsTranslating(false));
    }
  }, [viewLang, bTrans, post, dynamicTrans, isTranslating]);

  const activeIsEn = viewLang === "en";

  const displayTitle = activeIsEn
    ? dynamicTrans?.title || post.enTitle || bTrans?.title || post.title
    : post.title;

  const displayExcerpt = activeIsEn
    ? dynamicTrans?.excerpt || post.enExcerpt || bTrans?.excerpt || post.excerpt
    : post.excerpt;

  const displayCategory = activeIsEn
    ? post.enCategory || bTrans?.category || post.category
    : post.category;

  const displayAuthor = activeIsEn
    ? bTrans?.author || post.author
    : post.author;

  const displayReadingTime = activeIsEn
    ? bTrans?.readingTime || post.readingTime.replace("phút đọc", "min read")
    : post.readingTime;

  const displayContent = activeIsEn
    ? dynamicTrans?.content || post.enContent || bTrans?.content || post.content
    : post.content;

  return (
    <main className={`pt-24 ${isPreview ? "pt-36" : ""}`}>
      {/* Draft Preview Bar */}
      {isPreview && (
        <aside className="fixed top-0 inset-x-0 z-50 bg-[#0F382E] text-white shadow-2xl border-b border-emerald-500/20 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              {activeIsEn ? "Draft Preview Mode" : "Chế Độ Xem Trước Bản Nháp"}
            </span>
          </div>
        </aside>
      )}

      <article className="section-shell py-16">
        {/* AI Translation Switcher Banner */}
        <div className="mx-auto max-w-3xl mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-3.5 text-xs">
          <div className="flex items-center gap-2 text-forest font-bold">
            <Sparkles className="size-4 text-emerald-600 animate-pulse" />
            <span>
              {activeIsEn
                ? "✨ AI-Powered Auto Translation (Gemini 2.5 Flash)"
                : "✨ Bản gốc Tiếng Việt · Hỗ trợ dịch AI song ngữ"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setViewLang(activeIsEn ? "vi" : "en")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3.5 py-1.5 font-bold text-white shadow-sm hover:bg-forest/90 transition"
          >
            {isTranslating ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span>AI Translating...</span>
              </>
            ) : (
              <>
                <Globe className="size-3.5" />
                <span>
                  {activeIsEn ? "Xem bản gốc (Tiếng Việt)" : "Read in English (AI)"}
                </span>
              </>
            )}
          </button>
        </div>

        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
            {displayCategory}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">
            {displayTitle}
          </h1>
          <p className="mt-4 text-sm text-ink/55">
            {tPage.authorPrefix} <strong className="text-ink">{displayAuthor}</strong> · <time dateTime={post.date}>{post.date}</time> · {displayReadingTime}
          </p>
        </header>

        {/* Cover Image */}
        <figure className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl shadow-card">
          <AppImage src={post.image} alt={displayTitle} fill priority className="object-cover" />
        </figure>

        {/* Excerpt */}
        {displayExcerpt && (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-forest/5 border-l-4 border-forest p-5 text-lg italic text-ink/80 font-serif leading-relaxed">
            {displayExcerpt}
          </div>
        )}

        {/* Main Content */}
        <section className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-8 text-ink/80">
          {activeIsEn && displayContent ? (
            displayContent.split("\n\n").map((para: string, i: number) => (
              <p key={i} className="leading-relaxed">
                {para}
              </p>
            ))
          ) : post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block: BlogContentBlock) => (
              <div key={block.id}>
                {block.type === "paragraph" && (
                  <p style={{ textAlign: block.align || "left" }}>
                    {block.content}
                  </p>
                )}

                {block.type === "heading" &&
                  (block.level === 3 ? (
                    <h3 className="text-2xl font-bold text-forest mt-8 mb-3">
                      {block.content}
                    </h3>
                  ) : (
                    <h2 className="text-3xl font-extrabold text-ink mt-10 mb-4">
                      {block.content}
                    </h2>
                  ))}

                {block.type === "quote" && (
                  <blockquote className="my-8 rounded-2xl bg-forest/5 border-l-4 border-forest p-6">
                    <p className="text-xl italic font-serif text-ink leading-relaxed">
                      "{block.content}"
                    </p>
                    {block.author && (
                      <cite className="block mt-2 text-sm font-bold text-forest not-italic">
                        — {block.author}
                      </cite>
                    )}
                  </blockquote>
                )}

                {block.type === "list" && (
                  <ul className={`my-4 space-y-2 pl-6 ${block.style === "number" ? "list-decimal" : "list-disc"}`}>
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <>
              <p>{post.content}</p>
              <p>
                Du lịch cộng đồng phát huy giá trị cao nhất khi du khách đến với lòng tò mò và sự kiên nhẫn. Tại A Lưới, những kỷ niệm ý nghĩa nhất thường đến từ những khoảnh khắc dung dị: bữa ăn ấm áp, tấm Zèng thủ công, đường mòn ven rừng hay cuộc trò chuyện thân tình cùng bà con bản địa.
              </p>
            </>
          )}
        </section>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mx-auto mt-12 max-w-3xl pt-6 border-t border-black/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-ink/50">
              {tPage.topicTitle}:
            </span>
            {(activeIsEn && bTrans?.tags ? bTrans.tags : post.tags).map((tag) => (
              <span key={tag} className="rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related articles */}
        <aside className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-ink">
            {tPage.relatedTitle}
          </h2>
          <ul className="mt-5 grid gap-3">
            {related.map((item) => {
              const rTrans = blogTranslations[item.slug];
              const rTitle = activeIsEn ? (item.enTitle || rTrans?.title || item.title) : item.title;

              return (
                <li key={item.slug}>
                  <Link className="font-semibold text-forest hover:text-ink" href={`/blog/${item.slug}`}>
                    {rTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </article>
    </main>
  );
}
