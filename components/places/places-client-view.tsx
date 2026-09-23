"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Car,
  Compass,
  Home,
  MapPin,
  MapPinOff,
  MessageCircle,
  RotateCcw,
  Search,
  Sparkles,
  TicketCheck,
  Trees,
  Utensils,
  Waves,
  X
} from "lucide-react";
import { PlaceCard } from "@/components/place-card";
import { useLanguage } from "@/components/i18n-provider";
import type { Place } from "@/data/places";
import type { PlaceRecord } from "@/lib/server-store";

export interface DestinationCategoryGroup {
  id: string;
  labelVi: string;
  labelEn: string;
  icon: any;
  matchCategories: string[];
  descriptionVi: string;
  descriptionEn: string;
}

export const DESTINATION_CATEGORIES: DestinationCategoryGroup[] = [
  {
    id: "all",
    labelVi: "Tất cả",
    labelEn: "All Places",
    icon: Compass,
    matchCategories: [],
    descriptionVi: "Toàn bộ điểm đến, homestay, sinh thái và trải nghiệm du lịch cộng đồng tại A Lưới.",
    descriptionEn: "All verified destinations, homestays, nature retreats, and community experiences in A Luoi."
  },
  {
    id: "waterfall-stream",
    labelVi: "Thác & Suối",
    labelEn: "Waterfalls & Streams",
    icon: Waves,
    matchCategories: ["waterfall-stream"],
    descriptionVi: "Thác A Nôr, suối A Lin, suối Pâr Le nước trong xanh mát lạnh giữa đại ngàn Trường Sơn.",
    descriptionEn: "Pristine natural waterfalls and crystal-clear mountain streams."
  },
  {
    id: "stay",
    labelVi: "Lưu trú & Homestay",
    labelEn: "Homestays & Lodging",
    icon: Home,
    matchCategories: ["stay"],
    descriptionVi: "Homestay nhà sàn, farmstay ven suối và không gian nghỉ dưỡng cộng đồng bình yên.",
    descriptionEn: "Authentic stilt-house homestays, streamside farmstays, and community retreats."
  },
  {
    id: "culture",
    labelVi: "Văn hóa & Trải nghiệm",
    labelEn: "Culture & Living Heritage",
    icon: Sparkles,
    matchCategories: ["culture", "experience", "campfire", "community-tourism"],
    descriptionVi: "Làng du lịch cộng đồng, workshop dệt Zèng di sản, đêm hội lửa trại cồng chiêng và giao lưu bản địa.",
    descriptionEn: "Community tourism hamlets, UNESCO Zeng weaving, campfire folklore, and ethnic immersion."
  },
  {
    id: "visit",
    labelVi: "Tham quan & Check-in",
    labelEn: "Sightseeing & Nature",
    icon: Trees,
    matchCategories: ["visit", "outdoor", "play"],
    descriptionVi: "Đồi thông, Cầu treo Pi Lung, rừng nguyên sinh A Roàng và các tuyệt cảnh thiên nhiên kỳ vĩ.",
    descriptionEn: "Scenic pine hills, suspension bridges, virgin rainforests, and breathtaking photo spots."
  },
  {
    id: "food",
    labelVi: "Ẩm thực & Quán ăn",
    labelEn: "Dining & Local Food",
    icon: Utensils,
    matchCategories: ["food"],
    descriptionVi: "Quán cơm bản địa, mâm cơm truyền thống Pa Cô - Tà Ôi, gà nướng và rau rừng tươi sạch.",
    descriptionEn: "Indigenous ethnic restaurants, woodsmoke feasts, hill chicken, and wild mountain greens."
  },
  {
    id: "service",
    labelVi: "Dịch vụ & Di chuyển",
    labelEn: "Travel Services",
    icon: Car,
    matchCategories: ["service"],
    descriptionVi: "Xe ô tô đưa đón 2 chiều Huế - A Lưới, hướng dẫn viên bản địa am hiểu địa bàn.",
    descriptionEn: "Two-way comfortable shuttle transport between Hue and A Luoi, local licensed guides."
  }
];

