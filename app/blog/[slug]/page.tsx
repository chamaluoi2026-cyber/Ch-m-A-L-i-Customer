import { AppImage } from "@/components/ui/app-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts, type BlogContentBlock } from "@/lib/server-store";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default async function BlogDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
}) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const isPreview = sParams.preview === "true" || Boolean(sParams.token);

  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  // Bảo vệ bài nháp: Nếu bài viết chưa xuất bản và không có cờ preview -> Trả về 404
  if (post.status !== "published" && !isPreview) {
    notFound();
  }

  const allPosts = getBlogPosts();
  const related = allPosts.filter((item) => item.slug !== slug && item.status === "published").slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.image,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    url: `${siteUrl}/blog/${post.slug}`
  };

  return (
    <main className={`pt-24 ${isPreview ? "pt-36" : ""}`}>
      {/* Top Banner Chế độ Xem Trước Bản Nháp */}
      {isPreview && (
        <div className="fixed top-0 inset-x-0 z-50 bg-[#0F382E] text-white shadow-2xl border-b border-emerald-500/20 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-amber-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Chế Độ Xem Trước Bản Nháp (Draft Preview)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  post.status === "published" ? "bg-emerald-800 text-emerald-100" : "bg-amber-900 text-amber-200"
                }`}>
                  Trạng thái: {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 hidden sm:block">
                Bài viết này chưa công khai trong danh sách blog. Chỉ những ai có link xem trước mới xem được.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`http://localhost:3001/admin/blogs?edit=${post.id}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition shadow-sm"
            >
              ← Quay lại chỉnh sửa
            </a>

            <form
              action={async () => {
                "use server";
                const { saveBlogPost: publishPost } = await import("@/lib/server-store");
                const { revalidatePath } = await import("next/cache");
                const { redirect } = await import("next/navigation");
                publishPost({ ...post, status: "published" });
                revalidatePath("/blog");
                revalidatePath(`/blog/${post.slug}`);
                redirect(`/blog/${post.slug}`);
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-[#0F382E] shadow-md transition"
              >
                Đăng bài
              </button>
            </form>
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="section-shell py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">{post.category}</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">{post.title}</h1>
          <p className="mt-4 text-sm text-ink/55">
            Bởi <strong className="text-ink">{post.author}</strong> · <time dateTime={post.date}>{post.date}</time> · {post.readingTime}
          </p>
        </header>

        {/* Cover Image */}
        <figure className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl shadow-card">
          <AppImage src={post.image} alt={post.title} fill priority className="object-cover" />
        </figure>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-forest/5 border-l-4 border-forest p-5 text-lg italic text-ink/80 font-serif leading-relaxed">
            {post.excerpt}
          </div>
        )}

        {/* Main Content: Blocks or Fallback */}
        <section className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-8 text-ink/80">
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block: BlogContentBlock) => (
              <div key={block.id}>
                {block.type === "paragraph" && (
                  <p style={{ textAlign: block.align || "left" }}>
                    {block.content}
                  </p>
                )}

                {block.type === "heading" && (
                  block.level === 3 ? (
                    <h3 className="text-2xl font-bold text-forest mt-8 mb-3">
                      {block.content}
                    </h3>
                  ) : (
                    <h2 className="text-3xl font-extrabold text-ink mt-10 mb-4">
                      {block.content}
                    </h2>
                  )
                )}

                {block.type === "image" && (
                  <figure
                    className={`my-8 ${
                      block.align === "center"
                        ? "mx-auto text-center"
                        : block.align === "right"
                        ? "ml-auto text-right"
                        : "mr-auto text-left"
                    }`}
                    style={{
                      maxWidth:
                        block.width === "sm" ? "320px" : block.width === "md" ? "540px" : block.width === "lg" ? "760px" : "100%"
                    }}
                  >
                    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-card">
                      <AppImage src={block.url} alt={block.alt || block.caption || post.title} fill className="object-cover" />
                    </div>
                    {block.caption && (
                      <figcaption className="mt-2 text-sm italic text-ink/60 text-center">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {block.type === "gallery" && (
                  <div className="my-8 space-y-3">
                    <div
                      className={`grid gap-4 ${
                        block.layout === "grid-2" ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
                      }`}
                    >
                      {block.images.map((img) => (
                        <figure key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
                          <AppImage src={img.url} alt={img.caption || "Gallery"} fill className="object-cover" />
                          {img.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 text-white text-xs font-semibold text-center truncate">
                              {img.caption}
                            </div>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

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

                {block.type === "divider" && (
                  <hr className="my-8 border-t-2 border-forest/15" />
                )}

                {block.type === "code" && (
                  <pre className="my-6 rounded-2xl bg-neutral-900 text-emerald-300 font-mono text-sm p-4 overflow-x-auto">
                    {block.code}
                  </pre>
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
            <span className="text-xs font-bold text-ink/50">Chủ đề:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <aside className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-ink">Bài viết liên quan</h2>
          <ul className="mt-5 grid gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link className="font-semibold text-forest hover:text-ink" href={`/blog/${item.slug}`}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </article>
    </main>
  );
}
