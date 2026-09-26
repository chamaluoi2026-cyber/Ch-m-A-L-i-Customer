import { Metadata } from "next";
import { Suspense } from "react";
import VerifyBookingClient from "./verify-booking-client";

export const metadata: Metadata = {
  title: "Tra cứu & Xác minh Booking | Chạm A Lưới",
  description: "Xác thực tính pháp lý và thông tin chính chủ của đơn đặt tour, homestay, trải nghiệm tại Chạm A Lưới – Hệ thống du lịch cộng đồng tại Huế.",
};

export default function VerifyBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F7F2] pt-32 pb-20 text-center">
          <div className="inline-block size-8 animate-spin rounded-full border-4 border-forest border-t-transparent" />
          <p className="mt-3 text-xs text-ink/60">Đang tải trung tâm xác thực booking...</p>
        </div>
      }
    >
      <VerifyBookingClient />
    </Suspense>
  );
}
