"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Route, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageFor } from "@/data/site";
import { useLanguage } from "@/components/i18n-provider";

export default function BookTourPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <main className="pt-24">
      <section className="section-shell py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
            {isEn ? "Plan Your Journey" : "Đặt chuyến đi"}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
            {isEn ? "How would you like to travel?" : "Bạn muốn đi theo cách nào?"}
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">
            {isEn
              ? "Cham A Luoi is a community connection platform, not a tour operator. Choose one of the two independent travel styles below."
              : "Chạm A Lưới là nền tảng kết nối, không phải công ty lữ hành. Hãy chọn một trong hai hành trình độc lập bên dưới."}
          </p>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <article className="group overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1">
            <figure className="relative min-h-80">
              <Image
                src={imageFor("photo-1529156069898-49953e39b3ac")}
                alt={isEn ? "All-inclusive guided tour package" : "Đoàn khách du lịch trọn gói có hướng dẫn viên"}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
            </figure>
            <section className="p-8">
              <p className="flex size-12 items-center justify-center rounded-full bg-forest text-white">
                <Route className="size-6" aria-hidden="true" />
              </p>
              <h2 className="mt-5 text-3xl font-extrabold text-ink">
                {isEn ? "All-Inclusive Guided Tour" : "Đặt tour trọn gói"}
              </h2>
              <p className="mt-4 text-base leading-8 text-ink/65">
                {isEn
                  ? "Ideal for travelers seeking a fully-guided itinerary organized by local operators: transport, guide, dining, homestay, and cultural experiences."
                  : "Phù hợp với khách muốn có lịch trình hoàn chỉnh do công ty lữ hành tổ chức: xe đưa đón, hướng dẫn viên, ăn uống, homestay và trải nghiệm."}
              </p>
              <Button asChild size="lg" className="mt-7">
                <Link href="/book-tour/package">
                  {isEn ? "Explore Guided Tours" : "Khám phá tour"}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </section>
          </article>

          <article className="group overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1">
            <figure className="relative min-h-80">
              <Image
                src={imageFor("photo-1501785888041-af3ef285b470")}
                alt={isEn ? "Self-guided homestays and highlands adventure" : "Du khách tự túc khám phá homestay và núi rừng A Lưới"}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-0 bg-gradient-to-t from-brown/85 via-brown/20 to-transparent" />
            </figure>
            <section className="p-8">
              <p className="flex size-12 items-center justify-center rounded-full bg-clay text-white">
                <TentTree className="size-6" aria-hidden="true" />
              </p>
              <h2 className="mt-5 text-3xl font-extrabold text-ink">
                {isEn ? "Self-Guided Exploration" : "Du lịch tự túc"}
              </h2>
              <p className="mt-4 text-base leading-8 text-ink/65">
                {isEn
                  ? "Handpick homestays and community activities at your own pace. No tour agency involved in this independent journey."
                  : "Tự chọn homestay và các trải nghiệm theo nhu cầu của bạn. Không có công ty lữ hành tham gia vào hành trình này."}
              </p>
              <Button asChild size="lg" className="mt-7 bg-clay hover:bg-brown">
                <Link href="/book-tour/self-guided">
                  {isEn ? "Start Self-Planning" : "Bắt đầu lên kế hoạch"}
                  <Compass className="size-5" />
                </Link>
              </Button>
            </section>
          </article>
        </section>
      </section>
    </main>
  );
}
