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
import type { PlaceRecord } from "@/lib/server-store";

interface HomeClientViewProps {
  activeHeroImage: string;
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
    title: "Bản làng Pa Cô, Tà Ôi",
    enTitle: "Pa Co & Ta Oi Villages",
    caption: "Nơi văn hóa Pa Cô, Tà Ôi được kể bằng đời sống.",
    enCaption: "Where living indigenous heritage thrives through looms and daily rhythm.",
    image: imageFor("photo-1482192505345-5655af888cc4"),
    className: "md:col-span-2"
  }
];

export function HomeClientView({
  activeHeroImage,
  featuredPlaces,
  homestays,
  products,
  publishedBlogs,
  testimonials
}: HomeClientViewProps) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <AppImage
          src={activeHeroImage}
          alt={isEn ? "A Luoi mountain scenery at sunrise" : "Cảnh núi rừng A Lưới lúc bình minh"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/28 to-ink/65" />
        <article className="section-shell relative z-10 pt-20 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/75">
            {t.home.heroTag}
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
            {t.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
            {t.home.heroDesc}
          </p>
          <nav className="mt-9 flex flex-wrap gap-4" aria-label={isEn ? "Primary Actions" : "Hành động chính"}>
            <Button asChild size="lg">
              <Link href="/places">
                {t.home.heroExploreBtn}
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/book-tour">{t.home.heroBookTourBtn}</Link>
            </Button>
          </nav>
        </article>
        <a
          href="#featured"
          aria-label={isEn ? "Scroll to featured destinations" : "Cuộn xuống địa điểm nổi bật"}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/35 p-3 text-white"
        >
          <ArrowDown className="size-5 animate-bounce" aria-hidden="true" />
        </a>
      </section>

      {/* 2. FEATURED DESTINATIONS & 3 STEPS */}
      <section id="featured" className="section-shell py-24">
        <MotionReveal>
          <SectionHeading
            eyebrow={t.home.featuredEyebrow}
            title={t.home.featuredTitle}
            description={t.home.featuredDesc}
          />
        </MotionReveal>
        <div className="grid gap-5 md:grid-cols-3">
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
            {homestays.map((item) => (
              <ImageCard
                key={item.id}
                href="/book-tour"
                image={item.image}
                alt={`Homestay ${item.name}`}
                title={item.name}
                subtitle={`${item.village} · ${item.capacity}`}
                meta={`${item.rating} ${isEn ? "rating" : "điểm đánh giá"}`}
                price={item.price}
              />
            ))}
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
          {products.map((item) => (
            <ImageCard
              key={item.slug}
              href={`/products/${item.slug}#dat-hang`}
              image={item.image}
              alt={item.name}
              title={item.name}
              subtitle={item.description}
              meta={item.category}
              price={item.price}
              cta={isEn ? "Order Now" : "Đặt hàng"}
            />
          ))}
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
            {publishedBlogs.map((post) => (
              <article key={post.slug} className="rounded-2xl bg-white/10 p-5 backdrop-blur transition hover:-translate-y-1">
                <figure className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <AppImage src={post.image} alt={post.title} fill className="object-cover" />
                </figure>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/60">{post.category}</p>
                <h3 className="mt-2 text-xl font-bold">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold hover:underline">
                  {t.home.readArticle}
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
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
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl bg-white p-6 shadow-card">
              <p className="flex gap-1 text-clay" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </p>
              <blockquote className="mt-5 text-lg font-medium leading-8 text-ink">
                “{item.quote}”
              </blockquote>
              <footer className="mt-5 text-sm text-ink/60">
                <strong className="text-ink">{item.name}</strong> · {item.role}
              </footer>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
