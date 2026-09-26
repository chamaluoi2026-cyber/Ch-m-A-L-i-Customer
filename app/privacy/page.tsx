import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { BRAND_CONFIG } from "@/lib/brand.config";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật Quyền Riêng Tư | Chạm A Lưới",
  description: "Chính sách bảo mật dữ liệu khách hàng, mã hóa thanh toán và nguyên tắc bảo vệ quyền riêng tư tại Chạm A Lưới.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F2] pt-28 pb-24 text-ink">
      <div className="section-shell max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 text-forest px-4 py-1 text-xs font-black uppercase tracking-wider">
            <Lock className="size-4 text-emerald-700" />
            <span>Cam kết an toàn dữ liệu cá nhân</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-xs sm:text-sm text-ink/70 max-w-xl mx-auto leading-relaxed">
            Chạm A Lưới tôn trọng tuyệt đối và cam kết bảo vệ dữ liệu cá nhân của mọi du khách khi truy cập và đặt dịch vụ.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-forest/15 space-y-6 text-xs sm:text-sm leading-relaxed text-ink/80">
          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">1. Mục Đích Thu Thập Thông Tin</h2>
            <p>
              Chúng tôi chỉ thu thập các thông tin tối thiểu cần thiết để phục vụ chuyến đi: Họ tên, số điện thoại liên hệ, ngày khởi hành và số lượng khách trong đoàn để kết nối đón tiếp với homestay và hướng dẫn viên.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">2. Cơ Chế Bảo Vệ Riêng Tư Anti-Doxxing</h2>
            <p>
              Khi người dùng tra cứu mã đơn tại cổng <Link href="/verify-booking" className="text-forest underline font-bold">Xác minh Booking</Link>, số điện thoại và họ tên đầy đủ của du khách được che giấu một phần (ví dụ: <code>091****233</code>) nhằm ngăn chặn việc rò rỉ thông tin cá nhân cho bên thứ ba.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">3. Bảo Mật Giao Dịch & Dữ Liệu Ngân Hàng</h2>
            <p>
              Website không lưu trữ thông tin thẻ ngân hàng hoặc mật khẩu tài khoản cá nhân. Mọi giao dịch được thực hiện trực tiếp thông qua tiêu chuẩn VietQR Napas247 giữa ứng dụng ngân hàng của bạn và tài khoản đối soát chỉ định.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">4. Cam Kết Không Thương Mại Hóa Dữ Liệu</h2>
            <p>
              Chạm A Lưới cam kết <strong>không bao giờ bán, cho thuê hoặc chuyển nhượng</strong> thông tin cá nhân của bạn cho bất kỳ đơn vị quảng cáo hoặc công ty thứ ba nào. Thông tin chỉ được chia sẻ duy nhất với chủ homestay bạn đã chọn nhằm mục đích phục vụ lưu trú.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">5. Yêu Cầu Xóa Dữ Liệu</h2>
            <p>
              Quý khách có quyền yêu cầu xóa hoặc chỉnh sửa thông tin cá nhân trong cơ sở dữ liệu bất kỳ lúc nào bằng cách gửi yêu cầu về email <strong>{BRAND_CONFIG.contact.email}</strong> hoặc liên hệ Hotline {BRAND_CONFIG.contact.hotline}.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
