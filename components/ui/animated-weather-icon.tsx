"use client";

import React from "react";

export interface AnimatedWeatherIconProps {
  weatherCode: number;
  size?: number;
  className?: string;
  showGlow?: boolean;
}

/**
 * Returns weather classification and styling metadata based on WMO code
 */
export function getWeatherTheme(code: number) {
  if (code === 0) {
    return {
      type: "sunny",
      label: "Nắng đẹp",
      enLabel: "Clear Sky",
      glowColor: "rgba(245, 158, 11, 0.4)",
      bgGradient: "from-amber-400/20 via-yellow-400/10 to-orange-400/20",
      borderGlow: "border-amber-300/40",
      textColor: "text-amber-900",
      accentDot: "bg-amber-400",
      cardHeaderGradient: "from-amber-500 via-orange-500 to-amber-600",
      floatingBorder: "border-amber-200/60 shadow-[0_8px_32px_rgba(245,158,11,0.22)]",
    };
  }
  if (code === 1 || code === 2) {
    return {
      type: "partly-cloudy",
      label: "Ít mây",
      enLabel: "Partly Cloudy",
      glowColor: "rgba(56, 189, 248, 0.4)",
      bgGradient: "from-sky-400/20 via-amber-300/10 to-blue-400/20",
      borderGlow: "border-sky-300/40",
      textColor: "text-sky-950",
      accentDot: "bg-sky-400",
      cardHeaderGradient: "from-sky-500 via-blue-500 to-indigo-600",
      floatingBorder: "border-sky-200/60 shadow-[0_8px_32px_rgba(56,189,248,0.22)]",
    };
  }
  if (code === 3) {
    return {
      type: "overcast",
      label: "Nhiều mây",
      enLabel: "Overcast",
      glowColor: "rgba(148, 163, 184, 0.35)",
      bgGradient: "from-slate-400/20 via-sky-400/10 to-slate-500/20",
      borderGlow: "border-slate-300/40",
      textColor: "text-slate-900",
      accentDot: "bg-slate-400",
      cardHeaderGradient: "from-slate-600 via-slate-700 to-zinc-800",
      floatingBorder: "border-slate-200/60 shadow-[0_8px_32px_rgba(148,163,184,0.2)]",
    };
  }
  if (code === 45 || code === 48) {
    return {
      type: "fog",
      label: "Sương mù đèo",
      enLabel: "Highland Mist",
      glowColor: "rgba(168, 85, 247, 0.35)",
      bgGradient: "from-purple-400/20 via-teal-400/15 to-indigo-400/20",
      borderGlow: "border-purple-300/40",
      textColor: "text-purple-950",
      accentDot: "bg-purple-400",
      cardHeaderGradient: "from-purple-600 via-indigo-600 to-teal-700",
      floatingBorder: "border-purple-200/60 shadow-[0_8px_32px_rgba(168,85,247,0.22)]",
    };
  }
  if (code >= 51 && code <= 55) {
    return {
      type: "drizzle",
      label: "Mưa phùn",
      enLabel: "Drizzle",
      glowColor: "rgba(56, 189, 248, 0.4)",
      bgGradient: "from-cyan-400/20 via-sky-400/15 to-blue-400/20",
      borderGlow: "border-cyan-300/40",
      textColor: "text-cyan-950",
      accentDot: "bg-cyan-400",
      cardHeaderGradient: "from-cyan-600 via-sky-600 to-blue-700",
      floatingBorder: "border-cyan-200/60 shadow-[0_8px_32px_rgba(6,182,212,0.22)]",
    };
  }
  if (code >= 61 && code <= 82) {
    return {
      type: "rain",
      label: code >= 80 ? "Mưa rào" : "Mưa",
      enLabel: code >= 80 ? "Heavy Showers" : "Rain",
      glowColor: "rgba(37, 99, 235, 0.45)",
      bgGradient: "from-blue-500/20 via-indigo-400/15 to-sky-500/20",
      borderGlow: "border-blue-400/40",
      textColor: "text-blue-950",
      accentDot: "bg-blue-500",
      cardHeaderGradient: "from-blue-600 via-indigo-700 to-slate-800",
      floatingBorder: "border-blue-200/60 shadow-[0_8px_32px_rgba(37,99,235,0.25)]",
    };
  }
  if (code === 95 || code >= 96) {
    return {
      type: "thunderstorm",
      label: "Giông bão",
      enLabel: "Thunderstorm",
      glowColor: "rgba(234, 179, 8, 0.5)",
      bgGradient: "from-indigo-600/25 via-purple-700/20 to-amber-500/25",
      borderGlow: "border-amber-400/50",
      textColor: "text-indigo-950",
      accentDot: "bg-amber-400",
      cardHeaderGradient: "from-slate-900 via-indigo-950 to-purple-900",
      floatingBorder: "border-amber-300/50 shadow-[0_8px_36px_rgba(234,179,8,0.28)] ring-1 ring-amber-300/30",
    };
  }
  return {
    type: "variable",
    label: "Biến thiên",
    enLabel: "Variable",
    glowColor: "rgba(59, 130, 246, 0.35)",
    bgGradient: "from-teal-400/20 via-sky-400/15 to-emerald-400/20",
    borderGlow: "border-teal-300/40",
    textColor: "text-teal-950",
    accentDot: "bg-teal-400",
    cardHeaderGradient: "from-teal-600 via-emerald-600 to-cyan-700",
    floatingBorder: "border-teal-200/60 shadow-[0_8px_32px_rgba(20,184,166,0.22)]",
  };
}

