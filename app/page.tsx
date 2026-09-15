import Link from "next/link";
import { ArrowDown, ArrowRight, Building2, Compass, Gift, Headphones, MapPinned, Route, Star, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/image-card";
import { MotionReveal } from "@/components/motion-reveal";
import { PlaceCard } from "@/components/place-card";
import { SectionHeading } from "@/components/section-heading";
import { AppImage } from "@/components/ui/app-image";
import { heroImage, homestays, imageFor, products, testimonials } from "@/data/site";
import { getFeaturedPlaces } from "@/lib/places";
import { getSiteSettings, getSiteSettingsAsync, getBlogPosts } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const aluoiGallery = [
  {
    title: "Núi rừng A Lưới",
    caption: "Những cung đường xanh mở ra nhịp đi chậm và sâu.",
    image: imageFor("photo-1500534314209-a25ddb2bd429"),
    className: "md:col-span-2 md:row-span-2"
  },
  {
    title: "Thác A Nôr",
    caption: "Không gian mát lành cho hành trình cộng đồng.",
    image: imageFor("photo-1506744038136-46273834b3fb"),
    className: ""
  },
  {
    title: "Bình minh vùng cao",
    caption: "Ánh sáng mềm trên núi và bản làng.",
    image: imageFor("photo-1501785888041-af3ef285b470"),
    className: ""
  },
  {
    title: "Bản làng",
    caption: "Nơi văn hóa Pa Cô, Tà Ôi được kể bằng đời sống.",
    image: imageFor("photo-1482192505345-5655af888cc4"),
    className: "md:col-span-2"
  }
];

export default async function HomePage() {
  const featuredPlaces = getFeaturedPlaces(3);
  const siteSettings = await getSiteSettingsAsync();
  const activeHeroImage = siteSettings.heroImage || heroImage;
  const publishedBlogs = getBlogPosts()
    .filter((p) => p.status === "published")
    .slice(0, 3);

  return (
    <main>
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <AppImage src={activeHeroImage} alt="Cảnh núi rừng A Lưới lúc bình minh" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/28 to-ink/65" />
        <article className="section-shell relative z-10 pt-20 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/75">Du lịch cộng đồng tại Huế</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">Chạm A Lưới</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
            Nơi du khách tìm địa điểm đáng tin cậy, nhận voucher trước khi tư vấn và kết nối trực tiếp với doanh nghiệp địa phương.
          </p>
          <nav className="mt-9 flex flex-wrap gap-4" aria-label="Hành động chính">
            <Button asChild size="lg"><Link href="/places">Khám phá địa điểm<ArrowRight className="size-5" /></Link></Button>
            <Button asChild size="lg" variant="secondary"><Link href="/book-tour">Đặt tour</Link></Button>
          </nav>
        </article>
        <a href="#featured" aria-label="Cuộn xuống địa điểm nổi bật" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/35 p-3 text-white">
          <ArrowDown className="size-5 animate-bounce" aria-hidden="true" />
        </a>
      </section>

      <section id="featured" className="section-shell py-24">
        <MotionReveal>
          <SectionHeading
            eyebrow="Khám phá địa điểm"
            title="Chọn nơi muốn đến, nhận ưu đãi rồi được tư vấn"
            description="Chạm A Lưới giúp bạn tìm địa điểm ăn uống, lưu trú, vui chơi và trải nghiệm cộng đồng phù hợp trước khi lên lịch."
          />
        </MotionReveal>
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-card">
            <p className="flex size-12 items-center justify-center rounded-full bg-forest text-white"><Building2 className="size-6" /></p>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">1. Chọn địa điểm</h2>
            <p className="mt-3 text-sm leading-7 text-ink/65">Khách xem ăn uống, lưu trú, vui chơi, trải nghiệm, đặc sản và dịch vụ tại A Lưới.</p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-card">
            <p className="flex size-12 items-center justify-center rounded-full bg-clay text-white"><Gift className="size-6" /></p>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">2. Nhận voucher</h2>
            <p className="mt-3 text-sm leading-7 text-ink/65">Khách để lại thông tin, hệ thống tạo mã voucher trước khi mở nút chat Zalo.</p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-card">
            <p className="flex size-12 items-center justify-center rounded-full bg-ink text-white"><Headphones className="size-6" /></p>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">3. Được tư vấn</h2>
            <p className="mt-3 text-sm leading-7 text-ink/65">Đội ngũ địa phương hỗ trợ lịch trình, thời gian phù hợp, dịch vụ đi kèm và cách sử dụng voucher.</p>
          </article>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg"><Link href="/places">Xem tất cả địa điểm<ArrowRight className="size-5" /></Link></Button>
        </div>
      </section>

      <section className="section-shell py-24">
        <MotionReveal>
          <SectionHeading eyebrow="Đặt chuyến đi" title="Tour và tự túc vẫn là nhánh dịch vụ riêng" description="Khách muốn lịch trình hoàn chỉnh có thể đặt tour trọn gói. Khách muốn tự chọn homestay và trải nghiệm có thể đi theo luồng tự túc." />
        </MotionReveal>
        <div className="grid gap-6 md:grid-cols-2">
          <MotionReveal>
            <article className="rounded-3xl bg-white p-8 shadow-card transition hover:-translate-y-1">
              <p className="flex size-12 items-center justify-center rounded-full bg-forest text-white"><Route className="size-6" /></p>
              <h2 className="mt-5 text-3xl font-extrabold text-ink">Đặt tour trọn gói</h2>
              <p className="mt-4 text-base leading-8 text-ink/65">Phù hợp với khách muốn lịch trình hoàn chỉnh do công ty lữ hành tổ chức.</p>
              <Button asChild size="lg" className="mt-7"><Link href="/book-tour/package">Khám phá tour<ArrowRight className="size-5" /></Link></Button>
            </article>
          </MotionReveal>
          <MotionReveal>
            <article className="rounded-3xl bg-white p-8 shadow-card transition hover:-translate-y-1">
              <p className="flex size-12 items-center justify-center rounded-full bg-clay text-white"><TentTree className="size-6" /></p>
              <h2 className="mt-5 text-3xl font-extrabold text-ink">Du lịch tự túc</h2>
              <p className="mt-4 text-base leading-8 text-ink/65">Tự chọn homestay và các trải nghiệm theo nhu cầu của bạn.</p>
              <Button asChild size="lg" className="mt-7 bg-clay hover:bg-brown"><Link href="/book-tour/self-guided">Bắt đầu lên kế hoạch<Compass className="size-5" /></Link></Button>
            </article>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="section-shell">
          <MotionReveal>
            <header className="mb-10 grid gap-6 md:grid-cols-[0.75fr_1fr] md:items-end">
              <section>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-clay">
                  <MapPinned className="size-4" aria-hidden="true" />
                  Khung ảnh A Lưới
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-5xl">Xem A Lưới qua những khung hình rộng mở</h2>
              </section>
              <p className="text-base leading-8 text-ink/65">
                Một góc thị giác dành riêng cho núi rừng, thác nước, bình minh và bản làng trước khi du khách chọn hành trình.
              </p>
            </header>
          </MotionReveal>
          <section className="grid auto-rows-[240px] gap-5 md:grid-cols-4">
            {aluoiGallery.map((item) => (
              <figure key={item.title} className={`group relative overflow-hidden rounded-3xl shadow-card ${item.className}`}>
                <AppImage src={item.image} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 text-white">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{item.caption}</p>
                </figcaption>
              </figure>
            ))}
          </section>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="section-shell">
          <SectionHeading eyebrow="Homestay nổi bật" title="Lưu trú giữa núi rừng và sự ấm áp cộng đồng" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homestays.map((item) => (
              <ImageCard key={item.id} href="/book-tour" image={item.image} alt={`Homestay sinh thái miền núi tại A Lưới tên ${item.name}`} title={item.name} subtitle={`${item.village} · ${item.capacity}`} meta={`${item.rating} điểm đánh giá`} price={item.price} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-24">
        <SectionHeading eyebrow="Sản phẩm địa phương" title="Thủ công, hương vị và ký ức từ vùng cao" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((item) => (
            <ImageCard key={item.slug} href={`/products/${item.slug}#dat-hang`} image={item.image} alt={item.name} title={item.name} subtitle={item.description} meta={item.category} price={item.price} cta="Đặt hàng" />
          ))}
        </div>
      </section>

      <section className="bg-forest py-24 text-white">
        <div className="section-shell">
          <SectionHeading eyebrow="Blog mới nhất" title="Những câu chuyện trước hành trình" />
          <div className="grid gap-6 md:grid-cols-3">
            {publishedBlogs.map((post) => (
              <article key={post.slug} className="rounded-2xl bg-white/10 p-5 backdrop-blur transition hover:-translate-y-1">
                <figure className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <AppImage src={post.image} alt={post.title} fill className="object-cover" />
                </figure>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/60">{post.category}</p>
                <h3 className="mt-2 text-xl font-bold">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Đọc bài viết<ArrowRight className="size-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-24">
        <SectionHeading eyebrow="Cảm nhận" title="Du khách nhớ nhất những chi tiết con người" />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl bg-white p-6 shadow-card">
              <p className="flex gap-1 text-clay" aria-label="Đánh giá năm sao">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</p>
              <blockquote className="mt-5 text-lg font-medium leading-8 text-ink">“{item.quote}”</blockquote>
              <footer className="mt-5 text-sm text-ink/60"><strong className="text-ink">{item.name}</strong> · {item.role}</footer>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
