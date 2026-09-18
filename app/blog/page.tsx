import type { Metadata } from "next";
import { ImageCard } from "@/components/image-card";
import { getBlogPosts } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cẩm nang du lịch A Lưới | Chạm A Lưới",
  description: "Văn hóa, ẩm thực, cẩm nang du lịch, trải nghiệm và tin tức từ du lịch cộng đồng A Lưới."
};

const categories = ["Tất cả", "Cẩm nang", "Văn hóa", "Ẩm thực", "Trải nghiệm", "Tin tức"];

export default function BlogPage() {
  const allPosts = getBlogPosts();
  const publishedPosts = allPosts.filter((p) => p.status === "published");

  return (
    <main className="pt-24">
      <section className="section-shell py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Kinh nghiệm & Khám phá</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-5xl">Cẩm nang du lịch A Lưới</h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">
            Kinh nghiệm phượt đèo, văn hóa bản địa Pa Cô - Tà Ôi, ẩm thực vùng cao và cẩm nang bỏ túi hữu ích nhất.
          </p>
        </header>
        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Danh mục cẩm nang">
          {categories.map((category) => (
            <span key={category} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-forest shadow-xs border border-forest/10">
              {category}
            </span>
          ))}
        </nav>
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {publishedPosts.map((post) => (
            <ImageCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              image={post.image}
              alt={post.title}
              title={post.title}
              subtitle={post.excerpt}
              meta={`${post.category} · ${post.readingTime}`}
              cta="Đọc cẩm nang"
            />
          ))}
        </section>
      </section>
    </main>
  );
}