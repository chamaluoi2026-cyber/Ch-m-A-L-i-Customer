"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  MapPin,
  Clock,
  Navigation,
  Sparkles,
  Share2,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Luggage,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag,
  Car,
  Utensils,
  Home,
  Ticket,
  CloudSun,
  Thermometer,
  Eye,
  ArrowLeftRight,
  Trash2,
  PlusCircle,
  Undo2
} from "lucide-react";
import { ItineraryPlan, ItineraryStop } from "@/lib/highland-itinerary-engine";
import { useLanguage } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { AppImage } from "@/components/ui/app-image";
import { formatCurrency } from "@/lib/utils";
import { places as staticPlaces, type Place } from "@/data/places";
import { fetchAllPlacesAction } from "@/app/actions/places";
import { PlaceSelectorModal } from "./place-selector-modal";

interface HighlandItineraryViewProps {
  plan: ItineraryPlan;
  onReset: () => void;
}

function placeToItineraryStop(place: Place, defaultTimeSlot: string, isEn: boolean): ItineraryStop {
  const catLabelMap: Record<string, string> = {
    food: isEn ? "Dining" : "Ăn uống",
    stay: isEn ? "Homestay" : "Lưu trú",
    "waterfall-stream": isEn ? "Waterfalls & Streams" : "Thác & Suối",
    culture: isEn ? "Heritage & Craft" : "Văn hóa",
    visit: isEn ? "Sightseeing" : "Tham quan",
    outdoor: isEn ? "Outdoors & Eco" : "Dã ngoại",
    experience: isEn ? "Local Experience" : "Trải nghiệm",
    campfire: isEn ? "Campfire Night" : "Lửa trại",
    play: isEn ? "Recreation" : "Vui chơi"
  };

  return {
    id: `custom-stop-${place.slug}-${Date.now()}`,
    timeSlot: defaultTimeSlot,
    name: place.name,
    enName: place.name,
    slug: place.slug,
    category: catLabelMap[place.category] || (isEn ? "Sightseeing" : "Tham quan"),
    image: place.image || "/images/aluoi/thac-a-nor.jpg",
    duration: "1.5 - 2 giờ",
    distanceFromPrev: "~3-5 km",
    summary: place.summary || place.description?.slice(0, 150) || (isEn ? "Authentic highland destination in A Luoi." : "Điểm đến trải nghiệm đặc sắc tại A Lưới."),
    enSummary: place.summary || (isEn ? "Authentic highland destination in A Luoi." : "Điểm đến trải nghiệm đặc sắc tại A Lưới."),
    wisdomTip: place.highlights?.[0] || "Khuyên mang theo giày chống trượt và đồ dùng cá nhân gọn nhẹ.",
    enWisdomTip: place.highlights?.[0] || "Bring non-slip shoes and light travel gear.",
    energyLevel: "easy",
    googleMapsQuery: `${place.name} A Lưới Thừa Thiên Huế`,
    stopType: place.category === "stay" ? "checkin" : place.category === "food" ? "meal" : "visit",
    mustTry: place.highlights?.slice(0, 2)
  };
}