interface PlacesClientViewProps {
  initialCategoryId?: string;
  places: (Place | PlaceRecord)[];
}

export function PlacesClientView({
  initialCategoryId = "all",
  places
}: PlacesClientViewProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Normalize initial category ID
  const paramCategory = searchParams.get("category") || initialCategoryId;
  const validCategory = DESTINATION_CATEGORIES.some((c) => c.id === paramCategory)
    ? paramCategory
    : "all";

  const [activeCategoryId, setActiveCategoryId] = useState<string>(validCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calculate place count for each category group
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DESTINATION_CATEGORIES.forEach((cat) => {
      if (cat.id === "all") {
        counts[cat.id] = places.length;
      } else {
        counts[cat.id] = places.filter(
          (p) => cat.matchCategories.includes(p.category) || p.category === cat.id
        ).length;
      }
    });
    return counts;
  }, [places]);

  // Filter places based on active category & search query
  const filteredPlaces = useMemo(() => {
    let result = places;

    // 1. Filter by category
    if (activeCategoryId !== "all") {
      const activeGroup = DESTINATION_CATEGORIES.find((c) => c.id === activeCategoryId);
      if (activeGroup) {
        result = result.filter(
          (p) =>
            activeGroup.matchCategories.includes(p.category) || p.category === activeCategoryId
        );
      }
    }

    // 2. Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const summary = (p.summary || "").toLowerCase();
        const address = (p.address || "").toLowerCase();
        const business = (p.businessName || "").toLowerCase();
        const highlights = (p.highlights || []).join(" ").toLowerCase();
        const activities = (p.activities || []).join(" ").toLowerCase();

        return (
          name.includes(q) ||
          summary.includes(q) ||
          address.includes(q) ||
          business.includes(q) ||
          highlights.includes(q) ||
          activities.includes(q)
        );
      });
    }

    return result;
  }, [places, activeCategoryId, searchQuery]);

  const activeGroup =
    DESTINATION_CATEGORIES.find((c) => c.id === activeCategoryId) || DESTINATION_CATEGORIES[0];

  const handleSelectCategory = (catId: string) => {
    setActiveCategoryId(catId);
    // Update URL query smoothly
    const url = catId === "all" ? "/places" : `/places?category=${catId}`;
    router.replace(url, { scroll: false });
  };

  const handleResetFilters = () => {
    setActiveCategoryId("all");
    setSearchQuery("");
    router.replace("/places", { scroll: false });
  };

  return (
    <main className="pt-24 min-h-screen bg-stone-50/50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-forest py-16 md:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,111,60,0.35),transparent_34%),linear-gradient(135deg,#0F5C4A,#16211E)]" />
        <div className="section-shell relative z-10">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-white/70">
            {isEn ? "Verified Local Network" : "Mạng lưới điểm đến & cơ sở bản địa"}
          </p>
          <h1 className="mt-3.5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            {isEn ? "Destinations in A Luoi" : "Địa điểm tại A Lưới"}
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80">
            {isEn
              ? "Discover crystal streams, streamside homestays, waterfalls, campfire festivals, and indigenous cultural heritage. Claim exclusive vouchers before connecting directly with local hosts."
              : "Khám phá suối thác trong xanh, homestay ven suối, lửa trại cồng chiêng và di sản văn hóa bản địa. Nhận mã voucher ưu đãi độc quyền trước khi kết nối trực tiếp cùng cơ sở."}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [Building2, isEn ? "Authentic local partners verified by community" : "Cơ sở địa phương được thẩm định rõ ràng"],
              [TicketCheck, isEn ? "Instant voucher discount before booking" : "Khách nhận mã voucher ưu đãi trước khi tư vấn"],
              [MessageCircle, isEn ? "Direct host connection via WhatsApp / Zalo" : "Mở khóa chat Zalo ngay sau khi gửi thông tin"]
            ].map(([Icon, text]) => (
              <article key={text as string} className="rounded-2xl bg-white/10 p-4 backdrop-blur border border-white/10">
                <Icon className="size-6 text-amber-300" aria-hidden="true" />
                <p className="mt-3 text-xs sm:text-sm font-bold leading-5 text-white/90">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modern UX/UI Filter & Search Section */}
      <section className="section-shell pt-8 pb-4">
        {/* Top Control Bar: Heading & Search Box */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-forest" />
              <h2 className="text-lg sm:text-xl font-extrabold text-ink">
                {isEn ? "Explore Categories" : "Khám phá theo danh mục"}
              </h2>
            </div>
            <p className="text-xs text-ink/60 mt-0.5">
              {isEn
                ? "Filter destinations by your travel interests or search by keyword"
                : "Chọn nhu cầu trải nghiệm hoặc tìm nhanh tên địa điểm, suối, homestay"}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search place, waterfall, homestay..." : "Tìm tên địa điểm, suối, homestay..."}
              className="w-full rounded-2xl border border-forest/15 bg-white pl-10 pr-9 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink/40 shadow-xs transition focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition p-0.5 rounded-full hover:bg-beige"
                title={isEn ? "Clear search" : "Xóa tìm kiếm"}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (Horizontally scrollable on mobile) */}
        <nav
          className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
          aria-label={isEn ? "Destination Categories" : "Danh mục địa điểm"}
        >
          {DESTINATION_CATEGORIES.map((category) => {
            const isSelected = activeCategoryId === category.id;
            const count = categoryCounts[category.id] ?? 0;
            const IconComponent = category.icon;
            const label = isEn ? category.labelEn : category.labelVi;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelectCategory(category.id)}
                className={`group flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none ${
                  isSelected
                    ? "bg-forest text-white shadow-md shadow-forest/20 ring-2 ring-forest/20 scale-[1.02]"
                    : "bg-white text-ink/75 hover:bg-beige/80 hover:text-forest border border-forest/10 shadow-xs"
                }`}
              >
                <IconComponent
                  className={`size-4 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-amber-300" : "text-forest"
                  }`}
                />
                <span>{label}</span>
                <span
                  className={`ml-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-forest/10 text-forest group-hover:bg-forest/15"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Filter Summary & Active Info */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 pt-4 text-xs">
          <div className="flex items-center gap-2 text-ink/75">
            <span className="font-semibold text-ink">
              {isEn ? activeGroup.labelEn : activeGroup.labelVi}:
            </span>
            <span className="text-ink/65 hidden sm:inline">
              {isEn ? activeGroup.descriptionEn : activeGroup.descriptionVi}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-forest bg-forest/10 px-3 py-1 rounded-full">
              {isEn
                ? `Showing ${filteredPlaces.length} destinations`
                : `Tìm thấy ${filteredPlaces.length} địa điểm`}
            </span>

            {(activeCategoryId !== "all" || searchQuery.trim()) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 font-bold text-clay hover:text-clay/80 transition underline cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>{isEn ? "Reset filters" : "Xóa bộ lọc"}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Place Cards Grid or Empty State */}
      <section className="section-shell pb-24 pt-4">
        {filteredPlaces.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.slug} place={place} />
            ))}
          </div>
        ) : (
          /* Friendly Empty State */
          <div className="rounded-3xl border border-dashed border-forest/20 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-forest/10 text-forest">
              <MapPinOff className="size-8 text-forest" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-ink">
              {isEn ? "No matching destinations found" : "Không tìm thấy địa điểm phù hợp"}
            </h3>
            <p className="mt-2 text-sm text-ink/60 max-w-md mx-auto">
              {searchQuery
                ? isEn
                  ? `No destinations matched "${searchQuery}". Please try another keyword or clear filters.`
                  : `Không có địa điểm nào phù hợp với từ khóa "${searchQuery}". Vui lòng thử từ khóa khác hoặc xóa bộ lọc.`
                : isEn
                ? "There are currently no destinations in this category."
                : "Hiện chưa có địa điểm nào trong danh mục này."}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-forest/90 transition cursor-pointer"
              >
                <Compass className="size-4" />
                <span>{isEn ? "View all destinations" : `Xem tất cả ${places.length} địa điểm`}</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
