import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/server-store";
import { BlogListClientView } from "@/components/blog/blog-list-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cẩm nang du lịch A Lưới | Chạm A Lưới",
  description: "Văn hóa, ẩm thực, cẩm nang du lịch, trải nghiệm và tin tức từ du lịch cộng đồng A Lưới."
};

export default function BlogPage() {
  const allPosts = getBlogPosts();
  const publishedPosts = allPosts.filter((p) => p.status === "published");

  return <BlogListClientView publishedPosts={publishedPosts} />;
}
