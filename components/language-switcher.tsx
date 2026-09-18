"use client";

import { useLanguage } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "compact";
}

export function LanguageSwitcher({ className, variant = "pill" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-white/80 px-2.5 py-1 text-xs font-semibold text-ink/80 backdrop-blur-md transition hover:border-forest/30 hover:bg-white hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
          className
        )}
        aria-label={`Chuyển ngôn ngữ sang ${language === "vi" ? "English" : "Tiếng Việt"}`}
      >
        <span>{language === "vi" ? "🇻🇳" : "🇬🇧"}</span>
        <span className="font-mono uppercase tracking-wider">{language}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Chọn ngôn ngữ"
      className={cn(
        "inline-flex items-center rounded-full border border-forest/15 bg-white/90 p-0.5 shadow-sm backdrop-blur-md",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLanguage("vi")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200",
          language === "vi"
            ? "bg-forest text-white shadow-xs"
            : "text-ink/70 hover:text-forest"
        )}
        aria-pressed={language === "vi"}
      >
        <span className="text-xs leading-none">🇻🇳</span>
        <span>VI</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200",
          language === "en"
            ? "bg-forest text-white shadow-xs"
            : "text-ink/70 hover:text-forest"
        )}
        aria-pressed={language === "en"}
      >
        <span className="text-xs leading-none">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
