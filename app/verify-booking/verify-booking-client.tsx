"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building2,
  Calendar,
  Users,
  CreditCard,
  Lock,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  FileCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/brand.config";
import { formatCurrency } from "@/lib/utils";
import { resolveZaloCoordinator } from "@/lib/zalo-helper";
import { verifyBookingLookupAction, type VerifiedBookingDetails } from "@/app/actions/bookings";
import { ReportIssueModal } from "@/components/trust/report-issue-modal";

export default function VerifyBookingClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchCode, setSearchCode] = useState(initialId);
  const [result, setResult] = useState<VerifiedBookingDetails | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleLookup = (codeToSearch?: string) => {
    const code = (codeToSearch || searchCode).trim();
    if (!code) {
      setError("Vui lòng nhập mã booking của bạn (ví dụ: BK-..., TRIP-...)");
      setResult(null);
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await verifyBookingLookupAction(code);
      setSearched(true);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setResult(null);
        setError(res.error || "Không tìm thấy dữ liệu đơn đặt.");
      }
    });
  };

  useEffect(() => {
    if (initialId) {
      handleLookup(initialId);
    }
  }, [initialId]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const zaloCoord = result
    ? resolveZaloCoordinator(
        null,
        { bookingId: result.id, customerName: result.customerName },
        `Xin chào Chạm A Lưới, tôi cần hỗ trợ kiểm tra thông tin đơn ${result.id}.`
      )
    : resolveZaloCoordinator();

  return (
    <main className="min-h-screen bg-[#F8F7F2] pt-28 pb-24 text-ink">
      <div className="section-shell max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 text-forest px-4 py-1 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="size-4 text-emerald-700" />
            <span>Cổng xác thực an toàn chính thức</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-ink">
            Tra cứu & Xác minh Booking
          </h1>
          <p className="text-xs sm:text-sm text-ink/70 max-w-xl mx-auto leading-relaxed">
            Kiểm tra tính pháp lý, trạng thái giữ chỗ và đối soát tài khoản điều phối viên để phòng tránh rủi ro gian lận mạo danh du lịch A Lưới.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-card border border-forest/15">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink/40" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Nhập mã booking (ví dụ: BK-17894, AI-7782)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-beige/60 border border-forest/20 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-forest text-ink"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-3.5 bg-forest hover:bg-forest/90 text-white font-black text-sm rounded-2xl shrink-0 shadow-md"
            >
              {isPending ? "Đang xác thực..." : "Xác minh ngay"}
            </Button>
          </form>

          {/* Helper Tips */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-ink/50 px-1 gap-2">
            <span>Mã booking được in trong SMS, email hóa đơn hoặc trong mục Tài khoản.</span>
            <Link href="/account?tab=bookings" className="text-forest hover:underline font-bold">
              Xem đơn trong tài khoản của bạn →
            </Link>
          </div>
        </div>

        {/* Verification Result */}
        {searched && (
          <div className="transition-all animate-in fade-in duration-300">
            {result ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border-2 border-emerald-600/30 space-y-6">
                {/* Official Stamp */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="size-7" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-emerald-800 text-xs font-black bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
                        <Sparkles className="size-3 text-amber-500" />
                        <span>✓ Đã xác minh bởi Chạm A Lưới</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-ink">
                        Đơn đặt chỗ hợp lệ
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs text-forest bg-forest/5 hover:bg-forest/10 px-3 py-1.5 rounded-xl font-bold transition"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    <span>{copied ? "Đã sao chép link" : "Sao chép link xác thực"}</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  <div className="rounded-2xl bg-[#F8F7F2] p-4 border border-forest/10 space-y-1">
                    <span className="text-ink/50 text-[11px] font-semibold">Mã booking tra cứu</span>
                    <p className="font-mono text-base font-black text-forest">{result.id}</p>
                    <span className="text-[10px] text-ink/40">Phân loại: {result.type.toUpperCase()}</span>
                  </div>

                  <div className="rounded-2xl bg-[#F8F7F2] p-4 border border-forest/10 space-y-1">
                    <span className="text-ink/50 text-[11px] font-semibold">Trạng thái đặt chỗ</span>
                    <div>
                      {result.status === "confirmed" && (
                        <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-bold">
                          Đã xác nhận giữ chỗ
                        </span>
                      )}
                      {result.status === "completed" && (
                        <span className="inline-block rounded-full bg-teal-100 text-teal-800 px-2.5 py-0.5 font-bold">
                          Chuyến đi hoàn tất
                        </span>
                      )}
                      {result.status === "cancellation_requested" && (
                        <span className="inline-block rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 font-bold">
                          Đang đối soát hủy / hoàn tiền
                        </span>
                      )}
                      {result.status === "refunded" && (
                        <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-bold">
                          Đã hoàn trả tiền
                        </span>
                      )}
                      {result.status === "cancelled" && (
                        <span className="inline-block rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 font-bold">
                          Đã hủy
                        </span>
                      )}
                      {result.status === "pending" && (
                        <span className="inline-block rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 font-bold">
                          Chờ điều phối viên xác nhận
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-ink/40">Thanh toán: {result.paymentStatus === "paid" ? "Đã thanh toán đủ" : result.paymentStatus === "partially_paid" ? "Đã đặt cọc" : "Chưa thanh toán"}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F7F2] p-4 border border-forest/10 space-y-1">
                    <span className="text-ink/50 text-[11px] font-semibold">Tổng giá trị đơn</span>
                    <p className="font-black text-base text-forest">
                      {formatCurrency(result.finalAmount)}
                    </p>
                    <span className="text-[10px] text-ink/40">Niêm yết minh bạch, 0% phụ thu ẩn</span>
                  </div>

                  <div className="rounded-2xl bg-[#F8F7F2] p-4 border border-forest/10 space-y-1">
                    <span className="text-ink/50 text-[11px] font-semibold">Dịch vụ trải nghiệm</span>
                    <p className="font-bold text-ink text-sm leading-snug">{result.itemTitle}</p>
                    <p className="text-[10px] text-ink/60">Cơ sở: {result.businessName}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F7F2] p-4 border border-forest/10 space-y-1">
                    <span className="text-ink/50 text-[11px] font-semibold">Ngày thực hiện</span>
                    <p className="font-bold text-ink text-sm">{result.experienceDate}</p>
                    <p className="text-[10px] text-ink/60">Số lượng: {result.numberOfPeople} khách</p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F7F2] p-4 border border-forest/10 space-y-1">
                    <span className="text-ink/50 text-[11px] font-semibold">Khách hàng (Bảo mật Anti-Doxxing)</span>
                    <p className="font-bold text-ink text-sm">{result.customerName}</p>
                    <p className="text-[11px] font-mono text-ink/70">SĐT: {result.maskedPhone}</p>
                  </div>
                </div>

                {/* Anti-Fraud Security Guarantee Notice */}
                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-emerald-950">
                  <Lock className="size-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1 leading-relaxed">
                    <strong className="font-bold block text-sm text-emerald-900">
                      Bảo đảm an toàn giao dịch từ Chạm A Lưới
                    </strong>
                    <p>
                      Đơn hàng này được kết nối trực tiếp với chủ cơ sở bản địa và đội ngũ điều phối viên của Chạm A Lưới tại huyện A Lưới. Khách hàng được cam kết giữ phòng, đúng lịch trình và hưởng chính sách hỗ trợ hoàn hủy 100% minh bạch.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={zaloCoord.zaloUrl || `tel:${zaloCoord.fallbackHotline.replace(/\s+/g, "")}`}
                      target={zaloCoord.zaloUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0068FF] hover:bg-[#0055d4] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
                    >
                      <MessageSquare className="size-4" />
                      <span>Chat Zalo với Điều phối viên</span>
                    </a>

                    <a
                      href={`tel:${BRAND_CONFIG.contact.hotline.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-forest/20 bg-white hover:bg-forest/5 px-4 py-2.5 text-xs font-bold text-forest transition"
                    >
                      <PhoneCall className="size-3.5" />
                      <span>Hotline: {BRAND_CONFIG.contact.hotline}</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setIsReportOpen(true)}
                    type="button"
                    className="text-xs text-rose-600 hover:text-rose-800 underline font-semibold"
                  >
                    Báo cáo nghi vấn bất thường?
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center shadow-card border border-rose-200 space-y-4">
                <div className="size-14 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
                  <AlertTriangle className="size-8" />
                </div>
                <h3 className="text-xl font-black text-ink">Không tìm thấy mã booking</h3>
                <p className="text-xs text-ink/70 max-w-md mx-auto leading-relaxed">
                  {error || "Mã đơn đặt không tồn tại trên hệ thống hoặc đã quá thời hạn lưu trữ."}
                </p>
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 max-w-lg mx-auto text-left space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="size-4 text-amber-600 shrink-0" />
                    Cảnh báo phòng tránh lừa đảo & mạo danh
                  </p>
                  <p className="leading-relaxed opacity-90">
                    Nếu có đối tượng tự xưng là Chạm A Lưới yêu cầu bạn chuyển khoản cọc vào tài khoản cá nhân lạ không có mã đơn hợp lệ, xin tuyệt đối KHÔNG chuyển tiền và hãy thông báo ngay cho chúng tôi qua Hotline {BRAND_CONFIG.contact.hotline}.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-6"
                  >
                    Gửi báo cáo nghi vấn lừa đảo
                  </Button>
                  <Button asChild variant="outline" className="border-forest/20 text-forest text-xs font-bold">
                    <Link href="/trust">Tìm hiểu Trung Tâm Tin Cậy →</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Checklist Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 border border-forest/10 space-y-2">
            <div className="size-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <Building2 className="size-5" />
            </div>
            <h4 className="font-bold text-sm text-ink">Cơ sở bản địa thực tế</h4>
            <p className="text-xs text-ink/65 leading-relaxed">
              Mỗi homestay, HTX dệt Zèng hay điểm trải nghiệm đều được đội ngũ Chạm A Lưới kiểm tra cơ sở vật chất trực tiếp.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 border border-forest/10 space-y-2">
            <div className="size-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="size-5" />
            </div>
            <h4 className="font-bold text-sm text-ink">Thanh toán bảo mật</h4>
            <p className="text-xs text-ink/65 leading-relaxed">
              Quét mã VietQR chuẩn Napas247 tự động gắn mã đơn đối soát chính xác 100%, không lo chuyển nhầm số tài khoản.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 border border-forest/10 space-y-2">
            <div className="size-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <PhoneCall className="size-5" />
            </div>
            <h4 className="font-bold text-sm text-ink">Hỗ trợ khẩn cấp 24/7</h4>
            <p className="text-xs text-ink/65 leading-relaxed">
              Điều phối viên địa phương luôn sẵn sàng hỗ trợ chỉ đường đường đèo QL49, thời tiết và xử lý sự cố xuyên suốt chuyến đi.
            </p>
          </div>
        </div>

        {/* Report Modal */}
        <ReportIssueModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          defaultBookingId={result?.id || searchCode}
        />
      </div>
    </main>
  );
}
