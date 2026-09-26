"use client";

import { useState, useTransition } from "react";
import {
  X,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  User,
  Loader2,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitSecurityReportAction, type SecurityReportInput } from "@/app/actions/trust";
import { BRAND_CONFIG } from "@/lib/brand.config";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
}

export function ReportIssueModal({
  isOpen,
  onClose,
  defaultBookingId = ""
}: ReportIssueModalProps) {
  const [reportType, setReportType] = useState<SecurityReportInput["reportType"]>("fraud_scam");
  const [bookingId, setBookingId] = useState(defaultBookingId);
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [suspectDetails, setSuspectDetails] = useState("");
  const [description, setDescription] = useState("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await submitSecurityReportAction({
        reportType,
        bookingId: bookingId.trim() || undefined,
        reporterName: reporterName.trim(),
        reporterPhone: reporterPhone.trim(),
        reporterEmail: reporterEmail.trim() || undefined,
        description: description.trim(),
        suspectDetails: suspectDetails.trim() || undefined
      });

      if (res.success && res.reportId) {
        setSubmittedReportId(res.reportId);
      } else {
        setError(res.error || "Gửi báo cáo thất bại. Vui lòng liên hệ hotline.");
      }
    });
  };

  const handleReset = () => {
    setSubmittedReportId(null);
    setDescription("");
    setSuspectDetails("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-200 text-ink">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-5 top-5 p-2 rounded-full text-ink/40 hover:text-ink hover:bg-beige transition"
        >
          <X className="size-5" />
        </button>

        {submittedReportId ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-6 space-y-4">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-10" />
            </div>

            <h3 className="text-2xl font-black text-ink">Đã Tiếp Nhận Báo Cáo</h3>

            <div className="rounded-2xl bg-beige/60 p-4 border border-forest/10 text-xs space-y-2 max-w-md mx-auto text-left">
              <div className="flex justify-between">
                <span className="text-ink/60">Mã tiếp nhận:</span>
                <span className="font-mono font-bold text-forest">{submittedReportId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Người phản ánh:</span>
                <span className="font-bold text-ink">{reporterName} ({reporterPhone})</span>
              </div>
              <p className="text-[11px] text-ink/70 pt-1 border-t border-black/5">
                Đội ngũ Trust & Safety của Chạm A Lưới đã nhận được cảnh báo và sẽ liên hệ hỗ trợ bạn qua số điện thoại trên trong vòng 15 – 30 phút.
              </p>
            </div>

            <p className="text-xs text-ink/60">
              Trường hợp khẩn cấp, vui lòng gọi trực tiếp hotline{" "}
              <strong className="text-forest">{BRAND_CONFIG.contact.hotline}</strong>.
            </p>

            <Button onClick={handleReset} className="w-full bg-forest text-white font-bold py-3 rounded-2xl">
              Đóng cửa sổ
            </Button>
          </div>
        ) : (
          /* REPORT FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700">
              <ShieldAlert className="size-6 shrink-0" />
              <div>
                <h3 className="text-xl font-black text-ink leading-tight">Báo Cáo Sự Cố & Phòng Tránh Lừa Đảo</h3>
                <p className="text-xs text-ink/60 mt-0.5">Trung tâm An toàn & Minh bạch du lịch Chạm A Lưới</p>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Phân loại sự cố */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-ink">Phân loại sự cố:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full rounded-2xl bg-beige/60 border border-forest/20 p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest text-ink"
              >
                <option value="fraud_scam">Nghi vấn lừa đảo / Chuyển khoản sai tài khoản</option>
                <option value="impersonation">Mạo danh thương hiệu Chạm A Lưới</option>
                <option value="service_dispute">Khiếu nại cơ sở dịch vụ / Homestay không đúng cam kết</option>
                <option value="safety_concern">Cảnh báo an toàn (Thời tiết, sạt lở đèo QL49)</option>
                <option value="other">Vấn đề bảo mật khác</option>
              </select>
            </div>

            {/* Thông tin người báo cáo */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink">Họ tên của bạn *</label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full rounded-xl bg-beige/60 border border-forest/20 p-2.5 focus:outline-none focus:ring-2 focus:ring-forest text-ink text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full rounded-xl bg-beige/60 border border-forest/20 p-2.5 focus:outline-none focus:ring-2 focus:ring-forest text-ink text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink">Mã booking liên quan (nếu có)</label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="Ví dụ: BK-17894"
                  className="w-full rounded-xl bg-beige/60 border border-forest/20 p-2.5 focus:outline-none focus:ring-2 focus:ring-forest text-ink text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Email nhận kết quả xử lý</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-beige/60 border border-forest/20 p-2.5 focus:outline-none focus:ring-2 focus:ring-forest text-ink text-xs"
                />
              </div>
            </div>

            {/* Chi tiết nghi vấn / tài khoản lạ */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-ink">Thông tin tài khoản nghi vấn / Fanpage lạ (nếu có):</label>
              <input
                type="text"
                value={suspectDetails}
                onChange={(e) => setSuspectDetails(e.target.value)}
                placeholder="Ví dụ: STK MBBank 9999xxxx nhận tiền, Link Facebook giả mạo..."
                className="w-full rounded-xl bg-beige/60 border border-forest/20 p-2.5 focus:outline-none focus:ring-2 focus:ring-forest text-ink text-xs"
              />
            </div>

            {/* Mô tả chi tiết */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-ink">Mô tả sự việc chi tiết *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vui lòng cung cấp chi tiết thời điểm, sự việc đã xảy ra để Ban Quản Trị hỗ trợ tốt nhất..."
                className="w-full rounded-2xl bg-beige/60 border border-forest/20 p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-forest text-ink"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="border-forest/20 text-xs font-bold px-5"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-6 shadow-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                    Đang gửi phản ánh...
                  </>
                ) : (
                  "Gửi báo cáo sự cố ngay"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