export function AnimatedWeatherIcon({
  weatherCode,
  size = 44,
  className = "",
  showGlow = true,
}: AnimatedWeatherIconProps) {
  const theme = getWeatherTheme(weatherCode);

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Pulsing Glow Backdrop */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-75 pointer-events-none transition-all duration-700 animate-pulse"
          style={{
            backgroundColor: theme.glowColor,
            transform: "scale(1.15)",
          }}
        />
      )}

      {/* Dynamic SVG Weather Art */}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="relative z-10 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="sunGradient" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="cloudFrontGrad" x1="18" y1="20" x2="46" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F0F9FF" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>

          <linearGradient id="cloudStormGrad" x1="18" y1="20" x2="46" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="60%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>

          <linearGradient id="cloudBackGrad" x1="24" y1="14" x2="52" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="lightningGrad" x1="30" y1="28" x2="34" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.16" />
          </filter>

          <filter id="lightningGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#FACC15" floodOpacity="0.9" />
          </filter>

          {/* Keyframe Styles */}
          <style>{`
            @keyframes weather-spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes weather-float-soft {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-3px); }
            }
            @keyframes weather-float-offset {
              0%, 100% { transform: translate(0px, 0px); }
              50% { transform: translate(-2px, -2px); }
            }
            @keyframes weather-rain-drop-1 {
              0% { transform: translateY(0) scaleY(1); opacity: 0; }
              30% { opacity: 1; }
              80% { transform: translateY(12px) scaleY(1.2); opacity: 1; }
              100% { transform: translateY(16px) scaleY(0.4); opacity: 0; }
            }
            @keyframes weather-rain-drop-2 {
              0% { transform: translateY(0) scaleY(1); opacity: 0; }
              30% { opacity: 1; }
              80% { transform: translateY(12px) scaleY(1.2); opacity: 1; }
              100% { transform: translateY(16px) scaleY(0.4); opacity: 0; }
            }
            @keyframes weather-lightning-flash {
              0%, 100% { opacity: 0.15; transform: scale(0.96); }
              20% { opacity: 1; transform: scale(1.04); }
              24% { opacity: 0.3; }
              28% { opacity: 1; transform: scale(1.02); }
              38% { opacity: 0.15; }
              70% { opacity: 0.15; }
              74% { opacity: 0.95; }
              78% { opacity: 0.2; }
            }
            @keyframes weather-mist-drift {
              0% { transform: translateX(-3px); opacity: 0.55; }
              50% { transform: translateX(3px); opacity: 0.9; }
              100% { transform: translateX(-3px); opacity: 0.55; }
            }
            @keyframes weather-sparkle-twinkle {
              0%, 100% { opacity: 0.2; transform: scale(0.7) rotate(0deg); }
              50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
            }
            .anim-sun-spin {
              transform-origin: 32px 32px;
              animation: weather-spin-slow 24s linear infinite;
            }
            .anim-sun-spin-offset {
              transform-origin: 42px 19px;
              animation: weather-spin-slow 20s linear infinite;
            }
            .anim-cloud-float {
              animation: weather-float-soft 4s ease-in-out infinite;
            }
            .anim-cloud-back {
              animation: weather-float-offset 5s ease-in-out infinite;
            }
            .anim-rain-1 {
              animation: weather-rain-drop-1 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .anim-rain-2 {
              animation: weather-rain-drop-2 1.2s cubic-bezier(0.4, 0, 0.6, 1) 0.5s infinite;
            }
            .anim-rain-3 {
              animation: weather-rain-drop-1 1.2s cubic-bezier(0.4, 0, 0.6, 1) 0.85s infinite;
            }
            .anim-lightning {
              transform-origin: 32px 36px;
              animation: weather-lightning-flash 2.8s ease-in-out infinite;
            }
            .anim-mist-1 {
              animation: weather-mist-drift 3.5s ease-in-out infinite;
            }
            .anim-mist-2 {
              animation: weather-mist-drift 4.5s ease-in-out 0.8s infinite;
            }
            .anim-sparkle {
              transform-origin: center;
              animation: weather-sparkle-twinkle 2s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* 1. SUNNY (Code 0) */}
        {theme.type === "sunny" && (
          <g>
            {/* Spinning Rays */}
            <g className="anim-sun-spin">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1="32"
                  y1="10"
                  x2="32"
                  y2="15"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 32 32)`}
                />
              ))}
            </g>
            {/* Sun Body */}
            <circle cx="32" cy="32" r="14" fill="url(#sunGradient)" />
            {/* Warm core reflection */}
            <circle cx="28" cy="28" r="4.5" fill="#FEF08A" opacity="0.6" />
          </g>
        )}

        {/* 2. PARTLY CLOUDY (Code 1-2) */}
        {theme.type === "partly-cloudy" && (
          <g>
            {/* Peeking Sun */}
            <g className="anim-sun-spin-offset">
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <line
                  key={i}
                  x1="42"
                  y1="9"
                  x2="42"
                  y2="13"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 42 19)`}
                />
              ))}
            </g>
            <circle cx="42" cy="19" r="10" fill="url(#sunGradient)" />

            {/* Front Floating Cloud */}
            <g className="anim-cloud-float" filter="url(#cloudShadow)">
              <path
                d="M45 42H20C15.58 42 12 38.42 12 34C12 30.13 14.75 26.9 18.45 26.17C19.78 20.37 24.93 16 31 16C37.89 16 43.6 21.13 44.4 27.85C47.6 28.53 50 31.42 50 34.9C50 38.82 46.82 42 45 42Z"
                fill="url(#cloudFrontGrad)"
              />
            </g>
          </g>
        )}

        {/* 3. OVERCAST / CLOUDY (Code 3) */}
        {theme.type === "overcast" && (
          <g>
            {/* Background Secondary Cloud */}
            <g className="anim-cloud-back" opacity="0.8">
              <path
                d="M48 34H26C22.68 34 20 31.32 20 28C20 25.1 22.06 22.68 24.84 22.13C25.83 17.78 29.7 14.5 34.25 14.5C39.42 14.5 43.7 18.35 44.3 23.39C46.7 23.9 48.5 26.07 48.5 28.68C48.5 31.62 46.12 34 48 34Z"
                fill="url(#cloudBackGrad)"
              />
            </g>

            {/* Front Floating Cloud */}
            <g className="anim-cloud-float" filter="url(#cloudShadow)">
              <path
                d="M46 44H19C14.58 44 11 40.42 11 36C11 32.13 13.75 28.9 17.45 28.17C18.78 22.37 23.93 18 30 18C36.89 18 42.6 23.13 43.4 29.85C46.6 30.53 49 33.42 49 36.9C49 40.82 45.82 44 46 44Z"
                fill="url(#cloudFrontGrad)"
              />
            </g>
          </g>
        )}

        {/* 4. FOG / MIST (Code 45, 48 - Săn mây Đồi Thông) */}
        {theme.type === "fog" && (
          <g>
            {/* Sparkles of Mystic Highland Morning */}
            <g className="anim-sparkle" style={{ transformOrigin: "46px 14px" }}>
              <path d="M46 10L47.5 13.5L51 15L47.5 16.5L46 20L44.5 16.5L41 15L44.5 13.5L46 10Z" fill="#F472B6" />
            </g>
            <g className="anim-sparkle" style={{ transformOrigin: "14px 22px", animationDelay: "1s" }}>
              <path d="M14 18L15 20.5L17.5 21.5L15 22.5L14 25L13 22.5L10.5 21.5L13 20.5L14 18Z" fill="#38BDF8" />
            </g>

            {/* Cloud */}
            <g className="anim-cloud-float" filter="url(#cloudShadow)">
              <path
                d="M46 36H19C14.58 36 11 32.42 11 28C11 24.13 13.75 20.9 17.45 20.17C18.78 14.37 23.93 10 30 10C36.89 10 42.6 15.13 43.4 21.85C46.6 22.53 49 25.42 49 28.9C49 32.82 45.82 36 46 36Z"
                fill="url(#cloudFrontGrad)"
              />
            </g>

            {/* Drifting Mist Wave Ribbons */}
            <g className="anim-mist-1">
              <path d="M14 42H48" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </g>
            <g className="anim-mist-2">
              <path d="M18 48H44" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M22 53H38" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          </g>
        )}

        {/* 5. DRIZZLE (Code 51-55) */}
        {theme.type === "drizzle" && (
          <g>
            <g className="anim-cloud-float" filter="url(#cloudShadow)">
              <path
                d="M46 37H19C14.58 37 11 33.42 11 29C11 25.13 13.75 21.9 17.45 21.17C18.78 15.37 23.93 11 30 11C36.89 11 42.6 16.13 43.4 22.85C46.6 23.53 49 26.42 49 29.9C49 33.82 45.82 37 46 37Z"
                fill="url(#cloudFrontGrad)"
              />
            </g>
            {/* Drizzle drops */}
            <g className="anim-rain-1">
              <line x1="24" y1="42" x2="22" y2="47" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g className="anim-rain-2">
              <line x1="32" y1="42" x2="30" y2="47" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g className="anim-rain-3">
              <line x1="40" y1="42" x2="38" y2="47" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 6. RAIN / SHOWERS (Code 61-82) */}
        {theme.type === "rain" && (
          <g>
            <g className="anim-cloud-float" filter="url(#cloudShadow)">
              <path
                d="M46 36H19C14.58 36 11 32.42 11 28C11 24.13 13.75 20.9 17.45 20.17C18.78 14.37 23.93 10 30 10C36.89 10 42.6 15.13 43.4 21.85C46.6 22.53 49 25.42 49 28.9C49 32.82 45.82 36 46 36Z"
                fill="url(#cloudBackGrad)"
              />
            </g>
            {/* Angled Rain Streaks */}
            <g className="anim-rain-1">
              <line x1="23" y1="40" x2="19" y2="50" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <g className="anim-rain-2">
              <line x1="32" y1="40" x2="28" y2="51" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <g className="anim-rain-3">
              <line x1="41" y1="40" x2="37" y2="50" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 7. THUNDERSTORM / GIÔNG BÃO (Code 95) */}
        {theme.type === "thunderstorm" && (
          <g>
            {/* Dark Storm Cloud */}
            <g className="anim-cloud-float" filter="url(#cloudShadow)">
              <path
                d="M47 35H18C13.58 35 10 31.42 10 27C10 23.13 12.75 19.9 16.45 19.17C17.78 13.37 22.93 9 29 9C35.89 9 41.6 14.13 42.4 20.85C45.6 21.53 48 24.42 48 27.9C48 31.82 44.82 35 47 35Z"
                fill="url(#cloudStormGrad)"
              />
            </g>

            {/* Rain Streaks */}
            <g className="anim-rain-1" opacity="0.75">
              <line x1="20" y1="40" x2="16" y2="49" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g className="anim-rain-2" opacity="0.75">
              <line x1="43" y1="40" x2="39" y2="49" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Glowing Zigzag Lightning Bolt */}
            <g className="anim-lightning" filter="url(#lightningGlow)">
              <polygon
                points="33,26 25,38 31,38 27,53 39,36 33,36"
                fill="url(#lightningGrad)"
                stroke="#F59E0B"
                strokeWidth="1"
              />
            </g>
          </g>
        )}

        {/* 8. VARIABLE / FALLBACK */}
        {theme.type === "variable" && (
          <g>
            <g className="anim-cloud-float" filter="url(#cloudShadow)">
              <path
                d="M46 38H19C14.58 38 11 34.42 11 30C11 26.13 13.75 22.9 17.45 22.17C18.78 16.37 23.93 12 30 12C36.89 12 42.6 17.13 43.4 23.85C46.6 24.53 49 27.42 49 30.9C49 34.82 45.82 38 46 38Z"
                fill="url(#cloudFrontGrad)"
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
