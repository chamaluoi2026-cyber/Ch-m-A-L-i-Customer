"use client";

import { useState } from "react";
import Link from "next/link";
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
  Ticket
} from "lucide-react";
import { ItineraryPlan } from "@/lib/highland-itinerary-engine";
import { useLanguage } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { AppImage } from "@/components/ui/app-image";
import { formatCurrency } from "@/lib/utils";

interface HighlandItineraryViewProps {
  plan: ItineraryPlan;
  onReset: () => void;
}

export function HighlandItineraryView({ plan, onReset }: HighlandItineraryViewProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"timeline" | "safety">("timeline");
  const [copied, setCopied] = useState(false);

  const isEn = language === "en";

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
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isEn ? "Bespoke Highland Journal" : "Sổ Tay Viễn Du Đại Ngàn"}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl lg:text-4xl">
              {isEn ? plan.enTitle : plan.title}
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

        {/* 4 Metric Chips */}
        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
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
          {plan.days.map((day) => (
            <section
              key={day.dayNumber}
              className="space-y-4 rounded-3xl border border-forest/10 bg-white p-5 shadow-card sm:p-7"
            >
              {/* Day Header Banner */}
              <div className="flex flex-col gap-1 border-b border-forest/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-forest">
                    <span>{isEn ? `DAY 0${day.dayNumber}` : `NGÀY 0${day.dayNumber}`}</span>
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

                  return (
                    <article
                      key={stop.id}
                      className={`relative flex flex-col gap-4 rounded-2xl border p-4 transition-all md:ml-12 md:p-5 ${
                        isTravelLeg
                          ? "border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white shadow-sm"
                          : "border-forest/10 bg-[#FAF9F5] hover:border-forest/30 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      {/* Stepper Dot on the River Line */}
                      <div
                        className={`absolute -left-[3.25rem] top-6 hidden h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-xs md:flex ${
                          isTravelLeg ? "bg-emerald-600 text-white" : "bg-forest text-white"
                        }`}
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
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                energyColors[stop.energyLevel]
                              }`}
                            >
                              {energyLabels[stop.energyLevel]}
                            </span>
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
                    </article>
                  );
                })}
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
            <Button asChild size="lg" className="rounded-full bg-amber-400 font-extrabold text-ink shadow-md hover:bg-amber-300">
              <Link href="/book-tour">
                <span>{isEn ? "Book This Custom Tour Now" : "Đặt Tour Theo Lịch Trình Này"}</span>
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-forest/15 bg-white p-6 shadow-card sm:flex-row print:hidden">
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-ink">
            {isEn ? "Want to adjust this route?" : "Bạn muốn điều chỉnh lại theo ý mình?"}
          </h4>
          <p className="text-xs text-ink/60">
            {isEn
              ? "Re-run the smart questionnaire anytime to explore different highland rhythms."
              : "Có thể chọn lại các điểm yêu thích hoặc thêm điều muốn tránh bất kỳ lúc nào."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="border-forest text-forest hover:bg-forest hover:text-white"
          >
            <RotateCcw className="mr-1.5 h-4 w-4" />
            {t.itinerary.startOver}
          </Button>
          <Button asChild className="bg-forest text-white hover:bg-forest-light">
            <Link href="/places">
              {t.nav.places}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}