"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSessionFromHash, saveCustomerSession } from "@/lib/supabase/browser";
import { socialAuthCustomerAction } from "@/app/actions/auth";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMsg, setStatusMsg] = useState("Đang đồng bộ phiên xác thực...");

  useEffect(() => {
    const next = searchParams.get("next")?.startsWith("/") ? searchParams.get("next")! : "/account";
    const error = searchParams.get("error_description") ?? searchParams.get("error");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");

    if (!accessToken) {
      // Kiểm tra xem Supabase hash thông thường có token không
      const hasSession = saveSessionFromHash(hash);
      router.replace(hasSession ? next : "/login?error=Khong_tim_thay_phien_xac_thuc");
      return;
    }

    async function resolveOAuthToken() {
      try {
        // 1. Thử xác thực với Google UserInfo
        try {
          const gRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (gRes.ok) {
            const gUser = await gRes.json();
            setStatusMsg(`Chào mừng ${gUser.name || "bạn"}! Đang lưu thông tin du khách...`);
            const authRes = await socialAuthCustomerAction({
              fullName: gUser.name || "Khách Google",
              email: gUser.email || "",
              avatarUrl: gUser.picture,
              provider: "google",
              nextPath: next
            });
            if (authRes.success && authRes.user) {
              saveCustomerSession({
                id: authRes.user.id,
                name: authRes.user.name,
                email: authRes.user.email,
                phone: authRes.user.phone,
                avatarUrl: authRes.user.avatarUrl,
                provider: "google",
                role: authRes.user.role
              });
              window.location.href = authRes.redirectUrl || next;
              return;
            }
          }
        } catch {
          // Bỏ qua nếu không phải Google
        }

        // 2. Thử xác thực với Facebook Graph API
        try {
          const fbRes = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
          );
          if (fbRes.ok) {
            const fbUser = await fbRes.json();
            setStatusMsg(`Chào mừng ${fbUser.name || "bạn"}! Đang lưu thông tin du khách...`);
            const authRes = await socialAuthCustomerAction({
              fullName: fbUser.name || "Khách Facebook",
              email: fbUser.email || `${fbUser.id}@facebook.com`,
              avatarUrl: fbUser.picture?.data?.url,
              provider: "facebook",
              nextPath: next
            });
            if (authRes.success && authRes.user) {
              saveCustomerSession({
                id: authRes.user.id,
                name: authRes.user.name,
                email: authRes.user.email,
                phone: authRes.user.phone,
                avatarUrl: authRes.user.avatarUrl,
                provider: "facebook",
                role: authRes.user.role
              });
              window.location.href = authRes.redirectUrl || next;
              return;
            }
          }
        } catch {
          // Bỏ qua nếu không phải Facebook
        }

        // 3. Fallback: Lưu Supabase Session
        const hasSession = saveSessionFromHash(hash);
        router.replace(hasSession ? next : "/login?error=Khong_the_dong_bo_tai_khoan");
      } catch (err: any) {
        router.replace(`/login?error=${encodeURIComponent(err.message || "Lỗi xác thực")}`);
      }
    }

    resolveOAuthToken();
  }, [router, searchParams]);

  return (
    <main className="pt-24">
      <section className="section-shell grid min-h-[60vh] place-items-center py-16">
        <article className="rounded-3xl bg-white p-8 text-center shadow-card max-w-md w-full border border-forest/10 space-y-4">
          <div className="size-14 rounded-2xl bg-forest/10 text-forest mx-auto flex items-center justify-center">
            <Loader2 className="size-7 animate-spin text-forest" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-forest">Đang Xác Thực Tài Khoản</p>
          <h1 className="text-xl font-extrabold text-ink">{statusMsg}</h1>
          <p className="text-xs text-ink/60">Vui lòng đợi giây lát, hệ thống đang thiết lập quyền lợi du khách cho bạn.</p>
        </article>
      </section>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="pt-24">
          <section className="section-shell grid min-h-[60vh] place-items-center py-16">
            <article className="rounded-3xl bg-white p-8 text-center shadow-card">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-forest">Đăng nhập</p>
              <h1 className="mt-3 text-3xl font-extrabold text-ink">Đang xác nhận tài khoản Google...</h1>
            </article>
          </section>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
