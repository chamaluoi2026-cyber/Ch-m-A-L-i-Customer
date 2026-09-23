"use client";

import { AppImage } from "@/components/ui/app-image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Gift,
  HelpCircle,
  Lock,
  MapPin,
  Navigation,
  Phone,
  Play,
  Film,
  ShieldCheck,
  Star,
  TicketCheck,
  Users,
  X,
  ZoomIn
} from "lucide-react";
import { BlogVideoEmbed, parseYouTubeVideoId, isDirectVideoUrl } from "@/components/blog/blog-video-embed";
import { PlaceLeadForm } from "@/components/place-lead-form";
import { PlaceCard } from "@/components/place-card";
import { PlaceReviewsSection } from "@/components/place-reviews-section";
import { Button } from "@/components/ui/button";
import { placeCategories } from "@/data/places";
import { useLanguage } from "@/components/i18n-provider";
import { categoryTranslations } from "@/lib/i18n/translations";
import { placeTranslations } from "@/lib/i18n/catalog-translations";
import type { Place } from "@/data/places";
import type { PlaceRecord } from "@/lib/server-store";

interface PlaceDetailClientViewProps {
  place: Place | PlaceRecord;
  relatedPlaces: (Place | PlaceRecord)[];
  approvedReviews: any[];
  isPreview?: boolean;
}

