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
  Compass,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { loginCustomerAction, registerCustomerAction } from "@/app/actions/auth";

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
      nextPath: nextUrl
    });

    if (res.success && res.redirectUrl) {
      setSuccessMsg("Đăng nhập thành công! Đang chuyển tiếp...");
      window.location.href = res.redirectUrl;
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
      nextPath: nextUrl
    });

    if (res.success && res.redirectUrl) {
      setSuccessMsg("Đăng ký thành công! Đang đăng nhập và chuyển hướng...");
      window.location.href = res.redirectUrl;
    } else {
      setError(res.error || "Đăng ký thất bại.");
      setLoading(false);
    }
  };

  const handleQuickDemoCustomer = async () => {
    setError(null);
    setLoading(true);
    const res = await loginCustomerAction({
      identifier: "dukhach@chamaluoi.vn",
      nextPath: nextUrl
    });
    if (res.success && res.redirectUrl) {
      window.location.href = res.redirectUrl;
    } else {
      setError(res.error || "Lỗi đăng nhập nhanh.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white shadow-card border border-forest/10 overflow-hidden text-left">
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
          onClick={() => { setTab("login"); setError(null); }}
          className={`flex-1 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-2 ${
            tab === "login"
              ? "bg-white text-forest shadow-sm border border-black/5"
              : "text-ink/60 hover:text-ink"
          }`}
        >
          <User className="size-4" />
          Đăng Nhập
        </button>
        <button
          type="button"
          onClick={() => { setTab("register"); setError(null); }}
          className={`flex-1 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-2 ${
            tab === "register"
              ? "bg-white text-forest shadow-sm border border-black/5"
              : "text-ink/60 hover:text-ink"
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

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Số điện thoại Zalo hoặc Email
              </label>
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

            {/* Đăng nhập nhanh 1 chạm */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-black/10"></div>
                <span className="flex-shrink mx-3 text-[11px] text-ink/40 font-semibold uppercase">Hoặc</span>
                <div className="flex-grow border-t border-black/10"></div>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                disabled={loading}
                className="w-full py-2.5 rounded-2xl border border-forest/30 bg-forest/5 text-forest text-xs font-bold hover:bg-forest/10 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                Đăng Nhập Nhanh (Khách Tham Quan Thử Nghiệm)
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <TicketCheck className="size-4 shrink-0 text-amber-600" />
              <span><b>Ưu đãi thành viên:</b> Tự động nhận ngay voucher giảm 10% áp dụng cho homestay và tour A Lưới!</span>
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

        {/* Chuyển hướng Cổng Quản Trị dành cho Admin & Đối tác */}
        <div className="pt-3 border-t border-black/5 text-center space-y-2">
          <p className="text-[11px] text-ink/50">
            Bạn là Ban Quản Trị hoặc Chủ Homestay đối tác?{" "}
            <Link href="http://localhost:3001/login" className="font-bold text-forest hover:underline">
              Đăng nhập Cổng Quản Trị tại đây →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
