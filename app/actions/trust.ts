"use server";

import { sendTelegramNotification, escapeHtml } from "@/lib/notification/telegram";
import { revalidatePath } from "next/cache";

export interface SecurityReportInput {
  reportType: "fraud_scam" | "service_dispute" | "safety_concern" | "impersonation" | "other";
  bookingId?: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  description: string;
  suspectDetails?: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hcunfovtwbzfatudejfs.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdW5mb3Z0d2J6ZmF0dWRlamZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTM5NTM5OSwiZXhwIjoyMTA0OTcxMzk5fQ.7QwyRHqGXa6UwgbUNAhlWdmGZqpuS8Cxall2v8j7lMU';

export async function submitSecurityReportAction(input: SecurityReportInput): Promise<{
  success: boolean;
  reportId?: string;
  error?: string;
}> {
  try {
    if (!input.reporterName?.trim()) {
      return { success: false, error: "Vui lòng nhập họ tên người báo cáo." };
    }
    if (!input.reporterPhone?.trim()) {
      return { success: false, error: "Vui lòng nhập số điện thoại để Điều phối viên liên hệ xử lý." };
    }
    if (!input.description?.trim()) {
      return { success: false, error: "Vui lòng mô tả chi tiết sự cố hoặc nghi vấn." };
    }

    const reportId = `REP-${Date.now().toString().slice(-6)}`;
    const createdAt = new Date().toISOString();

    const reportData = {
      id: reportId,
      ...input,
      status: "pending_review",
      createdAt
    };

    // 1. Lưu vào Supabase bảng system_store (key = security_reports)
    try {
      const getRes = await fetch(`${SUPABASE_URL}/rest/v1/system_store?key=eq.security_reports&select=value`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        cache: 'no-store'
      });

      let existingList: any[] = [];
      if (getRes.ok) {
        const rows = await getRes.json();
        if (rows.length > 0 && Array.isArray(rows[0].value)) {
          existingList = rows[0].value;
        }
      }

      existingList.unshift(reportData);

      // Cập nhật lại vào Supabase
      await fetch(`${SUPABASE_URL}/rest/v1/system_store`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          key: 'security_reports',
          value: existingList.slice(0, 200), // giữ 200 report gần nhất
          updated_at: new Date().toISOString()
        })
      });
    } catch (saveErr) {
      console.warn("Could not save report to Supabase system_store:", saveErr);
    }

    // 2. Gửi Telegram Alert khẩn cấp tới Ban Quản Trị
    const reportTypeLabels: Record<string, string> = {
      fraud_scam: "Lừa đảo / Chuyển tiền sai tài khoản",
      service_dispute: "Khiếu nại chất lượng dịch vụ / Homestay",
      safety_concern: "An toàn đường đi / Thời tiết nguy hiểm",
      impersonation: "Mạo danh Chạm A Lưới / Lừa cọc",
      other: "Vấn đề bảo mật khác"
    };

    const typeLabel = reportTypeLabels[input.reportType] || "Sự cố bảo mật";

    const telegramMsg = `🚨 <b>BÁO CÁO SỰ CỐ / TRUST & SAFETY</b>
━━━━━━━━━━━━━━━━━━
🆔 Mã báo cáo: <code>${reportId}</code>
🏷️ Phân loại: <b>${escapeHtml(typeLabel)}</b>
${input.bookingId ? `📦 Mã Booking: <code>${escapeHtml(input.bookingId)}</code>\n` : ""}👤 Người gửi: <b>${escapeHtml(input.reporterName)}</b>
📞 Số điện thoại: <code>${escapeHtml(input.reporterPhone)}</code>
${input.reporterEmail ? `📧 Email: ${escapeHtml(input.reporterEmail)}\n` : ""}
📝 <b>Nội dung phản ánh:</b>
<i>${escapeHtml(input.description)}</i>
${input.suspectDetails ? `\n⚠️ <b>Thông tin nghi can / tài khoản lạ:</b>\n<code>${escapeHtml(input.suspectDetails)}</code>` : ""}
━━━━━━━━━━━━━━━━━━
⚡ <i>Vui lòng vào trang Admin để liên hệ khách hàng và xử lý ngay!</i>`;

    try {
      await sendTelegramNotification(telegramMsg);
    } catch (telErr) {
      console.warn("Telegram alert failed:", telErr);
    }

    revalidatePath("/admin/trust-safety");
    return { success: true, reportId };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Lỗi xử lý gửi báo cáo. Vui lòng liên hệ hotline."
    };
  }
}
