import { getPlacesByCategoryAsync } from "@/lib/places";
import { siteUrl } from "@/lib/utils";
import { toAbsoluteImageUrl } from "@/lib/seo/schema-generator";
import { PlacesClientView } from "@/components/places/places-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Điểm Đến & Homestay A Lưới | Thác A Nôr, Suối Pâr Le, Du Lịch Bản Địa",
  description: "Khám phá danh sách homestay ven suối, Thác A Nôr, Suối Pâr Le, ẩm thực Pa Cô và các điểm du lịch sinh thái cộng đồng tiêu biểu tại A Lưới, Thừa Thiên Huế.",
  alternates: {
    canonical: `${siteUrl}/places`
  },
  openGraph: {
    title: "Điểm Đến & Homestay A Lưới - Chạm A Lưới",
    description: "Khám phá danh sách homestay ven suối, Thác A Nôr, Suối Pâr Le, ẩm thực Pa Cô và các điểm du lịch sinh thái cộng đồng.",
    url: `${siteUrl}/places`,
    siteName: "Chạm A Lưới",
    images: [{ url: `${siteUrl}/images/home-hero.jpg`, width: 1200, height: 630 }]
  }
};

export default async function PlacesPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const query = await searchParams;
  const activeCategoryId = query.category || "all";
  const filteredPlaces = await getPlacesByCategoryAsync(activeCategoryId);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh sách Điểm Đến & Homestay Du Lịch Cộng Đồng A Lưới",
    description: "Khám phá Thác A Nôr, Suối Pâr Le, Homestay bản địa và các điểm du lịch sinh thái tại A Lưới, Thừa Thiên Huế",
    numberOfItems: filteredPlaces.length,
    itemListElement: filteredPlaces.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: p.name,
      url: `${siteUrl}/places/${p.slug}`,
      image: toAbsoluteImageUrl(p.image)
    }))
  };

  return (
    <>
      {/* Schema.org ItemList Carousel Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <PlacesClientView
        activeCategoryId={activeCategoryId}
        filteredPlaces={filteredPlaces}
      />
    </>
  );
}
