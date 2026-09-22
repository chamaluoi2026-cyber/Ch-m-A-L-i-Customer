import { notFound, redirect } from "next/navigation";
import { getPlaceBySlugAsync, getPlaceStaticParams, getRelatedPlacesAsync } from "@/lib/places";
import { fetchPlaceReviewsAction } from "@/app/actions/reviews";
import { siteUrl } from "@/lib/utils";
import { generatePlaceJsonLd, toAbsoluteImageUrl } from "@/lib/seo/schema-generator";
import { PlaceDetailClientView } from "@/components/places/place-detail-client-view";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export function generateStaticParams() {
  return getPlaceStaticParams();
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlugAsync(slug);

  if (!place || (place as any).isDeleted) {
    notFound();
  }

  const ogImageUrl = toAbsoluteImageUrl(place.ogImage || place.coverImage || place.image);

  return {
    title: place.seoTitle || `${place.name} | Du lịch cộng đồng A Lưới`,
    description: place.seoDescription || place.summary,
    alternates: {
      canonical: `${siteUrl}/places/${place.slug}`
    },
    openGraph: {
      title: place.seoTitle || `${place.name} - Chạm A Lưới`,
      description: place.seoDescription || place.summary,
      url: `${siteUrl}/places/${place.slug}`,
      siteName: "Chạm A Lưới",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: place.name
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: place.seoTitle || `${place.name} - Chạm A Lưới`,
      description: place.seoDescription || place.summary,
      images: [ogImageUrl]
    }
  };
}

export default async function PlaceDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
}) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : undefined;
  const isPreview = query?.preview === "true" || !!query?.token;

  const place = await getPlaceBySlugAsync(slug);
  if (!place || ((place as any).isDeleted && !isPreview)) notFound();

  // Tự động chuyển hướng từ slug cũ sang slug mới nếu đã được đổi tên
  if (place.slug !== slug) {
    redirect(isPreview ? `/places/${place.slug}?preview=true` : `/places/${place.slug}`);
  }

  // Bảo vệ bài ẩn/nháp: Nếu địa điểm bị ẩn mà không có preview token => 404
  if (place.status === "hidden" && !isPreview) {
    notFound();
  }

  const relatedPlaces = await getRelatedPlacesAsync(place.slug, place.category as any);
  const approvedReviews = await fetchPlaceReviewsAction(place.slug, true);
  const { mainSchema, breadcrumbSchema, faqSchema } = generatePlaceJsonLd(place, approvedReviews);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <PlaceDetailClientView
        place={place}
        relatedPlaces={relatedPlaces}
        approvedReviews={approvedReviews}
        isPreview={isPreview}
      />
    </>
  );
}
