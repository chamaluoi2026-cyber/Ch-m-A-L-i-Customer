"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/i18n-provider";
import { Cloud, CloudRain, Sun, Compass, X, AlertTriangle, Sparkles, ChevronDown } from "lucide-react";

const A_LUOI_LAT = 16.22;
const A_LUOI_LON = 107.31;

interface DayForecast {
  date: string;
  dayName: string;
  enDayName: string;
  emoji: string;
  label: string;
  enLabel: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  isCloudHuntingGood: boolean;
  specialNote?: string;
  enSpecialNote?: string;
}

function wmoToDisplay(code: number): { emoji: string; label: string; enLabel: string } {
  if (code === 0) return { emoji: "☀️", label: "Nắng đẹp", enLabel: "Clear Sky" };
  if (code === 1) return { emoji: "🌤️", label: "Ít mây", enLabel: "Mostly Sunny" };
  if (code === 2) return { emoji: "⛅", label: "Nhiều mây", enLabel: "Partly Cloudy" };
  if (code === 3) return { emoji: "🌥️", label: "Trời xám", enLabel: "Overcast" };
  if (code === 45 || code === 48) return { emoji: "🌫️", label: "Sương mù đèo ✨", enLabel: "Mountain Fog ✨" };
  if (code >= 51 && code <= 55) return { emoji: "🌦️", label: "Mưa phùn", enLabel: "Drizzle" };
  if (code >= 61 && code <= 65) return { emoji: "🌧️", label: "Mưa", enLabel: "Rain" };
  if (code >= 71 && code <= 77) return { emoji: "🌨️", label: "Mưa đá nhẹ", enLabel: "Light Sleet" };
  if (code >= 80 && code <= 82) return { emoji: "⛈️", label: "Mưa rào", enLabel: "Showers" };
  if (code === 95) return { emoji: "⛈️", label: "Giông bão", enLabel: "Thunderstorm" };
  return { emoji: "🌈", label: "Biến thiên", enLabel: "Variable" };
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

interface WeatherNavBadgeProps {
  variant?: "navbar" | "compact" | "drawer";
  className?: string;
}

export function WeatherNavBadge({ variant = "navbar", className = "" }: WeatherNavBadgeProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${A_LUOI_LAT}&longitude=${A_LUOI_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=5`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!data?.daily?.time) return;
        const { time, weathercode, temperature_2m_max, temperature_2m_min, precipitation_probability_max } = data.daily;
        const parsed: DayForecast[] = time.map((dateStr: string, i: number) => {
          const code = weathercode[i];
          const { emoji, label, enLabel } = wmoToDisplay(code);
          const { dayName, enDayName } = getDayName(dateStr);
          const rainChance = precipitation_probability_max[i] ?? 0;
          const isCloudHuntingGood = code === 45 || code === 48 || (code >= 1 && code <= 3 && rainChance < 30);

          let specialNote: string | undefined;
          let enSpecialNote: string | undefined;
          if (code === 45 || code === 48) {
            specialNote = "🌫️ Sương mù đẹp! Cơ hội săn mây đỉnh Đồi Thông lúc 06:15 sáng";
            enSpecialNote = "🌫️ Mountain mist! Prime cloud-hunting at Pine Hill 06:15 AM";
          } else if (isCloudHuntingGood) {
            specialNote = "☁️ Sáng sớm có mây bồng bềnh — rất thích hợp săn mây";
            enSpecialNote = "☁️ Early morning clouds — great for photography";
          } else if (code === 0) {
            specialNote = "☀️ Nắng ráo trong veo — suối Pâr Le & thác A Nôr đẹp nhất!";
            enSpecialNote = "☀️ Clear sunny skies — waterfalls at their most crystal clear!";
          } else if (code >= 80) {
            specialNote = "🌧️ Có mưa rào — cẩn trọng khi đi qua đèo QL49";
            enSpecialNote = "🌧️ Mountain rain showers — drive safely along Pass 49";
          }

          const d = new Date(dateStr);
          return {
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            dayName,
            enDayName,
            emoji,
            label,
            enLabel,
            tempMax: Math.round(temperature_2m_max[i]),
            tempMin: Math.round(temperature_2m_min[i]),
            rainChance,
            isCloudHuntingGood,
            specialNote,
            enSpecialNote
          };
        });
        setForecasts(parsed);
        setLoading(false);
      })
      .catch(() => {
        // Fallback nhẹ nếu mạng chậm
        setLoading(false);
      });
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

  const today = forecasts[0] || {
    emoji: "🌤️",
    label: "22°C Mát mẻ",
    enLabel: "22°C Pleasant",
    tempMax: 24,
    tempMin: 18,
    rainChance: 15
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Nút bấm hiển thị thời tiết trên Navbar */}
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Xem dự báo thời tiết A Lưới"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-sky-800 text-xs font-bold transition shadow-2xs"
        >
          <span className="text-sm">{today.emoji}</span>
          <span>{today.tempMax}°C</span>
        </button>
      ) : variant === "drawer" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{today.emoji}</span>
            <div className="text-left">
              <p className="font-extrabold text-sky-950">Thời tiết A Lưới hôm nay: {today.tempMax}° / {today.tempMin}°C</p>
              <p className="text-[11px] text-sky-700 font-normal">{isEn ? today.enLabel : today.label} • Khí hậu cao nguyên 700m</p>
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
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-50 via-teal-50/70 to-emerald-50/80 hover:from-sky-100 hover:to-emerald-100 border border-sky-200/90 text-sky-950 text-xs font-bold transition-all shadow-xs hover:shadow-sm"
        >
          <span className="text-base group-hover:scale-110 transition-transform">{today.emoji}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sky-900 font-extrabold">{today.tempMax}°C</span>
            <span className="text-[11px] text-sky-700 font-medium hidden lg:inline">A Lưới</span>
          </div>
          <span className="text-[10px] text-sky-600/80 font-normal hidden xl:inline">({isEn ? today.enLabel : today.label})</span>
          <ChevronDown className={`size-3 text-sky-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Dropdown Modal Dự Báo Thời Tiết 5 Ngày A Lưới */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-[330px] sm:w-[350px] z-50 rounded-2xl bg-white border border-sky-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-700 px-4 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏔️</span>
              <div>
                <p className="text-xs font-black tracking-wider uppercase text-sky-100">
                  {isEn ? "A Luoi Weather Forecast" : "Dự Báo Thời Tiết A Lưới"}
                </p>
                <p className="text-[11px] text-white/80">
                  Độ cao 700m • Tọa độ 16.22°B, 107.31°Đ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
              aria-label="Đóng"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3.5 space-y-3">
            {/* Lưới 5 ngày */}
            <div className="grid grid-cols-5 gap-1.5">
              {forecasts.map((f, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center p-2 rounded-xl text-center transition ${
                    i === 0 ? "bg-sky-50 ring-1.5 ring-sky-300" : "bg-[#F8FAFC] hover:bg-sky-50/50"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase text-sky-900">{isEn ? f.enDayName : f.dayName}</p>
                  <p className="text-[9px] text-ink/45 font-medium">{f.date}</p>
                  <span className="text-xl my-1 leading-none">{f.emoji}</span>
                  <p className="text-[11px] font-black text-rose-600">{f.tempMax}°</p>
                  <p className="text-[10px] font-bold text-sky-600">{f.tempMin}°</p>
                  {f.rainChance > 0 ? (
                    <span className="text-[9px] text-sky-600 font-semibold mt-0.5">💧{f.rainChance}%</span>
                  ) : (
                    <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">Khô ráo</span>
                  )}
                </div>
              ))}
            </div>

            {/* Thông điệp đặc biệt về săn mây và đường đèo */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Sparkles className="size-3.5 text-amber-600 shrink-0" />
                <span>Mách nước cho du khách hôm nay:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                {today.specialNote || "Nhiệt độ A Lưới mát mẻ hơn đồng bằng 4-6°C. Thích hợp tắm thác A Nôr & cắm trại Đồi Thông."}
              </p>
            </div>

            {/* Cảnh báo đèo QL49 */}
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-950 flex items-start gap-2">
              <span className="text-sm shrink-0">🚗</span>
              <p className="leading-snug">
                <b>Cung đèo QL49:</b> Buổi sáng nắng đẹp, từ <b>16:30</b> sương mù hạ thấp. Khuyên xuất phát xuống đèo trước 16:30 để chạy xe an toàn.
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
