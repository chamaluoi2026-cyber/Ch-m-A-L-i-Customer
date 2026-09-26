"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/components/i18n-provider";
import { AnimatedWeatherIcon, getWeatherTheme } from "@/components/ui/animated-weather-icon";
import { ChevronUp, X, Sparkles, AlertTriangle, Compass, Droplets, Wind, ShieldAlert, Minimize2, Maximize2 } from "lucide-react";

const A_LUOI_LAT = 16.232;
const A_LUOI_LON = 107.261;
const A_LUOI_ELEVATION = 620;

interface DayForecast {
  date: string;
  dayName: string;
  enDayName: string;
  weatherCode: number;
  label: string;
  enLabel: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  isCloudHuntingGood: boolean;
  specialNote?: string;
  enSpecialNote?: string;
}

function wmoToDisplay(code: number): { label: string; enLabel: string } {
  if (code === 0) return { label: "Nắng đẹp", enLabel: "Clear Sky" };
  if (code === 1) return { label: "Ít mây", enLabel: "Mostly Sunny" };
  if (code === 2) return { label: "Nhiều mây", enLabel: "Partly Cloudy" };
  if (code === 3) return { label: "Trời xám", enLabel: "Overcast" };
  if (code === 45 || code === 48) return { label: "Sương mù đèo", enLabel: "Mountain Fog" };
  if (code >= 51 && code <= 55) return { label: "Mưa phùn", enLabel: "Drizzle" };
  if (code >= 61 && code <= 65) return { label: "Mưa", enLabel: "Rain" };
  if (code >= 71 && code <= 77) return { label: "Mưa đá nhẹ", enLabel: "Light Sleet" };
  if (code >= 80 && code <= 82) return { label: "Mưa lớn", enLabel: "Heavy Rain" };
  if (code === 95) return { label: "Giông bão", enLabel: "Thunderstorm" };
  return { label: "Biến thiên", enLabel: "Variable" };
}

function getDayName(dateStr: string): { dayName: string; enDayName: string } {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return { dayName: "Hôm nay", enDayName: "Today" };
  if (diff === 1) return { dayName: "Ngày mai", enDayName: "Tomorrow" };
  const viDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const enDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { dayName: viDays[date.getDay()], enDayName: enDays[date.getDay()] };
}