export function HighlandItineraryView({ plan, onReset }: HighlandItineraryViewProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"timeline" | "safety">("timeline");
  const [copied, setCopied] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Interactive Itinerary State
  const [currentPlan, setCurrentPlan] = useState<ItineraryPlan>(plan);
  const [originalPlan] = useState<ItineraryPlan>(plan);
  const [isCustomized, setIsCustomized] = useState<boolean>(false);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>(staticPlaces);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "swap" | "add";
    dayIndex: number;
    stopIndex?: number;
    currentStopName?: string;
  }>({
    isOpen: false,
    mode: "swap",
    dayIndex: 0
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isEn = language === "en";

  // Sync state if initial prop changes
  useEffect(() => {
    setCurrentPlan(plan);
    setIsCustomized(false);
  }, [plan]);

  // Load dynamic places from DB
  useEffect(() => {
    fetchAllPlacesAction()
      .then((places) => {
        if (places && places.length > 0) {
          setAvailablePlaces(places);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleBookCustomTour = () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("chamaluoi_custom_tour_plan", JSON.stringify(currentPlan));
      }
    } catch (e) {
      console.warn("sessionStorage save error:", e);
    }
    router.push("/book-tour/custom");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Stop Action Handlers
  const openSwapModal = (dayIndex: number, stopIndex: number, stop: ItineraryStop) => {
    setModalState({
      isOpen: true,
      mode: "swap",
      dayIndex,
      stopIndex,
      currentStopName: isEn ? stop.enName : stop.name
    });
  };

  const openAddModal = (dayIndex: number) => {
    setModalState({
      isOpen: true,
      mode: "add",
      dayIndex
    });
  };

  const handleSelectPlace = (place: Place) => {
    const dayIdx = modalState.dayIndex;
    if (modalState.mode === "swap" && typeof modalState.stopIndex === "number") {
      const stopIdx = modalState.stopIndex;
      const newPlan = { ...currentPlan };
      const targetDay = { ...newPlan.days[dayIdx] };
      const oldStop = targetDay.stops[stopIdx];
      const newStop = placeToItineraryStop(place, oldStop.timeSlot, isEn);
      newStop.timeSlot = oldStop.timeSlot;
      targetDay.stops = [
        ...targetDay.stops.slice(0, stopIdx),
        newStop,
        ...targetDay.stops.slice(stopIdx + 1)
      ];
      newPlan.days = [
        ...newPlan.days.slice(0, dayIdx),
        targetDay,
        ...newPlan.days.slice(dayIdx + 1)
      ];
      setCurrentPlan(newPlan);
      setIsCustomized(true);
      try {
        sessionStorage.setItem("chamaluoi_custom_tour_plan", JSON.stringify(newPlan));
      } catch {}
      setToastMsg(isEn ? `Swapped to "${place.name}"!` : `Đã đổi thành "${place.name}"!`);
      setModalState((prev) => ({ ...prev, isOpen: false }));
    } else if (modalState.mode === "add") {
      const newPlan = { ...currentPlan };
      const targetDay = { ...newPlan.days[dayIdx] };
      const stopCount = targetDay.stops.length;
      const defaultSlots = ["08:00 - 09:30", "10:00 - 11:30", "13:30 - 15:00", "15:30 - 17:00", "18:00 - 20:00"];
      const assignedSlot = defaultSlots[Math.min(stopCount, defaultSlots.length - 1)] || "16:00 - 17:30";
      const newStop = placeToItineraryStop(place, assignedSlot, isEn);
      targetDay.stops = [...targetDay.stops, newStop];
      newPlan.days = [
        ...newPlan.days.slice(0, dayIdx),
        targetDay,
        ...newPlan.days.slice(dayIdx + 1)
      ];
      setCurrentPlan(newPlan);
      setIsCustomized(true);
      try {
        sessionStorage.setItem("chamaluoi_custom_tour_plan", JSON.stringify(newPlan));
      } catch {}
      setToastMsg(isEn ? `Added "${place.name}" to Day 0${dayIdx + 1}!` : `Đã thêm "${place.name}" vào Ngày 0${dayIdx + 1}!`);
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleRemoveStop = (dayIdx: number, stopIdx: number) => {
    const stopToRemove = currentPlan.days[dayIdx]?.stops[stopIdx];
    if (!stopToRemove) return;
    const newPlan = { ...currentPlan };
    const targetDay = { ...newPlan.days[dayIdx] };
    targetDay.stops = targetDay.stops.filter((_, idx) => idx !== stopIdx);
    newPlan.days = [
      ...newPlan.days.slice(0, dayIdx),
      targetDay,
      ...newPlan.days.slice(dayIdx + 1)
    ];
    setCurrentPlan(newPlan);
    setIsCustomized(true);
    try {
      sessionStorage.setItem("chamaluoi_custom_tour_plan", JSON.stringify(newPlan));
    } catch {}
    setToastMsg(isEn ? `Removed "${stopToRemove.name}" from route` : `Đã bỏ điểm "${stopToRemove.name}" khỏi lịch trình`);
  };

  const handleRestoreOriginal = () => {
    setCurrentPlan(originalPlan);
    setIsCustomized(false);
    try {
      sessionStorage.setItem("chamaluoi_custom_tour_plan", JSON.stringify(originalPlan));
    } catch {}
    setToastMsg(isEn ? "Restored original AI plan!" : "Đã khôi phục lịch trình gốc của AI!");
  };

  const energyLabels = {
    easy: isEn ? "Gentle Healing (Level 1)" : "Nhẹ nhàng & Chữa lành (Cấp 1)",
    moderate: isEn ? "Balanced Scenic (Level 2)" : "Vừa sức, thư thái (Cấp 2)",
    challenging: isEn ? "Active Explorer (Level 3)" : "Khám phá & Thử thách (Cấp 3)"
  };

  const energyColors = {
    easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
    moderate: "text-amber-700 bg-amber-50 border-amber-200",
    challenging: "text-rose-700 bg-rose-50 border-rose-200"
  };

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Highland Passport Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-forest/15 bg-gradient-to-br from-[#0D3B30] via-[#114E40] to-[#1A382F] p-6 text-white shadow-xl md:p-8">
        {/* Subtle Zèng Pattern Accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-rose-400 opacity-80"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isEn ? "Bespoke Highland Journal" : "Sổ Tay Viễn Du Đại Ngàn"}</span>
              </div>
              {isCustomized && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200 animate-in fade-in duration-200">
                  <span>✨ {isEn ? "Customized by you" : "Lịch trình đã tùy chỉnh"}</span>
                  <button
                    type="button"
                    onClick={handleRestoreOriginal}
                    className="ml-1 underline text-amber-300 hover:text-white transition"
                    title={isEn ? "Restore original AI plan" : "Khôi phục lịch trình ban đầu của AI"}
                  >
                    ({isEn ? "Restore" : "Khôi phục gốc"})
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl lg:text-4xl">
              {isEn ? currentPlan.enTitle : currentPlan.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
              {isEn
                ? "Crafted by AI using your unique passions & comfort constraints. Fully clustered along mountain passes for a fluid, effortless ride."
                : "Hành trình cá nhân hóa được AI tự động điều chỉnh theo sở thích và điều muốn tránh của bạn, tối ưu từng chặng đèo QL49."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              {copied ? t.common.copied : t.common.share}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Printer className="mr-1.5 h-4 w-4" />
              {t.common.print}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onReset}
              className="bg-amber-500 font-bold text-ink hover:bg-amber-400"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              {t.common.editQuiz}
            </Button>
          </div>
        </div>

        {/* 6 Metric Chips */}
        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
            <span className="text-xs font-medium text-white/65">
              {t.itinerary.totalDistance}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-amber-300">~{plan.totalDistanceKm}</span>
              <span className="text-xs text-white/70">km</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
            <span className="text-xs font-medium text-white/65">
              {t.itinerary.energyLevel}
            </span>
            <div className="mt-1">
              <span className="inline-block rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                {energyLabels[plan.energyRating]}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
            <span className="text-xs font-medium text-white/65">
              {t.itinerary.estBudget}
            </span>
            <div className="mt-1">
              <span className="text-lg font-extrabold text-amber-300">
                ~{formatCurrency(plan.estBudgetPerPerson)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
            <span className="text-xs font-medium text-white/65">
              {t.itinerary.stopsCount}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-emerald-300">
                {plan.days.reduce((acc, d) => acc + d.stops.length, 0)}
              </span>
              <span className="text-xs text-white/70">
                {isEn ? "stops" : "trạm dừng"}
              </span>
            </div>
          </div>

          {plan.departureDate && (
            <div className="rounded-2xl border border-sky-400/30 bg-sky-400/10 p-3.5 backdrop-blur-xs">
              <span className="text-xs font-medium text-sky-200/80">
                {isEn ? "Departure Date" : "Ngày khởi hành"}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-sky-300">
                  {plan.days[0]?.dateLabel?.split(", ")?.[1] || plan.departureDate}
                </span>
              </div>
            </div>
          )}

          {plan.departureTime && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3.5 backdrop-blur-xs">
              <span className="text-xs font-medium text-amber-200/80">
                {isEn ? "Departs Hue" : "Xuất phát lúc"}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-amber-300">{plan.departureTime}</span>
              </div>
            </div>
          )}
        </div>


        {/* Google Gemini AI & Highland Weather Advisory Card */}
        {plan.weatherAdvisory && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-amber-300/30 bg-gradient-to-br from-white/10 via-amber-400/5 to-white/5 p-5 text-white backdrop-blur-md">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                    {isEn ? "AI Highland Climate & Route Advisory" : "Cố Vấn Khí Hậu & Lộ Trình Thông Minh Từ AI"}
                  </h3>
                  <p className="text-[11px] text-white/60">
                    {isEn ? "Synchronized with Open-Meteo & Gemini 2.5 Flash" : "Đồng bộ dữ liệu thời tiết thực & Gemini 2.5 Flash"}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-200">
                  <CloudSun className="h-3 w-3" />
                  <span>{isEn ? plan.weatherAdvisory.enSeasonName : plan.weatherAdvisory.seasonName}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-200">
                  <Thermometer className="h-3 w-3" />
                  <span>{plan.weatherAdvisory.tempRange}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                  <Eye className="h-3 w-3" />
                  <span>
                    {isEn
                      ? `Cloud Hunting: ${plan.weatherAdvisory.cloudHuntingRating === "excellent" ? "Prime 95%" : "Fair"}`
                      : `Săn mây: ${plan.weatherAdvisory.cloudHuntingRating === "excellent" ? "Đỉnh cao (06:15)" : "Khá tốt"}`}
                  </span>
                </span>
              </div>
            </div>

            {/* AI Personalized Insight Text */}
            {(plan.geminiIntro || plan.weatherAdvisory.conditionSummary) && (
              <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-3.5">
                <p className="text-xs leading-relaxed text-white/90">
                  <strong className="text-amber-300">
                    {isEn ? "🤖 AI Recommendation: " : "🤖 Nhận định của Cố Vấn AI: "}
                  </strong>
                  "{isEn ? (plan.enGeminiIntro || plan.geminiIntro || plan.weatherAdvisory.enConditionSummary) : (plan.geminiIntro || plan.weatherAdvisory.conditionSummary)}"
                </p>
              </div>
            )}

            {/* 2-Column Actionable Grid */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* Col 1: Road & Weather Alerts */}
              <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{isEn ? "Pass 49 & River Alerts" : "Cảnh Báo Đèo QL49 & Nước Suối"}</span>
                </div>
                <ul className="mt-2 space-y-1.5 text-xs text-rose-100/90">
                  {(isEn ? (plan.weatherAdvisory.enAiAlerts || plan.weatherAdvisory.aiAlerts) : plan.weatherAdvisory.aiAlerts).map((alert, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Adaptive Route Changes */}
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{isEn ? "Weather-Adaptive Plan Adjustments" : "Lịch Trình Đã Được AI Thích Ứng Như Thế Nào"}</span>
                </div>
                <ul className="mt-2 space-y-1.5 text-xs text-emerald-100/90">
                  {(isEn ? (plan.weatherAdvisory.enAdaptiveActions || plan.weatherAdvisory.adaptiveActions) : plan.weatherAdvisory.adaptiveActions).map((act, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Special AI Voucher Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/25 via-emerald-500/20 to-teal-500/25 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-amber-400 text-ink grid place-items-center text-xl shrink-0 shadow-sm font-bold">
              🎁
            </div>
            <div>
              <p className="font-extrabold text-white text-sm flex items-center gap-2">
                <span>{isEn ? "Special Gift for Your AI Itinerary" : "Đặc quyền quà tặng cho Lịch trình của bạn"}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-ink font-black text-[10px] uppercase">
                  Giảm 10%
                </span>
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                {isEn
                  ? "Use voucher code for any homestay, local feast or eco-tour in this trip."
                  : "Mã ưu đãi áp dụng trực tiếp khi đặt phòng homestay, mâm cỗ hoặc tour trong lịch trình này."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 font-mono font-bold text-amber-300 text-xs tracking-wider select-all">
              CAL-AI-10OFF
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText("CAL-AI-10OFF");
                  setCopiedVoucher(true);
                  setTimeout(() => setCopiedVoucher(false), 2500);
                }
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-ink font-extrabold text-xs transition shadow-sm active:scale-95"
            >
              {copiedVoucher ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-800" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Ticket size={14} />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
            <a
              href="https://zalo.me/0905000118"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-sm"
            >
              Đặt tour Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-forest/15 pb-2 print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "timeline"
              ? "bg-forest text-white shadow-md"
              : "text-ink/70 hover:bg-forest/10 hover:text-forest"
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>{t.itinerary.timelineTab}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("safety")}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "safety"
              ? "bg-forest text-white shadow-md"
              : "text-ink/70 hover:bg-forest/10 hover:text-forest"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{t.itinerary.tipsTab}</span>
        </button>
      </div>

      {/* TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="space-y-10">
          {currentPlan.days.map((day, dayIdx) => (
            <section
              key={day.dayNumber}
              className="space-y-4 rounded-3xl border border-forest/10 bg-white p-5 shadow-card sm:p-7"
            >
              {/* Day Header Banner */}
              <div className="flex flex-col gap-1 border-b border-forest/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-forest">
                    <span>{isEn ? `DAY 0${day.dayNumber}` : `NGÀY 0${day.dayNumber}`}</span>
                    {day.dateLabel && (
                      <span className="rounded-md bg-forest/10 px-2.5 py-0.5 text-[11px] font-bold text-forest">
                        {isEn ? day.enDateLabel : day.dateLabel}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-ink sm:text-2xl">
                    {isEn ? day.enTitle : day.title}
                  </h2>
                </div>
                <p className="text-xs font-medium text-ink/65 sm:text-sm">
                  {isEn ? day.enTheme : day.theme}
                </p>
              </div>

              {/* Stops River Flow */}
              <div className="relative space-y-6 pt-2">
                {/* River Flow Line */}
                <div
                  className="absolute bottom-6 left-6 top-6 hidden w-0.5 bg-gradient-to-b from-forest via-emerald-400 to-amber-500 md:block"
                  aria-hidden="true"
                />

                {day.stops.map((stop, sIdx) => {
                  const isEatery = stop.category === "Ăn uống";
                  const isHomestay = stop.category === "Lưu trú" || stop.category === "Lửa trại";
                  const isTravelLeg = stop.isTravelLeg || stop.category === "Di chuyển";
                  const isCheckin = stop.stopType === "checkin";
                  const isCheckout = stop.stopType === "checkout";
                  const isRest = stop.stopType === "rest";
                  const isBreakfast = stop.stopType === "breakfast";
                  const isCoffee = stop.stopType === "coffee";

                  const cardClass = isCheckin
                    ? "border-teal-300 bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-white shadow-sm"
                    : isCheckout
                    ? "border-slate-300 bg-gradient-to-br from-slate-50/90 to-white shadow-sm"
                    : isRest
                    ? "border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-sky-50/50 shadow-sm"
                    : isBreakfast
                    ? "border-orange-200 bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-white shadow-sm"
                    : isCoffee
                    ? "border-amber-300 bg-gradient-to-br from-amber-50/80 via-yellow-50/40 to-white shadow-sm"
                    : isTravelLeg
                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white shadow-sm"
                    : "border-forest/10 bg-[#FAF9F5] hover:border-forest/30 hover:bg-white hover:shadow-md";

                  const dotClass = isCheckin
                    ? "bg-teal-600 text-white"
                    : isCheckout
                    ? "bg-slate-500 text-white"
                    : isRest
                    ? "bg-indigo-500 text-white"
                    : isBreakfast
                    ? "bg-orange-500 text-white"
                    : isCoffee
                    ? "bg-amber-600 text-white"
                    : isTravelLeg
                    ? "bg-emerald-600 text-white"
                    : "bg-forest text-white";

                  return (
                    <article
                      key={stop.id}
                      className={`relative flex flex-col gap-4 rounded-2xl border p-4 transition-all md:ml-12 md:p-5 ${cardClass}`}
                    >
                      {/* Special top-banner for checkin / checkout / rest / breakfast / coffee */}
                      {(isCheckin || isCheckout || isRest || isBreakfast || isCoffee) && (
                        <div className={`-mx-4 -mt-4 mb-2 flex items-center gap-2 rounded-t-2xl px-4 py-2 text-xs font-extrabold uppercase tracking-widest ${
                          isCheckin
                            ? "bg-teal-600 text-white"
                            : isCheckout
                            ? "bg-slate-500 text-white"
                            : isBreakfast
                            ? "bg-orange-500 text-white"
                            : isCoffee
                            ? "bg-amber-600 text-white"
                            : "bg-indigo-500 text-white"
                        }`}>
                          {isCheckin && <span>🏨 {isEn ? "CHECK-IN · NHẬN PHÒNG" : "CHECK-IN · NHẬN PHÒNG HOMESTAY"}</span>}
                          {isCheckout && <span>🚪 {isEn ? "CHECK-OUT · DEPARTURE" : "CHECK-OUT · TRẢ PHÒNG"}</span>}
                          {isRest && <span>🛌 {isEn ? "REST & RECHARGE" : "NGHỈ NGƠI & THƯ GIÃN"}</span>}
                          {isBreakfast && <span>🍚 {isEn ? "BREAKFAST · ĂN SÁNG VÙNG CAO" : "BỮA SÁNG ĐẶC SẢN VÙNG CAO"}</span>}
                          {isCoffee && <span>☕ {isEn ? "HIGHLAND COFFEE BREAK" : "CÀ PHÊ VÙNG CAO"}</span>}
                        </div>
                      )}

                      {/* Stepper Dot on the River Line */}
                      <div
                        className={`absolute -left-[3.25rem] top-6 hidden h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-xs md:flex ${dotClass}`}
                        aria-hidden="true"
                      >
                        {sIdx + 1}
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Image Thumbnail */}
                        <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-48">
                          <AppImage
                            src={stop.image}
                            alt={stop.name}
                            fill
                            className="object-cover transition duration-300 hover:scale-105"
                          />
                          <div className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-xs ${
                            isTravelLeg ? "bg-emerald-700/80" : "bg-black/60"
                          }`}>
                            {isTravelLeg ? "🚗 Di chuyển" : stop.category}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-forest">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{stop.timeSlot}</span>
                              <span className="text-ink/30">•</span>
                              <span>{stop.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                  energyColors[stop.energyLevel]
                                }`}
                              >
                                {energyLabels[stop.energyLevel]}
                              </span>

                              {/* Interactive Stop Actions: Swap or Remove */}
                              {!isTravelLeg && (
                                <div className="flex items-center gap-1.5 print:hidden">
                                  <button
                                    type="button"
                                    onClick={() => openSwapModal(dayIdx, sIdx, stop)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-forest/25 bg-white hover:bg-forest/5 px-2 py-1 text-[11px] font-bold text-forest shadow-2xs transition hover:scale-105 active:scale-95"
                                    title={isEn ? "Swap this destination" : "Đổi điểm đến khác"}
                                  >
                                    <ArrowLeftRight className="size-3 text-forest" />
                                    <span>{isEn ? "Swap" : "Đổi điểm"}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveStop(dayIdx, sIdx)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-700 shadow-2xs transition hover:scale-105 active:scale-95"
                                    title={isEn ? "Remove this stop from route" : "Bỏ điểm này khỏi lịch trình"}
                                  >
                                    <Trash2 className="size-3 text-rose-600" />
                                    <span>{isEn ? "Remove" : "Bỏ bớt"}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <h3 className="text-lg font-extrabold text-ink">
                            {isEn ? stop.enName : stop.name}
                          </h3>

                          <p className="text-sm leading-relaxed text-ink/75">
                            {isEn ? stop.enSummary : stop.summary}
                          </p>

                          {/* Local Wisdom Box */}
                          <div className="rounded-xl border border-amber-300/40 bg-amber-50/70 p-3 text-xs text-amber-950">
                            <strong className="font-bold text-amber-900">
                              💡 {t.itinerary.localWisdom}{" "}
                            </strong>
                            <span>{isEn ? stop.enWisdomTip : stop.wisdomTip}</span>
                          </div>

                          {/* Distance & Action Links - High Conversion */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <span className="text-xs text-ink/55">
                              {t.itinerary.distanceFromPrev}: <strong className="text-ink/80">{stop.distanceFromPrev}</strong>
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Direct Google Maps */}
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  stop.googleMapsQuery
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-forest/20 bg-white px-2.5 py-1.5 text-xs font-semibold text-forest shadow-2xs hover:bg-forest/5"
                              >
                                <Navigation className="h-3.5 w-3.5" />
                                <span>{t.itinerary.openInMaps}</span>
                                <ExternalLink className="h-3 w-3 opacity-60" />
                              </a>

                              {/* Conversion CTA: Get Voucher / Book Homestay / Book Table */}
                              <Link
                                href={`/places/${stop.slug}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-forest-light"
                              >
                                {isHomestay ? (
                                  <>
                                    <Home className="h-3.5 w-3.5 text-amber-300" />
                                    <span>{isEn ? "Book Homestay / Voucher" : "Đặt phòng & Nhận Voucher"}</span>
                                  </>
                                ) : isEatery ? (
                                  <>
                                    <Utensils className="h-3.5 w-3.5 text-amber-300" />
                                    <span>{isEn ? "Book Table & Voucher" : "Đặt bàn & Nhận Voucher"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Ticket className="h-3.5 w-3.5 text-amber-300" />
                                    <span>{isEn ? "Get Voucher & Chat Zalo" : "Nhận Voucher & Chat Zalo"}</span>
                                  </>
                                )}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* MustTry Chips */}
                      {stop.mustTry && stop.mustTry.length > 0 && (
                        <div className="mt-1 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-700">
                            {isEn ? "✨ Nhất định phải thử" : "✨ Nhất định phải thử"}
                          </p>
                          <ul className="space-y-1">
                            {(isEn ? (stop.enMustTry ?? stop.mustTry) : stop.mustTry).map((tip, ti) => (
                              <li key={ti} className="flex items-start gap-1.5 text-xs text-amber-900">
                                <span className="mt-0.5 shrink-0 text-amber-500">›</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </article>
                  );
                })}

                {/* Dotted button to add destination to this day */}
                <div className="pt-2 flex justify-center sm:justify-start md:ml-12 print:hidden">
                  <button
                    type="button"
                    onClick={() => openAddModal(dayIdx)}
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-forest/30 bg-forest/5 hover:bg-forest/10 hover:border-forest/50 px-4 py-2.5 text-xs font-bold text-forest transition group shadow-2xs hover:scale-102 active:scale-98"
                  >
                    <PlusCircle className="size-4 text-forest transition-transform group-hover:scale-110" />
                    <span>{isEn ? `+ Add destination to Day 0${day.dayNumber}` : `+ Thêm địa điểm vào Ngày 0${day.dayNumber}`}</span>
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* SAFETY & LOCAL CULTURE TAB */}
      {activeTab === "safety" && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Safety & Mountain pass */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2.5 text-amber-900">
              <div className="rounded-full bg-amber-200/70 p-2">
                <AlertTriangle className="h-5 w-5 text-amber-800" />
              </div>
              <h3 className="text-lg font-bold">
                {t.itinerary.safetyTitle}
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-amber-950">
              {(isEn ? plan.enSafetyTips : plan.safetyTips).map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-amber-600">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Cultural rules */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2.5 text-emerald-900">
              <div className="rounded-full bg-emerald-200/70 p-2">
                <HeartHandshake className="h-5 w-5 text-emerald-800" />
              </div>
              <h3 className="text-lg font-bold">
                {t.itinerary.cultureTitle}
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-emerald-950">
              {(isEn ? plan.enCulturalRules : plan.culturalRules).map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Packing checklist */}
          <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2.5 text-blue-900">
              <div className="rounded-full bg-blue-200/70 p-2">
                <Luggage className="h-5 w-5 text-blue-800" />
              </div>
              <h3 className="text-lg font-bold">
                {t.itinerary.packingTitle}
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-blue-950">
              {(isEn ? plan.enPackingList : plan.packingList).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* HIGH-CONVERTING TOUR UPSELL BANNER */}
      <div className="overflow-hidden rounded-3xl border border-amber-300/40 bg-gradient-to-r from-forest via-[#115444] to-[#8C4623] p-6 text-white shadow-lg sm:p-8 print:hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <Car className="h-3.5 w-3.5" />
              <span>{isEn ? "Turn This Plan Into A Private Guided Tour" : "Gói Tour Riêng Trọn Gói Theo Lịch Trình Này"}</span>
            </div>
            <h3 className="text-xl font-black text-white sm:text-2xl">
              {isEn
                ? "Prefer not to drive mountain passes yourself?"
                : "Thích lịch trình này nhưng ngại tự lái xe hay lo đường đèo dốc?"}
            </h3>
            <p className="max-w-2xl text-sm leading-relaxed text-white/85">
              {isEn
                ? "Let Chạm A Lưới handle everything: roundtrip private transport from Hue, confirmed stilt-house homestay, and authentic local meals following this exact custom itinerary."
                : "Để Chạm A Lưới lo trọn gói: xe ô tô 7-16 chỗ đón tận nơi từ TP. Huế, giữ sẵn phòng homestay nhà sàn ven suối và chuẩn bị trước các bữa ăn đặc sản theo đúng lịch trình bạn vừa tạo."}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              type="button"
              onClick={handleBookCustomTour}
              size="lg"
              className="rounded-full bg-amber-400 font-extrabold text-ink shadow-md hover:bg-amber-300 transition-all hover:scale-105"
            >
              <span>{isEn ? "Book This Custom Tour Now" : "Đặt Tour Theo Lịch Trình Này"}</span>
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Utility & Action Bar (Phương án 2: Tiện ích & Tùy biến linh hoạt) */}
      <div className="rounded-3xl border border-forest/15 bg-white p-6 sm:p-7 shadow-card space-y-5 print:hidden mb-12 sm:mb-8">
        {/* Hàng 1: Bộ công cụ tiện ích đồng hành cùng du khách */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-forest">
            <Sparkles className="size-4 text-amber-500" />
            <span>{isEn ? "Traveler Toolkit & Route Actions" : "Tiện ích đồng hành & Công cụ lịch trình"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-forest/25 text-forest hover:bg-forest/5 text-xs font-bold rounded-xl h-9"
            >
              <Printer className="mr-1.5 size-3.5" />
              <span>{isEn ? "Print / Save PDF" : "In / Lưu PDF"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-forest/25 text-forest hover:bg-forest/5 text-xs font-bold rounded-xl h-9"
            >
              <Share2 className="mr-1.5 size-3.5" />
              <span>{copied ? (isEn ? "Link Copied!" : "Đã sao chép link!") : (isEn ? "Share Route" : "Chia sẻ lịch trình")}</span>
            </Button>

            {isCustomized && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRestoreOriginal}
                className="border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-bold rounded-xl h-9"
                title={isEn ? "Revert to initial AI recommendation" : "Khôi phục lại lịch trình ban đầu của AI"}
              >
                <Undo2 className="mr-1.5 size-3.5" />
                <span>{isEn ? "Reset to AI Plan" : "Khôi phục gợi ý gốc của AI"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Hàng 2: Điều hướng tùy biến & Khám phá địa điểm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left max-w-xl">
            <h4 className="font-extrabold text-ink text-sm sm:text-base">
              {isEn ? "Want to adjust your trip rhythm?" : "Bạn muốn điều chỉnh lại theo ý mình?"}
            </h4>
            <p className="text-xs text-ink/65 mt-0.5 leading-relaxed">
              {isEn
                ? "You can customize your questionnaire answers, or directly swap, remove, and add destinations on each day above."
                : "Có thể tùy chỉnh lại tiêu chí câu hỏi ban đầu, hoặc linh hoạt đổi điểm / bỏ bớt / thêm điểm ngay ở từng ngày phía trên."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="border-forest/30 text-forest hover:bg-forest hover:text-white rounded-2xl font-bold text-xs px-4 py-2.5 h-10"
            >
              <RotateCcw className="mr-1.5 size-3.5" />
              <span>{isEn ? "Adjust Questionnaire" : "Tùy chỉnh lại tiêu chí"}</span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white rounded-2xl font-bold text-xs px-4 py-2.5 h-10"
            >
              <Link href="/places">
                <Compass className="mr-1.5 size-3.5" />
                <span>{isEn ? "Explore 40+ Places" : "Khám phá danh bạ địa điểm"}</span>
                <ChevronRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Place Selector Modal (Swap / Add destination) */}
      <PlaceSelectorModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        mode={modalState.mode}
        targetDayNumber={modalState.dayIndex + 1}
        currentStopName={modalState.currentStopName}
        places={availablePlaces}
        onSelectPlace={handleSelectPlace}
        isEn={isEn}
      />

      {/* Toast Feedback Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-xs font-bold text-white shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="size-4 text-amber-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}