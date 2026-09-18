import Link from "next/link";
import { CustomerAuthView } from "@/components/auth/customer-auth-view";
import { AdminQuickLogin } from "@/components/auth/admin-quick-login";
import { ShieldCheck } from "lucide-react";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string; portal?: string }>;
}) {
  const query = await searchParams;
  const next = query.next?.startsWith("/") ? query.next : "/account";
  const isAdminPortal = query.portal === "admin" || next.startsWith("/admin");

  return (
    <main className="min-h-screen bg-[#F4F6F5] grid place-items-center py-12 px-4">
      {isAdminPortal ? (
        <article className="w-full max-w-xl rounded-3xl bg-white p-8 md:p-10 shadow-card border border-black/5 text-center">
          <div className="mx-auto size-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mb-4">
            <ShieldCheck className="size-8" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-forest">Cổng Quản Trị & Vận Hành</p>
          <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">Đăng nhập Ban Quản Trị</h1>
          <p className="mt-3 text-xs md:text-sm text-ink/65 leading-relaxed">
            Hệ thống bảo vệ phân quyền 8 vai trò (RBAC): Super Admin, Admin, Content Manager, Sales, Finance, Support, Business.
          </p>

          {query.error ? (
            <div className="mt-4 rounded-2xl bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">
              {query.error === "unauthorized"
                ? "Vui lòng chọn hoặc đăng nhập tài khoản có thẩm quyền để truy cập trang quản trị."
                : query.error === "forbidden_business_portal"
                ? "Tài khoản Doanh nghiệp vui lòng truy cập cổng đối tác tại /business/profile."
                : query.error}
            </div>
          ) : null}

          <div className="mt-6">
            <AdminQuickLogin nextUrl={next} />
          </div>

          <p className="mt-6 text-xs text-ink/50">
            Bạn là Khách du lịch?{" "}
            <Link href="/login" className="font-bold text-forest hover:text-ink">
              Chuyển sang Đăng nhập Khách hàng
            </Link>
          </p>
        </article>
      ) : (
        <div className="w-full max-w-xl">
          <CustomerAuthView nextUrl={next} />
        </div>
      )}
    </main>
  );
}
