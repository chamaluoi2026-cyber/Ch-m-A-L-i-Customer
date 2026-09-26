"use server";

import { revalidatePath } from "next/cache";
import {
  getBookingById,
  updateBookingRecord,
  saveBookingTimelineEvent,
  type BookingRecord,
  getSiteSettingsAsync
} from "@/lib/server-store";

export interface CancellationRequestPayload {
  bookingId: string;
  reason: string;
  reasonDetail?: string;
  customerPhone?: string;
}

export interface CancellationResult {
  success: boolean;
  message: string;
  booking?: BookingRecord;
  error?: string;
}

// Hàm tính toán phí hủy và số tiền hoàn dự kiến dựa trên chính sách
export async function calculateCancellationQuote(booking: BookingRecord) {
  const isPaid = booking.paymentStatus === "paid" || booking.paymentStatus === "partially_paid";
  const paidAmount = isPaid ? (booking.totalAmount || booking.finalAmount || 0) : 0;

  if (!isPaid || paidAmount <= 0) {
    return {
      cancellationFee: 0,
      refundEstimatedAmount: 0,
      policyLabel: "Hủy miễn phí (Đơn chưa thanh toán)",
      feePercent: 0
    };
  }

  // So sánh ngày trải nghiệm với thời điểm hiện tại
  const expDateStr = booking.experienceDate || booking.startDate;
  let diffHours = 72; // mặc định nếu không rõ ngày

  if (expDateStr) {
    try {
      const expTime = new Date(expDateStr).getTime();
      const now = Date.now();
      diffHours = Math.round((expTime - now) / (1000 * 60 * 60));
    } catch {}
  }

  // Chính sách Chạm A Lưới:
  // - Hủy trước >= 48 giờ: Miễn phí 100%
  // - Hủy từ 24 - 48 giờ: Phí chuẩn bị cơ sở 15%
  // - Hủy dưới 24 giờ: Phí hủy muộn 30%
  let feePercent = 0;
  let policyLabel = "Miễn phí hủy (Hủy trước 48h khởi hành)";

  if (diffHours < 24) {
    feePercent = 30;
    policyLabel = "Phí hủy muộn 30% (Hủy dưới 24h trước giờ đi)";
  } else if (diffHours < 48) {
    feePercent = 15;
    policyLabel = "Phí hủy chuẩn 15% (Hủy từ 24h - 48h trước giờ đi)";
  }

  const cancellationFee = Math.round((paidAmount * feePercent) / 100);
  const refundEstimatedAmount = Math.max(0, paidAmount - cancellationFee);

  return {
    cancellationFee,
    refundEstimatedAmount,
    policyLabel,
    feePercent,
    paidAmount
  };
}

