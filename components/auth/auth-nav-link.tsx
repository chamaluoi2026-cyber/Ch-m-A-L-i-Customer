"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCircle, LogOut, ChevronDown, Ticket, Calendar, ShieldCheck, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getCurrentUser, clearLocalSession, type AuthUser } from "@/lib/supabase/browser";
import { logoutAction } from "@/app/actions/auth";
import { useLanguage } from "@/components/i18n-provider";

interface AuthNavLinkProps {
  variant?: "default" | "drawer";
  onItemClick?: () => void;
}

export function AuthNavLink({ variant = "default", onItemClick }: AuthNavLinkProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    clearLocalSession();
    await logoutAction();
    setUser(null);
    setIsOpen(false);
    window.location.href = "/";
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Du khách";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initial = displayName.charAt(0).toUpperCase();

  // 1. MOBILE DRAWER VARIANT
  if (variant === "drawer") {
    if (!user) {
      return (
        <Link
          href="/login"
          onClick={onItemClick}
          className="focus-ring flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-forest border border-forest/20 hover:bg-beige flex items-center justify-center gap-1.5"
        >
          <UserCircle className="size-4" />
          <span>{t.nav.login}</span>
        </Link>
      );
    }

    return (
      <div className="w-full rounded-2xl bg-forest/5 border border-forest/15 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            onClick={onItemClick}
            className="flex items-center gap-2.5 hover:opacity-90"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={36}
                height={36}
                className="size-9 rounded-full object-cover ring-2 ring-forest/30"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-forest text-sm font-black text-white shadow-xs">
                {initial}
              </span>
            )}
            <div className="text-left">
              <p className="text-xs font-bold text-ink truncate max-w-[150px]">{displayName}</p>
              <p className="text-[10px] text-forest font-semibold">Tài khoản thành viên</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-ink/40 hover:text-red-600 hover:bg-red-50 text-xs flex items-center gap-1"
            title="Đăng xuất"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-forest/10 text-[11px]">
          <Link
            href="/account?tab=vouchers"
            onClick={onItemClick}
            className="py-1.5 px-2 rounded-lg bg-white/80 hover:bg-white text-ink/80 font-medium text-center shadow-2xs"
          >
            Kho Voucher
          </Link>
          <Link
            href="/account?tab=bookings"
            onClick={onItemClick}
            className="py-1.5 px-2 rounded-lg bg-white/80 hover:bg-white text-ink/80 font-medium text-center shadow-2xs"
          >
            Đơn đặt tour
          </Link>
        </div>
      </div>
    );
  }

  // 2. DESKTOP NAVBAR VARIANT
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-ink/80 hover:text-forest hover:bg-forest/5 transition border border-transparent hover:border-forest/15 whitespace-nowrap"
      >
        <UserCircle className="size-4" />
        <span>{t.nav.login}</span>
      </Link>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Nút hiển thị tên và avatar khách hàng */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-forest/5 hover:bg-forest/10 border border-forest/20 text-ink text-xs font-bold transition shadow-2xs"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={26}
            height={26}
            className="size-6.5 rounded-full object-cover ring-1.5 ring-forest/40"
          />
        ) : (
          <span className="grid size-6.5 place-items-center rounded-full bg-forest text-[11px] font-black text-white shadow-2xs">
            {initial}
          </span>
        )}
        <span className="max-w-[110px] truncate">{displayName}</span>
        <ChevronDown className={`size-3 text-ink/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu Tài Khoản */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-2xl border border-black/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
          {/* Header */}
          <div className="p-2.5 rounded-xl bg-forest/5 border border-forest/10 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-forest text-xs font-black text-white">
                {initial}
              </span>
              <div className="overflow-hidden">
                <p className="text-xs font-extrabold text-ink truncate">{displayName}</p>
                <p className="text-[10px] text-ink/50 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-forest font-bold">
              <ShieldCheck className="size-3" />
              <span>Thành viên Chạm A Lưới</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 text-xs font-semibold text-ink/80">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest/5 hover:text-forest transition"
            >
              <User className="size-3.5 text-forest" />
              <span>Hồ sơ & Tài khoản của tôi</span>
            </Link>

            <Link
              href="/account?tab=vouchers"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest/5 hover:text-forest transition"
            >
              <Ticket className="size-3.5 text-amber-600" />
              <span>Kho Voucher ưu đãi</span>
            </Link>

            <Link
              href="/account?tab=bookings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest/5 hover:text-forest transition"
            >
              <Calendar className="size-3.5 text-sky-600" />
              <span>Đơn đặt & Lịch trình tour</span>
            </Link>
          </div>

          {/* Đăng xuất */}
          <div className="mt-1 pt-1 border-t border-black/5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition text-left"
            >
              <LogOut className="size-3.5" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}