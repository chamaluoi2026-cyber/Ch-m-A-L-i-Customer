"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  BadgeCheck,
  AlertTriangle,
  HeartHandshake,
  Compass,
  FileCheck,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  Users,
  ShieldAlert,
  Search,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/brand.config";
import { resolveZaloCoordinator } from "@/lib/zalo-helper";
import { ReportIssueModal } from "@/components/trust/report-issue-modal";

export default function TrustClient() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const zaloCoord = resolveZaloCoordinator();

  const COMMITMENTS = [
    {
      num: "01",
      title: "100% Giá Niêm Yết Minh Bạch",
      tagline: "Tuyệt đối không ép giá, không phụ thu ẩn khi nhận phòng",
      desc: "Mọi giá dịch vụ homestay, hướng dẫn viên và ẩm thực bản địa trên Chạm A Lưới đều được ký kết niêm yết chuẩn mực cùng bà con HTX địa phương. Mức giá bạn nhìn thấy là mức giá thanh toán cuối cùng.",
      icon: Scale,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
    {
      num: "02",
      title: "Cơ Sở & Điểm Đến Thẩm Định Thực Tế",
      tagline: "100% kiểm tra thực địa PCCC, vệ sinh thực phẩm và an toàn suối thác",
      desc: "Chúng tôi không đăng tải đại trà. Từng nhà sàn, homestay ven suối, làng nghề dệt Zèng hay điểm tắm thác A Nôr đều được đội ngũ khảo sát kỹ lưỡng về điều kiện đón tiếp văn minh trước khi cấp huy hiệu xác thực.",
      icon: BadgeCheck,
      color: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
      num: "03",
      title: "Bảo Vệ Thanh Toán & Hoàn Cọc Rõ Ràng",
      tagline: "Hệ thống VietQR Napas247 đối soát tự động, hoàn cọc miễn phí trước 48h",
      desc: "Thanh toán an toàn qua mã QR tự động kèm mã booking. Tiền cọc được Chạm A Lưới giữ bảo đảm và thanh quyết toán cho cơ sở chỉ sau khi bạn nhận phòng thành công. Khách hàng được quyền hủy hoàn theo biểu phí minh bạch.",
      icon: Lock,
      color: "bg-amber-50 text-amber-900 border-amber-200"
    },
    {
      num: "04",
      title: "Người Bản Địa Đồng Hành Am Hiểu Văn Hóa",
      tagline: "Bảo tồn giá trị nhân văn của đồng bào Pa Cô, Tà Ôi, Cơ Tu",
      desc: "Người dẫn đường và chủ nhà là những người con sinh ra và lớn lên giữa đại ngàn A Lưới. Từng lời ca, tiếng đàn Ta Lư hay câu chuyện bếp lửa nhà rông đều được truyền tải chân thực và đầy tự hào.",
      icon: Users,
      color: "bg-purple-50 text-purple-900 border-purple-200"
    },
    {
      num: "05",
      title: "Trợ Lý Khẩn Cấp & Cảnh Báo Đèo QL49 24/7",
      tagline: "Cập nhật sương mù, mưa lũ và hỗ trợ cứu hộ đường dài theo thời gian thực",
      desc: "Điều phối viên Chạm A Lưới đóng tại thị trấn A Lưới luôn trực tiếp theo dõi điều kiện giao thông đường đèo QL49 Huế - A Lưới và thời tiết thực tế để khuyến nghị du khách chuyến đi an toàn nhất.",
      icon: Clock,
      color: "bg-rose-50 text-rose-900 border-rose-200"
    }
  ];

  const VERIFY_STEPS = [
    {
      step: "01",
      title: "Kiểm tra hồ sơ pháp lý & văn hóa",
      desc: "Xác minh tư cách pháp nhân hợp tác xã, hộ kinh doanh hoặc gia đình đồng bào bản địa tại các thôn bản A Lưới."
    },
    {
      step: "02",
      title: "Khảo sát thực địa an toàn & tiện nghi",
      desc: "Đoàn thẩm định kiểm tra trực tiếp giường chiếu, nhà vệ sinh, trang bị áo phao suối thác và bình chữa cháy."
    },
    {
      step: "03",
      title: "Cam kết chuẩn giá & văn minh du lịch",
      desc: "Ký thỏa thuận giữ nguyên giá niêm yết, cam kết thân thiện, tôn trọng du khách và vệ sinh môi trường không rác thải nhựa."
    },
    {
      step: "04",
      title: "Cấp huy hiệu xác thực & định danh số",
      desc: "Gắn huy hiệu '✓ Đã xác minh bởi Chạm A Lưới', tạo mã QR định danh và đưa lên hệ thống tra cứu booking công khai."
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8F7F2] pt-28 pb-24 text-ink">
      {/* Hero Header */}
      <section className="section-shell max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 text-forest px-4 py-1.5 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="size-4 text-emerald-700" />
          <span>Trung Tâm Tin Cậy & An Toàn Du Khách (Trust & Safety)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
          Hành trình an tâm trọn vẹn tại Chạm A Lưới
        </h1>

        <p className="text-sm sm:text-base text-ink/75 max-w-2xl mx-auto leading-relaxed">
          Chúng tôi xây dựng hệ sinh thái du lịch cộng đồng dựa trên nền tảng của <strong>sự minh bạch, chân thành bản địa và trách nhiệm tuyệt đối</strong> đối với trải nghiệm của mỗi du khách khi lên bản.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-forest hover:bg-forest/90 text-white font-bold rounded-2xl px-6">
            <Link href="/verify-booking" className="flex items-center gap-2">
              <Search className="size-4" />
              <span>Tra cứu & Xác minh Booking</span>
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsReportOpen(true)}
            className="border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-2xl px-6"
          >
            <ShieldAlert className="size-4 mr-2" />
            <span>Báo cáo nghi vấn gian lận</span>
          </Button>
        </div>
      </section>

      {/* 5 Transparent Commitments */}
      <section className="section-shell max-w-4xl mx-auto mt-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-clay uppercase tracking-widest">Tiêu chuẩn phục vụ</span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink">5 Cam Kết Minh Bạch Cốt Lõi</h2>
        </div>

        <div className="grid gap-4">
          {COMMITMENTS.map((c) => (
            <div
              key={c.num}
              className="rounded-3xl bg-white p-6 sm:p-7 shadow-card border border-forest/15 flex flex-col md:flex-row items-start gap-5 transition hover:shadow-lg"
            >
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-2xl font-black text-forest/40">{c.num}</span>
                <div className={`p-3.5 rounded-2xl border ${c.color} flex items-center justify-center`}>
                  <c.icon className="size-6" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-ink">{c.title}</h3>
                  <span className="text-[11px] font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                    {c.tagline}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Verification Process */}
      <section className="section-shell max-w-4xl mx-auto mt-20 space-y-8">
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-forest/15 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-forest uppercase tracking-widest">Quy chuẩn khắt khe</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              Quy Trình Thẩm Định 4 Bước Để Cấp Huy Hiệu Xác Thực
            </h2>
            <p className="text-xs text-ink/65 leading-relaxed">
              Mỗi cơ sở homestay, dịch vụ ăn uống và điểm trải nghiệm xuất hiện trên website đều phải trải qua đánh giá độc lập trước khi đón khách.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VERIFY_STEPS.map((s) => (
              <div key={s.step} className="rounded-2xl bg-[#F8F7F2] p-5 border border-forest/10 space-y-2 relative">
                <span className="font-mono text-xs font-black text-forest bg-forest/10 px-2 py-0.5 rounded-md">
                  BƯỚC {s.step}
                </span>
                <h4 className="font-extrabold text-sm text-ink pt-1">{s.title}</h4>
                <p className="text-xs text-ink/65 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-emerald-700 shrink-0" />
              <span>
                Tìm thấy biểu tượng <strong className="font-bold">✓ Đã xác minh bởi Chạm A Lưới</strong> trên trang chi tiết địa điểm để an tâm 100%.
              </span>
            </div>
            <Link href="/places" className="font-bold text-emerald-800 hover:underline">
              Khám phá danh sách địa điểm đã xác minh →
            </Link>
          </div>
        </div>
      </section>

      {/* Anti-Fraud / Scam Prevention Guide */}
      <section className="section-shell max-w-4xl mx-auto mt-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-widest">Cảnh giác an toàn</span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink">Cẩm Nang Phòng Tránh Lừa Đảo Mạo Danh</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-card border border-rose-200/80 space-y-3">
            <div className="size-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="size-5" />
            </div>
            <h3 className="font-black text-base text-ink">Các dấu hiệu giả mạo cần cảnh giác</h3>
            <ul className="text-xs text-ink/75 space-y-2 leading-relaxed list-disc list-inside">
              <li>Trang Facebook lạ tự xưng Chạm A Lưới nhưng không dẫn về tên miền <strong>chamaluoi.vn</strong>.</li>
              <li>Yêu cầu chuyển khoản cọc 100% vào tài khoản cá nhân không trùng khớp thông tin đối soát.</li>
              <li>Hối thúc chuyển khoản nhanh với lý do "sắp hết phòng dịp lễ" mà không cấp mã đơn đặt chỗ hợp lệ.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card border border-emerald-200/80 space-y-3">
            <div className="size-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-black text-base text-ink">Nguyên tắc giao dịch an toàn</h3>
            <ul className="text-xs text-ink/75 space-y-2 leading-relaxed list-disc list-inside">
              <li>Chỉ thanh toán cọc tối đa <strong>30%</strong> cho các booking đặt trước, phần còn lại thanh toán tại cơ sở.</li>
              <li>Luôn nhận mã đơn (ví dụ: <strong>BK-17894</strong>) và nhập vào cổng <Link href="/verify-booking" className="text-forest underline font-bold">Xác minh Booking</Link> để kiểm chứng.</li>
              <li>Gọi trực tiếp Hotline chính thức <strong>{BRAND_CONFIG.contact.hotline}</strong> trước khi chuyển tiền nếu có bất kỳ nghi vấn nào.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Official Channels & Policy Direct Links */}
      <section className="section-shell max-w-4xl mx-auto mt-16">
        <div className="rounded-3xl bg-forest text-white p-6 sm:p-10 space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">Kênh liên lạc chính thống</span>
            <h3 className="text-2xl sm:text-3xl font-black">Cần hỗ trợ hoặc phản ánh khẩn cấp?</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Đội ngũ điều phối viên của Chạm A Lưới thường trực tại địa phương sẵn sàng đồng hành cùng bạn 24/7.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <a
              href={`tel:${BRAND_CONFIG.contact.hotline.replace(/\s+/g, "")}`}
              className="rounded-2xl bg-white/10 hover:bg-white/15 p-4 border border-white/15 transition space-y-1 block"
            >
              <PhoneCall className="size-5 text-emerald-300 mb-1" />
              <p className="text-white/60 text-[11px]">Hotline khẩn cấp</p>
              <p className="font-black text-sm text-white">{BRAND_CONFIG.contact.hotline}</p>
            </a>

            <a
              href={zaloCoord.zaloUrl || `tel:${zaloCoord.fallbackHotline.replace(/\s+/g, "")}`}
              target={zaloCoord.zaloUrl ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="rounded-2xl bg-white/10 hover:bg-white/15 p-4 border border-white/15 transition space-y-1 block"
            >
              <MessageSquare className="size-5 text-emerald-300 mb-1" />
              <p className="text-white/60 text-[11px]">Zalo điều phối viên</p>
              <p className="font-black text-sm text-white">{zaloCoord.displayName}</p>
            </a>

            <a
              href={`mailto:${BRAND_CONFIG.contact.email}`}
              className="rounded-2xl bg-white/10 hover:bg-white/15 p-4 border border-white/15 transition space-y-1 block"
            >
              <FileCheck className="size-5 text-emerald-300 mb-1" />
              <p className="text-white/60 text-[11px]">Hòm thư Trust & Safety</p>
              <p className="font-black text-xs text-white truncate">{BRAND_CONFIG.contact.email}</p>
            </a>
          </div>

          {/* Quick Legal Links */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-white/70 gap-3">
            <span>Các văn bản chính sách minh bạch của Chạm A Lưới:</span>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white">
              <Link href="/cancellation-policy" className="hover:text-emerald-300 underline">
                Chính sách hủy & hoàn cọc
              </Link>
              <Link href="/terms" className="hover:text-emerald-300 underline">
                Điều khoản dịch vụ
              </Link>
              <Link href="/privacy" className="hover:text-emerald-300 underline">
                Chính sách bảo mật
              </Link>
              <Link href="/verify-booking" className="hover:text-emerald-300 underline">
                Cổng tra cứu Booking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      <ReportIssueModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </main>
  );
}
