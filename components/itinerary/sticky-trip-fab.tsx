"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Compass } from "lucide-react";
import { useLanguage } from "@/components/i18n-provider";

export function StickyTripFab() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isEn = language === "en";

  // Hide on the itinerary page itself or admin
  if (pathname?.startsWith("/itinerary") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <aside
      aria-label="AI Trip Planner Quick Access"
      className="fixed bottom-6 left-6 z-40 hidden sm:block md:bottom-8 md:left-8"
    >
      <Link
        href="/itinerary"
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-forest via-emerald-700 to-teal-800 px-4 py-2.5 text-xs md:text-sm font-extrabold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/25 ring-4 ring-emerald-500/20"
      >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
        </span>

        <Sparkles className="size-4 text-amber-300 animate-spin-slow group-hover:rotate-45 transition-transform" />
        <span className="tracking-wide">
          {isEn ? "Plan Trip with AI" : "✨ Lên chuyến đi với AI"}
        </span>
        <Compass className="size-4 opacity-75 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </aside>
  );
}
