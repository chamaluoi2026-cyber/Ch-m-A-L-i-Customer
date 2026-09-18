"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/components/i18n-provider";
import { AnimatedWeatherIcon, getWeatherTheme } from "@/components/ui/animated-weather-icon";
import {
  X,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Compass,
  Droplets,
  Calendar,
  ShieldAlert,
  Volume2,
  VolumeX,
} from "lucide-react";

const A_LUOI_LAT = 16.22;
const A_LUOI_LON = 107.31;

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
  if (code === 0) return { label: "Nắng đẹp rực rỡ", enLabel: "Clear Sunny" };
  if (code === 1) return { label: "Ít mây dịu mát", enLabel: "Mostly Sunny" };
  if (code === 2) return { label: "Nhiều mây bồng bềnh", enLabel: "Partly Cloudy" };
  if (code === 3) return { label: "Trời xám đại ngàn", enLabel: "Overcast" };
  if (code === 45 || code === 48) return { label: "Sương mù đèo ✨", enLabel: "Mountain Mist ✨" };
  if (code >= 51 && code <= 55) return { label: "Mưa phùn bay", enLabel: "Drizzle" };
  if (code >= 61 && code <= 65) return { label: "Mưa ngàn", enLabel: "Rain" };
  if (code >= 71 && code <= 77) return { label: "Mưa đá nhẹ", enLabel: "Light Sleet" };
  if (code >= 80 && code <= 82) return { label: "Mưa rào lớn", enLabel: "Heavy Showers" };
  if (code === 95) return { label: "Giông bão đèo cao", enLabel: "Highland Storm" };
  return { label: "Biến thiên cao nguyên", enLabel: "Variable Highland" };
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

/**
 * Animated Mascot SVG: Bé Mây A Lưới (Highland Cloud Bot)
 * Changes facial expressions, accessories, and elemental weather effects dynamically!
 */
