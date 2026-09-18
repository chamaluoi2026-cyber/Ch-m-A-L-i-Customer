"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Compass,
  Gift,
  Headphones,
  MapPinned,
  Route,
  Star,
  TentTree
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/image-card";
import { MotionReveal } from "@/components/motion-reveal";
import { PlaceCard } from "@/components/place-card";
import { SectionHeading } from "@/components/section-heading";
import { AppImage } from "@/components/ui/app-image";
import { imageFor } from "@/data/site";
import { useLanguage } from "@/components/i18n-provider";
import type { Place } from "@/data/places";
import type { PlaceRecord, SiteSettings } from "@/lib/server-store";
import {
  homestayTranslations,
  productTranslations,
  blogTranslations,
  testimonialTranslations
} from "@/lib/i18n/catalog-translations";

interface HomeClientViewProps {
  activeHeroImage: string;
  settings?: SiteSettings;
  featuredPlaces: (Place | PlaceRecord)[];
  homestays: any[];
  products: any[];
  publishedBlogs: any[];
  testimonials: any[];
}

const aluoiGallery = [
  {
    title: "Núi rừng A Lưới",
    enTitle: "A Luoi Mountain Passes",
    caption: "Những cung đường xanh mở ra nhịp đi chậm và sâu.",
    enCaption: "Pristine mountain passes opening up a deep, mindful travel rhythm.",
    image: imageFor("photo-1500534314209-a25ddb2bd429"),
    className: "md:col-span-2 md:row-span-2"
  },
  {
    title: "Thác A Nôr",
    enTitle: "A Nor Waterfall",
    caption: "Không gian mát lành cho hành trình cộng đồng.",
    enCaption: "Crystal mountain waters creating an idyllic sanctuary for travelers.",
    image: imageFor("photo-1506744038136-46273834b3fb"),
    className: ""
  },
  {
    title: "Bình minh vùng cao",
    enTitle: "Highland Sunrise",
    caption: "Ánh sáng mềm trên núi và bản làng.",
    enCaption: "Soft morning light cascading over limestone crests and stilt houses.",
    image: imageFor("photo-1501785888041-af3ef285b470"),
    className: ""
  },
  {
    title: "Văn hóa bản địa",
    enTitle: "Indigenous Living Heritage",
    caption: "Chạm vào đời sống, nghề thủ công và sự đón tiếp ấm áp.",
    enCaption: "Immersion into tribal crafts, stilt architecture, and sincere smiles.",
    image: imageFor("photo-1452860606245-08befc0ff44b"),
    className: "md:col-span-2"
  }
];

