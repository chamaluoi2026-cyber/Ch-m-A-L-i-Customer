"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Lock,
  Sparkles,
  TicketCheck,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
} from "lucide-react";
import { loginCustomerAction, registerCustomerAction, socialAuthCustomerAction } from "@/app/actions/auth";
import { saveCustomerSession } from "@/lib/supabase/browser";

interface CustomerAuthViewProps {
  nextUrl?: string;
}

export function CustomerAuthView({ nextUrl = "/account" }: CustomerAuthViewProps) {
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Social Modal State
  const [socialModal, setSocialModal] = useState<"google" | "facebook" | null>(null);
  const [socialName, setSocialName] = useState("");
  const [socialEmail, setSocialEmail] = useState("");
  const [socialPhone, setSocialPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) {
      setError("Vui lòng nhập số điện thoại hoặc email của bạn.");
      return;
    }

    setLoading(true);
    const res = await loginCustomerAction({
      identifier: loginIdentifier.trim(),
      password: loginPassword,
      nextPath: nextUrl,
    });

    if (res.success && res.user) {
      saveCustomerSession({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        avatarUrl: res.user.avatarUrl,
        provider: res.user.provider,
        role: res.user.role,
      });
      setSuccessMsg("Đăng nhập thành công! Đang chuyển tiếp...");
      window.location.href = res.redirectUrl || nextUrl;
    } else {
      setError(res.error || "Đăng nhập thất bại.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!registerName.trim()) {
      setError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!registerPhone.trim() && !registerEmail.trim()) {
      setError("Vui lòng nhập số điện thoại hoặc email để lưu tài khoản.");
      return;
    }

    setLoading(true);
    const res = await registerCustomerAction({
      fullName: registerName.trim(),
      phone: registerPhone.trim(),
      email: registerEmail.trim(),
      password: registerPassword,
      nextPath: nextUrl,
    });

    if (res.success && res.user) {
      saveCustomerSession({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        avatarUrl: res.user.avatarUrl,
        provider: "email",
        role: res.user.role,
      });
      setSuccessMsg("Đăng ký thành công! Đang đăng nhập và chuyển hướng...");
      window.location.href = res.redirectUrl || nextUrl;
    } else {
      setError(res.error || "Đăng ký thất bại.");
      setLoading(false);
    }
  };

  const handleOpenSocialModal = (provider: "google" | "facebook") => {
    setError(null);
    setSocialModal(provider);
    if (provider === "google") {
      setSocialName("Nguyễn Hoàng Nam");
      setSocialEmail("hoangnam.travel@gmail.com");
      setSocialPhone("");
    } else {
      setSocialName("Thảo Vy A Lưới");
      setSocialEmail("thaovy.al@facebook.com");
      setSocialPhone("");
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialModal) return;
    setError(null);
    setLoading(true);

    const avatarUrl =
      socialModal === "google"
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";

    const res = await socialAuthCustomerAction({
      fullName: socialName.trim(),
      email: socialEmail.trim(),
      phone: socialPhone.trim() || undefined,
      avatarUrl,
      provider: socialModal,
      nextPath: nextUrl,
    });

    if (res.success && res.user) {
      saveCustomerSession({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        avatarUrl: res.user.avatarUrl,
        provider: socialModal,
        role: res.user.role,
      });
      setSuccessMsg(`Đăng nhập ${socialModal === "google" ? "Google" : "Facebook"} thành công! Đang chuyển hướng...`);
      window.location.href = res.redirectUrl || nextUrl;
    } else {
      setError(res.error || "Đăng nhập mạng xã hội thất bại.");
      setLoading(false);
    }
  };

  const handleQuickDemoCustomer = async () => {
    setError(null);
    setLoading(true);
    const res = await loginCustomerAction({
      identifier: "dukhach@chamaluoi.vn",
      nextPath: nextUrl,
    });
    if (res.success && res.user) {
      saveCustomerSession({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        role: res.user.role,
      });
      window.location.href = res.redirectUrl || nextUrl;
    } else {
      setError(res.error || "Lỗi đăng nhập nhanh.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white shadow-card border border-forest/10 overflow-hidden text-left relative">
      {/* Banner chào mừng */}
      <div className="bg-gradient-to-br from-[#0F382E] via-[#0F5C4A] to-[#16423C] p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold backdrop-blur-sm">
            <Sparkles className="size-3.5" /> Du Lịch Bản Địa Chạm A Lưới
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            {tab === "login" ? "Chào mừng bạn trở lại!" : "Đăng ký thành viên mới"}
          </h2>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-md">
            {tab === "login"
              ? "Đăng nhập để xem lại lịch sử đặt phòng, quản lý voucher ưu đãi và cập nhật tin đèo QL49 sương mù."
              : "Tạo tài khoản du khách trong 10 giây để nhận ngay mã ưu đãi 10% cho chuyến đi khám phá A Lưới!"}
          </p>
        </div>
      </div>

      {/* Chuyển tab Đăng Nhập / Đăng Ký */}
      <div className="flex border-b border-black/5 bg-[#FBFBFB] p-1.5">
        <button
          type="button"
          onClick={() => {
            setTab("login");
            setError(null);
          }}
          className={`flex-1 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-2 ${
            tab === "login" ? "bg-white text-forest shadow-sm border border-black/5" : "text-ink/60 hover:text-ink"
          }`}
        >
          <User className="size-4" />
          Đăng Nhập
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("register");
            setError(null);
          }}
          className={`flex-1 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-2 ${
            tab === "register" ? "bg-white text-forest shadow-sm border border-black/5" : "text-ink/60 hover:text-ink"
          }`}
        >
          <Sparkles className="size-4 text-amber-500" />
          Đăng Ký Khách Mới
        </button>
      </div>

      {/* Body Form */}
      <div className="p-6 md:p-8 space-y-5">
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* NÚT ĐĂNG NHẬP / ĐĂNG KÝ BẰNG GOOGLE & FACEBOOK */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOpenSocialModal("google")}
            className="w-full py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-xs md:text-sm font-bold text-gray-800 shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-3"
          >
            {/* Google SVG Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{tab === "login" ? "Tiếp tục với Google" : "Đăng ký nhanh bằng Google"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenSocialModal("facebook")}
            className="w-full py-3 px-4 rounded-2xl border border-blue-200 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 text-xs md:text-sm font-bold text-[#1877F2] shadow-2xs transition flex items-center justify-center gap-3"
          >
            {/* Facebook SVG Logo */}
            <svg className="w-5 h-5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>{tab === "login" ? "Tiếp tục với Facebook" : "Đăng ký nhanh bằng Facebook"}</span>
          </button>
        </div>

        {/* Ngăn cách */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-black/10"></div>
          <span className="flex-shrink mx-3 text-[11px] text-ink/40 font-semibold uppercase">
            Hoặc sử dụng SĐT / Email
          </span>
          <div className="flex-grow border-t border-black/10"></div>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">Số điện thoại Zalo hoặc Email</label>
              <div className="relative">
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Ví dụ: 0912345678 hoặc email@gmail.com"
                  className="w-full rounded-2xl border border-black/10 bg-[#FBFBFB] pl-10 pr-4 py-3 text-xs md:text-sm text-ink focus:border-forest focus:bg-white focus:outline-none transition"
                  required
                />
                <Phone className="absolute left-3.5 top-3.5 size-4 text-ink/40 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">
                  Mật khẩu <span className="text-[11px] font-normal text-ink/50">(Tùy chọn)</span>
                </label>
                <span className="text-[11px] text-forest font-semibold cursor-pointer hover:underline">
                  Đăng nhập không cần mật khẩu
                </span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (nếu đã đặt)"
                  className="w-full rounded-2xl border border-black/10 bg-[#FBFBFB] pl-10 pr-11 py-3 text-xs md:text-sm text-ink focus:border-forest focus:bg-white focus:outline-none transition"
                />
                <Lock className="absolute left-3.5 top-3.5 size-4 text-ink/40 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3.5 text-ink/40 hover:text-ink"
                >
                  {showLoginPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-forest text-white text-xs md:text-sm font-bold hover:bg-forest/90 transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {loading ? "Đang xử lý đăng nhập..." : "Đăng Nhập Vào Hệ Thống"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <TicketCheck className="size-4 shrink-0 text-amber-600" />
              <span>
                <b>Ưu đãi thành viên:</b> Tự động nhận ngay voucher giảm 10% áp dụng cho homestay và tour A Lưới!
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">Họ và tên quý khách *</label>
              <div className="relative">
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full rounded-2xl border border-black/10 bg-[#FBFBFB] pl-10 pr-4 py-3 text-xs md:text-sm text-ink focus:border-forest focus:bg-white focus:outline-none transition"
                  required
                />
                <User className="absolute left-3.5 top-3.5 size-4 text-ink/40 pointer-events-none" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">Số điện thoại / Zalo *</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="0912..."
                    className="w-full rounded-2xl border border-black/10 bg-[#FBFBFB] pl-10 pr-4 py-3 text-xs md:text-sm text-ink focus:border-forest focus:bg-white focus:outline-none transition"
                  />
                  <Phone className="absolute left-3.5 top-3.5 size-4 text-ink/40 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full rounded-2xl border border-black/10 bg-[#FBFBFB] pl-10 pr-4 py-3 text-xs md:text-sm text-ink focus:border-forest focus:bg-white focus:outline-none transition"
                  />
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-ink/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">Tạo mật khẩu</label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full rounded-2xl border border-black/10 bg-[#FBFBFB] pl-10 pr-11 py-3 text-xs md:text-sm text-ink focus:border-forest focus:bg-white focus:outline-none transition"
                />
                <Lock className="absolute left-3.5 top-3.5 size-4 text-ink/40 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3.5 top-3.5 text-ink/40 hover:text-ink"
                >
                  {showRegisterPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-forest text-white text-xs md:text-sm font-bold hover:bg-forest/90 transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-amber-300" />}
              {loading ? "Đang tạo tài khoản..." : "Hoàn Tất Đăng Ký & Nhận Ưu Đãi"}
            </button>
          </form>
        )}

        {/* Demo khách vãng lai */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleQuickDemoCustomer}
            disabled={loading}
            className="w-full py-2.5 rounded-2xl border border-forest/20 bg-forest/5 text-forest text-xs font-bold hover:bg-forest/10 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="size-3.5 text-amber-500" />
            Đăng Nhập Nhanh (Khách Thử Nghiệm)
          </button>
        </div>

        {/* Chuyển hướng Cổng Quản Trị */}
        <div className="pt-3 border-t border-black/5 text-center space-y-2">
          <p className="text-[11px] text-ink/50">
            Bạn là Ban Quản Trị hoặc Chủ Homestay đối tác?{" "}
            <Link href="http://localhost:3001/login" className="font-bold text-forest hover:underline">
              Đăng nhập Cổng Quản Trị tại đây →
            </Link>
          </p>
        </div>
      </div>

      {/* MODAL THU THẬP THÔNG TIN MẠNG XÃ HỘI (GOOGLE / FACEBOOK) */}
      {socialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-forest/10 overflow-hidden text-left p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                  {socialModal === "google" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-ink">
                    Đăng nhập bằng {socialModal === "google" ? "Google" : "Facebook"}
                  </h3>
                  <p className="text-[11px] text-ink/60">Xác thực 1-chạm & đồng bộ hồ sơ du khách</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSocialModal(null)}
                className="rounded-full p-1 text-gray-400 hover:text-ink hover:bg-gray-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSocialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Họ và tên hiển thị</label>
                <input
                  type="text"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-ink focus:border-forest focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Email tài khoản {socialModal === "google" ? "Google" : "Facebook"}
                </label>
                <input
                  type="email"
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-ink focus:border-forest focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Số điện thoại Zalo <span className="text-[10px] text-forest font-semibold">(Nhận mã giảm giá 10%)</span>
                </label>
                <input
                  type="tel"
                  value={socialPhone}
                  onChange={(e) => setSocialPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-ink focus:border-forest focus:outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Thông tin được bảo mật và dùng để lưu trữ voucher, xác nhận homestay.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSocialModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-ink/70 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest/90 shadow flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-4" />}
                  {loading ? "Đang xác thực..." : "Tiếp Tục Đăng Nhập"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
