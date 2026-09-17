import { AppImage } from "@/components/ui/app-image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Compass,
  Gift,
  HelpCircle,
  Lock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  TicketCheck,
  Users
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { PlaceLeadForm } from "@/components/place-lead-form";
import { PlaceCard } from "@/components/place-card";
import { PlaceReviewsSection } from "@/components/place-reviews-section";
import { Button } from "@/components/ui/button";
import { placeCategories } from "@/data/places";
import { getPlaceBySlug, getPlaceStaticParams, getRelatedPlaces } from "@/lib/places";
import { fetchPlaceReviewsAction } from "@/app/actions/reviews";
import { siteUrl } from "@/lib/utils";
import { generatePlaceJsonLd, toAbsoluteImageUrl } from "@/lib/seo/schema-generator";

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
  const place = getPlaceBySlug(slug);

  if (!place || place.isDeleted) {
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

  const place = getPlaceBySlug(slug);
  if (!place || (place.isDeleted && !isPreview)) notFound();

  // Tự động chuyển hướng từ slug cũ sang slug mới nếu đã được đổi tên
  if (place.slug !== slug) {
    redirect(isPreview ? `/places/${place.slug}?preview=true` : `/places/${place.slug}`);
  }

  // Bảo vệ bài ẩn/nháp: Nếu địa điểm bị ẩn mà không có preview token => 404
  if (place.status === "hidden" && !isPreview) {
    notFound();
  }

  const category = placeCategories.find((item) => item.id === place.category);
  const relatedPlaces = getRelatedPlaces(place.slug, place.category as any);
  const isActive = place.status === "active";
  const approvedReviews = await fetchPlaceReviewsAction(place.slug, true);

  const { mainSchema, breadcrumbSchema, faqSchema } = generatePlaceJsonLd(place, approvedReviews);

  return (
    <main className="pt-24 bg-beige/30 min-h-screen">
      {/* Schema.org Rich Snippet Structured Data for Google Search */}
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

      {/* Floating Draft Preview Bar */}
      {isPreview && (
        <aside className="sticky top-20 z-40 bg-amber-500 text-ink px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 border-b border-amber-600">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="inline-block size-2 rounded-full bg-white animate-ping" />
            <span>Chế Độ Xem Trước Địa Điểm (Draft Preview)</span>
          </div>
          <p className="text-[11px] text-ink/75">Trang này đang ở trạng thái bản nháp/ẩn và chưa hiển thị công khai cho du khách thông thường.</p>
        </aside>
      )}

      {/* Breadcrumb & Navigation */}
      <section className="section-shell flex flex-wrap items-center justify-between gap-4 pt-6">
        <div className="flex items-center gap-2 text-xs text-ink/60">
          <Link href="/places" className="inline-flex items-center gap-1 hover:text-forest transition">
            <ArrowLeft className="size-3.5" /> Tất cả địa điểm
          </Link>
          <span>/</span>
          <span className="text-forest font-semibold">{category?.label || "Khám phá"}</span>
          <span>/</span>
          <span className="text-ink font-bold truncate max-w-[200px]">{place.name}</span>
        </div>

        {/* Quick action bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="bg-forest hover:bg-forest/90 text-white font-bold">
            <a href="#nhan-voucher">
              <TicketCheck className="size-4 mr-1.5" />
              Nhận voucher
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-forest/30 text-forest hover:bg-forest/5 font-bold">
            <a href="#danh-gia">
              <Star className="size-4 mr-1.5 fill-amber-400 text-amber-500" />
              Đánh giá ({place.reviewCount})
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-forest/30 text-forest hover:bg-forest/5 font-bold">
            <a href="#ban-do">
              <MapPin className="size-4 mr-1.5" />
              Xem bản đồ
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-forest/30 text-forest hover:bg-forest/5 font-bold">
            <a href={`tel:${place.phone}`}>
              <Phone className="size-4 mr-1.5" />
              Gọi điện
            </a>
          </Button>
          <Button asChild size="sm" variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200">
            <a href="#nhan-voucher" title="Điền form để nhận mã và mở chat Zalo">
              <Lock className="size-3.5 mr-1.5 text-blue-600" />
              Chat Zalo
            </a>
          </Button>
        </div>
      </section>

      {/* Hero & Overview */}
      <section className="section-shell grid gap-8 py-8 lg:grid-cols-[1fr_0.8fr]">
        <article>
          <figure className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white shadow-card">
            <AppImage
              src={place.coverImage || place.image}
              alt={place.imageAlt || place.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-6 md:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur">
                  {category?.label || "Địa điểm"}
                </span>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold shadow-sm">
                    <CheckCircle2 className="size-3.5" /> Đang mở cửa
                  </span>
                ) : place.status === "temporarily_closed" ? (
                  <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-bold shadow-sm">
                    Tạm ngưng đón khách
                  </span>
                ) : (
                  <span className="rounded-full bg-stone-600 px-3 py-1 text-xs font-bold shadow-sm">
                    Bản nháp / Đang ẩn
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{place.name}</h1>
              <p className="mt-2.5 max-w-2xl text-white/85 text-sm md:text-base leading-relaxed">{place.summary}</p>
            </figcaption>
          </figure>

          {/* Gallery */}
          {place.gallery && place.gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {place.gallery.map((galleryItem, idx) => {
                const imgUrl = typeof galleryItem === "string" ? galleryItem : galleryItem.url;
                const imgAlt = typeof galleryItem === "string" ? `Ảnh chụp ${place.name} ${idx + 1}` : (galleryItem.alt || place.name);
                return (
                  <figure key={idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm group">
                    <AppImage
                      src={imgUrl}
                      alt={imgAlt}
                      fill
                      sizes="33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </figure>
                );
              })}
            </div>
          )}
        </article>

        {/* Business & Booking Sidebar */}
        <aside className="h-fit rounded-3xl bg-white p-6 md:p-7 shadow-card lg:sticky lg:top-24 border border-forest/10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-clay">Cơ sở địa phương</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">{place.businessName}</h2>

          <div className="mt-5 grid gap-2.5 text-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 font-bold text-ink">
              <Star className="size-5 fill-current text-clay shrink-0" aria-hidden="true" />
              <span>{place.rating} / 5.0 ({place.reviewCount} lượt đánh giá thực tế)</span>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
              <MapPin className="size-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
              <span>{place.address}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
              <Clock className="size-5 text-forest shrink-0" aria-hidden="true" />
              <span>{place.openingHours}</span>
            </div>

            {place.duration && (
              <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
                <Compass className="size-5 text-forest shrink-0" aria-hidden="true" />
                <span>Thời gian trải nghiệm: <strong>{place.duration}</strong></span>
              </div>
            )}

            {place.maxGuests && (
              <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
                <Users className="size-5 text-forest shrink-0" aria-hidden="true" />
                <span>Sức chứa đoàn: <strong>{place.maxGuests}</strong></span>
              </div>
            )}

            <div className="rounded-2xl bg-forest/10 p-4 border border-forest/20">
              <p className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="size-4" /> Ưu đãi từ Chạm A Lưới:
              </p>
              <p className="mt-1 font-bold text-ink text-sm md:text-base">
                {place.voucherOffer}
              </p>
              {place.voucherTerms && (
                <p className="mt-1.5 text-xs text-ink/65 italic">
                  * {place.voucherTerms}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button asChild size="lg" className="w-full text-base font-extrabold shadow-lg">
              <a href="#nhan-voucher">
                <TicketCheck className="size-5 mr-2" aria-hidden="true" />
                Nhận voucher ưu đãi
              </a>
            </Button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-ink/55 text-center">
            <Lock className="size-3.5 text-forest shrink-0" />
            Nút Chat Zalo sẽ mở sau khi bạn điền form bên dưới.
          </p>
        </aside>
      </section>

      {/* Place Description & Highlights */}
      <section className="section-shell grid gap-8 pb-12 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl bg-white p-6 md:p-8 shadow-card border border-forest/10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest">Giới thiệu chi tiết</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">Về {place.name}</h2>
          <p className="mt-4 text-base leading-8 text-ink/75 whitespace-pre-line">{place.description}</p>

          {place.highlights && place.highlights.length > 0 && (
            <div className="mt-8">
              <h3 className="text-base font-bold text-ink uppercase tracking-wider text-xs">Điểm nổi bật:</h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {place.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 rounded-2xl bg-beige p-3.5 text-xs md:text-sm font-bold text-ink/80">
                    <span className="size-2 rounded-full bg-forest shrink-0" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="rounded-3xl bg-white p-6 md:p-8 shadow-card border border-forest/10 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest">Dịch vụ & Mức giá</p>
            <h2 className="mt-2 text-2xl font-extrabold text-forest">{place.priceLabel}</h2>
            {place.priceUnit && (
              <p className="text-xs text-ink/60 mt-0.5">Đơn vị tính: {place.priceUnit}</p>
            )}

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/60">Tiện ích & Dịch vụ:</p>
            <ul className="mt-3 grid gap-2">
              {place.services.map((service) => (
                <li key={service} className="flex items-center gap-2.5 rounded-xl border border-forest/10 bg-beige/60 px-3.5 py-2.5 text-xs md:text-sm font-semibold text-ink/80">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl bg-forest/5 p-4 border border-dashed border-forest/20">
            <p className="text-xs font-bold text-forest">💡 Lưu ý minh bạch:</p>
            <p className="mt-1 text-xs text-ink/65 leading-relaxed">
              Mọi giao dịch thanh toán được thực hiện trực tiếp giữa du khách và cơ sở tại A Lưới. Chạm A Lưới hỗ trợ kết nối, cung cấp voucher ưu đãi và bảo vệ quyền lợi du khách.
            </p>
          </div>
        </article>
      </section>

      {/* Activities, Suitable For & Safety Notes */}
      <section className="section-shell grid gap-6 pb-12 md:grid-cols-3">
        {/* Activities */}
        <article className="rounded-3xl bg-white p-6 shadow-card border border-forest/10">
          <div className="flex items-center gap-2.5 text-forest">
            <Compass className="size-5" />
            <h3 className="font-extrabold text-lg text-ink">Hoạt động tại điểm</h3>
          </div>
          <p className="mt-2 text-xs text-ink/60">Các trải nghiệm bạn có thể tham gia khi đến đây:</p>
          <ul className="mt-4 space-y-2">
            {place.activities.map((act, i) => (
              <li key={i} className="rounded-xl bg-beige p-3 text-xs font-semibold text-ink/80 flex items-start gap-2">
                <span className="font-bold text-forest">{i + 1}.</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Suitable For */}
        <article className="rounded-3xl bg-white p-6 shadow-card border border-forest/10">
          <div className="flex items-center gap-2.5 text-clay">
            <Users className="size-5" />
            <h3 className="font-extrabold text-lg text-ink">Đối tượng phù hợp</h3>
          </div>
          <p className="mt-2 text-xs text-ink/60">Điểm đến này được thiết kế và phù hợp nhất cho:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(place.suitableFor || []).map((target) => (
              <span key={target} className="rounded-full bg-clay/10 text-clay px-3 py-1.5 text-xs font-bold">
                ✓ {target}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-beige p-4 text-xs text-ink/70 leading-relaxed">
            🌿 Thích hợp cho cả những ai tìm kiếm sự tĩnh lặng hoặc muốn trải nghiệm không khí gắn kết cộng đồng miền núi.
          </div>
        </article>

        {/* Safety Notes */}
        <article className="rounded-3xl bg-white p-6 shadow-card border border-forest/10">
          <div className="flex items-center gap-2.5 text-amber-700">
            <AlertTriangle className="size-5 text-amber-600" />
            <h3 className="font-extrabold text-lg text-ink">Lưu ý an toàn</h3>
          </div>
          <p className="mt-2 text-xs text-ink/60">Khuyến nghị từ ban quản lý và người bản địa:</p>
          <ul className="mt-4 space-y-2">
            {place.safetyNotes.map((note, idx) => (
              <li key={idx} className="rounded-xl bg-amber-50/80 border border-amber-200/60 p-3 text-xs text-amber-900 font-medium flex items-start gap-2">
                <ShieldCheck className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* FAQ Section (Nếu có) */}
      {place.faq && place.faq.length > 0 && (
        <section className="section-shell pb-12">
          <article className="rounded-3xl bg-white p-6 md:p-8 shadow-card border border-forest/10">
            <div className="flex items-center gap-2.5 text-forest mb-4">
              <HelpCircle className="size-6 text-forest" />
              <div>
                <h3 className="text-xl font-extrabold text-ink">Câu hỏi thường gặp (FAQ)</h3>
                <p className="text-xs text-ink/60">Giải đáp thắc mắc phổ biến về {place.name}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 mt-4">
              {place.faq.map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-beige/60 p-4 border border-black/5">
                  <h4 className="font-bold text-sm text-ink flex items-start gap-2">
                    <span className="size-5 rounded-full bg-forest text-white text-xs flex items-center justify-center shrink-0 mt-0.5">?</span>
                    {item.question}
                  </h4>
                  <p className="mt-2 text-xs text-ink/75 leading-relaxed pl-7">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {/* Map & Lead Form */}
      <section className="section-shell grid gap-8 pb-16 lg:grid-cols-[1fr_1fr]" id="ban-do">
        <article className="overflow-hidden rounded-3xl bg-white shadow-card border border-forest/10 flex flex-col">
          <div className="p-6 border-b border-forest/10">
            <div className="flex items-center gap-2 text-forest">
              <MapPin className="size-5" />
              <h3 className="text-xl font-extrabold text-ink">Vị trí trên bản đồ</h3>
            </div>
            <p className="mt-1 text-xs text-ink/60">{place.address}</p>
            {place.directions && (
              <div className="mt-2 flex items-start gap-2 text-xs text-forest/90 bg-forest/5 p-2.5 rounded-xl border border-forest/10">
                <Navigation className="size-4 shrink-0 mt-0.5 text-forest" />
                <span><strong>Chỉ dẫn đường đi:</strong> {place.directions}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-h-[380px]">
            <iframe
              title={`Bản đồ ${place.name}`}
              src={place.mapEmbedUrl}
              className="h-full w-full border-0 min-h-[380px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </article>

        {/* Lead Form */}
        <PlaceLeadForm place={place as any} />
      </section>

      {/* Reviews & Ratings Section */}
      <PlaceReviewsSection
        placeSlug={place.slug}
        placeName={place.name}
        reviews={approvedReviews}
        averageRating={place.rating}
        reviewCount={place.reviewCount}
      />

      {/* Related Places */}
      {relatedPlaces.length ? (
        <section className="section-shell pb-24 border-t border-forest/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink">Điểm đến liên quan bạn có thể quan tâm</h2>
          <p className="mt-2 text-sm text-ink/60">Khám phá thêm các dịch vụ cùng nhóm tại A Lưới</p>
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {relatedPlaces.map((item) => (
              <PlaceCard key={item.slug} place={item as any} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