export function PlaceDetailClientView({
  place,
  relatedPlaces,
  approvedReviews,
  isPreview = false
}: PlaceDetailClientViewProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const category = placeCategories.find((item) => item.id === place.category);
  const catTrans = categoryTranslations[place.category];
  const categoryLabel = isEn
    ? catTrans?.en || place.category
    : catTrans?.vi || category?.label || "Địa điểm";

  const pTrans = placeTranslations[place.slug];

  const displayName = isEn && pTrans?.name ? pTrans.name : place.name;
  const displaySummary = isEn && pTrans?.summary ? pTrans.summary : place.summary;
  const displayAddress = isEn && pTrans?.address ? pTrans.address : place.address;
  const displayVoucher = isEn && pTrans?.voucherOffer ? pTrans.voucherOffer : place.voucherOffer;

  const displayPrice = isEn
    ? pTrans?.priceLabel ||
      place.priceLabel
        .replace(/Dịch vụ từ/gi, "Services from")
        .replace(/Từ/gi, "From")
        .replace(/Vé & dịch vụ từ/gi, "Entry & services from")
        .replace(/Gói trọn gói từ/gi, "All-inclusive from")
        .replace(/đ\/người/gi, "₫/guest")
        .replace(/đ\/đêm/gi, "₫/night")
        .replace(/khách/gi, "guests")
    : place.priceLabel;

  const isActive = place.status === "active";

  // Collect all photos for gallery/lightbox viewer
  const heroImgUrl = place.coverImage || place.image;
  const allPhotos: { url: string; alt: string; caption?: string }[] = [];

  if (heroImgUrl) {
    allPhotos.push({
      url: heroImgUrl,
      alt: displayName,
      caption: isEn ? `${displayName} - Main View` : `${displayName} - Ảnh bìa`
    });
  }

  if (Array.isArray(place.gallery)) {
    place.gallery.forEach((item, idx) => {
      const url = typeof item === "string" ? item : item?.url;
      if (!url) return;
      if (allPhotos.some((p) => p.url === url)) return;
      const alt = typeof item === "object" && item.alt ? item.alt : `${displayName} - Ảnh ${idx + 1}`;
      const caption = typeof item === "object" ? item.caption : undefined;
      allPhotos.push({ url, alt, caption });
    });
  }

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || allPhotos.length <= 1) return prev;
      return (prev + 1) % allPhotos.length;
    });
  }, [allPhotos.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || allPhotos.length <= 1) return prev;
      return (prev - 1 + allPhotos.length) % allPhotos.length;
    });
  }, [allPhotos.length]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  return (
    <main className="pt-24 bg-beige/30 min-h-screen">
      {/* Floating Draft Preview Bar */}
      {isPreview && (
        <aside className="sticky top-20 z-40 bg-amber-500 text-ink px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 border-b border-amber-600">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="inline-block size-2 rounded-full bg-white animate-ping" />
            <span>{isEn ? "Draft Preview Mode" : "Chế Độ Xem Trước Địa Điểm (Draft Preview)"}</span>
          </div>
          <p className="text-[11px] text-ink/75">
            {isEn
              ? "This page is currently unpublished/hidden and not visible to regular travelers."
              : "Trang này đang ở trạng thái bản nháp/ẩn và chưa hiển thị công khai cho du khách thông thường."}
          </p>
        </aside>
      )}

      {/* Breadcrumb & Navigation */}
      <section className="section-shell flex flex-wrap items-center justify-between gap-4 pt-6">
        <div className="flex items-center gap-2 text-xs text-ink/60">
          <Link href="/places" className="inline-flex items-center gap-1 hover:text-forest transition">
            <ArrowLeft className="size-3.5" /> {isEn ? "All Destinations" : "Tất cả địa điểm"}
          </Link>
          <span>/</span>
          <span className="text-forest font-semibold">{categoryLabel}</span>
          <span>/</span>
          <span className="text-ink font-bold truncate max-w-[200px]">{displayName}</span>
        </div>

        {/* Quick action bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="bg-forest hover:bg-forest/90 text-white font-bold">
            <a href="#nhan-voucher">
              <TicketCheck className="size-4 mr-1.5" />
              {isEn ? "Claim Voucher" : "Nhận voucher"}
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-forest/30 text-forest hover:bg-forest/5 font-bold">
            <a href="#danh-gia">
              <Star className="size-4 mr-1.5 fill-amber-400 text-amber-500" />
              {isEn ? `Reviews (${place.reviewCount})` : `Đánh giá (${place.reviewCount})`}
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-forest/30 text-forest hover:bg-forest/5 font-bold">
            <a href="#ban-do">
              <MapPin className="size-4 mr-1.5" />
              {isEn ? "View Map" : "Xem bản đồ"}
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-forest/30 text-forest hover:bg-forest/5 font-bold">
            <a href={`tel:${place.phone}`}>
              <Phone className="size-4 mr-1.5" />
              {isEn ? "Call" : "Gọi điện"}
            </a>
          </Button>
          <Button asChild size="sm" variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200">
            <a href="#nhan-voucher" title={isEn ? "Fill out form to unlock Zalo / WhatsApp chat" : "Điền form để nhận mã và mở chat Zalo"}>
              <Lock className="size-3.5 mr-1.5 text-blue-600" />
              {isEn ? "Direct Chat" : "Chat Zalo"}
            </a>
          </Button>
        </div>
      </section>

      {/* Hero & Overview */}
      <section className="section-shell grid gap-8 py-8 lg:grid-cols-[1fr_0.8fr]">
        <article>
          <figure
            role="button"
            tabIndex={0}
            onClick={() => openLightbox(0)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openLightbox(0);
            }}
            className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white shadow-card cursor-pointer group focus:outline-none focus:ring-2 focus:ring-forest"
            title={isEn ? "Click to view full photo" : "Bấm để xem ảnh phóng to"}
          >
            <AppImage
              src={place.coverImage || place.image}
              alt={displayName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(0);
                }}
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-ink/65 hover:bg-ink/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur border border-white/20 shadow-md transition transform hover:scale-105"
              >
                <ZoomIn className="size-3.5" />
                <span>{isEn ? `View all ${allPhotos.length} photos` : `Xem tất cả ${allPhotos.length} ảnh`}</span>
              </button>
            )}
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-6 md:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur">
                  {categoryLabel}
                </span>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold shadow-sm">
                    <CheckCircle2 className="size-3.5" /> {isEn ? "Open Now" : "Đang mở cửa"}
                  </span>
                ) : place.status === "temporarily_closed" ? (
                  <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-bold shadow-sm">
                    {isEn ? "Temporarily Closed" : "Tạm ngưng đón khách"}
                  </span>
                ) : (
                  <span className="rounded-full bg-stone-600 px-3 py-1 text-xs font-bold shadow-sm">
                    {isEn ? "Draft / Hidden" : "Bản nháp / Đang ẩn"}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{displayName}</h1>
              <p className="mt-2.5 max-w-2xl text-white/85 text-sm md:text-base leading-relaxed">{displaySummary}</p>
            </figcaption>
          </figure>

          {/* Gallery */}
          {place.gallery && place.gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {place.gallery.map((galleryItem, idx) => {
                const imgUrl = typeof galleryItem === "string" ? galleryItem : galleryItem.url;
                const imgAlt = typeof galleryItem === "string" ? `${displayName} photo ${idx + 1}` : (galleryItem.alt || displayName);
                const photoIndex = allPhotos.findIndex((p) => p.url === imgUrl);
                const targetIdx = photoIndex !== -1 ? photoIndex : (heroImgUrl ? idx + 1 : idx);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openLightbox(targetIdx)}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest text-left"
                    title={isEn ? "Click to enlarge photo" : "Bấm để xem ảnh phóng to"}
                  >
                    <AppImage
                      src={imgUrl}
                      alt={imgAlt}
                      fill
                      sizes="33vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2.5 rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transform translate-y-1 group-hover:translate-y-0">
                        <ZoomIn className="size-4" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Featured Experience Video */}
          {place.videoUrl && (
            <div className="mt-6 rounded-3xl overflow-hidden shadow-card border border-forest/10 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 text-forest">
                <Play className="size-4 fill-forest" />
                <h3 className="font-extrabold text-sm sm:text-base text-ink uppercase tracking-wider">
                  {isEn ? "Experience Video" : "Video trải nghiệm thực tế"}
                </h3>
              </div>
              <BlogVideoEmbed
                url={place.videoUrl}
                caption={isEn ? `Real-life experience at ${displayName}` : `Video trải nghiệm thực tế tại ${place.name}`}
              />
            </div>
          )}
        </article>

        {/* Business & Booking Sidebar */}
        <aside className="h-fit rounded-3xl bg-white p-6 md:p-7 shadow-card lg:sticky lg:top-24 border border-forest/10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-clay">
            {isEn ? "Local Partner" : "Cơ sở địa phương"}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">{place.businessName}</h2>

          <div className="mt-5 grid gap-2.5 text-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 font-bold text-ink">
              <Star className="size-5 fill-current text-clay shrink-0" aria-hidden="true" />
              <span>{place.rating} / 5.0 ({place.reviewCount} {isEn ? "verified reviews" : "lượt đánh giá thực tế"})</span>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
              <MapPin className="size-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
              <span>{displayAddress}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
              <Clock className="size-5 text-forest shrink-0" aria-hidden="true" />
              <span>{place.openingHours}</span>
            </div>

            {place.duration && (
              <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
                <Compass className="size-5 text-forest shrink-0" aria-hidden="true" />
                <span>{isEn ? "Duration:" : "Thời gian trải nghiệm:"} <strong>{place.duration}</strong></span>
              </div>
            )}

            {place.maxGuests && (
              <div className="flex items-center gap-3 rounded-2xl bg-beige p-3.5 text-ink/80 text-xs md:text-sm font-medium">
                <Users className="size-5 text-forest shrink-0" aria-hidden="true" />
                <span>{isEn ? "Capacity:" : "Sức chứa đoàn:"} <strong>{place.maxGuests}</strong></span>
              </div>
            )}

            <div className="rounded-2xl bg-forest/10 p-4 border border-forest/20">
              <p className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="size-4" /> {isEn ? "Exclusive Cham A Luoi Offer:" : "Ưu đãi từ Chạm A Lưới:"}
              </p>
              <p className="mt-1 font-bold text-ink text-sm md:text-base">
                {displayVoucher}
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
                {isEn ? "Claim Discount Voucher" : "Nhận voucher ưu đãi"}
              </a>
            </Button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-ink/55 text-center">
            <Lock className="size-3.5 text-forest shrink-0" />
            {isEn
              ? "Host chat button will unlock after you submit the voucher form below."
              : "Nút Chat Zalo sẽ mở sau khi bạn điền form bên dưới."}
          </p>
        </aside>
      </section>

      {/* Place Description & Highlights */}
      <section className="section-shell grid gap-8 pb-12 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl bg-white p-6 md:p-8 shadow-card border border-forest/10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest">
            {isEn ? "In-Depth Overview" : "Giới thiệu chi tiết"}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">
            {isEn ? `About ${displayName}` : `Về ${place.name}`}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-8 text-ink/75">
            {(place.description || displaySummary).split(/\n\n+/).map((para: string, i: number) => {
              const trimmed = para.trim();
              if (parseYouTubeVideoId(trimmed) || isDirectVideoUrl(trimmed)) {
                return (
                  <div key={i} className="my-4">
                    <BlogVideoEmbed url={trimmed} />
                  </div>
                );
              }
              return (
                <p key={i} className="whitespace-pre-line leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          {place.highlights && place.highlights.length > 0 && (
            <div className="mt-8">
              <h3 className="text-base font-bold text-ink uppercase tracking-wider text-xs">
                {isEn ? "Key Highlights:" : "Điểm nổi bật:"}
              </h3>
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
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest">
              {isEn ? "Services & Rates" : "Dịch vụ & Mức giá"}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-forest">{displayPrice}</h2>
            {place.priceUnit && (
              <p className="text-xs text-ink/60 mt-0.5">
                {isEn ? `Pricing unit: ${place.priceUnit}` : `Đơn vị tính: ${place.priceUnit}`}
              </p>
            )}

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/60">
              {isEn ? "Included Services & Amenities:" : "Tiện ích & Dịch vụ:"}
            </p>
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
            <p className="text-xs font-bold text-forest">
              {isEn ? "💡 Transparent Local Booking:" : "💡 Lưu ý minh bạch:"}
            </p>
            <p className="mt-1 text-xs text-ink/65 leading-relaxed">
              {isEn
                ? "All payments are made directly between travelers and local hosts in A Luoi. Cham A Luoi bridges connections, provides exclusive vouchers, and safeguards traveler interests."
                : "Mọi giao dịch thanh toán được thực hiện trực tiếp giữa du khách và cơ sở tại A Lưới. Chạm A Lưới hỗ trợ kết nối, cung cấp voucher ưu đãi và bảo vệ quyền lợi du khách."}
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
            <h3 className="font-extrabold text-lg text-ink">
              {isEn ? "On-Site Activities" : "Hoạt động tại điểm"}
            </h3>
          </div>
          <p className="mt-2 text-xs text-ink/60">
            {isEn ? "Experiences you can enjoy when visiting:" : "Các trải nghiệm bạn có thể tham gia khi đến đây:"}
          </p>
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
            <h3 className="font-extrabold text-lg text-ink">
              {isEn ? "Ideal For" : "Đối tượng phù hợp"}
            </h3>
          </div>
          <p className="mt-2 text-xs text-ink/60">
            {isEn ? "This destination is best suited for:" : "Điểm đến này được thiết kế và phù hợp nhất cho:"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(place.suitableFor || []).map((target) => (
              <span key={target} className="rounded-full bg-clay/10 text-clay px-3 py-1.5 text-xs font-bold">
                ✓ {target}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-beige p-4 text-xs text-ink/70 leading-relaxed">
            🌿 {isEn
              ? "Suitable for both travelers seeking quiet healing retreats and those eager to connect with vibrant tribal cultures."
              : "Thích hợp cho cả những ai tìm kiếm sự tĩnh lặng hoặc muốn trải nghiệm không khí gắn kết cộng đồng miền núi."}
          </div>
        </article>

        {/* Safety Notes */}
        <article className="rounded-3xl bg-white p-6 shadow-card border border-forest/10">
          <div className="flex items-center gap-2.5 text-amber-700">
            <AlertTriangle className="size-5 text-amber-600" />
            <h3 className="font-extrabold text-lg text-ink">
              {isEn ? "Safety Advisory" : "Lưu ý an toàn"}
            </h3>
          </div>
          <p className="mt-2 text-xs text-ink/60">
            {isEn ? "Recommendations from management & local elders:" : "Khuyến nghị từ ban quản lý và người bản địa:"}
          </p>
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

      {/* Map & Lead Form */}
      <section className="section-shell grid gap-8 pb-16 lg:grid-cols-[1fr_1fr]" id="ban-do">
        <article className="overflow-hidden rounded-3xl bg-white shadow-card border border-forest/10 flex flex-col">
          <div className="p-6 border-b border-forest/10">
            <div className="flex items-center gap-2 text-forest">
              <MapPin className="size-5" />
              <h3 className="text-xl font-extrabold text-ink">
                {isEn ? "Location on Map" : "Vị trí trên bản đồ"}
              </h3>
            </div>
            <p className="mt-1 text-xs text-ink/60">{displayAddress}</p>
            {place.directions && (
              <div className="mt-2 flex items-start gap-2 text-xs text-forest/90 bg-forest/5 p-2.5 rounded-xl border border-forest/10">
                <Navigation className="size-4 shrink-0 mt-0.5 text-forest" />
                <span><strong>{isEn ? "Directions:" : "Chỉ dẫn đường đi:"}</strong> {place.directions}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-h-[380px]">
            <iframe
              title={`Map ${displayName}`}
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
        placeName={displayName}
        reviews={approvedReviews}
        averageRating={place.rating}
        reviewCount={place.reviewCount}
      />

      {/* Related Places */}
      {relatedPlaces.length ? (
        <section className="section-shell pb-24 border-t border-forest/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink">
            {isEn ? "Related Destinations You Might Like" : "Điểm đến liên quan bạn có thể quan tâm"}
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            {isEn ? "Discover more experiences and activities in A Luoi" : "Khám phá thêm các dịch vụ cùng nhóm tại A Lưới"}
          </p>
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {relatedPlaces.map((item) => (
              <PlaceCard key={item.slug} place={item as any} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && allPhotos[lightboxIndex] && (
        <aside
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Lightbox Header */}
          <div
            className="flex items-center justify-between p-4 sm:p-6 text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/10">
                {lightboxIndex + 1} / {allPhotos.length}
              </span>
              <span className="hidden sm:inline text-sm text-white/90 font-semibold truncate max-w-md">
                {displayName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition focus:outline-none"
                title={isEn ? "Close (Esc)" : "Đóng (Esc)"}
              >
                <X className="size-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Previous button */}
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur border border-white/15 transition transform hover:scale-105 focus:outline-none"
                title={isEn ? "Previous image (Left arrow)" : "Ảnh trước (Mũi tên trái)"}
              >
                <ChevronLeft className="size-6 sm:size-8" />
              </button>
            )}

            {/* Main Image */}
            <div
              className="relative max-h-[72vh] max-w-[92vw] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allPhotos[lightboxIndex].url}
                alt={allPhotos[lightboxIndex].alt || displayName}
                className="max-h-[72vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next button */}
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur border border-white/15 transition transform hover:scale-105 focus:outline-none"
                title={isEn ? "Next image (Right arrow)" : "Ảnh tiếp theo (Mũi tên phải)"}
              >
                <ChevronRight className="size-6 sm:size-8" />
              </button>
            )}
          </div>

          {/* Lightbox Footer & Thumbnail Strip */}
          <div
            className="p-3 sm:p-5 text-white flex flex-col items-center gap-2.5 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {allPhotos[lightboxIndex].caption && (
              <p className="text-center text-xs sm:text-sm text-white/90 font-medium max-w-xl truncate">
                {allPhotos[lightboxIndex].caption}
              </p>
            )}

            {/* Thumbnail Strip */}
            {allPhotos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2">
                {allPhotos.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative size-12 sm:size-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      i === lightboxIndex
                        ? "border-amber-400 scale-105 shadow-lg"
                        : "border-transparent opacity-50 hover:opacity-90"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </main>
  );
}
