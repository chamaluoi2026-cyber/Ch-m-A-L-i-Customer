"use client";

import { useState } from "react";
import { X, AlertTriangle, CheckCircle2, Loader2, ShieldAlert, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingRecord } from "@/lib/server-store";
import { requestBookingCancellationAction, calculateCancellationQuote } from "@/app/actions/cancellation";

interface CancellationModalProps {
  booking: BookingRecord;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBooking: BookingRecord) => void;
}

const REASONS = [
  "Thay đổi kế hoạch cá nhân",
  "Không thể đi đúng ngày đã đặt",
  "Tìm được phương án di chuyển/lưu trú khác",
  "Vấn đề về giá cả hoặc ngân sách",
  "Vấn đề về dịch vụ / lịch trình chưa phù hợp",
  "Lý do sức khỏe / cá nhân đột xuất",
  "Khác"
];

export function CancellationModal({
  booking,
  isOpen,
  onClose,
  onSuccess
}: CancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [detailReason, setDetailReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPaid = booking.paymentStatus === "paid" || booking.paymentStatus === "partially_paid";
  const paidAmount = isPaid ? (booking.totalAmount || booking.finalAmount || 0) : 0;

  // Tính sơ bộ phí hủy
  const feePercent = isPaid ? 15 : 0;
  const estimatedFee = Math.round((paidAmount * feePercent) / 100);
  const estimatedRefund = Math.max(0, paidAmount - estimatedFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setErrorMsg("Vui lòng chọn một lý do hủy booking.");
      return;
    }
    if (selectedReason === "Khác" && !detailReason.trim()) {
      setErrorMsg("Vui lòng nhập lý do cụ thể khi chọn 'Khác'.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await requestBookingCancellationAction({
        bookingId: booking.id,
        reason: selectedReason,
        reasonDetail: detailReason,
        customerPhone: booking.phone
      });

      if (res.success && res.booking) {
        onSuccess(res.booking);
        onClose();
      } else {
        setErrorMsg(res.message || "Không thể thực hiện yêu cầu hủy.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Lỗi kết nối khi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-forest/15 max-h-[90vh] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-black/5 bg-gradient-to-r from-forest to-emerald-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-white/20 grid place-items-center">
              <ShieldAlert className="size-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Yêu cầu Hủy Booking</h3>
              <p className="text-xs text-white/75 font-mono">Mã đơn: {booking.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Booking Summary Card */}
          <div className="rounded-2xl bg-beige/60 p-4 border border-forest/10 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-ink">
              <span>{booking.itemTitle}</span>
              <span className="font-mono text-forest">{(booking.finalAmount || 0).toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between text-ink/65">
              <span>Ngày khởi hành:</span>
              <span className="font-medium text-ink">{booking.experienceDate || booking.startDate || "Chưa chọn"}</span>
            </div>
            <div className="flex justify-between text-ink/65">
              <span>Trạng thái thanh toán:</span>
              <span className="font-semibold text-emerald-700">
                {isPaid ? `Đã thanh toán (${paidAmount.toLocaleString("vi-VN")} đ)` : "Chưa thanh toán"}
              </span>
            </div>
          </div>

          {/* Chính sách hoàn tiền minh bạch */}
          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200/80 text-xs space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <span>Chính sách Hủy & Hoàn tiền Chạm A Lưới:</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200/60 text-ink/80">
              <div>
                <p className="text-[11px] text-ink/50">Phí hủy ước tính:</p>
                <p className="font-mono font-bold text-amber-900 mt-0.5">{estimatedFee.toLocaleString("vi-VN")} đ</p>
              </div>
              <div>
                <p className="text-[11px] text-ink/50">Dự kiến hoàn trả:</p>
                <p className="font-mono font-bold text-emerald-700 mt-0.5">{estimatedRefund.toLocaleString("vi-VN")} đ</p>
              </div>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed pt-1">
              * Hủy trước 48h miễn phí 100%. Tiền hoàn sẽ được chuyển về tài khoản ban đầu trong 24h - 48h làm việc sau khi điều phối viên xác nhận.
            </p>
          </div>

          {/* Chọn lý do hủy */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ink">
              Lý do bạn muốn hủy đơn? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1.5">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedReason === r
                      ? "border-forest bg-forest/5 font-semibold text-forest"
                      : "border-black/10 hover:bg-black/5 text-ink/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={selectedReason === r}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-forest"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Textarea chi tiết */}
          {selectedReason === "Khác" && (
            <div className="space-y-1 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-ink">
                Vui lòng nhập lý do cụ thể <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={detailReason}
                onChange={(e) => setDetailReason(e.target.value)}
                placeholder="Chia sẻ lý do cụ thể để Chạm A Lưới hỗ trợ bạn tốt nhất..."
                className="w-full rounded-xl border border-black/15 p-3 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-black/5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl text-xs font-bold"
            >
              Giữ lại đơn
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedReason}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận Hủy Booking"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
