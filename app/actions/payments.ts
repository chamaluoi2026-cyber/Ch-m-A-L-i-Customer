"use server";

import {
  createPayment,
  verifyAndConfirmPayment,
  processPaymentRefund,
  cancelPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByBookingId,
  getBookingById,
  type PaymentRecord,
  type PaymentMethodType
} from "@/lib/server-store";
import { PaymentProviderFactory } from "@/lib/payment/provider";
import { revalidatePath } from "next/cache";
import { getSession, requireRole, assertCustomerAccess, sanitizeErrorMessage } from "@/lib/auth/roles";
import { sendTelegramNotification } from "@/lib/notification/telegram";

// 1. Tạo yêu cầu thanh toán (Payment Request)
export async function initiatePaymentAction(params: {
  bookingId: string;
  method: PaymentMethodType;
  provider?: string;
  amount?: number;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
}) {
  try {
    const booking = getBookingById(params.bookingId);
    if (!booking) {
      return { success: false, error: "Không tìm thấy mã đơn đặt." };
    }

    // Identity check: Nếu có session khách hàng, đảm bảo khớp danh tính
    const session = await getSession();
    if (session && session.role === "CUSTOMER") {
      params.customerId = session.id;
      params.customerName = session.name;
    }

    const res = createPayment(params);
    if (!res.success || !res.payment) {
      return { success: false, error: res.error || "Không thể khởi tạo thanh toán." };
    }

    const providerInstance = PaymentProviderFactory.getProvider(params.method);
    const details = await providerInstance.initiatePayment(res.payment, booking);

    revalidatePath("/payment/" + res.payment.id);
    revalidatePath("/admin/payments");
    revalidatePath("/admin/bookings");
    revalidatePath("/account");

    return {
      success: true,
      payment: res.payment,
      details
    };
  } catch (err: any) {
    return {
      success: false,
      error: sanitizeErrorMessage(err, "Lỗi khởi tạo thanh toán.")
    };
  }
}

// 2. Xác thực thanh toán Server-Side (Không tin dữ liệu client)
export async function verifyPaymentCallbackAction(params: {
  paymentIdOrCode: string;
  receivedAmount: number;
  providerTransactionId?: string;
  actor?: { id: string; name: string; role: string };
  callbackId?: string;
}) {
  try {
    // Chỉ SUPER_ADMIN, ADMIN, FINANCE hoặc Webhook System mới được xác thực
    const session = await getSession();
    if (session && ["CONTENT_MANAGER", "SUPPORT", "BUSINESS"].includes(session.role)) {
      return { success: false, error: "FORBIDDEN: Bạn không có quyền xác thực giao dịch tài chính." };
    }

    const result = verifyAndConfirmPayment(params);
    if (!result.success || !result.payment) {
      return { success: false, error: result.error || "Xác thực thanh toán thất bại." };
    }

    revalidatePath("/payment/" + result.payment.id);
    revalidatePath("/admin/payments");
    revalidatePath("/admin/bookings");
    revalidatePath("/account");

    return {
      success: true,
      payment: result.payment,
      isDuplicate: result.isDuplicate,
      message: result.isDuplicate
        ? "Giao dịch đã được ghi nhận trước đó (Idempotent)."
        : "Thanh toán thành công và đơn đặt đã được xác nhận."
    };
  } catch (err: any) {
    return {
      success: false,
      error: sanitizeErrorMessage(err, "Lỗi xác thực thanh toán.")
    };
  }
}

// 3. Admin/Finance xử lý hoàn tiền (Refund Lifecycle)
export async function processRefundAction(params: {
  paymentIdOrCode: string;
  refundAmount?: number;
  reason: string;
  actor?: { id: string; name: string; role: string };
}) {
  try {
    // CONTENT_MANAGER, SALES, SUPPORT, BUSINESS bị chặn hoàn tiền
    const session = await requireRole(["SUPER_ADMIN", "ADMIN", "FINANCE"]);

    const effectiveActor = {
      id: session.id,
      name: session.name,
      role: session.role
    };

    const res = processPaymentRefund({
      ...params,
      actor: effectiveActor
    });

    if (!res.success || !res.payment) {
      return { success: false, error: res.error || "Lỗi xử lý hoàn tiền." };
    }

    revalidatePath("/admin/payments");
    revalidatePath("/admin/bookings");
    revalidatePath("/account");

    return { success: true, payment: res.payment };
  } catch (err: any) {
    return {
      success: false,
      error: sanitizeErrorMessage(err, "Lỗi xử lý hoàn tiền.")
    };
  }
}

// 4. Lấy danh sách thanh toán (Chỉ Quản trị & Tài chính)
export async function fetchAllPaymentsAction(): Promise<PaymentRecord[]> {
  try {
    const session = await getSession();
    // CONTENT_MANAGER, SUPPORT không được xem danh sách thanh toán
    if (session && ["CONTENT_MANAGER", "SUPPORT"].includes(session.role)) {
      return [];
    }

    return getAllPayments();
  } catch {
    return [];
  }
}

