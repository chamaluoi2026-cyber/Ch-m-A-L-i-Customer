"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/i18n-provider";
import { AnimatedWeatherIcon, getWeatherTheme } from "@/components/ui/animated-weather-icon";
import { Compass, X, Sparkles, ChevronDown } from "lucide-react";
import { getUnifiedWeatherData, type DayForecast } from "@/lib/weather-service";

interface WeatherNavBadgeProps {
  variant?: "navbar" | "compact" | "drawer";
  className?: string;
}

export function WeatherNavBadge({ variant = "navbar", className = "" }: WeatherNavBadgeProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getUnifiedWeatherData()
      .then((data) => {
        if (isMounted && data?.forecasts?.length) {
          setForecasts(data.forecasts);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const defaultToday: DayForecast = {
    date: "",
    dayName: "Hôm nay",
    enDayName: "Today",
    weatherCode: 2,
    emoji: "🌤️",
    label: "22°C Mát mẻ",
    enLabel: "22°C Pleasant",
    tempMax: 24,
    tempMin: 18,
    rainChance: 15,
    precipitationSum: 0,
    isCloudHuntingGood: true,
    specialNote: "Nhiệt độ A Lưới mát mẻ hơn đồng bằng 4-6°C. Thích hợp dạo bản làng & thưởng thức ẩm thực Pa Cô.",
    enSpecialNote: "A Luoi highland temperatures are 4-6°C cooler than lowlands. Great for village strolls and Pa Co cuisine.",
    passAlert: "Đường đèo thông thoáng, thời tiết mát mẻ. Khuyên di chuyển xuống đèo trước 16:30 khi sương mù hạ thấp.",
    enPassAlert: "Pass is clear and mild. Descend before 16:30 when mountain mist begins to lower.",
    passStatus: "normal"
  };

  const today = forecasts[0] || defaultToday;
  const activeDay = forecasts[selectedDayIndex] || today;

  const theme = getWeatherTheme(today.weatherCode);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Nút bấm hiển thị thời tiết trên Navbar */}
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Xem dự báo thời tiết A Lưới"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/95 hover:bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold transition shadow-2xs"
        >
          <AnimatedWeatherIcon weatherCode={today.weatherCode} size={20} showGlow={false} />
          <span>{today.tempMax}°C</span>
        </button>
      ) : variant === "drawer" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-sky-100 shadow-sm text-sky-900 text-xs font-bold"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
              <AnimatedWeatherIcon weatherCode={today.weatherCode} size={28} showGlow={false} />
            </div>
            <div className="text-left">
              <p className="font-extrabold text-sky-950">
                Thời tiết A Lưới: {today.tempMax}° / {today.tempMin}°C
              </p>
              <p className="text-[11px] text-sky-700 font-normal">
                {isEn ? today.enLabel : today.label} • Khí hậu 700m
              </p>
            </div>
          </div>
          <span className="text-xs text-sky-600 font-semibold underline">Dự báo 5 ngày →</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Dự báo thời tiết & điều kiện đèo A Lưới hôm nay"
          aria-label="Xem dự báo thời tiết A Lưới"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white border border-sky-200 text-sky-950 text-xs font-bold transition-all shadow-2xs hover:shadow-sm"
        >
          <AnimatedWeatherIcon weatherCode={today.weatherCode} size={22} showGlow={false} />
          <div className="flex items-baseline gap-1">
            <span className="text-sky-950 font-extrabold">{today.tempMax}°C</span>
            <span className="text-[11px] text-sky-700 font-medium hidden lg:inline">A Lưới</span>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-sky-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {/* Dropdown popup dự báo thời tiết chi tiết - iOS Style Spring Bloom */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[330px] sm:w-[360px] rounded-[28px] ios-glass ios-spring overflow-hidden z-50 ring-1 ring-black/5 dark:ring-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.22)]">
          {/* iOS Grabber */}
          <div className="pt-2 pb-1 flex justify-center bg-gradient-to-r from-transparent via-black/5 to-transparent">
            <div className="h-1 w-8 rounded-full bg-gray-400/40" />
          </div>

          {/* Header */}
          <div className={`p-4 bg-gradient-to-r ${theme.cardHeaderGradient} text-white flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/20 backdrop-blur-sm shadow-inner">
                <AnimatedWeatherIcon weatherCode={activeDay.weatherCode} size={28} showGlow={false} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm">
                    {isEn ? "A Luoi Weather Forecast" : "Dự Báo Thời Tiết A Lưới"}
                  </h4>
                </div>
                <p className="text-[11px] text-sky-100">
                  {activeDay.dayName} {activeDay.date ? `(${activeDay.date})` : ""} · {isEn ? activeDay.enLabel : activeDay.label}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition"
              aria-label="Đóng"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Nội dung */}
          <div className="p-3.5 space-y-3">
            {/* Lưới 5 ngày */}
            <div className="grid grid-cols-5 gap-1.5">
              {forecasts.map((f, i) => {
                const isSelected = i === selectedDayIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedDayIndex(i)}
                    className={`flex flex-col items-center p-2 rounded-xl text-center transition cursor-pointer ${
                      isSelected
                        ? "bg-sky-100/90 ring-2 ring-sky-500 shadow-xs"
                        : "bg-[#F8FAFC] hover:bg-sky-50/70"
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase ${isSelected ? "text-sky-950 font-black" : "text-sky-900"}`}>
                      {isEn ? f.enDayName : f.dayName}
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium">{f.date}</p>
                    <div className="my-1 flex h-7 w-7 items-center justify-center">
                      <AnimatedWeatherIcon weatherCode={f.weatherCode} size={24} showGlow={false} />
                    </div>
                    <p className="text-[11px] font-black text-rose-600">{f.tempMax}°</p>
                    <p className="text-[10px] font-bold text-sky-600">{f.tempMin}°</p>
                    {f.rainChance > 0 ? (
                      <span className="text-[9px] text-sky-600 font-semibold mt-0.5">💧{f.rainChance}%</span>
                    ) : (
                      <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">Khô ráo</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Thông điệp săn mây & Mách nước du khách */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Sparkles className="size-3.5 text-amber-600 shrink-0" />
                <span>
                  {isEn
                    ? (selectedDayIndex === 0 ? "Today's Travel Advisory:" : `Advisory for ${activeDay.enDayName} (${activeDay.date}):`)
                    : (selectedDayIndex === 0 ? "Mách nước cho du khách hôm nay:" : `Mách nước cho du khách ${activeDay.dayName.toLowerCase()} (${activeDay.date}):`)}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                {isEn ? activeDay.enSpecialNote : activeDay.specialNote}
              </p>
            </div>

            {/* Cảnh báo đèo QL49 - Đồng bộ 100% thời tiết thực tế */}
            <div
              className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 transition-colors ${
                activeDay.passStatus === "warning"
                  ? "bg-rose-50/90 border-rose-300 text-rose-950"
                  : activeDay.passStatus === "slippery"
                  ? "bg-amber-50/85 border-amber-300 text-amber-950"
                  : activeDay.passStatus === "foggy"
                  ? "bg-sky-50/85 border-sky-300 text-sky-950"
                  : "bg-emerald-50/70 border-emerald-200/70 text-emerald-950"
              }`}
            >
              <span className="text-sm shrink-0">
                {activeDay.passStatus === "warning"
                  ? "⚠️"
                  : activeDay.passStatus === "slippery"
                  ? "🌧️"
                  : activeDay.passStatus === "foggy"
                  ? "🌫️"
                  : "🚗"}
              </span>
              <p className="leading-snug">
                <b>
                  {isEn
                    ? `Pass 49 (${selectedDayIndex === 0 ? "Today" : activeDay.enDayName}):`
                    : `Cung đèo QL49 (${selectedDayIndex === 0 ? "Hôm nay" : activeDay.dayName}):`
                  }
                </b>{" "}
                {isEn ? activeDay.enPassAlert : activeDay.passAlert}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Dữ liệu từ trạm Open-Meteo A Lưới</span>
            <span className="text-emerald-700 font-semibold">Cập nhật trực tiếp 24/7</span>
          </div>
        </div>
      )}
    </div>
  );
}
