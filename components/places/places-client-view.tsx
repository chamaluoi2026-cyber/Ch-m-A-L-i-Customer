"use client";

import Link from "next/link";
import { Building2, Filter, MessageCircle, TicketCheck } from "lucide-react";
import { PlaceCard } from "@/components/place-card";
import { SectionHeading } from "@/components/section-heading";
import { placeCategories } from "@/data/places";
import { useLanguage } from "@/components/i18n-provider";
import { categoryTranslations } from "@/lib/i18n/translations";
import type { Place } from "@/data/places";
import type { PlaceRecord } from "@/lib/server-store";

interface PlacesClientViewProps {
  activeCategoryId: string;
  filteredPlaces: (Place | PlaceRecord)[];
}

export function PlacesClientView({
  activeCategoryId,
  filteredPlaces
}: PlacesClientViewProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const activeCategory = placeCategories.find((c) => c.id === activeCategoryId) || placeCategories[0];
  const activeCategoryTrans = categoryTranslations[activeCategoryId];
  const activeCategoryLabel = isEn
    ? activeCategoryTrans?.en || activeCategory.label
    : activeCategoryTrans?.vi || activeCategory.label;

  return (
    <main className="pt-24">
      <section className="relative overflow-hidden bg-forest py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,111,60,0.35),transparent_34%),linear-gradient(135deg,#0F5C4A,#16211E)]" />
        <div className="section-shell relative z-10">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">
            {isEn ? "Verified Local Network" : "Mạng lưới kết nối cơ sở"}
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
            {isEn ? "Destinations in A Luoi" : "Địa điểm tại A Lưới"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            {isEn
              ? "Discover authentic dining, streamside homestays, pristine waterfalls, campfires, and living heritage. Submit your details to claim exclusive discount vouchers before connecting via Zalo."
              : "Tìm nơi ăn uống, homestay ven suối, tắm thác thiên nhiên, lửa trại và trải nghiệm văn hóa. Để lại thông tin để nhận mã voucher ưu đãi độc quyền trước khi chat Zalo cùng cơ sở."}
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [Building2, isEn ? "Authentic local partners verified by community" : "Cơ sở địa phương được thẩm định rõ ràng"],
              [TicketCheck, isEn ? "Instant voucher discount before booking" : "Khách nhận mã voucher ưu đãi trước khi tư vấn"],
              [MessageCircle, isEn ? "Direct host connection via WhatsApp / Zalo" : "Mở khóa chat Zalo ngay sau khi gửi thông tin"]
            ].map(([Icon, text]) => (
              <article key={text as string} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <Icon className="size-7 text-white" aria-hidden="true" />
                <p className="mt-4 text-sm font-bold leading-6 text-white/80">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-clay">
            <Filter className="size-4" aria-hidden="true" />
            {isEn ? "Filter by 13 Categories" : "Lọc theo 13 danh mục"}
          </div>
          <span className="text-xs font-semibold text-ink/60">
            {isEn ? `Found ${filteredPlaces.length} destinations` : `Tìm thấy ${filteredPlaces.length} địa điểm`}
          </span>
        </div>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label={isEn ? "Destination Categories" : "Danh mục địa điểm"}>
          {placeCategories.map((category) => {
            const isSelected = activeCategoryId === category.id;
            const href = category.id === "all" ? "/places" : `/places?category=${category.id}`;
            const catTrans = categoryTranslations[category.id];
            const label = isEn ? catTrans?.en || category.label : catTrans?.vi || category.label;

            return (
              <Link
                key={category.id}
                href={href}
                className={`focus-ring rounded-full px-4 py-2 text-xs md:text-sm font-bold transition shadow-sm ${
                  isSelected
                    ? "bg-forest text-white shadow-[0_4px_14px_rgba(15,92,74,0.3)]"
                    : "bg-white text-ink/75 hover:bg-beige hover:text-forest"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="section-shell pb-24">
        <SectionHeading
          eyebrow={activeCategoryLabel}
          title={
            isEn
              ? `Explore verified ${activeCategoryLabel.toLowerCase()}`
              : activeCategory ? activeCategory.description : "Khách chọn địa điểm trước, nhận voucher rồi mới tư vấn"
          }
          description={
            isEn
              ? "Each destination includes genuine photos, local safety tips, and a direct voucher claim form."
              : "Mỗi địa điểm có trang riêng với ảnh thực tế, hướng dẫn an toàn và form nhận voucher trực tiếp."
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
      </section>
    </main>
  );
}
