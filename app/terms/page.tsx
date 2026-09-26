import { Metadata } from "next";
import Link from "next/link";
import { Scale, ShieldCheck } from "lucide-react";
import { BRAND_CONFIG } from "@/lib/brand.config";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng Dịch Vụ | Chạm A Lưới",
  description: "Điều khoản dịch vụ và quy định nền tảng du lịch cộng đồng Chạm A Lưới.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F2] pt-28 pb-24 text-ink">
      <div className="section-shell max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 text-forest px-4 py-1 text-xs font-black uppercase tracking-wider">
            <Scale className="size-4 text-emerald-700" />
            <span>Pháp lý & Quy định nền tảng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-xs sm:text-sm text-ink/70 max-w-xl mx-auto leading-relaxed">
            Quy định sử dụng website {BRAND_CONFIG.officialDomain} và quyền lợi, nghĩa vụ của các bên tham gia hệ sinh thái du lịch Chạm A Lưới.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-forest/15 space-y-6 text-xs sm:text-sm leading-relaxed text-ink/80">
          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">1. Giới Thiệu Chung</h2>
            <p>
              Chạm A Lưới ({BRAND_CONFIG.officialDomain}) là nền tảng kết nối du lịch cộng đồng bản địa tại huyện A Lưới, Thừa Thiên Huế. Chúng tôi hỗ trợ du khách tiếp cận thông tin trung thực, đặt phòng homestay, đặt hướng dẫn viên địa phương và tiêu thụ đặc sản OCOP trực tiếp từ bà con hợp tác xã.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">2. Quyền Lợi & Trách Nhiệm Của Khách Hàng</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Cung cấp số điện thoại chính xác để hệ thống liên hệ đối soát và gửi vé điện tử.</li>
              <li>Tuân thủ phong tục tập quán văn hóa bản địa của đồng bào Pa Cô, Tà Ôi, Cơ Tu; bảo vệ môi trường, không xả rác tại suối thác.</li>
              <li>Được quyền kiểm tra mã booking tại <Link href="/verify-booking" className="text-forest underline font-bold">Cổng tra cứu</Link> và hưởng chính sách bảo vệ thanh toán.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">3. Trách Nhiệm Của Cơ Sở Lưu Trú & Đối Tác Bản Địa</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Cam kết giữ phòng và phục vụ đúng chất lượng đã thỏa thuận.</li>
              <li>Tuyệt đối không tăng giá vượt mức niêm yết trên website Chạm A Lưới.</li>
              <li>Đảm bảo các điều kiện an toàn, áo phao tắm suối và vệ sinh an toàn thực phẩm.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">4. Thanh Toán & Đặt Cọc</h2>
            <p>
              Mọi khoản đặt cọc được thanh toán qua mã VietQR Napas247 chính thức có gắn mã đơn hợp lệ. Chính sách hoàn cọc được áp dụng theo <Link href="/cancellation-policy" className="text-forest underline font-bold">Chính sách hủy & hoàn tiền</Link>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-ink">5. Giải Quyết Tranh Chấp & Khiếu Nại</h2>
            <p>
              Trong trường hợp xảy ra sự cố ngoài ý muốn, Chạm A Lưới đóng vai trò điều phối trung gian bảo vệ quyền lợi chính đáng của du khách và cơ sở địa phương. Mọi phản ánh xin gửi về Hotline {BRAND_CONFIG.contact.hotline} hoặc qua mục <Link href="/trust" className="text-forest underline font-bold">Trust & Safety</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
