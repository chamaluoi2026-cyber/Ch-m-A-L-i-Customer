"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/i18n-provider";
import { AnimatedWeatherIcon, getWeatherTheme } from "@/components/ui/animated-weather-icon";
import { Compass, X, Sparkles, ChevronDown } from "lucide-react";

const A_LUOI_LAT = 16.232;
const A_LUOI_LON = 107.261;
const A_LUOI_ELEVATION = 620;

interface DayForecast {
  date: string;
  dayName: string;
  enDayName: string;
  weatherCode: number;
  emoji: string;
  label: string;
  enLabel: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  isCloudHuntingGood: boolean;
  specialNote: string;
  enSpecialNote: string;
  passAlert: string;
  enPassAlert: string;
  passStatus: "normal" | "slippery" | "foggy" | "warning";
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

function getDayAdvisories(
  code: number,
  rainChance: number,
  tempMax: number,
  tempMin: number,
  isCloudHuntingGood: boolean
): {
  specialNote: string;
  enSpecialNote: string;
  passAlert: string;
  enPassAlert: string;
  passStatus: "normal" | "slippery" | "foggy" | "warning";
} {
  // 1. Dông bão / Sấm sét (WMO 95)
  if (code === 95) {
    return {
      specialNote: `⚡ Có dông bão vùng cao (${rainChance}% mưa) — hạn chế tắm suối thác & hoạt động ngoài trời. Thích hợp nghỉ ngơi nhà sàn.`,
      enSpecialNote: `⚡ Highland thunderstorms (${rainChance}% rain) — avoid mountain waterfalls. Rest in cozy stilt houses.`,
      passAlert: "Cung đèo QL49: Cảnh báo dông sét và mưa lớn, nguy cơ sạt trượt đất đá. Tránh vượt đèo ban đêm hoặc khi mưa dông đang trút xuống.",
      enPassAlert: "QL49 Pass: Severe weather alert with heavy rain & landslide risk. Avoid crossing pass during storms or at night.",
      passStatus: "warning"
    };
  }

  // 2. Mưa rào / Mưa to (WMO 80-82, 61-65, hoặc xác suất mưa >= 70%)
  if ((code >= 80 && code <= 82) || (code >= 61 && code <= 65) || rainChance >= 70) {
    return {
      specialNote: `🌧️ Có mưa rào vùng cao (${rainChance}% mưa) — suối khoáng nóng A Roàng 60°C & trải nghiệm dệt thổ cẩm Zèng là lựa chọn tuyệt vời nhất.`,
      enSpecialNote: `🌧️ Highland rain showers (${rainChance}% rain) — perfect day for A Roang hot springs (60°C) and indoor Zeng craft workshops.`,
      passAlert: "Cung đèo QL49: Mưa rừng làm mặt đèo ướt trơn, sương mù phủ kín đèo Mỏ Quạ & A Co. Cần giảm tốc độ, bật đèn cốt và nên xuống đèo trước 16:00.",
      enPassAlert: "QL49 Pass: Wet & slippery asphalt from forest rain. Reduced visibility at curves; slow down, use low beams and descend before 16:00.",
      passStatus: "slippery"
    };
  }

  // 3. Mưa phùn / mưa nhẹ (WMO 51-55 hoặc xác suất mưa 40-69%)
  if ((code >= 51 && code <= 55) || (rainChance >= 40 && rainChance < 70)) {
    return {
      specialNote: `🌦️ Tiết trời se lạnh có mưa bay lất phất (${rainChance}% mưa) — nên mang áo khoác gió chống nước nhẹ và ô nhỏ khi dạo bản.`,
      enSpecialNote: `🌦️ Light mountain drizzle (${rainChance}% rain) — bring a light waterproof windbreaker and compact umbrella for village walks.`,
      passAlert: "Cung đèo QL49: Mặt đường ẩm ướt ở các khúc cua dốc. Lái xe cẩn trọng, giữ cự ly an toàn và hoàn thành chuyến đi trước 16:30.",
      enPassAlert: "QL49 Pass: Moist road surface on mountain bends. Drive cautiously, keep safe following distance, descend before 16:30.",
      passStatus: "slippery"
    };
  }

  // 4. Sương mù đèo (WMO 45, 48)
  if (code === 45 || code === 48) {
    return {
      specialNote: "🌫️ Sương mù vùng cao bao phủ! Cơ hội săn mây thung lũng tuyệt đẹp tại Đồi Thông A Lưới lúc 06:00 - 06:45 sáng.",
      enSpecialNote: "🌫️ Misty highland weather! Ideal sea-of-clouds photography window at A Luoi Pine Hill around 06:00 - 06:45 AM.",
      passAlert: "Cung đèo QL49: Sương mù dày đặc che khuất tầm nhìn qua đèo A Co & Mỏ Quạ. Bật đèn gầm/đèn cảnh báo, chạy chậm và giữ cự ly tối thiểu 30m.",
      enPassAlert: "QL49 Pass: Dense fog obscuring turns at A Co & Mo Qua peaks. Turn on fog lights, slow down, maintain at least 30m distance.",
      passStatus: "foggy"
    };
  }

  // 5. Nắng đẹp trong lành (WMO 0)
  if (code === 0) {
    return {
      specialNote: "☀️ Nắng ráo trong veo — thời điểm lý tưởng nhất tắm suối Pâr Le, thác A Nôr & chụp ảnh bản làng đại ngàn.",
      enSpecialNote: "☀️ Crystal clear sunny skies — prime condition for Par Le stream, A Nor waterfalls, and tribal village photography.",
      passAlert: "Cung đèo QL49: Buổi sáng nắng đẹp, mặt đường khô ráo, chạy tốt. Từ 16:30 sương mù bắt đầu hạ thấp, khuyên xuất phát xuống đèo trước 16:30.",
      enPassAlert: "QL49 Pass: Sunny and dry pass conditions in daytime. Mountain mist lowers after 16:30; plan your descent before dusk for safety.",
      passStatus: "normal"
    };
  }

  // 6. Nhiều mây / Mát mẻ / Săn mây tốt (WMO 1-3)
  if (isCloudHuntingGood) {
    return {
      specialNote: "☁️ Sáng sớm có mây bồng bềnh mát dịu — rất thích hợp check-in đồi thông, cà phê ngắm cảnh và dạo suối.",
      enSpecialNote: "☁️ Soft morning mountain clouds — great for scenic pine-hill coffee stops and countryside strolls.",
      passAlert: "Cung đèo QL49: Đường đèo thông thoáng, thời tiết mát mẻ. Khuyên kiểm tra hệ thống phanh xe và di chuyển xuống đèo trước 16:30.",
      enPassAlert: "QL49 Pass: Clear mountain breeze and smooth pavement. Check vehicle brakes and descend before 16:30 before mist sets in.",
      passStatus: "normal"
    };
  }

  // Mặc định
  return {
    specialNote: `🍃 Nhiệt độ vùng cao mát mẻ (${tempMin}°C - ${tempMax}°C), thấp hơn đồng bằng 4-6°C. Thích hợp dạo bản và thưởng thức ẩm thực Pa Cô.`,
    enSpecialNote: `🍃 Pleasant highland climate (${tempMin}°C - ${tempMax}°C). Great for cultural villages and indigenous Pa Co cuisine.`,
    passAlert: "Cung đèo QL49: Đường đèo thông thoáng, mặt đường ổn định. Sương mù xuất hiện sau 16:30, nên điều chỉnh hành trình qua đèo sớm.",
    enPassAlert: "QL49 Pass: Pass is clear and well-conditioned. Mountain mist arrives after 16:30, schedule daytime travel across pass.",
    passStatus: "normal"
  };
}

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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${A_LUOI_LAT}&longitude=${A_LUOI_LON}&elevation=${A_LUOI_ELEVATION}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=5`;
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
          const tempMax = Math.round(temperature_2m_max[i]);
          const tempMin = Math.round(temperature_2m_min[i]);

          const advisories = getDayAdvisories(
            code,
            rainChance,
            tempMax,
            tempMin,
            isCloudHuntingGood
          );

          const d = new Date(dateStr);
          return {
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            dayName,
            enDayName,
            weatherCode: code,
            emoji,
            label,
            enLabel,
            tempMax,
            tempMin,
            rainChance,
            isCloudHuntingGood,
            specialNote: advisories.specialNote,
            enSpecialNote: advisories.enSpecialNote,
            passAlert: advisories.passAlert,
            enPassAlert: advisories.enPassAlert,
            passStatus: advisories.passStatus
          };
        });
        setForecasts(parsed);
        setLoading(false);
      })
      .catch(() => {
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