export async function requestBookingCancellationAction(
  payload: CancellationRequestPayload
): Promise<CancellationResult> {
  const { bookingId, reason, reasonDetail, customerPhone } = payload;

  if (!bookingId) {
    return { success: false, message: "Mã booking không hợp lệ", error: "MISSING_ID" };
  }

  if (!reason || reason.trim() === "") {
    return { success: false, message: "Vui lòng chọn lý do hủy booking", error: "MISSING_REASON" };
  }

  try {
    // 1. Lấy dữ liệu booking từ database
    let booking: BookingRecord | null = null;

    // Thử lấy từ Supabase Cloud
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hcunfovtwbzfatudejfs.supabase.co";
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdW5mb3Z0d2J6ZmF0dWRlamZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTM5NTM5OSwiZXhwIjoyMTA0OTcxMzk5fQ.7QwyRHqGXa6UwgbUNAhlWdmGZqpuS8Cxall2v8j7lMU";

    let cloudBookings: BookingRecord[] = [];
    if (url && key) {
      try {
        const res = await fetch(`${url}/rest/v1/system_store?id=eq.system_bookings&select=*`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          cache: "no-store"
        });
        if (res.ok) {
          const rows = await res.json();
          if (rows?.[0]?.data && Array.isArray(rows[0].data)) {
            cloudBookings = rows[0].data;
            booking = cloudBookings.find((b) => b.id === bookingId) || null;
          }
        }
      } catch {}
    }

    if (!booking) {
      booking = getBookingById(bookingId) || null;
    }

    if (!booking) {
      return { success: false, message: `Không tìm thấy booking ${bookingId}`, error: "NOT_FOUND" };
    }

    // 2. Kiểm tra điều kiện cho phép hủy
    if (booking.status === "cancelled" || booking.bookingStatus === "cancelled") {
      return { success: false, message: "Đơn booking này đã được hủy trước đó.", error: "ALREADY_CANCELLED" };
    }

    if (booking.status === "completed" || booking.bookingStatus === "completed") {
      return { success: false, message: "Đơn trải nghiệm này đã hoàn tất, không thể yêu cầu hủy.", error: "COMPLETED" };
    }

    if (booking.status === "cancellation_requested") {
      return { success: false, message: "Yêu cầu hủy của bạn đang được Ban Quản Trị xử lý.", error: "ALREADY_REQUESTED" };
    }

    // 3. Tính toán phí hủy và khoản hoàn dự kiến
    const quote = await calculateCancellationQuote(booking);
    const nowIso = new Date().toISOString();

    const isPendingUnpaid =
      (booking.status === "pending" || booking.bookingStatus === "pending") &&
      booking.paymentStatus !== "paid" &&
      booking.paymentStatus !== "partially_paid";

    // Nếu đơn chưa thanh toán và đang pending: Cho phép hủy tức thì
    // Nếu đơn đã thanh toán: Chuyển sang cancellation_requested để Admin duyệt hoàn tiền
    const newStatus = isPendingUnpaid ? "cancelled" : "cancellation_requested";
    const refundStatus = isPendingUnpaid ? "none" : "pending";

    const updatedBooking: BookingRecord = {
      ...booking,
      status: newStatus,
      bookingStatus: newStatus as any,
      cancellationReason: reason,
      cancellationReasonDetail: reasonDetail || "",
      cancellationRequestedAt: nowIso,
      cancellationFee: quote.cancellationFee,
      refundEstimatedAmount: quote.refundEstimatedAmount,
      refundStatus,
      updatedAt: nowIso
    };

    // 4. Lưu lại vào Store và Supabase Cloud
    if (cloudBookings.length > 0) {
      const idx = cloudBookings.findIndex((b) => b.id === bookingId);
      if (idx >= 0) {
        cloudBookings[idx] = updatedBooking;
      } else {
        cloudBookings.unshift(updatedBooking);
      }

      await fetch(`${url}/rest/v1/system_store`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates"
        },
        body: JSON.stringify({
          id: "system_bookings",
          data: cloudBookings,
          updated_at: nowIso
        })
      });
    }

    try {
      updateBookingRecord(updatedBooking);
      saveBookingTimelineEvent(bookingId, {
        stage: "cancelled",
        title: isPendingUnpaid ? "Khách đã hủy đơn" : "Khách gửi yêu cầu hủy booking",
        description: `Lý do: ${reason}. Chi tiết: ${reasonDetail || "Không có"}. Dự kiến hoàn: ${quote.refundEstimatedAmount.toLocaleString("vi-VN")} đ.`,
        actor: { id: customerPhone || "customer", name: booking.customerName || "Khách hàng", role: "customer" }
      });
    } catch {}

    // 5. Gửi thông báo Telegram cho Admin
    try {
      const settings = await getSiteSettingsAsync();
      if (settings?.telegramBotToken && settings?.telegramChatId) {
        const teleMsg = `⚠️ <b>YÊU CẦU HỦY BOOKING MỚI [${bookingId}]</b>\n` +
          `• Khách hàng: <b>${booking.customerName}</b> (${booking.phone})\n` +
          `• Dịch vụ: ${booking.itemTitle}\n` +
          `• Lý do: <b>${reason}</b>\n` +
          `• Chi tiết: <i>${reasonDetail || "Không có"}</i>\n` +
          `• Đã thanh toán: ${(booking.finalAmount || 0).toLocaleString("vi-VN")} đ\n` +
          `• Phí hủy ước tính: ${quote.cancellationFee.toLocaleString("vi-VN")} đ (${quote.feePercent}%)\n` +
          `• Dự kiến hoàn trả: <b>${quote.refundEstimatedAmount.toLocaleString("vi-VN")} đ</b>\n` +
          `👉 Vui lòng vào trang Admin để kiểm tra và duyệt hoàn tiền.`;

        await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: settings.telegramChatId,
            text: teleMsg,
            parse_mode: "HTML"
          })
        });
      }
    } catch {}

    revalidatePath("/account");
    revalidatePath(`/payment/${bookingId}`);

    return {
      success: true,
      message: isPendingUnpaid
        ? "Đã hủy đơn booking thành công."
        : "Đã gửi yêu cầu hủy thành công. Điều phối viên sẽ kiểm tra và liên hệ hoàn tiền trong 24-48 giờ.",
      booking: updatedBooking
    };
  } catch (err: any) {
    console.error("requestBookingCancellationAction error:", err);
    return { success: false, message: err?.message || "Lỗi xử lý yêu cầu hủy", error: "INTERNAL_ERROR" };
  }
}
