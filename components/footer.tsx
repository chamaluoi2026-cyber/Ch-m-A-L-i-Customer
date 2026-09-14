import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Heart } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";
import { navItems, siteConfig } from "@/data/site";

import type { SiteSettings } from "@/lib/server-store";

interface FooterProps {
  logo?: string;
  settings?: SiteSettings;
}

export function Footer({ logo, settings }: FooterProps = {}) {
  const activeLogo = logo || settings?.logoDark || settings?.logo || siteConfig.logoDark || siteConfig.logo;
  const address = settings?.contactAddress || "Huyện A Lưới, Thừa Thiên Huế";
  const phone = settings?.contactPhone || "0905 000 118";
  const email = settings?.contactEmail || "hotro@chamaluoi.vn";
  const facebookUrl = settings?.facebookUrl || "https://facebook.com/chamaluoi";
  const instagramUrl = settings?.instagramUrl || "https://instagram.com/chamaluoi";
  const zaloUrl = settings?.zaloUrl || "";
  const description = settings?.footerDescription || "Nền tảng du lịch cộng đồng kết nối du khách với các homestay, làng nghề truyền thống, ẩm thực bản địa và những điểm đến sinh thái nguyên sơ tại A Lưới, Thừa Thiên Huế.";

  return (
    <footer className="bg-ink text-white">
      <section className="section-shell grid gap-10 py-14 md:grid-cols-[1.4fr_0.8fr_1fr]">
        <article>
          <div className="relative h-12 w-48 mb-3">
            <AppImage
              src={activeLogo}
              alt="Logo Chạm A Lưới"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="max-w-md text-xs leading-6 text-white/70">
            {description}
          </p>
          <p className="mt-4 text-xs text-emerald-300 flex items-center gap-1.5">
            <Heart className="size-3.5 fill-current" /> Du lịch xanh • Tôn trọng bản sắc • Đồng hành cùng bà con
          </p>
        </article>

        <nav aria-label="Điều hướng du khách">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Khám phá A Lưới</h2>
          <ul className="mt-4 grid gap-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="text-xs text-white/75 hover:text-white transition" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Hỗ trợ & Liên hệ</h2>
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
        <p>© 2026 Chạm A Lưới. Nền tảng kết nối du lịch cộng đồng.</p>
        <p className="text-white/40 text-[11px]">Bảo tồn văn hóa Pa Cô, Tà Ôi, Cơ Tu • Phát triển bền vững</p>
      </div>
    </footer>
  );
}
