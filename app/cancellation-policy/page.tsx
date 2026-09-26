import { Metadata } from "next";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldAlert,
  HelpCircle,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/brand.config";
import { resolveZaloCoordinator } from "@/lib/zalo-helper";

export const metadata: Metadata = {
  title: "Chính Sách Hủy Tour & Hoàn Tiền Cọc | Chạm A Lưới",
  description: "Biểu phí hủy tour, quy trình hoàn cọc minh bạch và điều khoản bất khả kháng tại Chạm A Lưới.",
};

export default function CancellationPolicyPage() {
  const zaloCoord = resolveZaloCoordinator();

  return (
    <main className="min-h-screen bg-[#F8F7F2] pt-28 pb-24 text-ink">
      <div className="section-shell max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 text-forest px-4 py-1 text-xs font-black uppercase tracking-wider">
            <Scale className="size-4 text-emerald-700" />
            <span>Quy định minh bạch quyền lợi khách hàng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink">
            Chính Sách Hủy Tour & Hoàn Tiền
          </h1>
          <p className="text-xs sm:text-sm text-ink/70 max-w-xl mx-auto leading-relaxed">
            Áp dụng cho toàn bộ các tour trải nghiệm, lưu trú homestay và dịch vụ đặt trước trên nền tảng {BRAND_CONFIG.name}.
          </p>
        </div>

        {/* Highlight Summary Card */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-card border-2 border-emerald-500/30 text-center space-y-2">
            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">Hủy trước 48 giờ</span>
            <p className="text-2xl font-black text-emerald-700">MIỄN PHÍ 100%</p>
            <p className="text-xs text-ink/65 leading-relaxed">
              Hoàn trả 100% số tiền cọc đã thanh toán. Không mất bất kỳ chi phí giữ chỗ nào.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card border-2 border-amber-500/30 text-center space-y-2">
            <span className="text-xs font-extrabold uppercase text-amber-700 tracking-wider">Hủy 24h – 48 giờ</span>
            <p className="text-2xl font-black text-amber-700">Phí 15%</p>
            <p className="text-xs text-ink/65 leading-relaxed">
              Khấu trừ 15% tổng giá trị đơn để hỗ trợ chuẩn bị thực phẩm tươi cho homestay. Hoàn trả phần cọc còn lại.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card border-2 border-rose-500/30 text-center space-y-2">
            <span className="text-xs font-extrabold uppercase text-rose-700 tracking-wider">Hủy dưới 24h / Vắng mặt</span>
            <p className="text-2xl font-black text-rose-700">Phí 30%</p>
            <p className="text-xs text-ink/65 leading-relaxed">
              Khấu trừ 30% tiền cọc để bù đắp chi phí giữ phòng cho bà con và phương tiện di chuyển tư nhân.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-forest/15 space-y-8 text-xs sm:text-sm leading-relaxed text-ink/80">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-ink flex items-center gap-2">
              <span className="size-6 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Nguyên Tắc Hủy Dịch Vụ</span>
            </h2>
            <p>
              Chạm A Lưới hoạt động theo mô hình hỗ trợ cộng đồng bản địa phát triển du lịch bền vững. Khi bạn đặt tour hoặc homestay, bà con sẽ chủ động ngắt nhận khách khác, đi chợ bản mua nguyên liệu tươi sạch và chuẩn bị phòng ốc tươm tất. Do đó, chính sách hoàn hủy được xây dựng hài hòa giữa quyền lợi của du khách và sự tôn trọng công sức chuẩn bị của đồng bào.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-ink flex items-center gap-2">
              <span className="size-6 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Trường Hợp Bất Khả Kháng (Thiên Tai, Bão Lũ Đèo QL49)</span>
            </h2>
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2 text-amber-950">
              <p className="font-bold flex items-center gap-2">
                <ShieldAlert className="size-4 text-amber-700 shrink-0" />
                <span>Cam kết an toàn tuyệt đối là trên hết:</span>
              </p>
              <p>
                Nếu chuyến đi không thể thực hiện do sạt lở đèo QL49, lũ quét thượng nguồn A Lưới, lệnh cấm di chuyển của chính quyền hoặc thiên tai bão lụt bất khả kháng:
              </p>
              <ul className="list-disc list-inside space-y-1 font-medium">
                <li>Khách hàng được quyền <strong>Hủy miễn phí 100%</strong> và nhận lại toàn bộ tiền cọc; HOẶC</li>
                <li><strong>Bảo lưu tiền cọc vô thời hạn</strong> để dời lịch sang thời điểm thời tiết thuận lợi hơn mà không phát sinh thêm chi phí.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-ink flex items-center gap-2">
              <span className="size-6 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Quy Trình Gửi Yêu Cầu Hủy & Hoàn Tiền</span>
            </h2>
            <div className="space-y-2">
              <p>Khách hàng có thể thao tác hủy dễ dàng qua các bước:</p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>
                  <strong>Qua Tài khoản khách hàng:</strong> Đăng nhập tại website, vào mục <Link href="/account?tab=bookings" className="text-forest underline font-bold">Tài khoản &gt; Đơn đặt tour</Link>, tìm mã đơn và bấm nút <code>[ Yêu cầu hủy tour ]</code>. Chọn lý do hủy bắt buộc và kiểm tra số tiền hoàn ước tính.
                </li>
                <li>
                  <strong>Hệ thống đối soát:</strong> Điều phối viên Chạm A Lưới tiếp nhận yêu cầu, liên hệ cơ sở để chốt công nợ thực tế trong vòng <strong>2 – 4 giờ</strong> làm việc.
                </li>
                <li>
                  <strong>Chuyển khoản hoàn cọc:</strong> Tiền hoàn trả sẽ được chuyển khoản trực tiếp về số tài khoản ngân hàng của bạn trong vòng <strong>24 – 72 giờ</strong> làm việc.
                </li>
              </ol>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-ink flex items-center gap-2">
              <span className="size-6 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Đổi Lịch Trình Hoặc Dời Ngày Khởi Hành</span>
            </h2>
            <p>
              Nếu bạn muốn dời ngày khởi hành thay vì hủy tour: Vui lòng liên hệ Điều phối viên trước <strong>24 giờ</strong> so với giờ khởi hành cũ. Hệ thống sẽ hỗ trợ bạn dời ngày miễn phí (tùy thuộc vào tình trạng phòng trống của homestay vào ngày mới).
            </p>
          </section>
        </div>

        {/* Contact Hotline & Support */}
        <div className="rounded-3xl bg-forest p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-black">Cần hỗ trợ xử lý hủy đơn gấp?</h3>
            <p className="text-xs text-white/80">
              Liên hệ Điều phối viên Chạm A Lưới để được tư vấn chính sách và bảo lưu lịch trình tốt nhất.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${BRAND_CONFIG.contact.hotline.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-forest px-5 py-3 text-xs font-black shadow-md hover:bg-beige transition"
            >
              <PhoneCall className="size-4" />
              <span>Hotline: {BRAND_CONFIG.contact.hotline}</span>
            </a>

            <a
              href={zaloCoord.zaloUrl || `tel:${zaloCoord.fallbackHotline.replace(/\s+/g, "")}`}
              target={zaloCoord.zaloUrl ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0068FF] text-white px-5 py-3 text-xs font-black shadow-md hover:bg-[#0055d4] transition"
            >
              <MessageSquare className="size-4" />
              <span>Chat Zalo</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
