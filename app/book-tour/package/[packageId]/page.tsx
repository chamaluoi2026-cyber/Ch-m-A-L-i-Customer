import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPinned, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { Button } from "@/components/ui/button";
import { tourIncludes } from "@/data/booking";
import { experienceIcons } from "@/data/site";
import { getPackageById, getPackageStaticParams, getTourEnhancement } from "@/lib/travel-data";
import { formatCurrency, siteUrl } from "@/lib/utils";
import { generateTourPackageJsonLd, toAbsoluteImageUrl } from "@/lib/seo/schema-generator";

const steps = ["Chọn gói", "Xem lịch trình", "Chọn lữ hành", "Gửi yêu cầu", "Xác nhận"];

export function generateStaticParams() {
  return getPackageStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const selected = getPackageById(packageId);
  if (!selected) return {};

  const ogImageUrl = toAbsoluteImageUrl(selected.image);

  return {
    title: `${selected.name} (${selected.duration}) | Tour Du Lịch Chạm A Lưới`,
    description: selected.longDescription || selected.description,
    alternates: {
      canonical: `${siteUrl}/book-tour/package/${selected.id}`
    },
    openGraph: {
      title: `${selected.name} - Chạm A Lưới`,
      description: selected.longDescription || selected.description,
      url: `${siteUrl}/book-tour/package/${selected.id}`,
      siteName: "Chạm A Lưới",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: selected.name
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${selected.name} - Chạm A Lưới`,
      description: selected.longDescription || selected.description,
      images: [ogImageUrl]
    }
  };
}

export default async function PackageTourDetailPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const selected = getPackageById(packageId);
  const extra = getTourEnhancement(packageId);
  if (!selected || !extra) notFound();

  const tourJsonLd = generateTourPackageJsonLd(selected, extra);

  return (
    <main className="pt-24">
      {/* Schema.org TouristTrip & Product Rich Snippet cho Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd) }}
      />
      <TripFlowStepper steps={steps} current={2} tone="green" />
      <section className="section-shell pb-24">
        <article className="overflow-hidden rounded-3xl bg-white shadow-card">
          <figure className="relative min-h-[480px]">
            <Image src={selected.image} alt={`Ảnh hero gói ${selected.name}`} fill priority className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">Tour trọn gói · Bước 2</p>
              <h1 className="mt-3 text-4xl font-extrabold md:text-6xl">{selected.name}</h1>
              <p className="mt-4 max-w-2xl text-white/80">{selected.longDescription}</p>
            </figcaption>
          </figure>
          <section className="grid gap-4 p-6 md:grid-cols-4">
            <p className="rounded-2xl bg-beige p-5 font-semibold text-ink">Thời lượng<br /><span className="text-forest">{selected.duration}</span></p>
            <p className="rounded-2xl bg-beige p-5 font-semibold text-ink">Giá tham khảo<br /><span className="text-forest">{formatCurrency(selected.priceFrom)}</span></p>
            <p className="rounded-2xl bg-beige p-5 font-semibold text-ink">Phù hợp<br /><span className="text-forest">{selected.suitableFor.join(", ")}</span></p>
            <p className="rounded-2xl bg-beige p-5 font-semibold text-ink">Mức di chuyển<br /><span className="text-forest">{selected.difficulty}</span></p>
          </section>
        </article>

        <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-ink"><MapPinned className="size-8 text-forest" />Bản đồ tuyến</h2>
            <p className="mt-4 text-sm leading-7 text-ink/65">{extra.note}</p>
            <figure className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={extra.mapImage} alt={`Bản đồ tuyến demo của ${selected.name}`} fill className="object-cover" />
            </figure>
          </article>
          <section>
            <h2 className="text-3xl font-bold text-ink">Bộ sưu tập ảnh</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {extra.gallery.map((image) => (
                <figure key={image} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card">
                  <Image src={image} alt={`Ảnh trải nghiệm trong gói ${selected.name}`} fill className="object-cover" />
                </figure>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-ink">Bạn sẽ trải nghiệm</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {selected.experiences.map((item) => {
              const Icon = experienceIcons[item as keyof typeof experienceIcons] ?? Users;
              return (
                <article key={item} className="rounded-2xl bg-white p-5 shadow-card">
                  <Icon className="size-7 text-forest" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-ink">{item}</h3>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-ink">Timeline</h2>
          <ol className="mt-8 grid gap-6">
            {selected.timeline.map((day) => (
              <li key={day.day} className="grid gap-5 rounded-3xl bg-white p-6 shadow-card md:grid-cols-[180px_1fr]">
                <h3 className="text-2xl font-bold text-forest">{day.day}</h3>
                <ol className="grid gap-3">
                  {day.items.map((activity) => (
                    <li key={activity} className="flex gap-3 text-sm text-ink/70">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-forest" aria-hidden="true" />
                      {activity}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 rounded-3xl bg-forest p-8 text-white">
          <h2 className="text-3xl font-bold">Dịch vụ bao gồm</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tourIncludes.map((item) => <li key={item} className="flex gap-3 text-sm text-white/80"><CheckCircle2 className="size-5 text-white" />{item}</li>)}
          </ul>
          <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-7 text-white/75">
            Lưu ý: homestay là một phần của tour trọn gói và sẽ do công ty lữ hành sắp xếp. Khách không chọn homestay ở luồng này.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-forest hover:bg-beige">
            <Link href={`/book-tour/package/${selected.id}/operators`}>Tiếp tục chọn đơn vị lữ hành<ArrowRight className="size-5" /></Link>
          </Button>
        </section>
      </section>
    </main>
  );
}