function hexToRgba(hex?: string, opacity = 30): string {
  if (!hex) return `rgba(15, 56, 46, ${opacity / 100})`;
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (clean.length !== 6) {
    return `rgba(15, 56, 46, ${opacity / 100})`;
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${Math.min(Math.max(opacity, 0), 100) / 100})`;
}

export function HomeClientView({
  activeHeroImage,
  settings,
  featuredPlaces,
  homestays,
  products,
  publishedBlogs,
  testimonials
}: HomeClientViewProps) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  // Dynamic Hero Content & Translations
  const heroBadge = isEn
    ? (settings?.heroBadgeEn || "Community-Based Tourism in Hue")
    : (settings?.heroBadge || t.home.heroTag);

  const heroTitle1 = isEn
    ? (settings?.heroTitleLine1En || "Highland Adventure &")
    : (settings?.heroTitleLine1 || "Chạm A Lưới");

  const heroTitle2 = isEn
    ? (settings?.heroTitleLine2En || "Nature Retreat")
    : (settings?.heroTitleLine2 || "Du lịch cộng đồng");

  const heroDesc = isEn
    ? (settings?.heroDescriptionEn || "Discover verified community homestays, traditional craft villages, authentic cuisine, and pristine waterfalls in A Luoi, Thua Thien Hue.")
    : (settings?.heroDescription || t.home.heroDesc);

  const heroPrimaryText = isEn
    ? (settings?.heroPrimaryBtnTextEn || t.home.heroExploreBtn)
    : (settings?.heroPrimaryBtnText || t.home.heroExploreBtn);

  const heroPrimaryLink = settings?.heroPrimaryBtnLink || "/places";

  const heroSecondaryText = isEn
    ? (settings?.heroSecondaryBtnTextEn || t.home.heroBookTourBtn)
    : (settings?.heroSecondaryBtnText || t.home.heroBookTourBtn);

  const heroSecondaryLink = settings?.heroSecondaryBtnLink || "/book-tour";

  const overlayOpacity = Math.min(Math.max(settings?.heroOverlayOpacity ?? 60, 20), 95) / 100;

  // Cấu hình Vị trí hiển thị & Layer Giữa (Khung chữ)
  const position = settings?.heroPosition || "top";
  const cardStyle = settings?.heroCardStyle || "crystal";
  const cardColor = settings?.heroCardColor || "#0f382e";
  const cardOpacity = settings?.heroCardOpacity ?? 20;
  const cardBlur = settings?.heroCardBlur || "md";

  const blurClass = {
    none: "backdrop-blur-none",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  }[cardBlur] || "backdrop-blur-md";

  let containerBgStyle: React.CSSProperties = {};
  const isTop = position === "top";
  let containerClasses = `relative mx-auto max-w-3xl sm:max-w-4xl ${isTop ? "px-6 py-5 sm:px-10 sm:py-7" : "px-6 py-8 sm:px-12 sm:py-12"} transition-all duration-300 `;

  if (cardStyle === "none") {
    containerClasses += "bg-transparent border-0 shadow-none";
  } else if (cardStyle === "crystal") {
    // Kính pha lê siêu trong suốt chuẩn Apple Liquid Crystal - Không làm tối mặt người phía sau
    containerClasses += `rounded-3xl border border-white/30 shadow-2xl ${blurClass}`;
    containerBgStyle = {
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 100%)",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
    };
  } else if (cardStyle === "radial") {
    containerClasses += `rounded-3xl border-0 shadow-none ${blurClass}`;
    containerBgStyle = {
      background: `radial-gradient(ellipse at center, ${hexToRgba(cardColor, cardOpacity)} 0%, ${hexToRgba(cardColor, Math.round(cardOpacity * 0.3))} 55%, transparent 75%)`
    };
  } else if (cardStyle === "gradient") {
    containerClasses += `rounded-3xl border border-white/20 shadow-2xl ${blurClass}`;
    containerBgStyle = {
      background: `linear-gradient(180deg, ${hexToRgba(cardColor, Math.min(cardOpacity + 12, 95))} 0%, ${hexToRgba(cardColor, cardOpacity)} 50%, ${hexToRgba(cardColor, Math.min(cardOpacity + 16, 95))} 100%)`
    };
  } else {
    // "frosted" or "custom"
    containerClasses += `rounded-3xl border border-white/20 shadow-2xl ${blurClass}`;
    containerBgStyle = {
      backgroundColor: hexToRgba(cardColor, cardOpacity)
    };
  }

  // Section alignment according to heroPosition
  const sectionAlignClass = isTop
    ? "items-start pt-24 sm:pt-28 pb-8"
    : position === "bottom"
    ? "items-end pt-16 pb-16"
    : "items-center pt-24 pb-16";

  return (
    <main className="space-y-0">
      {/* 1. HERO BANNER */}
      <section className={`relative min-h-[94vh] flex justify-center overflow-hidden bg-forest ${sectionAlignClass} text-white`}>
        <figure className="absolute inset-0">
          <AppImage
            src={activeHeroImage}
            alt="Phong cảnh núi rừng A Lưới"
            fill
            priority
            className="object-cover object-center brightness-[0.82] contrast-[1.05]"
          />
          <figcaption className="sr-only">Hình ảnh đại diện phong cảnh thiên nhiên A Lưới</figcaption>
          {/* Enhanced Dark Overlay Scrim with dynamic opacity */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/50 transition-opacity duration-300"
            style={{ opacity: overlayOpacity }}
          />
          <div className="absolute inset-0 bg-radial-vignette opacity-70" />
        </figure>

        <header className={`relative z-10 mx-auto max-w-5xl px-4 ${isTop ? "py-2 sm:py-4" : "py-8"} text-center sm:px-6 lg:px-8`}>
          {/* Glassmorphism Frosted Backdrop Card (Layer mờ dưới chữ để làm nổi bật nội dung) */}
          <div className={containerClasses} style={containerBgStyle}>
            {/* Ambient top border glow */}
            {cardStyle !== "none" && cardStyle !== "radial" && (
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            )}

            <MotionReveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-950/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 shadow-md backdrop-blur-sm">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                {heroBadge}
              </div>
            </MotionReveal>

            <MotionReveal delay={0.1}>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.18] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                <span className="text-white drop-shadow-sm">{heroTitle1}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 drop-shadow-[0_2px_16px_rgba(16,185,129,0.4)]">
                  {heroTitle2}
                </span>
              </h1>
            </MotionReveal>

            <MotionReveal delay={0.2}>
              <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base md:text-lg font-normal leading-relaxed text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {heroDesc}
              </p>
            </MotionReveal>

            <MotionReveal delay={0.3}>
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-4" aria-label="Điều hướng chính Hero">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 text-base shadow-xl shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Link href={heroPrimaryLink}>
                    {heroPrimaryText}
                    <ArrowRight className="size-5 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 text-base backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Link href={heroSecondaryLink}>{heroSecondaryText}</Link>
                </Button>
              </nav>
            </MotionReveal>

            {/* Micro Trust badges */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-white/80 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> {isEn ? "100% Verified Local Homestays" : "100% Homestay bản địa"}
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> {isEn ? "Exclusive Direct Vouchers" : "Nhận voucher ưu đãi trực tiếp"}
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> {isEn ? "Mountain Pass Weather Advice" : "Cố vấn đèo QL49 an toàn"}
              </span>
            </div>
          </div>
        </header>

        <aside className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/70 text-xs font-medium tracking-widest uppercase">
          <span>{isEn ? "Scroll to Explore" : "Cuộn để khám phá"}</span>
          <ArrowDown className="size-4 animate-bounce text-emerald-300" />
        </aside>
      </section>

      {/* 2. CHOOSE DESTINATION & CLAIM VOUCHER */}
      <section className="section-shell py-24">
        <MotionReveal>
          <SectionHeading
            eyebrow={t.home.featuredEyebrow}
            title={t.home.featuredTitle}
            description={t.home.featuredDesc}
          />
        </MotionReveal>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-card">
            <p className="flex size-12 items-center justify-center rounded-full bg-forest text-white">
              <Building2 className="size-6" />
            </p>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">{t.home.step1Title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/65">{t.home.step1Desc}</p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-card">
            <p className="flex size-12 items-center justify-center rounded-full bg-clay text-white">
              <Gift className="size-6" />
            </p>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">{t.home.step2Title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/65">{t.home.step2Desc}</p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-card">
            <p className="flex size-12 items-center justify-center rounded-full bg-ink text-white">
              <Headphones className="size-6" />
            </p>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">{t.home.step3Title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/65">{t.home.step3Desc}</p>
          </article>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/places">
              {t.home.viewAllPlaces}
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3. TRIP BOOKING (ALL-INCLUSIVE VS SELF-GUIDED) */}
      <section className="section-shell py-24">
        <MotionReveal>
          <SectionHeading
            eyebrow={t.home.bookingEyebrow}
            title={t.home.bookingTitle}
            description={t.home.bookingDesc}
          />
        </MotionReveal>
        <div className="grid gap-6 md:grid-cols-2">
          <MotionReveal>
            <article className="rounded-3xl bg-white p-8 shadow-card transition hover:-translate-y-1">
              <p className="flex size-12 items-center justify-center rounded-full bg-forest text-white">
                <Route className="size-6" />
              </p>
              <h2 className="mt-5 text-3xl font-extrabold text-ink">{t.home.packageTourTitle}</h2>
              <p className="mt-4 text-base leading-8 text-ink/65">{t.home.packageTourDesc}</p>
              <Button asChild size="lg" className="mt-7">
                <Link href="/book-tour/package">
                  {t.home.packageTourBtn}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </article>
          </MotionReveal>
          <MotionReveal>
            <article className="rounded-3xl bg-white p-8 shadow-card transition hover:-translate-y-1">
              <p className="flex size-12 items-center justify-center rounded-full bg-clay text-white">
                <TentTree className="size-6" />
              </p>
              <h2 className="mt-5 text-3xl font-extrabold text-ink">{t.home.selfGuidedTitle}</h2>
              <p className="mt-4 text-base leading-8 text-ink/65">{t.home.selfGuidedDesc}</p>
              <Button asChild size="lg" className="mt-7 bg-clay hover:bg-brown">
                <Link href="/book-tour/self-guided">
                  {t.home.selfGuidedBtn}
                  <Compass className="size-5" />
                </Link>
              </Button>
            </article>
          </MotionReveal>
        </div>
      </section>

      {/* 4. GALLERY */}
      <section className="bg-white py-24">
        <div className="section-shell">
          <MotionReveal>
            <header className="mb-10 grid gap-6 md:grid-cols-[0.75fr_1fr] md:items-end">
              <section>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-clay">
                  <MapPinned className="size-4" aria-hidden="true" />
                  {t.home.galleryEyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
                  {t.home.galleryTitle}
                </h2>
              </section>
              <p className="text-base leading-8 text-ink/65">
                {t.home.galleryDesc}
              </p>
            </header>
          </MotionReveal>
          <section className="grid auto-rows-[240px] gap-5 md:grid-cols-4">
            {aluoiGallery.map((item) => (
              <figure key={item.title} className={`group relative overflow-hidden rounded-3xl shadow-card ${item.className}`}>
                <AppImage
                  src={item.image}
                  alt={isEn ? item.enTitle : item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 text-white">
                  <h3 className="text-xl font-bold">{isEn ? item.enTitle : item.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                    {isEn ? item.enCaption : item.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </section>
        </div>
      </section>

      {/* 5. FEATURED HOMESTAYS */}
      <section className="bg-white py-24">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t.home.homestayEyebrow}
            title={t.home.homestayTitle}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homestays.map((item) => {
              const hsTrans = homestayTranslations[item.id];
              const title = isEn && hsTrans ? hsTrans.name : item.name;
              const village = isEn && hsTrans ? hsTrans.village : item.village;
              const capacity = isEn && hsTrans ? hsTrans.capacity : item.capacity;
              const meta = `${item.rating} ${isEn ? "rating" : "điểm đánh giá"}`;

              return (
                <ImageCard
                  key={item.id}
                  href="/book-tour"
                  image={item.image}
                  alt={`Homestay ${title}`}
                  title={title}
                  subtitle={`${village} · ${capacity}`}
                  meta={meta}
                  price={item.price}
                  cta={isEn ? "View Details" : "Xem chi tiết"}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. LOCAL SPECIALTIES */}
      <section className="section-shell py-24">
        <SectionHeading
          eyebrow={t.home.specialtiesEyebrow}
          title={t.home.specialtiesTitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((item) => {
            const prodTrans = productTranslations[item.slug];
            const title = isEn && prodTrans ? prodTrans.name : item.name;
            const subtitle = isEn && prodTrans ? prodTrans.description : item.description;
            const meta = isEn && prodTrans ? prodTrans.category : item.category;

            return (
              <ImageCard
                key={item.slug}
                href={`/products/${item.slug}#dat-hang`}
                image={item.image}
                alt={title}
                title={title}
                subtitle={subtitle}
                meta={meta}
                price={item.price}
                cta={isEn ? "Order Now" : "Đặt hàng"}
              />
            );
          })}
        </div>
      </section>

      {/* 7. LATEST STORIES */}
      <section className="bg-forest py-24 text-white">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t.home.blogEyebrow}
            title={t.home.blogTitle}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {publishedBlogs.map((post) => {
              const bTrans = blogTranslations[post.slug];
              const title = isEn && bTrans ? bTrans.title : post.title;
              const category = isEn && bTrans ? bTrans.category : post.category;
              const excerpt = isEn && bTrans ? bTrans.excerpt : post.excerpt;

              return (
                <article key={post.slug} className="rounded-2xl bg-white/10 p-5 backdrop-blur transition hover:-translate-y-1">
                  <figure className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <AppImage src={post.image} alt={title} fill className="object-cover" />
                  </figure>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/60">{category}</p>
                  <h3 className="mt-2 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold hover:underline">
                    {t.home.readArticle}
                    <ArrowRight className="size-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="section-shell py-24">
        <SectionHeading
          eyebrow={t.home.testimonialsEyebrow}
          title={t.home.testimonialsTitle}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => {
            const enTestimonial = testimonialTranslations[index];
            const quote = isEn && enTestimonial ? enTestimonial.quote : item.quote;
            const name = isEn && enTestimonial ? enTestimonial.name : item.name;
            const role = isEn && enTestimonial ? enTestimonial.role : item.role;

            return (
              <article key={item.name} className="rounded-2xl bg-white p-6 shadow-card">
                <p className="flex gap-1 text-clay" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </p>
                <blockquote className="mt-5 text-lg font-medium leading-8 text-ink">
                  “{quote}”
                </blockquote>
                <footer className="mt-5 text-sm text-ink/60">
                  <strong className="text-ink">{name}</strong> · {role}
                </footer>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