export function WeatherWidget() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBubbleOnly, setIsBubbleOnly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${A_LUOI_LAT}&longitude=${A_LUOI_LON}&elevation=${A_LUOI_ELEVATION}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=5`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!data?.daily?.time) throw new Error("No data");
        const { time, weathercode, temperature_2m_max, temperature_2m_min, precipitation_probability_max } = data.daily;
        const parsed: DayForecast[] = time.map((dateStr: string, i: number) => {
          const code = weathercode[i];
          const { label, enLabel } = wmoToDisplay(code);
          const { dayName, enDayName } = getDayName(dateStr);
          const rainChance = precipitation_probability_max[i] ?? 0;
          const isCloudHuntingGood = code === 45 || code === 48 || (code >= 1 && code <= 3 && rainChance < 30);
          
          let specialNote: string | undefined;
          let enSpecialNote: string | undefined;
          if (code === 45 || code === 48) {
            specialNote = "🌫️ Săn mây tuyệt vời! Đỉnh Đồi Thông 06:15 sáng";
            enSpecialNote = "🌫️ Prime cloud-hunting! Pine Hill at 06:15 AM";
          } else if (isCloudHuntingGood) {
            specialNote = "☁️ Biển mây sáng sớm — thích hợp chụp ảnh & săn mây";
            enSpecialNote = "☁️ Early mountain clouds — prime photography morning";
          } else if (code === 0) {
            specialNote = "☀️ Nắng trong vắt — suối Pâr Le & thác A Nôr đẹp nhất!";
            enSpecialNote = "☀️ Crystal skies — waterfalls & springs at their most pristine!";
          } else if (code === 95) {
            specialNote = "⚡ Giông bão vùng cao — cẩn trọng sạt lở & sương mù đèo QL49 sau 16:30";
            enSpecialNote = "⚡ Highland storm — exercise caution along Pass 49 after 16:30";
          } else if (code >= 80) {
            specialNote = "🌧️ Mưa lớn vùng đèo — hạn chế xe máy sau 17:00";
            enSpecialNote = "🌧️ Heavy pass rain — avoid motorcycle travel after 17:00";
          }

          const d = new Date(dateStr);
          return {
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            dayName,
            enDayName,
            weatherCode: code,
            label,
            enLabel,
            tempMax: Math.round(temperature_2m_max[i]),
            tempMin: Math.round(temperature_2m_min[i]),
            rainChance,
            isCloudHuntingGood,
            specialNote,
            enSpecialNote,
          };
        });
        setForecasts(parsed);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Close when click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded]);

  const today = forecasts[0];
  const currentCode = today?.weatherCode ?? 2;
  const theme = getWeatherTheme(currentCode);

  return (
    <aside
      ref={containerRef}
      className="fixed bottom-6 left-6 sm:bottom-7 sm:left-7 z-50 print:hidden select-none transition-all duration-300"
      aria-label={isEn ? "Live weather widget" : "Tiện ích thời tiết trực tiếp"}
    >
      {/* 1. MINIMIZED FLOATING CLOUD BUBBLE (When user wants ultra-minimal mode) */}
      {isBubbleOnly && !isExpanded && (
        <button
          type="button"
          onClick={() => setIsBubbleOnly(false)}
          className={`group relative flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-xl bg-white/95 dark:bg-slate-900/90 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ring-2 ${theme.borderGlow} hover:scale-110 active:scale-95 transition-all duration-300`}
          title={isEn ? "A Luoi Weather - Click to expand" : "Thời tiết A Lưới - Bấm để mở rộng"}
        >
          <AnimatedWeatherIcon weatherCode={currentCode} size={36} />
          {/* Temperature Badge */}
          {!loading && today && (
            <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[10px] font-black text-white shadow-md">
              {today.tempMax}°
            </span>
          )}
        </button>
      )}

      {/* 2. COLLAPSED FLOATING WEATHER PILL (Standard view) */}
      {!isBubbleOnly && !isExpanded && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className={`group relative flex items-center gap-3 rounded-2xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/90 px-3.5 py-2.5 shadow-[0_12px_36px_rgba(15,23,42,0.14)] ring-1 ring-black/5 hover:ring-black/10 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-98 ${theme.floatingBorder}`}
            aria-expanded={false}
          >
            {/* Dynamic Weather Reactive Glow Pill Background */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${theme.bgGradient} opacity-60 pointer-events-none transition-opacity group-hover:opacity-100`}
            />

            {/* Animated Vector Weather Cloud / Storm / Sun Icon */}
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-inner ring-1 ring-black/5">
              {loading ? (
                <span className="animate-spin text-lg">⏳</span>
              ) : error ? (
                <span className="text-xl">🌈</span>
              ) : (
                <AnimatedWeatherIcon weatherCode={currentCode} size={34} />
              )}
            </div>

            {/* Weather & Location Information */}
            <div className="relative z-10 text-left pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-forest dark:text-emerald-400 uppercase">
                  {isEn ? "A Luoi" : "A Lưới"}
                </span>
                <span className="text-[10px] font-semibold text-gray-400">· 700m</span>
                {/* Live pulsing dot */}
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${theme.accentDot} opacity-75`} />
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${theme.accentDot}`} />
                </span>
              </div>

              {!loading && !error && today ? (
                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
                  <span>{isEn ? today.enLabel : today.label}</span>
                  <span className="mx-1 text-gray-300">·</span>
                  <span className="text-amber-600 font-extrabold">{today.tempMax}°</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-sky-600">{today.tempMin}°C</span>
                </p>
              ) : (
                <p className="text-[11px] text-gray-500">{isEn ? "Loading weather..." : "Đang cập nhật..."}</p>
              )}
            </div>

            {/* Expand Indicator Arrow */}
            <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100/80 dark:bg-slate-800/80 text-gray-500 group-hover:bg-forest group-hover:text-white transition-colors shadow-2xs">
              <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </div>
          </button>

          {/* Minimize to tiny bubble button */}
          <button
            type="button"
            onClick={() => setIsBubbleOnly(true)}
            className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md bg-white/80 dark:bg-slate-800/80 text-gray-400 hover:text-gray-700 hover:bg-white shadow-xs transition-all"
            title={isEn ? "Minimize widget" : "Thu nhỏ icon"}
            aria-label={isEn ? "Minimize" : "Thu nhỏ"}
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 3. EXPANDED WEATHER CARD MODAL */}
      {isExpanded && (
        <div className="w-[340px] sm:w-[370px] overflow-hidden rounded-3xl border border-white/40 bg-white/95 dark:bg-slate-900/95 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          {/* Card Header with Dynamic Weather Gradient */}
          <div className={`relative overflow-hidden bg-gradient-to-br ${theme.cardHeaderGradient} px-5 py-4 text-white shadow-md`}>
            {/* Ambient Background Glow Effect */}
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 shadow-inner">
                  <AnimatedWeatherIcon weatherCode={currentCode} size={40} showGlow={false} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-wider uppercase">
                      {isEn ? "A Luoi Highland" : "Cao Nguyên A Lưới"}
                    </h3>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold">700m</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    {isEn ? "Real-time Mountain Weather" : "Khí hậu vùng cao thời gian thực"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  aria-label={isEn ? "Close" : "Đóng"}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Current Day Highlights Banner */}
            {!loading && today && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-black/15 px-3.5 py-2 backdrop-blur-sm">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black">{today.tempMax}°</span>
                  <span className="text-xs text-white/80">/ {today.tempMin}°C</span>
                  <span className="ml-1 text-xs font-bold text-amber-200">
                    {isEn ? today.enLabel : today.label}
                  </span>
                </div>
                {today.rainChance > 0 && (
                  <div className="flex items-center gap-1 text-xs text-sky-200">
                    <Droplets className="h-3.5 w-3.5" />
                    <span className="font-bold">{today.rainChance}%</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3.5">
            {loading && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-forest">
                <span className="animate-spin">⏳</span>
                <span>{isEn ? "Updating A Luoi forecast..." : "Đang cập nhật thời tiết A Lưới..."}</span>
              </div>
            )}

            {error && (
              <div className="py-6 text-center text-xs text-gray-500">
                <span className="text-3xl">🌈</span>
                <p className="mt-2 font-bold text-gray-700">
                  {isEn ? "Offline mode" : "Đang chạy chế độ ngoại tuyến"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {isEn ? "Highland air is cool at 18-24°C" : "Khí hậu A Lưới luôn dịu mát 18–24°C"}
                </p>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* 5-Day Forecast Grid with Animated Icons */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                    {isEn ? "5-Day Forecast" : "Dự báo 5 ngày tới"}
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {forecasts.map((f, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center rounded-2xl p-2 text-center transition-all ${
                          i === 0
                            ? "bg-forest/5 ring-1 ring-forest/20 shadow-xs"
                            : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <p className={`text-[10px] font-black uppercase ${i === 0 ? "text-forest" : "text-gray-400"}`}>
                          {isEn ? f.enDayName : f.dayName}
                        </p>
                        <p className="text-[9px] text-gray-400">{f.date}</p>

                        <div className="my-1 flex h-8 w-8 items-center justify-center">
                          <AnimatedWeatherIcon weatherCode={f.weatherCode} size={28} showGlow={false} />
                        </div>

                        <p className="text-[11px] font-black text-amber-600 leading-tight">{f.tempMax}°</p>
                        <p className="text-[10px] font-bold text-sky-600 leading-tight">{f.tempMin}°</p>
                        {f.rainChance > 0 ? (
                          <p className="mt-0.5 text-[8px] font-bold text-sky-500">💧{f.rainChance}%</p>
                        ) : (
                          <p className="mt-0.5 text-[8px] font-bold text-emerald-500">☀️ Khô</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highland Special Advisory Banner */}
                {today?.specialNote && (
                  <div
                    className={`rounded-2xl p-3 text-xs leading-relaxed border ${
                      currentCode === 95
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-200/80"
                        : today.isCloudHuntingGood
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 border-purple-200/80"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border-emerald-200/80"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {currentCode === 95 ? (
                        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      ) : today.isCloudHuntingGood ? (
                        <Sparkles className="h-4 w-4 shrink-0 text-purple-600 mt-0.5" />
                      ) : (
                        <Compass className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold">
                          {isEn ? "Highland Travel Recommendation:" : "Lời khuyên trải nghiệm hôm nay:"}
                        </p>
                        <p className="mt-0.5 text-[11px] opacity-90">
                          {isEn ? today.enSpecialNote : today.specialNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pass QL49 Safety & Night Climate Tip */}
                <div className="rounded-2xl bg-gray-50 dark:bg-slate-800/60 p-3 text-[11px] text-gray-600 dark:text-gray-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-100">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{isEn ? "Pass 49 & Highland Tips:" : "Lưu ý đèo QL49 & Nhiệt độ đêm:"}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    {isEn
                      ? "• Check pass weather before crossing; dense fog often gathers after 16:30. Night temperatures drop to 17–19°C — bring a light windbreaker!"
                      : "• Đèo QL49 thường có sương mù dày sau 16:30. Nhiệt độ ban đêm trên cao nguyên hạ xuống 17–19°C, luôn mang theo áo khoác gió nhẹ!"}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1">
                  <span>Open-Meteo · 16.22°N, 107.31°E</span>
                  <button
                    type="button"
                    onClick={() => setIsBubbleOnly(true)}
                    className="text-forest hover:underline font-bold"
                  >
                    {isEn ? "Minimize icon" : "Thu gọn góc màn hình"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
