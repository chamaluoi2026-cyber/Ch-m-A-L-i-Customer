import type { Metadata } from "next";
import { ImageCard } from "@/components/image-card";
import { getBlogPosts } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog | Chạm A Lưới",
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
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Câu chuyện</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">Blog</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">Văn hóa, ẩm thực, cẩm nang, trải nghiệm và tin tức từ A Lưới.</p>
        </header>
        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Danh mục blog">
          {categories.map((category) => (
            <span key={category} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-forest shadow-sm">
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
              cta="Đọc bài viết"
            />
          ))}
        </section>
      </section>
    </main>
  );
}