function CloudBotMascot({
  weatherCode,
  isHappy = false,
}: {
  weatherCode: number;
  isHappy?: boolean;
}) {
  const isThunder = weatherCode === 95;
  const isSunny = weatherCode === 0;
  const isFog = weatherCode === 45 || weatherCode === 48;
  const isRain = weatherCode >= 51 && weatherCode <= 82;

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* SVG Canvas for Cloud Bot */}
      <svg
        viewBox="0 0 100 100"
        width="68"
        height="68"
        className="overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cloud Body Gradient */}
          <linearGradient id="botCloudBody" x1="20" y1="20" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            {isThunder ? (
              <>
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </>
            ) : isFog ? (
              <>
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E0E7FF" />
                <stop offset="100%" stopColor="#C7D2FE" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F0F9FF" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </>
            )}
          </linearGradient>

          {/* Golden Aura for Lightning / Sun */}
          <linearGradient id="goldGradient" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Keyframe Styles for Bot Animations */}
          <style>{`
            @keyframes bot-bob {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-5px) rotate(1.5deg); }
            }
            @keyframes bot-blink {
              0%, 94%, 98%, 100% { transform: scaleY(1); }
              96% { transform: scaleY(0.1); }
            }
            @keyframes bot-sparkle {
              0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
              50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
            }
            @keyframes bot-lightning {
              0%, 100% { opacity: 0.2; transform: scale(0.9); }
              20% { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 6px #FACC15); }
              24% { opacity: 0.4; }
              28% { opacity: 1; transform: scale(1.05); }
              35% { opacity: 0.2; }
            }
            @keyframes bot-sun-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes bot-rain-drop {
              0% { transform: translateY(0); opacity: 0; }
              40% { opacity: 1; }
              100% { transform: translateY(14px); opacity: 0; }
            }
            .anim-bot-body {
              animation: bot-bob 3.8s ease-in-out infinite;
              transform-origin: 50px 50px;
            }
            .anim-bot-eye {
              animation: bot-blink 4.2s infinite;
              transform-origin: 50px 48px;
            }
            .anim-bot-lightning {
              animation: bot-lightning 2.6s infinite ease-in-out;
              transform-origin: 50px 20px;
            }
            .anim-bot-sun {
              animation: bot-sun-spin 18s linear infinite;
              transform-origin: 78px 24px;
            }
            .anim-bot-drop-1 {
              animation: bot-rain-drop 1.1s infinite linear;
            }
            .anim-bot-drop-2 {
              animation: bot-rain-drop 1.1s infinite linear 0.55s;
            }
          `}</style>
        </defs>

        {/* WEATHER BACKGROUND ACCESSORIES */}
        {/* 1. Sunny: Mini Orbiting Sun */}
        {isSunny && (
          <g className="anim-bot-sun">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <line
                key={i}
                x1="78"
                y1="11"
                x2="78"
                y2="15"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${ang} 78 24)`}
              />
            ))}
            <circle cx="78" cy="24" r="7" fill="url(#goldGradient)" />
          </g>
        )}

        {/* 2. Fog/Mist: Cloud-Hunting Sparkle Stars */}
        {isFog && (
          <>
            <g style={{ transformOrigin: "82px 20px", animation: "bot-sparkle 2.2s infinite ease-in-out" }}>
              <path d="M82 14L83.5 18L87 19.5L83.5 21L82 25L80.5 21L77 19.5L80.5 18L82 14Z" fill="#A855F7" />
            </g>
            <g style={{ transformOrigin: "16px 28px", animation: "bot-sparkle 2.2s infinite ease-in-out 1s" }}>
              <path d="M16 22L17.5 26L21 27.5L17.5 29L16 33L14.5 29L11 27.5L14.5 26L16 22Z" fill="#38BDF8" />
            </g>
          </>
        )}

        {/* 3. Raindrops below the Bot */}
        {isRain && (
          <g>
            <line x1="36" y1="78" x2="33" y2="86" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" className="anim-bot-drop-1" />
            <line x1="50" y1="79" x2="47" y2="87" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" className="anim-bot-drop-2" />
            <line x1="64" y1="78" x2="61" y2="86" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" className="anim-bot-drop-1" />
          </g>
        )}

        {/* MAIN BOT BODY (Bobbing Motion) */}
        <g className="anim-bot-body">
          {/* Weather Antenna on top */}
          <line x1="50" y1="28" x2="50" y2="17" stroke={isThunder ? "#FACC15" : "#94A3B8"} strokeWidth="2.5" strokeLinecap="round" />
          <circle
            cx="50"
            cy="15"
            r="4.5"
            fill={isThunder ? "#FACC15" : isSunny ? "#F59E0B" : "#38BDF8"}
            className="animate-pulse"
          />

          {/* Thunderstorm Lightning Horn/Bolt on Antenna */}
          {isThunder && (
            <g className="anim-bot-lightning">
              <polygon
                points="49,5 44,14 48,14 45,23 55,12 50,12"
                fill="url(#goldGradient)"
                stroke="#D97706"
                strokeWidth="0.8"
              />
            </g>
          )}

          {/* Fluffy Cloud Body */}
          <path
            d="M74 70H26C18.27 70 12 63.73 12 56C12 49.19 16.85 43.51 23.37 42.24C25.68 32.1 34.69 24.5 45.5 24.5C57.65 24.5 67.72 33.56 69.11 45.4C75.24 46.46 80 51.78 80 58.1C80 64.67 74.67 70 74 70Z"
            fill="url(#botCloudBody)"
            stroke={isThunder ? "#475569" : "#E2E8F0"}
            strokeWidth="2"
          />

          {/* Bot Belly Specular Highlight */}
          <path
            d="M28 66C22 66 18 62 18 57"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* CUTE BOT FACE */}
          {/* Eyes (With Blinking Animation) */}
          <g className="anim-bot-eye">
            {isSunny ? (
              /* Sunglasses for sunny weather! */
              <g>
                <rect x="33" y="44" width="14" height="9" rx="3.5" fill="#1E293B" />
                <rect x="53" y="44" width="14" height="9" rx="3.5" fill="#1E293B" />
                <line x1="47" y1="48" x2="53" y2="48" stroke="#1E293B" strokeWidth="2" />
                <line x1="35" y1="46" x2="41" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="55" y1="46" x2="61" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            ) : (
              /* Big cute shiny eyes */
              <>
                {/* Left Eye */}
                <circle cx="39" cy="48" r="4" fill="#0F172A" />
                <circle cx="40.5" cy="46.5" r="1.5" fill="#FFFFFF" />

                {/* Right Eye */}
                <circle cx="61" cy="48" r="4" fill="#0F172A" />
                <circle cx="62.5" cy="46.5" r="1.5" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* Rosy Cheeks (Blushing) */}
          <ellipse cx="31" cy="54" rx="4" ry="2.2" fill="#FB7185" opacity="0.65" />
          <ellipse cx="69" cy="54" rx="4" ry="2.2" fill="#FB7185" opacity="0.65" />

          {/* Smiling Mouth */}
          {isHappy ? (
            /* Open happy mouth */
            <path d="M44 54 Q50 63 56 54 Z" fill="#E11D48" />
          ) : (
            /* Sweet smile */
            <path
              d="M44 54 Q50 60 56 54"
              stroke="#0F172A"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Highland Scarf (when fog or mist) */}
          {isFog && (
            <path
              d="M36 67C42 70 58 70 64 67C64 69 58 73 50 73C42 73 36 69 36 67Z"
              fill="#E11D48"
              stroke="#BE123C"
              strokeWidth="1"
            />
          )}
        </g>
      </svg>
    </div>
  );
}

export function WeatherMascotBot() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch Live Weather from Open-Meteo A Luoi
  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${A_LUOI_LAT}&longitude=${A_LUOI_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=5`;
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
            specialNote = "Săn mây đỉnh Đồi Thông lúc 06:15 sáng nha! Sương mù đèo rất thơ mộng ✨";
            enSpecialNote = "Prime cloud-hunting at Pine Hill 06:15 AM! Dreamy mountain mist ✨";
          } else if (isCloudHuntingGood) {
            specialNote = "Sáng sớm có biển mây bồng bềnh, chụp ảnh lưu niệm bao đẹp!";
            enSpecialNote = "Early morning sea of clouds, incredible photo opportunities!";
          } else if (code === 0) {
            specialNote = "Nắng trong veo ấm áp! Rất lý tưởng tắm suối Pâr Le & thác A Nôr ☀️";
            enSpecialNote = "Crystal sunny day! Perfect for Par Le Stream & A Nor Waterfall ☀️";
          } else if (code === 95) {
            specialNote = "A Lưới đang giông bão! Du khách nên qua đèo QL49 trước 16:30 để an toàn ⚡";
            enSpecialNote = "Highland thunderstorm active! Cross Pass 49 before 16:30 for safety ⚡";
          } else if (code >= 80) {
            specialNote = "Trời mưa lớn vùng núi, đường đèo trơn trượt hãy chạy xe cẩn thận nhé 🌧️";
            enSpecialNote = "Heavy mountain rain, roads are slick along the pass, drive carefully 🌧️";
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
        setLoading(false);
      });
  }, []);

  // Auto-hide speech bubble after 10s to keep UI clean, reopen on hover
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Close card when click outside
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
  const currentCode = today?.weatherCode ?? 95; // Default to current condition (thunderstorm in screenshot)
  const theme = getWeatherTheme(currentCode);

  // Dynamic Bot Voice Message
  const botGreeting = () => {
    if (loading) return isEn ? "Updating A Luoi mountain weather..." : "Đang cập nhật thời tiết A Lưới...";
    if (!today) return isEn ? "Highland air is fresh and cool!" : "Khí hậu A Lưới luôn dịu mát 18–24°C!";

    if (currentCode === 95) {
      return isEn
        ? `⚡ Storm Alert (${today.tempMax}°/${today.tempMin}°C): Cross Pass 49 before 16:30 for safety!`
        : `⚡ Cảnh báo giông bão (${today.tempMax}°/${today.tempMin}°C): Du khách nên vượt đèo QL49 trước 16:30 nhé!`;
    }
    if (currentCode === 45 || currentCode === 48) {
      return isEn
        ? `🌫️ Highland Mist (${today.tempMax}°C): Prime cloud-hunting at Pine Hill 06:15 AM!`
        : `🌫️ Sương mù bồng bềnh (${today.tempMax}°C): Sáng mai 06:15 săn mây Đồi Thông tuyệt đỉnh nha!`;
    }
    if (currentCode === 0) {
      return isEn
        ? `☀️ Sunny & Bright (${today.tempMax}°C): Par Le Stream & A Nor Waterfall are crystal clear today!`
        : `☀️ Nắng đẹp trong veo (${today.tempMax}°C): Suối Pâr Le & Thác A Nôr trong xanh mát rượi, đi ngay thôi!`;
    }
    if (currentCode >= 80) {
      return isEn
        ? `🌧️ Mountain Rain (${today.tempMax}°C): Keep warm and take a steaming coffee cup!`
        : `🌧️ Mưa rừng se lạnh (${today.tempMax}°C): Mang áo ấm và thưởng thức ly cà phê A Lưới nóng nhé!`;
    }
    return isEn
      ? `🌤️ A Luoi Highland (${today.tempMax}°/${today.tempMin}°C): Pleasant weather, ready to explore!`
      : `🌤️ Cao nguyên A Lưới (${today.tempMax}°/${today.tempMin}°C): Mát mẻ trong lành, sẵn sàng khám phá!`;
  };

  return (
    <aside
      ref={containerRef}
      className="fixed bottom-6 left-6 sm:bottom-7 sm:left-7 z-40 print:hidden select-none transition-all duration-300"
      aria-label={isEn ? "A Luoi Weather Bot" : "Bé Mây - Bot thời tiết A Lưới"}
    >
      {/* 1. iOS NOTIFICATION-STYLE SPEECH BUBBLE */}
      {!isDismissed && (showSpeechBubble || isHovered) && !isExpanded && (
        <div className="absolute bottom-20 left-0 w-[280px] sm:w-[320px] ios-speech">
          <div className="relative rounded-[24px] ios-glass p-3.5 ring-1 ring-black/5 dark:ring-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.16)]">
            {/* iOS Notification Header */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-2xs">
                  <span className="text-[11px] leading-none">☁️</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black tracking-tight text-gray-900 dark:text-white">
                    {isEn ? "Bé Mây" : "Bé Mây A Lưới"}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium">· {isEn ? "now" : "bây giờ"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDismissed(true);
                  setShowSpeechBubble(false);
                  setIsHovered(false);
                }}
                className="ios-haptic-tap cursor-pointer z-30 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                aria-label="Đóng thông báo"
              >
                <X className="h-4 w-4 pointer-events-none" />
              </button>
            </div>

            {/* Notification Body Text */}
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-snug">
              {botGreeting()}
            </p>

            {/* iOS Action Button Pill */}
            <div className="mt-2.5 flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="ios-haptic-tap flex items-center gap-1 rounded-full bg-forest/10 hover:bg-forest/15 px-3 py-1 text-[10px] font-bold text-forest transition"
              >
                <span>{isEn ? "View 5-Day Forecast" : "Chạm xem dự báo 5 ngày"}</span>
                <span className="text-xs">↗</span>
              </button>
              <span className="text-[10px] font-bold text-gray-400">700m</span>
            </div>

            {/* iOS Bubble Pointer */}
            <div className="absolute -bottom-2 left-8 h-3.5 w-3.5 rotate-45 border-b border-r border-black/5 bg-white/95 dark:bg-slate-900/95" />
          </div>
        </div>
      )}

      {/* 2. THE FLOATING CLOUD BOT WITH iOS HAPTIC TAP */}
      {!isExpanded && (
        <div
          className="group relative flex items-center gap-2 cursor-pointer ios-haptic-tap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsExpanded(true)}
        >
          {/* Weather Reactive Ambient Glow Aura */}
          <div
            className="absolute -inset-2 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
            style={{ backgroundColor: theme.glowColor }}
          />

          {/* iOS Continuous Squircle Container */}
          <div
            className={`relative flex items-center justify-center rounded-[28px] ios-glass p-1.5 ring-1 ${theme.borderGlow} shadow-[0_12px_32px_rgba(0,0,0,0.18)]`}
          >
            {/* The SVG Cloud Mascot */}
            <CloudBotMascot weatherCode={currentCode} isHappy={isHovered} />

            {/* iOS Dynamic Island Style Temperature Pill */}
            {!loading && today && (
              <div className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 text-[10px] font-black text-white shadow-md ring-1.5 ring-white">
                <span>{today.tempMax}°C</span>
              </div>
            )}
          </div>

          {/* Quick Label pill beside Bot */}
          <div className="hidden sm:flex flex-col rounded-[20px] ios-glass px-3 py-1.5 shadow-sm text-left pointer-events-none group-hover:ring-1 group-hover:ring-forest/30 transition-all">
            <span className="text-[10px] font-black uppercase tracking-tight text-forest">Bé Mây A Lưới</span>
            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">
              {today ? `${today.label} · ${today.tempMax}°C` : "Thời tiết 700m"}
            </span>
          </div>
        </div>
      )}

      {/* 3. EXPANDED iOS SHEET MODAL (Spring Bloom from Bot Origin) */}
      {isExpanded && (
        <div className="w-[340px] sm:w-[380px] overflow-hidden rounded-[32px] ios-glass ios-spring ring-1 ring-black/5 dark:ring-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
          {/* iOS Sheet Grabber Bar */}
          <div className="pt-2.5 pb-1 flex justify-center bg-gradient-to-r from-transparent via-black/5 to-transparent">
            <div className="h-1.5 w-10 rounded-full bg-gray-400/40" />
          </div>

          {/* Card Header with Mascot & Dynamic Weather Gradient */}
          <div className={`relative overflow-hidden bg-gradient-to-br ${theme.cardHeaderGradient} px-5 py-4 text-white shadow-md`}>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/20 backdrop-blur-md ring-1 ring-white/30 shadow-inner">
                  <CloudBotMascot weatherCode={currentCode} isHappy={true} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-wide uppercase">
                      {isEn ? "A Luoi Weather Bot" : "Bé Mây Thời Tiết A Lưới"}
                    </h3>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold">700m</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    {isEn ? "Open-Meteo Highland Station" : "Trạm khí tượng vùng cao 24/7"}
                  </p>
                </div>
              </div>

              {/* iOS Circular Close Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="ios-haptic-tap flex h-7 w-7 items-center justify-center rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Today status banner */}
            {!loading && today && (
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-black/20 px-3.5 py-2 backdrop-blur-md ring-1 ring-white/10">
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
            {/* 5-Day Forecast Grid */}
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                {isEn ? "5-Day Highland Forecast" : "Dự báo thời tiết 5 ngày tới"}
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {forecasts.map((f, i) => (
                  <div
                    key={i}
                    className={`ios-haptic-tap flex flex-col items-center rounded-2xl p-2 text-center transition-all ${
                      i === 0
                        ? "bg-forest/10 ring-1.5 ring-forest/30 shadow-xs"
                        : "bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05]"
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase ${i === 0 ? "text-forest" : "text-gray-400"}`}>
                      {isEn ? f.enDayName : f.dayName}
                    </p>
                    <p className="text-[9px] text-gray-400">{f.date}</p>

                    <div className="my-1 flex h-7 w-7 items-center justify-center">
                      <AnimatedWeatherIcon weatherCode={f.weatherCode} size={26} showGlow={false} />
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

            {/* Special Bot Travel Tip */}
            {today?.specialNote && (
              <div
                className={`rounded-2xl p-3 text-xs leading-relaxed border ${
                  currentCode === 95
                    ? "bg-amber-500/10 text-amber-950 dark:text-amber-200 border-amber-300/40"
                    : today.isCloudHuntingGood
                    ? "bg-purple-500/10 text-purple-950 dark:text-purple-200 border-purple-300/40"
                    : "bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 border-emerald-300/40"
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
                      {isEn ? "Bé Mây's Advice Today:" : "Lời dặn của Bé Mây hôm nay:"}
                    </p>
                    <p className="mt-0.5 text-[11px] opacity-90">
                      {isEn ? today.enSpecialNote : today.specialNote}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pass 49 Warning Banner */}
            <div className="rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] p-3 text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-100">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{isEn ? "Pass 49 & Highland Weather Advisory:" : "Lưu ý vượt đèo QL49 & Đêm vùng cao:"}</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                {isEn
                  ? "Dense fog rolls over Pass 49 after 16:30. Night temperatures drop to 17–19°C — always keep a light windbreaker in your bag!"
                  : "Sương mù hạ thấp đèo QL49 sau 16:30. Nhiệt độ ban đêm hạ xuống 17–19°C (se lạnh), nhớ mang theo áo khoác gió nhẹ bạn nhé!"}
              </p>
            </div>

            {/* iOS Footer */}
            <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1">
              <span>Trạm Open-Meteo · 16.22°N, 107.31°E</span>
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setIsDismissed(false);
                  setShowSpeechBubble(true);
                }}
                className="ios-haptic-tap text-forest hover:underline font-bold"
              >
                {isEn ? "Chat with bot" : "Nhắn Bé Mây"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
