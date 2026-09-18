import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/server-store";
import { siteUrl } from "@/lib/utils";
import { BlogDetailClientView } from "@/components/blog/blog-detail-client-view";

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogDetailClientView post={post} related={related} isPreview={isPreview} />
    </>
  );
}
