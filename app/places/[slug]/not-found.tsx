import Link from "next/link";
import { Compass, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlaceNotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center bg-[#F4F6F5] px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-black/5">
        <div className="size-20 bg-emerald-50 text-[#0F5C4A] rounded-3xl grid place-items-center mx-auto mb-6 shadow-inner">
          <Compass className="size-10 text-[#0F5C4A] animate-pulse" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B86F3C]">
          Địa điểm không tồn tại • 404
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
          Không tìm thấy địa điểm
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Địa điểm du lịch này có thể chưa được kích hoạt, đã tạm ngưng đón khách hoặc đã được chuyển đổi sang mã địa danh mới.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="w-full sm:w-auto bg-[#0F5C4A] hover:bg-[#0F5C4A]/90 text-white text-xs font-bold rounded-xl py-2.5 px-5 shadow-md">
            <Link href="/places">
              <MapPin className="size-4 mr-1.5 text-[#B86F3C]" />
              Khám phá địa điểm khác
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold rounded-xl py-2.5 px-5">
            <Link href="/">
              <Home className="size-4 mr-1.5" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
