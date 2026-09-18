"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n-provider";

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
  if (code >= 80 && code <= 82) return { emoji: "⛈️", label: "Mưa lớn", enLabel: "Heavy Rain" };
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

export function WeatherWidget() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${A_LUOI_LAT}&longitude=${A_LUOI_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=5`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
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
            specialNote = "🌫️ Săn mây tuyệt vời! Đồi Thông lúc 06:15";
            enSpecialNote = "🌫️ Prime cloud-hunting! Pine Hill at 06:15";
          } else if (isCloudHuntingGood) {
            specialNote = "☁️ Có thể có mây sáng — cơ hội săn mây đẹp";
            enSpecialNote = "☁️ Morning clouds possible — cloud-hunting likely";
          } else if (code === 0) {
            specialNote = "☀️ Nắng đẹp — thác suối trong xanh nhất!";
            enSpecialNote = "☀️ Clear sky — waterfalls at their most crystal clear!";
          } else if (code >= 80) {
            specialNote = "🌧️ Mưa lớn — kiểm tra thêm trước khi khởi hành";
            enSpecialNote = "🌧️ Heavy rain forecast — check closer to departure";
          }
          const d = new Date(dateStr);
          return { date: `${d.getDate()}/${d.getMonth() + 1}`, dayName, enDayName, emoji, label, enLabel, tempMax: Math.round(temperature_2m_max[i]), tempMin: Math.round(temperature_2m_min[i]), rainChance, isCloudHuntingGood, specialNote, enSpecialNote };
        });
        setForecasts(parsed);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <div className="fixed bottom-5 left-4 z-50 print:hidden">
      {!isExpanded && (
        <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-105" aria-label={isEn ? "Show weather forecast" : "Xem dự báo thời tiết"}>
          <span className="text-xl">{loading ? "⏳" : error ? "🌈" : (forecasts[0]?.emoji ?? "🌤️")}</span>
          <div className="text-left">
            <p className="text-xs font-bold text-sky-700">{isEn ? "A Luoi Weather" : "Thời tiết A Lưới"}</p>
            {!loading && !error && forecasts[0] && (<p className="text-[10px] text-gray-500">{isEn ? forecasts[0].enLabel : forecasts[0].label} · {forecasts[0].tempMax}°/{forecasts[0].tempMin}°</p>)}
          </div>
          <span className="text-[10px] text-sky-400">▲</span>
        </button>
      )}
      {isExpanded && (
        <div className="w-[320px] overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏔️</span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest">{isEn ? "A Luoi Highland" : "Cao Nguyên A Lưới"}</p>
                <p className="text-[10px] text-sky-100">{isEn ? "700m · 5-day forecast" : "700m · Dự báo 5 ngày"}</p>
              </div>
            </div>
            <button onClick={() => setIsExpanded(false)} className="rounded-full bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30">✕</button>
          </div>
          <div className="p-3">
            {loading && (<div className="flex items-center justify-center gap-2 py-6 text-sm text-sky-600"><span className="animate-spin">⏳</span><span>{isEn ? "Loading weather..." : "Đang tải thời tiết..."}</span></div>)}
            {error && (<div className="py-4 text-center text-xs text-gray-400"><p className="text-2xl">🌈</p><p className="mt-1">{isEn ? "Weather unavailable offline" : "Không có mạng để tải thời tiết"}</p><p className="mt-0.5 text-[10px]">{isEn ? "A Luoi is always cool & refreshing at 700m!" : "A Lưới ở 700m luôn mát mẻ và trong lành!"}</p></div>)}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-5 gap-1">
                  {forecasts.map((f, i) => (
                    <div key={i} className={`flex flex-col items-center rounded-xl p-2 text-center ${i === 0 ? "bg-sky-50 ring-1 ring-sky-200" : "hover:bg-gray-50"}`}>
                      <p className="text-[9px] font-bold uppercase text-gray-400">{isEn ? f.enDayName : f.dayName}</p>
                      <p className="text-[9px] text-gray-300">{f.date}</p>
                      <span className="my-1 text-xl leading-none">{f.emoji}</span>
                      <p className="text-[9px] font-bold text-red-500">{f.tempMax}°</p>
                      <p className="text-[9px] text-blue-400">{f.tempMin}°</p>
                      {f.rainChance > 0 && (<p className="text-[8px] text-sky-400">💧{f.rainChance}%</p>)}
                    </div>
                  ))}
                </div>
                {forecasts[0]?.specialNote && (
                  <div className={`mt-3 rounded-xl p-2.5 text-xs ${forecasts[0].isCloudHuntingGood ? "bg-indigo-50 text-indigo-700" : forecasts[0].rainChance >= 80 ? "bg-orange-50 text-orange-700" : "bg-emerald-50 text-emerald-700"}`}>
                    <p className="font-semibold">{isEn ? forecasts[0].enSpecialNote : forecasts[0].specialNote}</p>
                  </div>
                )}
                <p className="mt-2 text-center text-[9px] text-gray-400">{isEn ? "Source: Open-Meteo · A Luoi (16.22°N, 107.31°E)" : "Nguồn: Open-Meteo · A Lưới (16.22°N, 107.31°E)"}</p>
              </>
            )}
          </div>
          <div className="border-t border-sky-50 bg-sky-50/50 px-3 py-2">
            <p className="text-[10px] text-sky-600"><strong>💡 {isEn ? "Highland Climate" : "Khí hậu vùng cao"}:</strong> {isEn ? "Best Mar–Aug (dry). Nights always cool 17–19°C. Oct–Feb: misty, great for cloud-hunting!" : "Đẹp nhất T3–T8 (mùa khô). Đêm luôn se lạnh 17-19°C. T10–T2: sương mù đẹp tuyệt!"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
