import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Clock } from "lucide-react";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { Button } from "@/components/ui/button";
import { packages } from "@/data/site";
import { formatCurrency } from "@/lib/utils";

const steps = ["Chọn gói", "Xem lịch trình", "Chọn lữ hành", "Gửi yêu cầu", "Xác nhận"];

export default function PackageTourPage() {
  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={1} tone="green" />
      <section className="section-shell pb-24">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-forest">Tour trọn gói</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">Chọn gói tour</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">
            Công ty lữ hành sẽ chịu trách nhiệm sắp xếp toàn bộ chuyến đi. Khách không chọn homestay trong luồng này.
          </p>
        </header>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {packages.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1">
              <figure className="relative aspect-[16/10]">
                <Image src={item.image} alt={`Gói tour trọn gói ${item.name}`} fill className="object-cover" />
              </figure>
              <section className="p-7">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-forest">{item.code}</p>
                <h2 className="mt-3 text-3xl font-bold text-ink">{item.name}</h2>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-forest"><Clock className="size-4" />{item.duration}</p>
                <p className="mt-4 text-base leading-7 text-ink/65">{item.description}</p>
                <p className="mt-4 flex items-center gap-2 text-sm font-bold text-forest"><Briefcase className="size-4" />Giá tham khảo từ {formatCurrency(item.priceFrom)}</p>
                <Button asChild size="lg" className="mt-7 w-full">
                  <Link href={`/book-tour/package/${item.id}`}>Xem chi tiết gói<ArrowRight className="size-5" /></Link>
                </Button>
              </section>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
