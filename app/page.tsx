import { heroImage, testimonials } from "@/data/site";
import { getFeaturedPlacesAsync, getFeaturedHomestaysAsync } from "@/lib/places";
import { getPublicProductsAsync } from "@/lib/products";
import { getSiteSettingsAsync } from "@/lib/server-store";
import { getBlogsFromCloudAsync } from "@/lib/cloud-store";
import { HomeClientView } from "@/components/home/home-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [featuredPlaces, cloudHomestays, siteSettings, cloudBlogs, cloudProducts] = await Promise.all([
    getFeaturedPlacesAsync(3),
    getFeaturedHomestaysAsync(4),
    getSiteSettingsAsync(),
    getBlogsFromCloudAsync(),
    getPublicProductsAsync()
  ]);

  const activeHeroImage = siteSettings.heroImage || heroImage;
  const publishedBlogs = cloudBlogs
    .filter((p) => p.status === "published" && !p.isDeleted)
    .slice(0, 3);

  return (
    <HomeClientView
      activeHeroImage={activeHeroImage}
      settings={siteSettings}
      featuredPlaces={featuredPlaces}
      homestays={cloudHomestays}
      products={cloudProducts}
      publishedBlogs={publishedBlogs}
      testimonials={testimonials}
    />
  );
}
