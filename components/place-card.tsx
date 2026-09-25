"use client";

import { AppImage } from "@/components/ui/app-image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Star } from "lucide-react";
import type { Place } from "@/data/places";
import type { PlaceRecord } from "@/lib/server-store";
import { placeCategories } from "@/data/places";
import { useLanguage } from "@/components/i18n-provider";
import { categoryTranslations } from "@/lib/i18n/translations";
import { placeTranslations } from "@/lib/i18n/catalog-translations";

export function PlaceCard({ place }: { place: Place | PlaceRecord }) {
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

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
      <Link href={`/places/${place.slug}`} className="block flex-1">
        <figure className="relative aspect-[4/3] overflow-hidden bg-forest/5">
          <AppImage
            src={place.image}
            alt={displayName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <figcaption className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-forest shadow-md backdrop-blur">
              {categoryLabel}
            </span>
            {place.category === "stay" ? (
              place.availabilityStatus === "few_left" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur animate-pulse">
                  🔥 {isEn ? "Only 1-2 Left" : "Chỉ còn 1-2 phòng"}
                </span>
              ) : place.availabilityStatus === "sold_out" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 text-white px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur">
                  ❌ {isEn ? "Sold Out" : "Hết phòng"}
                </span>
              ) : place.availabilityStatus === "on_request" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 text-white px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur">
                  📞 {isEn ? "Inquire First" : "Liên hệ trước"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur">
                  <CheckCircle2 className="size-3" /> {isEn ? "Rooms Available" : "Còn phòng hôm nay"}
                </span>
              )
            ) : isActive ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur">
                <CheckCircle2 className="size-3" /> {isEn ? "Open Now" : "Đang hoạt động"}
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur">
                {isEn ? "Temporarily Closed" : "Tạm ngưng"}
              </span>
            )}
          </figcaption>
        </figure>
        <section className="p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="flex items-center gap-1 text-sm font-bold text-clay">
              <Star className="size-4 fill-current" aria-hidden="true" />
              {place.rating} ({place.reviewCount})
            </p>
            <p className="text-sm font-extrabold text-forest">{displayPrice}</p>
          </div>
          <h2 className="mt-3 text-xl font-extrabold text-ink line-clamp-1 group-hover:text-forest transition">
            {displayName}
          </h2>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/60 line-clamp-1">
            <MapPin className="size-3.5 shrink-0 text-forest" aria-hidden="true" />
            {displayAddress}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/70">{displaySummary}</p>
        </section>
      </Link>
      <div className="px-5 pb-5 pt-0">
        <div className="rounded-xl bg-forest/5 p-2.5 text-xs font-medium text-forest flex items-center justify-between">
          <span className="line-clamp-1">🎁 {displayVoucher}</span>
        </div>
        <Link
          href={`/places/${place.slug}`}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest/10 py-2.5 text-sm font-bold text-forest transition group-hover:bg-forest group-hover:text-white"
        >
          {isEn ? "View Details & Claim Voucher" : "Xem chi tiết & Nhận voucher"}
          <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
