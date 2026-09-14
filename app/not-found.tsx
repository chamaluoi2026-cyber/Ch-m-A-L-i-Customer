import Link from "next/link";
import { Compass, Home, MapPin, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center bg-[#F4F6F5] px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-black/5">
        <div className="size-20 bg-emerald-50 text-forest rounded-3xl grid place-items-center mx-auto mb-6 shadow-inner">
          <Compass className="size-10 text-[#0F5C4A] animate-pulse" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B86F3C]">
          Lỗi điều hướng • 404
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
          Không tìm thấy trang này
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Địa điểm, bài viết hoặc nội dung bạn đang tìm kiếm không tồn tại, đã bị gỡ bỏ hoặc đã được cập nhật sang một đường dẫn mới.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F5C4A] text-white text-xs font-bold shadow-md hover:bg-[#0F5C4A]/90 transition"
          >
            <Home className="size-4" />
            Về trang chủ
          </Link>
          <Link
            href="/places"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-ink/80 text-xs font-bold hover:bg-gray-50 transition"
          >
            <MapPin className="size-4 text-[#B86F3C]" />
            Xem địa điểm
          </Link>
        </div>
      </div>
    </main>
  );
}
