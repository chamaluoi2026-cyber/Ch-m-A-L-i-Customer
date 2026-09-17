import Link from "next/link";
import { Building2, Filter, MessageCircle, TicketCheck } from "lucide-react";
import { PlaceCard } from "@/components/place-card";
import { SectionHeading } from "@/components/section-heading";
import { placeCategories } from "@/data/places";
import { getCategoryById, getPlacesByCategory } from "@/lib/places";

import { siteUrl } from "@/lib/utils";
import { toAbsoluteImageUrl } from "@/lib/seo/schema-generator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Điểm Đến & Homestay A Lưới | Thác A Nôr, Suối Pâr Le, Du Lịch Bản Địa",
  description: "Khám phá danh sách homestay ven suối, Thác A Nôr, Suối Pâr Le, ẩm thực Pa Cô và các điểm du lịch sinh thái cộng đồng tiêu biểu tại A Lưới, Thừa Thiên Huế.",
  alternates: {
    canonical: `${siteUrl}/places`
  },
  openGraph: {
    title: "Điểm Đến & Homestay A Lưới - Chạm A Lưới",
    description: "Khám phá danh sách homestay ven suối, Thác A Nôr, Suối Pâr Le, ẩm thực Pa Cô và các điểm du lịch sinh thái cộng đồng.",
    url: `${siteUrl}/places`,
    siteName: "Chạm A Lưới",
    images: [{ url: `${siteUrl}/images/home-hero.jpg`, width: 1200, height: 630 }]
  }
};

export default async function PlacesPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const query = await searchParams;
  const activeCategoryId = query.category || "all";
  const activeCategory = getCategoryById(activeCategoryId) || placeCategories[0];
  const filteredPlaces = getPlacesByCategory(activeCategoryId);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh sách Điểm Đến & Homestay Du Lịch Cộng Đồng A Lưới",
    description: "Khám phá Thác A Nôr, Suối Pâr Le, Homestay bản địa và các điểm du lịch sinh thái tại A Lưới, Thừa Thiên Huế",
    numberOfItems: filteredPlaces.length,
    itemListElement: filteredPlaces.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: p.name,
      url: `${siteUrl}/places/${p.slug}`,
      image: toAbsoluteImageUrl(p.image)
    }))
  };

  return (
    <main className="pt-24">
      {/* Schema.org ItemList Carousel Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <section className="relative overflow-hidden bg-forest py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,111,60,0.35),transparent_34%),linear-gradient(135deg,#0F5C4A,#16211E)]" />
        <div className="section-shell relative z-10">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">Mạng lưới kết nối cơ sở</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">Địa điểm tại A Lưới</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Tìm nơi ăn uống, homestay ven suối, tắm thác thiên nhiên, lửa trại và trải nghiệm văn hóa. Để lại thông tin để nhận mã voucher ưu đãi độc quyền trước khi chat Zalo cùng cơ sở.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [Building2, "Cơ sở địa phương được thẩm định rõ ràng"],
              [TicketCheck, "Khách nhận mã voucher ưu đãi trước khi tư vấn"],
              [MessageCircle, "Mở khóa chat Zalo ngay sau khi gửi thông tin"]
            ].map(([Icon, text]) => (
              <article key={text as string} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <Icon className="size-7 text-white" aria-hidden="true" />
                <p className="mt-4 text-sm font-bold leading-6 text-white/80">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-clay">
            <Filter className="size-4" aria-hidden="true" />
            Lọc theo 13 danh mục
          </div>
          <span className="text-xs font-semibold text-ink/60">
            Tìm thấy {filteredPlaces.length} địa điểm
          </span>
        </div>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Danh mục địa điểm">
          {placeCategories.map((category) => {
            const isSelected = activeCategoryId === category.id;
            const href = category.id === "all" ? "/places" : `/places?category=${category.id}`;

            return (
              <Link
                key={category.id}
                href={href}
                className={`focus-ring rounded-full px-4 py-2 text-xs md:text-sm font-bold transition shadow-sm ${
                  isSelected
                    ? "bg-forest text-white shadow-[0_4px_14px_rgba(15,92,74,0.3)]"
                    : "bg-white text-ink/75 hover:bg-beige hover:text-forest"
                }`}
              >
                {category.label}
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="section-shell pb-24">
        <SectionHeading
          eyebrow={activeCategory ? activeCategory.label : "Tất cả địa điểm"}
          title={activeCategory ? activeCategory.description : "Khách chọn địa điểm trước, nhận voucher rồi mới tư vấn"}
          description="Mỗi địa điểm có trang riêng với ảnh thực tế, hướng dẫn an toàn và form nhận voucher trực tiếp."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
      </section>
    </main>
  );
}
