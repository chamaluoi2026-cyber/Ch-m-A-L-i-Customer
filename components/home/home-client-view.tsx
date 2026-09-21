"use client";

import { useState } from "react";
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
    title: "NÃºi rá»«ng A LÆ°á»›i",
    enTitle: "A Luoi Mountain Passes",
    caption: "Nhá»¯ng cung Ä‘Æ°á»ng xanh má»Ÿ ra nhá»‹p Ä‘i cháº­m vÃ  sÃ¢u.",
    enCaption: "Pristine mountain passes opening up a deep, mindful travel rhythm.",
    image: imageFor("photo-1500534314209-a25ddb2bd429"),
    className: "md:col-span-2 md:row-span-2"
  },
  {
    title: "ThÃ¡c A NÃ´r",
    enTitle: "A Nor Waterfall",
    caption: "KhÃ´ng gian mÃ¡t lÃ nh cho hÃ nh trÃ¬nh cá»™ng Ä‘á»“ng.",
    enCaption: "Crystal mountain waters creating an idyllic sanctuary for travelers.",
    image: imageFor("photo-1506744038136-46273834b3fb"),
    className: ""
  },
  {
    title: "BÃ¬nh minh vÃ¹ng cao",
    enTitle: "Highland Sunrise",
    caption: "Ãnh sÃ¡ng má»m trÃªn nÃºi vÃ  báº£n lÃ ng.",
    enCaption: "Soft morning light cascading over limestone crests and stilt houses.",
    image: imageFor("photo-1501785888041-af3ef285b470"),
    className: ""
  },
  {
    title: "VÄƒn hÃ³a báº£n Ä‘á»‹a",
    enTitle: "Indigenous Living Heritage",
    caption: "Cháº¡m vÃ o Ä‘á»i sá»‘ng, nghá» thá»§ cÃ´ng vÃ  sá»± Ä‘Ã³n tiáº¿p áº¥m Ã¡p.",
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
  const [activeItineraryDay, setActiveItineraryDay] = useState<1 | 2>(1);

  // Dynamic Hero Content & Translations
  const heroBadge = isEn
    ? (settings?.heroBadgeEn || "Community-Based Tourism in Hue")
    : (settings?.heroBadge || t.home.heroTag);

  const heroTitle1 = isEn
    ? (settings?.heroTitleLine1En || "Highland Adventure &")
    : (settings?.heroTitleLine1 || "Cháº¡m A LÆ°á»›i");

  const heroTitle2 = isEn
    ? (settings?.heroTitleLine2En || "Nature Retreat")
    : (settings?.heroTitleLine2 || "Du lá»‹ch cá»™ng Ä‘á»“ng");

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

  // Cáº¥u hÃ¬nh Vá»‹ trÃ­ hiá»ƒn thá»‹ & Layer Giá»¯a (Khung chá»¯)
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
    // KÃ­nh pha lÃª siÃªu trong suá»‘t chuáº©n Apple Liquid Crystal - KhÃ´ng lÃ m tá»‘i máº·t ngÆ°á»i phÃ­a sau
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
            alt="Phong cáº£nh nÃºi rá»«ng A LÆ°á»›i"
            fill
            priority
            className="object-cover object-center brightness-[0.82] contrast-[1.05]"
          />
          <figcaption className="sr-only">HÃ¬nh áº£nh Ä‘áº¡i diá»‡n phong cáº£nh thiÃªn nhiÃªn A LÆ°á»›i</figcaption>
          {/* Enhanced Dark Overlay Scrim with dynamic opacity */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/50 transition-opacity duration-300"
            style={{ opacity: overlayOpacity }}
          />
          <div className="absolute inset-0 bg-radial-vignette opacity-70" />
        </figure>

        <header className={`relative z-10 mx-auto max-w-5xl px-4 ${isTop ? "py-2 sm:py-4" : "py-8"} text-center sm:px-6 lg:px-8`}>
          {/* Glassmorphism Frosted Backdrop Card (Layer má» dÆ°á»›i chá»¯ Ä‘á»ƒ lÃ m ná»•i báº­t ná»™i dung) */}
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
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-4" aria-label="Äiá»u hÆ°á»›ng chÃ­nh Hero">
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
                <span className="text-emerald-400 font-bold">âœ“</span> {isEn ? "100% Verified Local Homestays" : "100% Homestay báº£n Ä‘á»‹a"}
              </span>
              <span className="hidden sm:inline text-white/30">â€¢</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">âœ“</span> {isEn ? "Exclusive Direct Vouchers" : "Nháº­n voucher Æ°u Ä‘Ã£i trá»±c tiáº¿p"}
              </span>
              <span className="hidden sm:inline text-white/30">â€¢</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">âœ“</span> {isEn ? "Mountain Pass Weather Advice" : "Cá»‘ váº¥n Ä‘Ã¨o QL49 an toÃ n"}
              </span>
            </div>
          </div>
        </header>

        <aside className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/70 text-xs font-medium tracking-widest uppercase">
          <span>{isEn ? "Scroll to Explore" : "Cuá»™n Ä‘á»ƒ khÃ¡m phÃ¡"}</span>
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

      {/* âœ¨ AI Lá»ŠCH TRÃŒNH â€” SECTION HIGHLIGHT */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest/95 to-[#0a2e22] py-24">
        {/* CSS animations for floating effects */}
        <style>{`
          @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
          @keyframes floatY2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          @keyframes floatRotate { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(8deg)} }
          @keyframes shimmer { 0%{opacity:0.15} 50%{opacity:0.35} 100%{opacity:0.15} }
          .float-1 { animation: floatY 6s ease-in-out infinite; }
          .float-2 { animation: floatY2 8s ease-in-out infinite 1s; }
          .float-3 { animation: floatRotate 7s ease-in-out infinite 2s; }
          .float-card { animation: floatY2 5s ease-in-out infinite 0.5s; }
          .shimmer-orb { animation: shimmer 4s ease-in-out infinite; }
        `}</style>

        {/* Floating decorative orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="shimmer-orb float-1 absolute left-[8%] top-[20%] size-48 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="shimmer-orb float-2 absolute right-[10%] bottom-[15%] size-64 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="float-3 absolute left-[60%] top-[10%] size-8 rounded-full border border-emerald-400/30 bg-emerald-400/10" />
          <div className="float-2 absolute left-[15%] bottom-[25%] size-4 rounded-full bg-emerald-300/20" />
          <div className="float-1 absolute right-[25%] top-[30%] size-5 rounded-full bg-teal-400/15 border border-teal-300/20" />
          {/* Dot grid */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
        </div>

        <div className="section-shell relative">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">

            {/* LEFT: Value Proposition */}
            <MotionReveal>
              <div className="space-y-7">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 backdrop-blur-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  {isEn ? "Powered by AI" : "Trá»£ lÃ½ AI du lá»‹ch"}
                </div>

                {/* Headline */}
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] text-white">
                    {isEn ? (
                      <>Personalized A LÆ°á»›i<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Itinerary in 60s</span></>
                    ) : (
                      <>Lá»‹ch trÃ¬nh A LÆ°á»›i<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">cÃ¡ nhÃ¢n hoÃ¡ trong 60 giÃ¢y</span></>
                    )}
                  </h2>
                  <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/75 max-w-lg">
                    {isEn
                      ? "Tell our AI your travel style, group, budget and interests â€” it builds a full A LÆ°á»›i itinerary with real local stops, meals, and bookable experiences. No generic templates."
                      : "Chá»‰ cáº§n cho AI biáº¿t phong cÃ¡ch, sá»‘ ngÆ°á»i, ngÃ¢n sÃ¡ch vÃ  sá»Ÿ thÃ­ch â€” há»‡ thá»‘ng sáº½ táº¡o lá»‹ch trÃ¬nh A LÆ°á»›i hoÃ n chá»‰nh vá»›i Ä‘iá»ƒm tham quan thá»±c táº¿, áº©m thá»±c Ä‘á»‹a phÆ°Æ¡ng vÃ  tráº£i nghiá»‡m Ä‘áº·t ngay. KhÃ´ng copy-paste."
                    }
                  </p>
                </div>

                {/* 3 Steps */}
                <ol className="space-y-4">
                  {[
                    {
                      num: "01", vi: "MÃ´ táº£ chuyáº¿n Ä‘i", en: "Describe your trip",
                      descVi: "NhÃ³m, ngÃ¢n sÃ¡ch, sá»Ÿ thÃ­ch â€” cÃ ng chi tiáº¿t AI cÃ ng sÃ¡t thá»±c táº¿.",
                      descEn: "Group size, budget, interests â€” the more detail, the better the plan."
                    },
                    {
                      num: "02", vi: "AI dá»±ng lá»‹ch trÃ¬nh", en: "AI builds the plan",
                      descVi: "Tá»± Ä‘á»™ng chá»n Ä‘iá»ƒm Ä‘áº¿n, thá»i gian di chuyá»ƒn, tiáº¿t trá»i phÃ¹ há»£p.",
                      descEn: "Auto-selects destinations, travel times, and weather-appropriate timing."
                    },
                    {
                      num: "03", vi: "Äáº·t vÃ  Ä‘iá»u chá»‰nh", en: "Book & customize",
                      descVi: "Äáº·t homestay, tour trong má»™t chá»—. Thay Ä‘á»•i linh hoáº¡t theo Ã½ báº¡n.",
                      descEn: "Book stays and tours in one place. Adjust freely to your preference."
                    }
                  ].map((step) => (
                    <li key={step.num} className="flex items-start gap-4">
                      <span className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/25 flex items-center justify-center text-[11px] font-black text-emerald-300 font-mono">
                        {step.num}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-white">{isEn ? step.en : step.vi}</p>
                        <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{isEn ? step.descEn : step.descVi}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Single CTA */}
                <div className="pt-2">
                  <Link
                    href="/itinerary"
                    className="inline-flex items-center gap-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm px-8 py-3.5 shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {isEn ? "Create my AI itinerary â€” free" : "Táº¡o lá»‹ch trÃ¬nh AI cá»§a tÃ´i â€” miá»…n phÃ­"}
                  </Link>
                </div>

                {/* Feature chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(isEn
                    ? ["ðŸŒ¤ Weather-aware", "ðŸ‘¥ Group friendly", "ðŸ’° Budget-smart", "ðŸŒ¿ Eco activities", "ðŸ  Local homestays"]
                    : ["ðŸŒ¤ Theo tiáº¿t trá»i", "ðŸ‘¥ Má»i nhÃ³m", "ðŸ’° PhÃ¹ há»£p ngÃ¢n sÃ¡ch", "ðŸŒ¿ Tráº£i nghiá»‡m sinh thÃ¡i", "ðŸ  Homestay báº£n Ä‘á»‹a"]
                  ).map((chip) => (
                    <span key={chip} className="text-[11px] font-medium text-emerald-200/80 bg-white/5 border border-white/10 rounded-full px-3 py-1">{chip}</span>
                  ))}
                </div>
              </div>
            </MotionReveal>

            {/* RIGHT: Itinerary Preview Card (mock UI) */}
            <MotionReveal delay={0.15}>
              <div className="float-card relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-3xl blur-2xl" />

                <div className="relative rounded-2xl border border-white/15 bg-white/8 backdrop-blur-md overflow-hidden shadow-2xl">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="size-3 rounded-full bg-red-400/70" />
                        <span className="size-3 rounded-full bg-yellow-400/70" />
                        <span className="size-3 rounded-full bg-emerald-400/70" />
                      </div>
                      <span className="text-xs font-semibold text-white/60 ml-1">
                        {isEn ? "AI Itinerary â€” 2 Days in A LÆ°á»›i" : "Lá»‹ch trÃ¬nh AI â€” 2 ngÃ y táº¡i A LÆ°á»›i"}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-full px-2.5 py-0.5">AI âœ¦</span>
                  </div>

                  {/* Day tabs â€” interactive */}
                  <div className="flex border-b border-white/10">
                    {([1, 2] as const).map((day) => (
                      <button
                        key={day}
                        onClick={() => setActiveItineraryDay(day)}
                        className={`flex-1 py-2.5 text-xs font-bold transition-all ${
                          activeItineraryDay === day
                            ? "text-white bg-white/10 border-b-2 border-emerald-400"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                        }`}
                      >
                        {isEn ? `Day ${day}` : `NgÃ y ${day}`}
                      </button>
                    ))}
                  </div>

                  {/* Itinerary timeline */}
                  <div className="p-5 space-y-3">
                    {(activeItineraryDay === 1 ? [
                      { time: "07:30", icon: "â˜€ï¸", activity: isEn ? "Breakfast at Ta LÄƒng homestay â€” sticky rice & jungle herbs" : "SÃ¡ng táº¡i homestay TÃ  LÄƒng â€” cÆ¡m náº¿p & rau rá»«ng", tag: isEn ? "Meal" : "áº¨m thá»±c" },
                      { time: "09:00", icon: "ðŸŒŠ", activity: isEn ? "A Nor Waterfall hike â€” 45 min trail" : "Trekking thÃ¡c A NÃ´r â€” Ä‘Æ°á»ng mÃ²n 45 phÃºt", tag: isEn ? "Nature" : "ThiÃªn nhiÃªn" },
                      { time: "11:30", icon: "ðŸ§µ", activity: isEn ? "ZÃ¨ng brocade weaving workshop â€” Pa Co village" : "Há»c dá»‡t thá»• cáº©m ZÃ¨ng â€” báº£n Pa Co", tag: isEn ? "Culture" : "VÄƒn hoÃ¡" },
                      { time: "14:00", icon: "ðŸŠ", activity: isEn ? "A Lin hot spring swim & relaxation" : "Táº¯m suá»‘i khoÃ¡ng nÃ³ng A Lin thÆ° giÃ£n", tag: isEn ? "Wellness" : "Nghá»‰ dÆ°á»¡ng" },
                      { time: "18:30", icon: "ðŸ–", activity: isEn ? "Community dinner â€” TÃ  Ã”i traditional dishes" : "CÆ¡m cá»™ng Ä‘á»“ng â€” Ä‘áº·c sáº£n TÃ  Ã”i truyá»n thá»‘ng", tag: isEn ? "Meal" : "áº¨m thá»±c" }
                    ] : [
                      { time: "06:30", icon: "ðŸŒ„", activity: isEn ? "Sunrise at A Ráº±ng pass â€” panoramic highland views" : "Ngáº¯m bÃ¬nh minh Ä‘Ã¨o A Ráº±ng â€” toÃ n cáº£nh nÃºi rá»«ng", tag: isEn ? "Nature" : "ThiÃªn nhiÃªn" },
                      { time: "08:30", icon: "ðŸŽ‹", activity: isEn ? "Bamboo forest walk & forest foraging with Pa KÃ´ guide" : "Äi bá»™ rá»«ng tre & hÃ¡i lÆ°á»£m vá»›i hÆ°á»›ng dáº«n Pa KÃ´", tag: isEn ? "Eco" : "Sinh thÃ¡i" },
                      { time: "11:00", icon: "ðŸµ", activity: isEn ? "Wild forest tea tasting â€” A LÆ°á»›i highland specialty" : "ThÆ°á»Ÿng trÃ  rá»«ng A LÆ°á»›i â€” Ä‘áº·c sáº£n vÃ¹ng cao", tag: isEn ? "Meal" : "áº¨m thá»±c" },
                      { time: "14:30", icon: "ðŸŽ­", activity: isEn ? "Ta Ã”i traditional dance performance & costume" : "Xem mÃºa truyá»n thá»‘ng TÃ  Ã”i â€” thá»­ trang phá»¥c dÃ¢n tá»™c", tag: isEn ? "Culture" : "VÄƒn hoÃ¡" },
                      { time: "17:00", icon: "ðŸš—", activity: isEn ? "Scenic drive back to Huáº¿ via Háº£i VÃ¢n Pass" : "Di chuyá»ƒn vá» Huáº¿ qua Ä‘Ã¨o Háº£i VÃ¢n", tag: isEn ? "Transfer" : "Di chuyá»ƒn" }
                    ]).map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="shrink-0 mt-0.5 text-[11px] font-mono text-white/40 w-10">{item.time}</span>
                        <div className="flex-1 min-w-0 flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-white/8">
                          <span className="text-base leading-none mt-0.5">{item.icon}</span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-white/90 leading-snug">{item.activity}</p>
                            <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400/80 bg-emerald-950/40 rounded-full px-2 py-0.5">{item.tag}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom info bar */}
                  <div className="px-5 pb-5 pt-1">
                    <div className="flex items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-400/20 px-4 py-3">
                      <div>
                        <p className="text-[11px] font-bold text-white/80">{isEn ? "4 people Â· 2 days Â· Budget 4Mâ‚«" : "4 ngÆ°á»i Â· 2 ngÃ y Â· NgÃ¢n sÃ¡ch 4 triá»‡u"}</p>
                        <p className="text-[10px] text-emerald-300/70 mt-0.5">{isEn ? "Includes stays & all meals" : "Bao gá»“m lÆ°u trÃº vÃ  Äƒn uá»‘ng"}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                        {isEn ? "AI Generated âœ¦" : "AI táº¡o ra âœ¦"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionReveal>

          </div>

          {/* FEATURES GRID â€” below main split */}
          <MotionReveal delay={0.2}>
            <div className="mt-20 pt-16 border-t border-white/10">
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/70 mb-10">
                {isEn ? "What the AI considers for your itinerary" : "Nhá»¯ng gÃ¬ AI xem xÃ©t khi lÃªn lá»‹ch trÃ¬nh cho báº¡n"}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    icon: "ðŸŒ¤",
                    vi: "Thá»i tiáº¿t thá»±c táº¿",
                    en: "Real weather data",
                    descVi: "AI kiá»ƒm tra dá»± bÃ¡o thá»i tiáº¿t A LÆ°á»›i theo ngÃ y báº¡n chá»n Ä‘á»ƒ Ä‘iá»u chá»‰nh lá»‹ch trÃ¬nh phÃ¹ há»£p.",
                    descEn: "AI checks A LÆ°á»›i weather forecasts for your chosen dates to plan outdoor activities wisely."
                  },
                  {
                    icon: "ðŸ‘¥",
                    vi: "PhÃ¹ há»£p nhÃ³m Ä‘i",
                    en: "Group-optimized",
                    descVi: "Tá»« cáº·p Ä‘Ã´i Ä‘áº¿n gia Ä‘Ã¬nh Ä‘Ã´ng ngÆ°á»i â€” AI chá»n Ä‘á»‹a Ä‘iá»ƒm, phÆ°Æ¡ng tiá»‡n vÃ  homestay phÃ¹ há»£p.",
                    descEn: "From couples to large families â€” AI picks venues, transport, and stays suited to your group."
                  },
                  {
                    icon: "ðŸ’š",
                    vi: "Tráº£i nghiá»‡m báº£n Ä‘á»‹a",
                    en: "Local-first experiences",
                    descVi: "Æ¯u tiÃªn hÃ ng Ä‘áº§u lÃ  cÆ¡ sá»Ÿ cá»™ng Ä‘á»“ng, há»™ gia Ä‘Ã¬nh Ä‘á»‹a phÆ°Æ¡ng vÃ  nghá» thá»§ cÃ´ng truyá»n thá»‘ng.",
                    descEn: "Priority given to community-run stays, local families, and authentic indigenous crafts."
                  },
                  {
                    icon: "âš¡",
                    vi: "Táº¡o trong 60 giÃ¢y",
                    en: "Ready in 60 seconds",
                    descVi: "KhÃ´ng cáº§n chá» tÆ° váº¥n viÃªn hay láº­t Google. Nháº­p yÃªu cáº§u â€” nháº­n lá»‹ch trÃ¬nh hoÃ n chá»‰nh ngay.",
                    descEn: "No waiting for agents or browsing maps. Describe your trip â€” get a full plan instantly."
                  }
                ].map((f) => (
                  <div key={f.vi} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                    <span className="text-2xl">{f.icon}</span>
                    <h3 className="mt-3 text-sm font-bold text-white">{isEn ? f.en : f.vi}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/55">{isEn ? f.descEn : f.descVi}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

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
              const meta = `${item.rating} ${isEn ? "rating" : "Ä‘iá»ƒm Ä‘Ã¡nh giÃ¡"}`;

              return (
                <ImageCard
                  key={item.id}
                  href="/book-tour"
                  image={item.image}
                  alt={`Homestay ${title}`}
                  title={title}
                  subtitle={`${village} Â· ${capacity}`}
                  meta={meta}
                  price={item.price}
                  cta={isEn ? "View Details" : "Xem chi tiáº¿t"}
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
                cta={isEn ? "Order Now" : "Äáº·t hÃ ng"}
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
                  â€œ{quote}â€
                </blockquote>
                <footer className="mt-5 text-sm text-ink/60">
                  <strong className="text-ink">{name}</strong> Â· {role}
                </footer>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
