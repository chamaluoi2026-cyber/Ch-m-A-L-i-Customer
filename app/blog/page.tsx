import type { Metadata } from "next";
import { getBlogsFromCloudAsync } from "@/lib/cloud-store";
import { BlogListClientView } from "@/components/blog/blog-list-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cẩm nang du lịch A Lưới | Chạm A Lưới",
  description: "Văn hóa, ẩm thực, cẩm nang du lịch, trải nghiệm và tin tức từ du lịch cộng đồng A Lưới."
};

export default async function BlogPage() {
  const allPosts = await getBlogsFromCloudAsync();
  const publishedPosts = allPosts.filter((p) => p.status === "published" && !p.isDeleted);

  return <BlogListClientView publishedPosts={publishedPosts} />;
}
