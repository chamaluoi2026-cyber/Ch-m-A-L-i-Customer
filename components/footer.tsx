"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Heart, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";
import { navItems } from "@/data/site";
import { useLanguage } from "@/components/i18n-provider";
import { BRAND_CONFIG } from "@/lib/brand.config";
import type { SiteSettings } from "@/lib/server-store";

interface FooterProps {
  logo?: string;
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps = {}) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  // Single Source of Truth: Logo footer dùng logoDark chính thức
  const brandDarkLogo = BRAND_CONFIG.logoDark;
  const address = settings?.contactAddress || BRAND_CONFIG.contact.address;
  const phone = settings?.contactPhone || BRAND_CONFIG.contact.hotline;
  const email = settings?.contactEmail || BRAND_CONFIG.contact.email;
  const facebookUrl = settings?.facebookUrl || BRAND_CONFIG.social.facebook;
  const instagramUrl = settings?.instagramUrl || BRAND_CONFIG.social.instagram;
  const zaloUrl = settings?.zaloUrl || (settings?.zaloPhone ? `https://zalo.me/${settings.zaloPhone.replace(/[^0-9]/g, "")}` : `https://zalo.me/0825497468`);
  const description = isEn
    ? "A community-based tourism platform connecting travelers with verified local homestays, traditional craft villages, authentic cuisine, and pristine mountain wonders in A Luoi, Thua Thien Hue."
    : (settings?.footerDescription || "Nền tảng du lịch cộng đồng kết nối du khách với các homestay, làng nghề truyền thống, ẩm thực bản địa và những điểm đến sinh thái nguyên sơ tại A Lưới, Thừa Thiên Huế.");

  const getNavLabel = (href: string, fallback: string) => {
    if (href === "/") return t.nav.home;
    if (href === "/places") return t.nav.places;
    if (href === "/itinerary") return t.nav.itineraryAI;
    if (href === "/blog") return t.nav.blog;
    if (href === "/products") return t.nav.products;
    if (href === "/book-tour") return t.nav.bookTour;
    if (href === "/about") return t.nav.about;
    return fallback;
  };

  return (
    <footer className="bg-[#0D1714] text-white border-t border-white/10" aria-label="Footer website">
      <section className="section-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1.1fr_1.3fr]">
        {/* Cột 1: Thương hiệu chính thức */}
        <article className="space-y-4">
          <Link href="/" className="inline-block" aria-label="Trang chủ Chạm A Lưới">
            <div className="relative h-12 w-48 sm:h-14 sm:w-52">
              <AppImage
                src={brandDarkLogo}
                alt="Logo Chạm A Lưới — Lên Bản Du lịch cộng đồng"
                fill
                fallbackSrc="/images/logo-white.svg"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <p className="text-xs leading-6 text-white/70 max-w-sm">
            {description}
          </p>
          <div className="pt-2 text-xs text-emerald-300 flex items-center gap-1.5 font-medium">
            <Heart className="size-3.5 fill-current text-rose-400 shrink-0" />
            <span>
              {isEn
                ? "Green Tourism • Cultural Respect • Empowering Communities"
                : "Du lịch xanh • Tôn trọng bản sắc • Đồng hành cùng bà con"}
            </span>
          </div>
        </article>

        {/* Cột 2: Khám phá */}
        <nav aria-label={isEn ? "Visitor navigation" : "Điều hướng du khách"}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {isEn ? "Explore A Luoi" : "Khám phá A Lưới"}
          </h2>
          <ul className="mt-4 grid gap-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="text-xs text-white/75 hover:text-white transition inline-block" href={item.href}>
                  {getNavLabel(item.href, item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Cột 3: Chính sách & An toàn (Trust & Safety) */}
        <nav aria-label={isEn ? "Policies & Safety" : "Chính sách & An toàn"}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            {isEn ? "Trust & Safety" : "Tin cậy & Chính sách"}
          </h2>
          <ul className="mt-4 grid gap-2.5 text-xs text-white/75">
            <li>
              <Link href="/verify-booking" className="hover:text-emerald-300 transition flex items-center gap-1.5 text-amber-300 font-semibold">
                <CheckCircle2 className="size-3.5 shrink-0" />
                {isEn ? "Verify Booking Code" : "Tra cứu & Xác thực Booking"}
              </Link>
            </li>
            <li>
              <Link href="/trust" className="hover:text-white transition">
                {isEn ? "Trust Center" : "Trung tâm An toàn & Tin cậy"}
              </Link>
            </li>
            <li>
              <Link href="/trust#booking-policy" className="hover:text-white transition">
                {isEn ? "Booking Policy" : "Chính sách Đặt tour & Homestay"}
              </Link>
            </li>
            <li>
              <Link href="/trust#cancellation-policy" className="hover:text-white transition">
                {isEn ? "Cancellation & Refund Policy" : "Chính sách Hủy & Hoàn tiền"}
              </Link>
            </li>
            <li>
              <Link href="/trust#terms" className="hover:text-white transition">
                {isEn ? "Terms of Service" : "Điều khoản sử dụng"}
              </Link>
            </li>
            <li>
              <Link href="/trust#privacy" className="hover:text-white transition">
                {isEn ? "Privacy Policy" : "Chính sách Bảo mật"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Cột 4: Kênh liên hệ chính thức & Cảnh báo an toàn */}
        <address className="not-italic space-y-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {isEn ? "Official Channels" : "Kênh liên hệ chính thức"}
            </h2>
            <ul className="mt-4 grid gap-2.5 text-xs text-white/75">
              <li className="flex gap-2.5 items-start">
                <MapPin className="size-4 shrink-0 text-clay mt-0.5" aria-hidden="true" />
                <span>{address}</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition font-medium">
                  Hotline: {phone}
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="size-4 shrink-0 text-amber-300" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-white transition">
                  {email}
                </a>
              </li>
            </ul>

            {/* Social Links & Zalo Button */}
            <div className="mt-3.5 flex items-center gap-3">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 rounded-lg bg-white/10 hover:bg-white/20 transition grid place-items-center text-white"
                  aria-label="Facebook Chạm A Lưới"
                >
                  <Facebook className="size-4" aria-hidden="true" />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 rounded-lg bg-white/10 hover:bg-white/20 transition grid place-items-center text-white"
                  aria-label="Instagram Chạm A Lưới"
                >
                  <Instagram className="size-4" aria-hidden="true" />
                </a>
              )}
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-xs font-bold text-white shadow-sm"
                aria-label="Chat Zalo Chạm A Lưới"
              >
                <span>💬 Zalo Điều phối</span>
              </a>
            </div>
          </div>

          {/* Cảnh báo phòng tránh giả mạo */}
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-200/90 leading-relaxed">
            <p className="flex items-center gap-1 font-bold text-amber-300 mb-1">
              <AlertTriangle className="size-3.5 shrink-0" />
              <span>{isEn ? "Fraud Warning:" : "Cảnh báo an toàn:"}</span>
            </p>
            <p>
              {isEn
                ? "Cham A Luoi never asks for passwords/OTP or unknown apps. Only pay according to official booking details."
                : "Chạm A Lưới không bao giờ yêu cầu cung cấp mật khẩu, mã OTP hoặc cài ứng dụng lạ. Chỉ thanh toán theo thông tin booking chính thức."}
            </p>
          </div>
        </address>
      </section>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-5 text-xs text-white/50 section-shell flex flex-wrap items-center justify-between gap-3">
        <p>
          {isEn
            ? "© 2026 Cham A Luoi. Official Community-Based Tourism Network."
            : "© 2026 Chạm A Lưới (Lên Bản). Nền tảng kết nối du lịch cộng đồng chính thức."}
        </p>
        <p className="text-white/40 text-[11px]">
          {isEn
            ? "Preserving Pa Co, Ta Oi, Co Tu living heritage • Sustainable development"
            : "Bảo tồn di sản sống Pa Cô, Tà Ôi, Cơ Tu • Phát triển sinh kế bền vững"}
        </p>
      </div>
    </footer>
  );
}