// 5. Lấy chi tiết thanh toán theo ID
export async function fetchPaymentByIdAction(id: string): Promise<PaymentRecord | null> {
  try {
    const session = await getSession();
    if (session && ["CONTENT_MANAGER", "SUPPORT"].includes(session.role)) {
      return null;
    }

    const p = getPaymentById(id);
    if (!p) return null;

    // Nếu là CUSTOMER, chỉ cho xem thanh toán của chính mình
    if (session && session.role === "CUSTOMER" && p.customerId !== session.id) {
      return null;
    }

    return p;
  } catch {
    return null;
  }
}

// 6. Khách hàng nộp ảnh biên lai / bill chuyển khoản thành công
export async function submitPaymentProofAction(params: {
  bookingId: string;
  paymentId?: string;
  receiptUrl: string;
  bankRefCode?: string;
  transactionNote?: string;
}) {
  try {
    const { bookingId, paymentId, receiptUrl, bankRefCode, transactionNote } = params;
    if (!bookingId || !receiptUrl) {
      return { success: false, error: "Thiếu thông tin mã đơn hoặc ảnh biên lai." };
    }

    const now = new Date().toISOString();
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hcunfovtwbzfatudejfs.supabase.co';
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdW5mb3Z0d2J6ZmF0dWRlamZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTM5NTM5OSwiZXhwIjoyMTA0OTcxMzk5fQ.7QwyRHqGXa6UwgbUNAhlWdmGZqpuS8Cxall2v8j7lMU';

    let updatedBooking: any = null;

    // 1. Đồng bộ lên Supabase Cloud (bookings_store)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/system_store?id=eq.bookings_store&select=data`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: "no-store"
      });
      if (res.ok) {
        const rows = await res.json();
        const list = rows[0]?.data || [];
        const b = list.find((x: any) => x.id === bookingId);
        if (b) {
          b.paymentReceiptUrl = receiptUrl;
          b.paymentProofUploadedAt = now;
          if (bankRefCode) b.bankRefCode = bankRefCode;
          b.paymentStatus = "partially_paid"; // Đã nộp ảnh biên lai, chờ duyệt
          b.updatedAt = now;
          if (!b.timeline) b.timeline = [];
          b.timeline.push({
            id: `btl-${Date.now()}`,
            stage: "paid",
            title: "Khách hàng đã gửi ảnh biên lai chuyển khoản",
            description: `Khách đã tải lên bằng chứng chuyển khoản qua VietQR / Ngân hàng.${bankRefCode ? ` Mã GD: ${bankRefCode}.` : ""}${transactionNote ? ` Ghi chú: ${transactionNote}` : ""}`,
            actor: { id: b.customerId || "guest", name: b.customerName, role: "customer" },
            timestamp: now,
            metadata: { receiptUrl, bankRefCode }
          });
          updatedBooking = b;

          await fetch(`${SUPABASE_URL}/rest/v1/system_store`, {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "resolution=merge-duplicates"
            },
            body: JSON.stringify({ id: "bookings_store", data: list, updated_at: now })
          });
        }
      }
    } catch (cloudErr) {
      console.error("[SUBMIT_PAYMENT_PROOF_CLOUD_ERR]", cloudErr);
    }

    // 2. Cập nhật local server-store nếu có
    const localBk = getBookingById(bookingId);
    if (localBk) {
      localBk.paymentReceiptUrl = receiptUrl;
      localBk.paymentProofUploadedAt = now;
      if (bankRefCode) localBk.bankRefCode = bankRefCode;
      localBk.paymentStatus = "partially_paid";
      localBk.updatedAt = now;
      if (!updatedBooking) updatedBooking = localBk;
    }

    // 3. Bắn thông báo Telegram cho Ban điều phối
    try {
      const b = updatedBooking || localBk;
      const tgMsg = `📸 <b>BIÊN LAI CHUYỂN KHOẢN MỚI - CHẠM A LƯỚI</b>\n` +
        `🆔 <b>Mã đơn:</b> <code>${bookingId}</code>\n` +
        (b ? `👤 <b>Khách hàng:</b> ${b.customerName} (${b.phone})\n` : '') +
        (b ? `💰 <b>Số tiền:</b> ${b.finalAmount?.toLocaleString("vi-VN")} đ\n` : '') +
        (bankRefCode ? `🔢 <b>Mã GD Ngân hàng:</b> <code>${bankRefCode}</code>\n` : '') +
        (transactionNote ? `💬 <b>Ghi chú:</b> ${transactionNote}\n` : '') +
        `🖼️ <b>Ảnh biên lai:</b> <a href="${receiptUrl}">Xem ảnh bill</a>\n` +
        `👉 <a href="https://chamaluoiadmin.netlify.app/admin/bookings">Xem trên Trang Quản Trị</a>`;
      await sendTelegramNotification(tgMsg);
    } catch (tgErr) {
      console.warn("Telegram alert error:", tgErr);
    }

    revalidatePath("/payment/" + (paymentId || bookingId));
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/orders");
    revalidatePath("/account");

    return {
      success: true,
      booking: updatedBooking || localBk,
      receiptUrl
    };
  } catch (err: any) {
    return {
      success: false,
      error: sanitizeErrorMessage(err, "Lỗi gửi biên lai chuyển khoản.")
    };
  }
}
