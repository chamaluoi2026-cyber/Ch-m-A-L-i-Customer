"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Heart } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";
import { navItems, siteConfig } from "@/data/site";
import { useLanguage } from "@/components/i18n-provider";
import type { SiteSettings } from "@/lib/server-store";

interface FooterProps {
  logo?: string;
  settings?: SiteSettings;
}

export function Footer({ logo, settings }: FooterProps = {}) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  // Logo footer: Ưu tiên logoDark nếu người dùng tùy chỉnh logoDark riêng (khác mặc định /images/logo-white.svg).
  // Nếu không, tự động đồng bộ theo settings.logo chính (hoặc logo prop).
  const hasCustomDarkLogo = Boolean(
    settings?.logoDark &&
    settings.logoDark !== "/images/logo-white.svg" &&
    settings.logoDark !== siteConfig.logoDark &&
    settings.logoDark !== settings?.logo
  );
  const activeLogo = hasCustomDarkLogo
    ? settings!.logoDark!
    : (settings?.logo || logo || siteConfig.logoDark || siteConfig.logo);
  const address = settings?.contactAddress || (isEn ? "A Luoi District, Thua Thien Hue, Vietnam" : "Huyện A Lưới, Thừa Thiên Huế");
  const phone = settings?.contactPhone || "0905 000 118";
  const email = settings?.contactEmail || "hotro@chamaluoi.vn";
  const facebookUrl = settings?.facebookUrl || "https://facebook.com/chamaluoi";
  const instagramUrl = settings?.instagramUrl || "https://instagram.com/chamaluoi";
  const zaloUrl = settings?.zaloUrl || "";
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

  const rawW = settings?.logoWidth || 160;
  const rawH = settings?.logoHeight || 44;
  const scale = ((settings?.logoScale || 100) / 100);
  const displayH = Math.min(Math.max(Math.round(rawH * scale), 36), 72);
  const displayW = Math.min(Math.max(Math.round(rawW * scale), 100), 340);

  return (
    <footer className="bg-ink text-white">
      <section className="section-shell grid gap-10 py-14 md:grid-cols-[1.4fr_0.8fr_1fr]">
        <article>
          <div
            className="relative mb-3 flex items-center"
            style={{ height: `${displayH}px`, width: `${displayW}px`, maxWidth: "100%" }}
          >
            <AppImage
              src={activeLogo}
              alt="Logo Chạm A Lưới"
              fill
              fallbackSrc="/images/logo-white.svg"
              className="object-contain object-left"
              priority
            />
          </div>
          <p className="max-w-md text-xs leading-6 text-white/70">
            {description}
          </p>
          <p className="mt-4 text-xs text-emerald-300 flex items-center gap-1.5">
            <Heart className="size-3.5 fill-current" />
            {isEn
              ? "Green Tourism • Cultural Respect • Empowering Communities"
              : "Du lịch xanh • Tôn trọng bản sắc • Đồng hành cùng bà con"}
          </p>
        </article>

        <nav aria-label={isEn ? "Visitor navigation" : "Điều hướng du khách"}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {isEn ? "Explore A Luoi" : "Khám phá A Lưới"}
          </h2>
          <ul className="mt-4 grid gap-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="text-xs text-white/75 hover:text-white transition" href={item.href}>
                  {getNavLabel(item.href, item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {isEn ? "Support & Contact" : "Hỗ trợ & Liên hệ"}
          </h2>
          <ul className="mt-4 grid gap-2.5 text-xs text-white/75">
            <li className="flex gap-2.5 items-center">
              <MapPin className="size-4 shrink-0 text-clay" aria-hidden="true" />
              <span>{address}</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition font-medium">
                {phone}
              </a>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail className="size-4 shrink-0 text-amber-300" aria-hidden="true" />
              <a href={`mailto:${email}`} className="hover:text-white transition">
                {email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-3 text-white/75">
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
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
                className="hover:text-white transition"
                aria-label="Instagram Chạm A Lưới"
              >
                <Instagram className="size-4" aria-hidden="true" />
              </a>
            )}
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold px-2 py-0.5 rounded border border-white/20 hover:border-white hover:text-white transition"
                aria-label="Zalo Chạm A Lưới"
              >
                Zalo
              </a>
            )}
          </div>
        </address>
      </section>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50 section-shell flex flex-wrap items-center justify-between gap-2">
        <p>
          {isEn
            ? "© 2026 Cham A Luoi. Community-based tourism network."
            : "© 2026 Chạm A Lưới. Nền tảng kết nối du lịch cộng đồng."}
        </p>
        <p className="text-white/40 text-[11px]">
          {isEn
            ? "Preserving Pa Co, Ta Oi, Co Tu cultural heritage • Sustainable development"
            : "Bảo tồn văn hóa Pa Cô, Tà Ôi, Cơ Tu • Phát triển bền vững"}
        </p>
      </div>
    </footer>
  );
}

