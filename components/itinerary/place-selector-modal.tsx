"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, MapPin, Tag, Check, ArrowLeftRight, Plus, Star } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";
import type { Place } from "@/data/places";

interface PlaceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "swap" | "add";
  targetDayNumber: number;
  currentStopName?: string;
  places: Place[];
  onSelectPlace: (place: Place) => void;
  isEn?: boolean;
}

const CATEGORY_TABS = [
  { id: "all", label: "Tất cả", enLabel: "All" },
  { id: "waterfall-stream", label: "Thác & Suối", enLabel: "Waterfalls" },
  { id: "culture", label: "Văn hóa & Làng nghề", enLabel: "Culture" },
  { id: "food", label: "Ẩm thực bản địa", enLabel: "Food" },
  { id: "stay", label: "Homestay nhà sàn", enLabel: "Homestays" },
  { id: "visit", label: "Tham quan & Check-in", enLabel: "Sightseeing" },
  { id: "outdoor", label: "Dã ngoại sinh thái", enLabel: "Eco Nature" }
];

export function PlaceSelectorModal({
  isOpen,
  onClose,
  mode,
  targetDayNumber,
  currentStopName,
  places,
  onSelectPlace,
  isEn = false
}: PlaceSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setActiveCategory("all");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // Exclude hidden or deleted
      if (place.status === "hidden" || place.isDeleted) return false;

      // Category filter
      if (activeCategory !== "all") {
        if (activeCategory === "waterfall-stream" && place.category !== "waterfall-stream") return false;
        if (activeCategory === "culture" && place.category !== "culture" && place.category !== "experience") return false;
        if (activeCategory === "food" && place.category !== "food" && place.category !== "specialty") return false;
        if (activeCategory === "stay" && place.category !== "stay") return false;
        if (activeCategory === "visit" && place.category !== "visit" && place.category !== "play") return false;
        if (activeCategory === "outdoor" && place.category !== "outdoor" && place.category !== "community-tourism") return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = place.name.toLowerCase().includes(q);
        const matchSummary = (place.summary || "").toLowerCase().includes(q);
        const matchAddress = (place.address || "").toLowerCase().includes(q);
        const matchHighlights = (place.highlights || []).some((h) => h.toLowerCase().includes(q));
        if (!matchName && !matchSummary && !matchAddress && !matchHighlights) return false;
      }

      return true;
    });
  }, [places, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-forest/15 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-forest/10 bg-gradient-to-r from-forest/5 via-white to-amber-50/20">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider">
              {mode === "swap" ? (
                <>
                  <ArrowLeftRight className="size-3.5" />
                  <span>{isEn ? "Swap Destination" : "Đổi Điểm Đến Khác"}</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>{isEn ? `Add to Day 0${targetDayNumber}` : `Thêm Điểm Đến Vào Ngày 0${targetDayNumber}`}</span>
                </>
              )}
            </div>
            <h3 className="mt-1 text-lg sm:text-xl font-black text-ink">
              {mode === "swap" ? (
                <span>{isEn ? `Replace: ${currentStopName || "Current Stop"}` : `Thay thế: ${currentStopName || "Điểm hiện tại"}`}</span>
              ) : (
                <span>{isEn ? `Choose a place for Day 0${targetDayNumber}` : `Chọn địa điểm thêm vào Ngày 0${targetDayNumber}`}</span>
              )}
            </h3>
            <p className="mt-0.5 text-xs text-ink/60">
              {mode === "swap"
                ? (isEn ? "Select another authentic spot in A Luoi to swap into this timeslot." : "Chọn một địa điểm khác tại A Lưới để thay vào khung giờ này.")
                : (isEn ? "Select a place to enrich your highland journey." : "Chọn địa điểm từ danh bạ Chạm A Lưới để bổ sung vào lịch trình.")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/50 hover:bg-forest/10 hover:text-forest transition"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 sm:p-5 border-b border-forest/10 space-y-3 bg-[#FAF9F5]">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search waterfalls, homestays, villages..." : "Tìm tên điểm đến, thác suối, homestay, bản làng..."}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-forest/20 bg-white text-xs sm:text-sm font-medium text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {CATEGORY_TABS.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? "bg-forest text-white shadow-xs"
                      : "bg-white text-ink/70 border border-forest/15 hover:bg-forest/5 hover:text-forest"
                  }`}
                >
                  {isEn ? cat.enLabel : cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Places List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-forest/10">
          {filteredPlaces.length === 0 ? (
            <div className="py-12 text-center text-ink/50 space-y-2">
              <MapPin className="mx-auto size-10 text-ink/30" />
              <p className="text-sm font-semibold">
                {isEn ? "No matching destinations found" : "Không tìm thấy địa điểm phù hợp"}
              </p>
              <p className="text-xs text-ink/40">
                {isEn ? "Try searching with a different keyword or category." : "Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác."}
              </p>
            </div>
          ) : (
            filteredPlaces.map((p) => {
              return (
                <div
                  key={p.slug}
                  className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl hover:bg-forest/5 transition group"
                >
                  <div className="flex items-start gap-3 w-full sm:w-auto flex-1">
                    <div className="relative size-16 sm:size-20 shrink-0 rounded-xl overflow-hidden border border-forest/15 shadow-2xs">
                      <AppImage
                        src={p.image || "/images/aluoi/thac-a-nor.jpg"}
                        alt={p.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded-md">
                          {p.category}
                        </span>
                        {p.rating && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Star className="size-2.5 fill-amber-500 text-amber-500" />
                            {p.rating}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 text-sm font-extrabold text-ink line-clamp-1 group-hover:text-forest transition">
                        {p.name}
                      </h4>
                      <p className="text-xs text-ink/60 line-clamp-2 mt-0.5">
                        {p.summary || p.address}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPlace(p)}
                    className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-forest text-white hover:bg-forest-light px-4 py-2 text-xs font-bold shadow-xs transition hover:scale-105 active:scale-95"
                  >
                    <Check className="size-3.5" />
                    <span>{mode === "swap" ? (isEn ? "Swap into plan" : "Chọn điểm này") : (isEn ? "Add to plan" : "Thêm vào lịch trình")}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-forest/10 bg-white flex items-center justify-between text-xs text-ink/50">
          <span>
            {isEn ? `${filteredPlaces.length} destinations available` : `Hiện có ${filteredPlaces.length} địa điểm sẵn sàng`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-forest hover:underline"
          >
            {isEn ? "Cancel" : "Đóng"}
          </button>
        </div>
      </div>
    </div>
  );
}
