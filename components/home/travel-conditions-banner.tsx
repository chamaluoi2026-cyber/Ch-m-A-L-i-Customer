"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CloudSun,
  Navigation,
  Waves,
  Flame,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Clock,
  Compass
} from "lucide-react";
import type { TravelConditions } from "@/data/travel-conditions";
import { useLanguage } from "@/components/i18n-provider";

export const defaultTravelConditions: TravelConditions = {
  temperature: "24°C",
  weatherState: "cool",
  weatherLabel: "Tiết trời mát mẻ vùng cao, se lạnh về đêm",
  roadStatus: "normal",
  roadLabel: "Đèo QL49 thông thoáng, mặt đường khô ráo, chạy tốt",
  waterfallStatus: "open",
  waterfallLabel: "Thác A Nôr & Pâr Le mở cửa, nước trong mát",
  hotSpringStatus: "active",
  hotSpringLabel: "Suối khoáng nóng A Roàng đang hoạt động bình thường",
  advisoryNote: "Nên mang theo áo khoác mỏng và dép chống trượt khi tắm suối",
  updatedAt: "2026-05-01T07:00:00.000Z"
};

interface TravelConditionsBannerProps {
  conditions?: TravelConditions;
}

export function TravelConditionsBanner({ conditions = defaultTravelConditions }: TravelConditionsBannerProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const getRoadBadge = (status: string) => {
    switch (status) {
      case "normal":
        return { text: isEn ? "Clear & Safe" : "Thông thoáng, an toàn", color: "bg-emerald-600/90 text-white" };
      case "foggy":
        return { text: isEn ? "Light Mist - Slow" : "Sương mù nhẹ, đi chậm", color: "bg-amber-600/90 text-white" };
      case "slippery":
        return { text: isEn ? "Slippery Pass" : "Trơn trượt, cẩn thận", color: "bg-orange-600/90 text-white" };
      case "maintenance":
        return { text: isEn ? "Road Maintenance" : "Sửa chữa đoạn ngắn", color: "bg-red-600/90 text-white" };
      default:
        return { text: isEn ? "Clear & Safe" : "Thông thoáng", color: "bg-emerald-600/90 text-white" };
    }
  };

  const road = getRoadBadge(conditions.roadStatus);

  const formatUpdateHour = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    } catch {
      return "07:00";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-300/40 bg-gradient-to-r from-[#113B2C] via-[#1B4E3B] to-[#2D3E33] text-white shadow-xl">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="relative p-5 sm:p-6 lg:p-7">
        {/* Top bar: Badge & Last updated */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-400" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                {isEn ? "Live A Luoi Travel Advisory" : "Bản Tin Thực Địa A Lưới Hôm Nay"}
              </span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white/90">
                {isEn ? "Official Local Report" : "Ban Quản Trị Xác Thực"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/75">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock size={12} className="text-amber-300" />
              {isEn ? `Updated ${formatUpdateHour(conditions.updatedAt)} today` : `Cập nhật lúc ${formatUpdateHour(conditions.updatedAt)} hôm nay`}
            </span>
          </div>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mt-4">
          {/* 1. Thời tiết */}
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <CloudSun size={13} className="text-amber-300" />
              {isEn ? "Mountain Weather" : "Thời tiết & Nhiệt độ"}
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{conditions.temperature}</span>
              <span className="text-xs font-bold text-amber-200 line-clamp-1">{conditions.weatherLabel}</span>
            </div>
          </div>

          {/* 2. Đèo QL49 */}
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Navigation size={13} className="text-sky-300" />
              {isEn ? "QL49 Mountain Pass" : "Tuyến đèo QL49"}
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${road.color}`}>
                {road.text}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-white/80 line-clamp-1">{conditions.roadLabel}</p>
          </div>

          {/* 3. Thác A Nôr */}
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Waves size={13} className="text-teal-300" />
              {isEn ? "Waterfalls & Streams" : "Thác A Nôr & Pâr Le"}
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  conditions.waterfallStatus === "open"
                    ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                    : "bg-amber-500/30 text-amber-200 border border-amber-400/40"
                }`}
              >
                {conditions.waterfallStatus === "open"
                  ? (isEn ? "Open for Swimming" : "Mở cửa đón khách")
                  : (isEn ? "Caution: High Water" : "Cảnh báo nước lớn")}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-white/80 line-clamp-1">{conditions.waterfallLabel}</p>
          </div>

          {/* 4. Suối khoáng nóng */}
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Flame size={13} className="text-amber-400" />
              {isEn ? "Hot Springs" : "Suối nóng A Roàng"}
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  conditions.hotSpringStatus === "active"
                    ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                    : "bg-amber-500/30 text-amber-200 border border-amber-400/40"
                }`}
              >
                {conditions.hotSpringStatus === "active"
                  ? (isEn ? "Open & Mineral Warm" : "Đang hoạt động")
                  : (isEn ? "Maintenance" : "Tạm bảo trì")}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-white/80 line-clamp-1">{conditions.hotSpringLabel}</p>
          </div>
        </div>

        {/* Advisory Tip & CTA Button */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white/10 p-3.5 border border-white/10">
          <div className="flex items-center gap-2.5 text-xs text-white/90">
            <AlertCircle size={16} className="text-amber-300 shrink-0" />
            <span>
              <strong className="text-amber-200">{isEn ? "Local tip today:" : "Khuyến nghị hôm nay:"}</strong>{" "}
              {conditions.advisoryNote}
            </span>
          </div>

          <Link
            href="/itinerary"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-black text-ink shadow-md hover:from-amber-300 hover:to-amber-400 transition active:scale-95 shrink-0"
          >
            <Sparkles size={14} className="text-forest fill-forest" />
            <span>{isEn ? "AI Custom Itinerary" : "Lên chuyến đi với AI"}</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
