"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/components/i18n-provider";
import { AnimatedWeatherIcon, getWeatherTheme } from "@/components/ui/animated-weather-icon";
import {
  X,
  Sparkles,
  Droplets,
  Compass,
  AlertTriangle,
  ShieldAlert,
  Wind
} from "lucide-react";

import { getUnifiedWeatherData, type DayForecast, type CurrentWeather } from "@/lib/weather-service";

/**
 * Animated Mascot SVG: Bé Mây A Lưới (Highland Cloud Bot)
 * Biểu cảm và hiệu ứng thay đổi linh hoạt theo thời tiết thực tế
 */
function CloudBotMascot({
  weatherCode,
  isHappy = false,
}: {
  weatherCode: number;
  isHappy?: boolean;
}) {
  const isThunder = weatherCode >= 95;
  const isSunny = weatherCode === 0;
  const isFog = weatherCode === 45 || weatherCode === 48;
  const isRain = weatherCode >= 51 && weatherCode <= 82;

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg
        viewBox="0 0 100 100"
        width="68"
        height="68"
        className="overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
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

          <linearGradient id="goldGradient" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

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

        {isRain && (
          <g>
            <line x1="36" y1="78" x2="33" y2="86" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" className="anim-bot-drop-1" />
            <line x1="50" y1="79" x2="47" y2="87" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" className="anim-bot-drop-2" />
            <line x1="64" y1="78" x2="61" y2="86" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" className="anim-bot-drop-1" />
          </g>
        )}

        <g className="anim-bot-body">
          <line x1="50" y1="28" x2="50" y2="17" stroke={isThunder ? "#FACC15" : "#94A3B8"} strokeWidth="2.5" strokeLinecap="round" />
          <circle
            cx="50"
            cy="15"
            r="4.5"
            fill={isThunder ? "#FACC15" : isSunny ? "#F59E0B" : "#38BDF8"}
            className="animate-pulse"
          />

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

          <path
            d="M74 70H26C18.27 70 12 63.73 12 56C12 49.19 16.85 43.51 23.37 42.24C25.68 32.1 34.69 24.5 45.5 24.5C57.65 24.5 67.72 33.56 69.11 45.4C75.24 46.46 80 51.78 80 58.1C80 64.67 74.67 70 74 70Z"
            fill="url(#botCloudBody)"
            stroke={isThunder ? "#475569" : "#E2E8F0"}
            strokeWidth="2"
          />

          <path
            d="M28 66C22 66 18 62 18 57"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          <g className="anim-bot-eye">
            {isSunny ? (
              <g>
                <rect x="33" y="44" width="14" height="9" rx="3.5" fill="#1E293B" />
                <rect x="53" y="44" width="14" height="9" rx="3.5" fill="#1E293B" />
                <line x1="47" y1="48" x2="53" y2="48" stroke="#1E293B" strokeWidth="2" />
                <line x1="35" y1="46" x2="41" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="55" y1="46" x2="61" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            ) : (
              <>
                <circle cx="39" cy="48" r="4" fill="#0F172A" />
                <circle cx="40.5" cy="46.5" r="1.5" fill="#FFFFFF" />
                <circle cx="61" cy="48" r="4" fill="#0F172A" />
                <circle cx="62.5" cy="46.5" r="1.5" fill="#FFFFFF" />
              </>
            )}
          </g>

          <ellipse cx="31" cy="54" rx="4" ry="2.2" fill="#FB7185" opacity="0.65" />
          <ellipse cx="69" cy="54" rx="4" ry="2.2" fill="#FB7185" opacity="0.65" />

          {isHappy ? (
            <path d="M44 54 Q50 63 56 54 Z" fill="#E11D48" />
          ) : (
            <path
              d="M44 54 Q50 60 56 54"
              stroke="#0F172A"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

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

  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getUnifiedWeatherData()
      .then((data) => {
        if (!isMounted) return;
        if (data.current) {
          setCurrentWeather(data.current);
        }
        if (data.forecasts?.length) {
          setForecasts(data.forecasts);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
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
  const activeDay = forecasts[selectedDayIndex] || today;
  const currentCode = currentWeather?.weatherCode ?? today?.weatherCode ?? 2;
  const currentTemp = currentWeather?.temp ?? today?.tempMax ?? 22;
  const currentLabel = currentWeather ? (isEn ? currentWeather.enLabel : currentWeather.label) : (today ? (isEn ? today.enLabel : today.label) : "Dịu mát");
  const theme = getWeatherTheme(currentCode);

  // Dynamic Bot Voice Message
  const botGreeting = () => {
    if (loading) return isEn ? "Updating A Luoi mountain weather..." : "Đang cập nhật thời tiết A Lưới...";
    if (!currentWeather && !today) return isEn ? "Highland air is fresh and cool!" : "Khí hậu A Lưới luôn dịu mát 18–24°C!";

    const temp = currentTemp;
    const isDay = currentWeather?.isDay ?? true;

    if (!isDay && temp <= 22) {
      return isEn
        ? `🌙 Highland Night (${temp}°C): Cool and crisp mountain air! Remember to wear a warm jacket.`
        : `🌙 Đêm vùng cao (${temp}°C): Trời se lạnh sương mù nhẹ, nhớ mang áo ấm khi đi dạo bản làng nhé!`;
    }
    if (currentCode >= 95) {
      return isEn
        ? `⚡ Thunderstorm Notice (${temp}°C): Showers in afternoon/evening, take caution crossing Pass 49.`
        : `⚡ Lưu ý có dông rải rác (${temp}°C): Du khách nên qua đèo QL49 sớm trước chiều tối để an toàn!`;
    }
    if (currentCode === 45 || currentCode === 48) {
      return isEn
        ? `🌫️ Highland Mist (${temp}°C): Prime cloud-hunting at Pine Hill 06:15 AM!`
        : `🌫️ Sương mù bồng bềnh (${temp}°C): Sáng sớm 06:00 - 07:15 săn biển mây Đồi Thông bao đẹp nha!`;
    }
    if (currentCode === 0) {
      return isEn
        ? `☀️ Sunny & Bright (${temp}°C): Par Le Stream & A Nor Waterfall are crystal clear today!`
        : `☀️ Nắng đẹp trong veo (${temp}°C): Suối Pâr Le & Thác A Nôr trong xanh mát rượi, đi ngay thôi!`;
    }
    if (currentCode >= 80) {
      return isEn
        ? `🌧️ Mountain Rain (${temp}°C): Keep warm and take a steaming coffee cup!`
        : `🌧️ Mưa rừng se lạnh (${temp}°C): Mang áo ấm và thưởng thức ly cà phê A Lưới nóng nhé!`;
    }
    return isEn
      ? `🌤️ A Luoi Highland (${temp}°C): Fresh, pleasant weather, ready to explore!`
      : `🌤️ Cao nguyên A Lưới (${temp}°C): Không khí mát mẻ trong lành, sẵn sàng khám phá!`;
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

            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-snug">
              {botGreeting()}
            </p>

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

            <div className="absolute -bottom-2 left-8 h-3.5 w-3.5 rotate-45 border-b border-r border-black/5 bg-white/95 dark:bg-slate-900/95" />
          </div>
        </div>
      )}

      {/* 2. THE FLOATING CLOUD BOT WITH REALTIME TEMPERATURE */}
      {!isExpanded && (
        <div
          className="group relative flex items-center gap-2 cursor-pointer ios-haptic-tap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsExpanded(true)}
        >
          <div
            className="absolute -inset-2 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
            style={{ backgroundColor: theme.glowColor }}
          />

          <div
            className={`relative flex items-center justify-center rounded-[28px] ios-glass p-1.5 ring-1 ${theme.borderGlow} shadow-[0_12px_32px_rgba(0,0,0,0.18)]`}
          >
            <CloudBotMascot weatherCode={currentCode} isHappy={isHovered} />

            {!loading && (
              <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 rounded-full bg-forest px-2 py-0.5 text-[10px] font-black text-white shadow-md ring-1.5 ring-white">
                <span>{currentTemp}°C</span>
              </div>
            )}
          </div>

          <div className="hidden sm:flex flex-col rounded-[20px] ios-glass px-3 py-1.5 shadow-sm text-left pointer-events-none group-hover:ring-1 group-hover:ring-forest/30 transition-all">
            <span className="text-[10px] font-black uppercase tracking-tight text-forest">Bé Mây A Lưới</span>
            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">
              {currentLabel} · {currentTemp}°C
            </span>
          </div>
        </div>
      )}

      {/* 3. EXPANDED iOS SHEET MODAL */}
      {isExpanded && (
        <div className="w-[340px] sm:w-[380px] overflow-hidden rounded-[32px] ios-glass ios-spring ring-1 ring-black/5 dark:ring-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
          <div className="pt-2.5 pb-1 flex justify-center bg-gradient-to-r from-transparent via-black/5 to-transparent">
            <div className="h-1.5 w-10 rounded-full bg-gray-400/40" />
          </div>

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
                    {isEn ? "Live Highland Station (Open-Meteo)" : "Trạm khí tượng vùng cao trực tiếp"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="ios-haptic-tap flex h-7 w-7 items-center justify-center rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Realtime Status Banner */}
            {!loading && (
              <div className="mt-3.5 rounded-2xl bg-black/20 p-3 backdrop-blur-md ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black">{currentTemp}°C</span>
                    {today && (
                      <span className="text-[11px] text-white/80">
                        ({today.tempMin}° - {today.tempMax}°C)
                      </span>
                    )}
                    <span className="ml-1 text-xs font-bold text-amber-200">
                      {currentLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-sky-200 font-bold">
                    <div className="flex items-center gap-0.5">
                      <Droplets className="h-3.5 w-3.5" />
                      <span>{currentWeather ? `${currentWeather.humidity}%` : (today ? `${today.rainChance}%` : "--")}</span>
                    </div>
                    {currentWeather && (
                      <div className="flex items-center gap-0.5 text-[10px] text-white/80 font-normal">
                        <Wind className="h-3 w-3" />
                        <span>{currentWeather.windSpeed}km/h</span>
                      </div>
                    )}
                  </div>
                </div>

                {currentWeather && (
                  <p className="text-[10px] text-white/75 mt-1 font-medium">
                    {isEn
                      ? `Feels like ${currentWeather.apparentTemp}°C · ${currentWeather.isDay ? "Daytime" : "Nighttime in highland"}`
                      : `Cảm giác nhiệt như ${currentWeather.apparentTemp}°C · ${currentWeather.isDay ? "Ban ngày vùng cao" : "Đêm vùng cao se lạnh"}`}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-4 space-y-3.5">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                {isEn ? "5-Day Highland Forecast" : "Dự báo thời tiết 5 ngày tới"}
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {forecasts.map((f, i) => {
                  const isSelected = i === selectedDayIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDayIndex(i)}
                      className={`ios-haptic-tap flex flex-col items-center rounded-2xl p-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-forest/15 ring-2 ring-forest shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05]"
                      }`}
                    >
                      <p className={`text-[10px] font-black uppercase ${isSelected ? "text-forest" : "text-gray-400"}`}>
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
                    </button>
                  );
                })}
              </div>
            </div>

            {activeDay?.specialNote && (
              <div
                className={`rounded-2xl p-3 text-xs leading-relaxed border ${
                  activeDay.weatherCode >= 95 || activeDay.passStatus === "warning"
                    ? "bg-amber-500/10 text-amber-950 dark:text-amber-200 border-amber-300/40"
                    : activeDay.isCloudHuntingGood
                    ? "bg-purple-500/10 text-purple-950 dark:text-purple-200 border-purple-300/40"
                    : "bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 border-emerald-300/40"
                }`}
              >
                <div className="flex items-start gap-2">
                  {activeDay.weatherCode >= 95 ? (
                    <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  ) : activeDay.isCloudHuntingGood ? (
                    <Sparkles className="h-4 w-4 shrink-0 text-purple-600 mt-0.5" />
                  ) : (
                    <Compass className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">
                      {isEn
                        ? (selectedDayIndex === 0 ? "Bé Mây's Advice Today:" : `Bé Mây's Advice for ${activeDay.enDayName} (${activeDay.date}):`)
                        : (selectedDayIndex === 0 ? "Lời dặn của Bé Mây hôm nay:" : `Lời dặn của Bé Mây ${activeDay.dayName.toLowerCase()} (${activeDay.date}):`)}
                    </p>
                    <p className="mt-0.5 text-[11px] opacity-90">
                      {isEn ? activeDay.enSpecialNote : activeDay.specialNote}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`rounded-2xl p-3 text-[11px] space-y-1 border ${
                activeDay?.passStatus === "warning"
                  ? "bg-rose-500/10 border-rose-300/40 text-rose-950 dark:text-rose-200"
                  : activeDay?.passStatus === "slippery"
                  ? "bg-amber-500/10 border-amber-300/40 text-amber-950 dark:text-amber-200"
                  : activeDay?.passStatus === "foggy"
                  ? "bg-sky-500/10 border-sky-300/40 text-sky-950 dark:text-sky-200"
                  : "bg-black/[0.03] dark:bg-white/[0.04] border-transparent text-gray-600 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>
                  {isEn
                    ? `Pass 49 Advisory (${selectedDayIndex === 0 ? "Today" : activeDay?.enDayName}):`
                    : `Cung đèo QL49 (${selectedDayIndex === 0 ? "Hôm nay" : activeDay?.dayName}):`}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed">
                {isEn ? activeDay?.enPassAlert : activeDay?.passAlert}
              </p>
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1">
              <span>Trạm Open-Meteo · 16.23°N, 107.34°E · 700m</span>
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
