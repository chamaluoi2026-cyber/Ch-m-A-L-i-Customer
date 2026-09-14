import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ImageCard } from "@/components/image-card";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { homestays } from "@/data/site";

const steps = ["Chọn ngày", "Chọn homestay", "Trải nghiệm", "Xác nhận", "Thông tin"];

export default async function SelfGuidedHomestaysPage({
  searchParams
}: {
  searchParams: Promise<{ checkin?: string; checkout?: string; guests?: string }>;
}) {
  const query = await searchParams;
  const checkin = query.checkin ?? "";
  const checkout = query.checkout ?? "";
  const guests = query.guests ?? "2";
  if (!checkin || !checkout) notFound();
  const suffix = `?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}`;

  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={2} tone="brown" />
      <section className="section-shell pb-24">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Du lịch tự túc · Bước 2</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">Chọn homestay</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">
            Lịch dự kiến: {checkin} đến {checkout} · {guests} khách. Giá homestay hiển thị theo đêm, không nhân theo số khách.
          </p>
        </header>
        <Suspense>
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {homestays.map((item) => (
              <ImageCard
                key={item.id}
                href={`/book-tour/self-guided/homestays/${item.id}/experiences${suffix}`}
                image={item.image}
                alt={`Homestay tự túc ${item.name}`}
                title={item.name}
                subtitle={`${item.village} · ${item.capacity} · Giá theo đêm · View núi · ${item.amenities.join(", ")}`}
                meta={`${item.rating} điểm đánh giá`}
                price={item.price}
                cta="Chọn Homestay"
              />
            ))}
          </section>
        </Suspense>
      </section>
    </main>
  );
}
