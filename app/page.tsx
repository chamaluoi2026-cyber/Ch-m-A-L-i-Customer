import { heroImage, homestays, products, testimonials } from "@/data/site";
import { getFeaturedPlaces } from "@/lib/places";
import { getSiteSettingsAsync, getBlogPosts } from "@/lib/server-store";
import { HomeClientView } from "@/components/home/home-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const featuredPlaces = getFeaturedPlaces(3);
  const siteSettings = await getSiteSettingsAsync();
  const activeHeroImage = siteSettings.heroImage || heroImage;
  const publishedBlogs = getBlogPosts()
    .filter((p) => p.status === "published")
    .slice(0, 3);

  return (
    <HomeClientView
      activeHeroImage={activeHeroImage}
      featuredPlaces={featuredPlaces}
      homestays={homestays}
      products={products}
      publishedBlogs={publishedBlogs}
      testimonials={testimonials}
    />
  );
}
