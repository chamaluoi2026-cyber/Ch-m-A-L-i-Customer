import { heroImage, homestays, products, testimonials } from "@/data/site";
import { getFeaturedPlacesAsync } from "@/lib/places";
import { getSiteSettingsAsync } from "@/lib/server-store";
import { getBlogsFromCloudAsync } from "@/lib/cloud-store";
import { HomeClientView } from "@/components/home/home-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const featuredPlaces = await getFeaturedPlacesAsync(3);
  const siteSettings = await getSiteSettingsAsync();
  const activeHeroImage = siteSettings.heroImage || heroImage;
  const cloudBlogs = await getBlogsFromCloudAsync();
  const publishedBlogs = cloudBlogs
    .filter((p) => p.status === "published" && !p.isDeleted)
    .slice(0, 3);

  return (
    <HomeClientView
      activeHeroImage={activeHeroImage}
      settings={siteSettings}
      featuredPlaces={featuredPlaces}
      homestays={homestays}
      products={products}
      publishedBlogs={publishedBlogs}
      testimonials={testimonials}
    />
  );
}
