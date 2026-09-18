"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { AuthNavLink } from "@/components/auth/auth-nav-link";
import { Button } from "@/components/ui/button";
import { AppImage } from "@/components/ui/app-image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/i18n-provider";
import { navItems, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

interface NavbarProps {
  initialLogo?: string;
  initialMobileLogo?: string;
}

export function Navbar({ initialLogo, initialMobileLogo }: NavbarProps = {}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const isEn = language === "en";
  const activeLogo = initialLogo || siteConfig.logo;
  const activeMobileLogo = initialMobileLogo || activeLogo;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-forest/10 bg-beige/95 shadow-[0_4px_24px_rgba(22,33,30,0.06)] backdrop-blur-xl">
      <nav className="section-shell flex h-18 items-center justify-between gap-2" aria-label="Điều hướng chính">
        {/* Logo */}
        <Link href="/" className="focus-ring flex shrink-0 items-center gap-2 transition hover:opacity-90">
          <div className={cn("relative h-10 w-36 sm:w-44", activeMobileLogo !== activeLogo ? "hidden sm:block" : "block")}>
            <AppImage
              src={activeLogo}
              alt="Logo Chạm A Lưới"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          {activeMobileLogo !== activeLogo && (
            <div className="relative h-9 w-28 sm:hidden">
              <AppImage
                src={activeMobileLogo}
                alt="Logo Chạm A Lưới"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          )}
        </Link>

        {/* Desktop Navigation Links - Single row, perfectly spaced */}
        <ul className="hidden items-center gap-0.5 rounded-full border border-forest/10 bg-white/90 p-1 shadow-xs md:flex lg:gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const label = isEn && item.enLabel ? item.enLabel : item.label;

            // Highlighted AI Itinerary Menu Item
            if (item.isHighlight) {
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-ring relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-300 lg:px-3.5 lg:text-sm",
                      active
                        ? "bg-gradient-to-r from-forest via-[#0F5C4A] to-[#A85832] text-white shadow-sm ring-2 ring-amber-400"
                        : "bg-gradient-to-r from-forest/90 via-[#10624F] to-[#964722] text-white shadow-2xs hover:brightness-110"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                    <span className="rounded-full bg-amber-400/30 border border-amber-300/60 px-1.5 py-0.2 text-[9px] font-black uppercase text-amber-200">
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
                    "focus-ring rounded-full px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition lg:px-3.5 lg:text-sm",
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

        {/* Right CTA Area: Compact & Sleek */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <LanguageSwitcher />
          <AuthNavLink />
          <Button asChild size="sm" className="h-8.5 rounded-full bg-forest px-3.5 text-xs font-bold text-white shadow-xs hover:bg-forest-light whitespace-nowrap">
            <Link href="/book-tour">{t.nav.bookTour}</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex shrink-0 items-center gap-1.5 md:hidden">
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            aria-label="Mở menu di động"
            className="focus-ring rounded-full bg-white p-2 text-ink shadow-sm"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open ? (
        <nav className="section-shell pb-5 md:hidden" aria-label="Điều hướng di động">
          <ul className="grid gap-2 rounded-2xl border border-forest/10 bg-white p-3 shadow-card">
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
                        "focus-ring flex items-center justify-between rounded-xl p-3 text-sm font-bold text-white transition",
                        "bg-gradient-to-r from-forest via-[#0F5C4A] to-[#A85832] shadow-md"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <span>{label}</span>
                      </div>
                      <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-ink">
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
                      "focus-ring block rounded-xl px-4 py-2.5 text-sm font-semibold",
                      active ? "bg-forest text-white" : "text-ink hover:bg-beige"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="border-t border-forest/10 pt-2 flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="focus-ring flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-forest border border-forest/20 hover:bg-beige"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/book-tour"
                onClick={() => setOpen(false)}
                className="focus-ring flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-bold bg-forest text-white hover:bg-forest-light"
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