"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, MessageSquare, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReviewRecord } from "@/lib/server-store";

interface PlaceReviewsSectionProps {
  placeSlug: string;
  placeName: string;
  reviews: ReviewRecord[];
  averageRating: number;
  reviewCount: number;
}

export function PlaceReviewsSection({
  placeSlug,
  placeName,
  reviews,
  averageRating,
  reviewCount
}: PlaceReviewsSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Phân bổ tỷ lệ sao
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { star, count, percentage };
  });

  return (
    <section className="section-shell pb-16" id="danh-gia">
      <article className="rounded-3xl bg-white p-6 md:p-10 shadow-card border border-forest/10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-forest/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Đánh giá từ khách đã hoàn thành trải nghiệm</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-ink">Đánh giá & Trải nghiệm thực tế</h3>
            <p className="text-xs md:text-sm text-ink/60 mt-1">
              100% đánh giá đến từ du khách đã hoàn tất dịch vụ hoặc tour tại {placeName}.
            </p>
          </div>

          <Button asChild size="sm" className="bg-forest text-white hover:bg-forest/90 font-bold text-xs">
            <Link href="/account">
              <Sparkles className="size-3.5 mr-1.5" />
              Đánh giá từ đơn của bạn
            </Link>
          </Button>
        </div>

        {/* Rating Breakdown & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-center bg-beige/50 p-6 md:p-8 rounded-3xl border border-forest/10">
          {/* Average Score */}
          <div className="text-center md:border-r border-forest/15 md:pr-8">
            <div className="text-5xl md:text-6xl font-black text-ink tracking-tight">
              {reviewCount > 0 ? averageRating.toFixed(1) : "5.0"}
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-500 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-5 ${
                    i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-ink/70">
              Dựa trên {reviewCount} lượt đánh giá đã xác thực
            </p>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-2 max-w-md w-full">
            {ratingDistribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-bold text-ink flex items-center gap-1">
                  {item.star} <Star className="size-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-forest/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-ink/60 font-mono text-[11px]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-forest/5 rounded-3xl p-6">
            <MessageSquare className="size-12 text-forest/30 mx-auto" />
            <h4 className="text-base font-bold text-ink">Chưa có đánh giá nào được xuất bản</h4>
            <p className="text-xs text-ink/60 max-w-md mx-auto">
              Nếu bạn đã tham gia trải nghiệm hoặc tour tại địa điểm này, hãy đăng nhập vào tài khoản để gửi đánh giá đầu tiên.
            </p>
            <Button asChild size="sm" variant="outline" className="border-forest/20 text-forest text-xs font-bold mt-2">
              <Link href="/account">Xem đơn đặt của tôi →</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="p-5 md:p-6 rounded-3xl bg-beige/30 border border-forest/10 space-y-3 hover:bg-beige/50 transition"
              >
                {/* Author info & Rating */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-forest text-white font-black text-sm flex items-center justify-center shadow-sm">
                      {r.authorName.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-ink">{r.authorName}</span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                          <ShieldCheck className="size-3" /> Đã trải nghiệm
                        </span>
                      </div>
                      <p className="text-[11px] text-ink/50 mt-0.5">
                        Ngày đánh giá: {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="font-bold text-ink text-xs ml-1">{r.rating}.0</span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs md:text-sm text-ink/85 leading-relaxed whitespace-pre-wrap pl-1">
                  {r.content}
                </p>

                {/* Attached Images */}
                {r.images && r.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {r.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className="relative size-16 md:size-20 rounded-2xl overflow-hidden border border-black/10 cursor-zoom-in group shadow-sm"
                      >
                        <Image
                          src={img}
                          alt={`Ảnh đánh giá của ${r.authorName}`}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </article>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Ảnh phóng to"
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
