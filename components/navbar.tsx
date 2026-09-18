"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { AuthNavLink } from "@/components/auth/auth-nav-link";
import { Button } from "@/components/ui/button";
import { AppImage } from "@/components/ui/app-image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { WeatherNavBadge } from "@/components/weather-nav-badge";
import { useLanguage } from "@/components/i18n-provider";
import { navItems, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/server-store";

interface NavbarProps {
  initialLogo?: string;
  initialMobileLogo?: string;
  logoScale?: number;
  logoWidth?: number;
  logoHeight?: number;
  settings?: SiteSettings;
}

export function Navbar({
  initialLogo,
  initialMobileLogo,
  logoScale,
  logoWidth,
  logoHeight,
  settings
}: NavbarProps = {}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const isEn = language === "en";
  const activeLogo = settings?.logo || initialLogo || siteConfig.logo;
  const activeMobileLogo = settings?.logoMobile || initialMobileLogo || activeLogo;

  // Hỗ trợ kích thước và tỷ lệ co giãn từ Admin (logoScale: 50% - 200%)
  const scale = ((settings?.logoScale ?? logoScale) || 100) / 100;
  const rawW = Math.max((settings?.logoWidth ?? logoWidth) || 220, 220);
  const rawH = (settings?.logoHeight ?? logoHeight) || 56;

  // Cho phép logo tận dụng chiều cao header 80px (tối đa 72px)
  const displayH = Math.min(Math.max(rawH, 36), 72);
  const displayW = Math.min(Math.max(Math.round(rawW * Math.max(scale, 1)), 180), 380);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-forest/10 bg-beige/95 shadow-[0_6px_28px_rgba(22,33,30,0.06)] backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-6 sm:px-8 lg:px-12 gap-4" aria-label="Điều hướng chính">
        {/* Logo */}
        <Link href="/" className="focus-ring flex shrink-0 items-center gap-2 transition hover:opacity-90">
          <div
            className={cn("relative transition-all duration-200 flex items-center shrink-0", activeMobileLogo !== activeLogo ? "hidden sm:flex" : "flex")}
            style={{
              height: `${displayH}px`,
              width: `${displayW}px`,
              transform: scale !== 1 ? `scale(${scale})` : undefined,
              transformOrigin: "left center"
            }}
          >
            <AppImage
              src={activeLogo}
              alt="Logo Chạm A Lưới"
              fill
              className="object-contain object-left"
              fallbackSrc="/images/logo.svg"
              priority
            />
          </div>
          {activeMobileLogo !== activeLogo && (
            <div
              className="relative transition-all duration-200 sm:hidden flex items-center shrink-0"
              style={{
                height: `${Math.min(displayH, 48)}px`,
                width: `${Math.min(displayW, 180)}px`,
                transform: scale !== 1 ? `scale(${Math.min(scale, 1.25)})` : undefined,
                transformOrigin: "left center"
              }}
            >
              <AppImage
                src={activeMobileLogo}
                alt="Logo Chạm A Lưới"
                fill
                className="object-contain object-left"
                fallbackSrc="/images/logo.svg"
                priority
              />
            </div>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 xl:gap-2 rounded-full border border-forest/15 bg-white/95 p-1.5 shadow-sm md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const label = isEn && item.enLabel ? item.enLabel : item.label;

            // Highlighted AI Itinerary: Distinct Amber/Gold Sunset Tone - NEVER clashes with active green items
            if (item.isHighlight) {
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-ring relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold whitespace-nowrap transition-all duration-300 xl:px-5",
                      active
                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md ring-2 ring-orange-400 scale-102"
                        : "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-[#291603] shadow-xs hover:from-amber-500 hover:to-orange-500 hover:text-white hover:shadow-md"
                    )}
                  >
                    <Sparkles className="h-4 w-4 animate-pulse shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900 shadow-2xs">
                      {isEn ? "AI" : item.badge || "AI"}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-150 xl:px-5",
                    active
                      ? "bg-forest text-white shadow-xs"
                      : "text-ink/80 hover:bg-forest/10 hover:text-forest"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right CTA Area: Roomy, balanced & elegant */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <WeatherNavBadge variant="navbar" />
          <LanguageSwitcher className="px-1 py-0.5" />
          <AuthNavLink />
          <Button asChild className="h-10 rounded-full bg-forest px-5 text-sm font-bold text-white shadow-sm hover:bg-forest-light whitespace-nowrap transition-all">
            <Link href="/book-tour">{t.nav.bookTour}</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <WeatherNavBadge variant="compact" />
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            aria-label="Mở menu di động"
            className="focus-ring rounded-full bg-white p-2.5 text-ink shadow-sm"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open ? (
        <nav className="section-shell pb-5 md:hidden" aria-label="Điều hướng di động">
          <ul className="grid gap-2 rounded-2xl border border-forest/10 bg-white p-3.5 shadow-card">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const label = isEn && item.enLabel ? item.enLabel : item.label;

              if (item.isHighlight) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "focus-ring flex items-center justify-between rounded-xl p-3.5 text-sm font-extrabold transition",
                        active
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md"
                          : "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-[#291603] shadow-xs"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-amber-900">
                        {isEn ? "AI NEW" : "MỚI"}
                      </span>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-ring block rounded-xl px-4 py-3 text-sm font-semibold",
                      active ? "bg-forest text-white" : "text-ink hover:bg-beige"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-1 pb-1">
              <WeatherNavBadge variant="drawer" />
            </li>
            <li className="border-t border-forest/10 pt-2.5 flex flex-col gap-2">
              <AuthNavLink variant="drawer" onItemClick={() => setOpen(false)} />
              <Link
                href="/book-tour"
                onClick={() => setOpen(false)}
                className="focus-ring w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold bg-forest text-white hover:bg-forest-light"
              >
                {t.nav.bookTour}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}