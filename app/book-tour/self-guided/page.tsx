import Image from "next/image";
import { CalendarDays, Mountain, TentTree } from "lucide-react";
import { SelfGuidedStartForm } from "@/components/self-guided-start-form";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { imageFor } from "@/data/site";

const steps = ["Chọn ngày", "Chọn homestay", "Trải nghiệm", "Xác nhận", "Thông tin"];

export default function SelfGuidedPage() {
  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={1} tone="brown" />
      <section className="section-shell pb-24">
        <article className="grid overflow-hidden rounded-3xl bg-white shadow-card lg:grid-cols-[0.9fr_1.1fr]">
          <figure className="relative min-h-[420px]">
            <Image src={imageFor("photo-1501785888041-af3ef285b470")} alt="Du lịch tự túc giữa núi rừng A Lưới" fill priority className="object-cover" />
            <figcaption className="absolute inset-0 bg-gradient-to-t from-brown/85 via-brown/20 to-transparent" />
          </figure>
          <section className="p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Du lịch tự túc · Bước 1</p>
            <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">Tự lên kế hoạch chuyến đi</h1>
            <p className="mt-5 text-lg leading-8 text-ink/65">
              Chọn ngày đi, homestay và các trải nghiệm bạn muốn. Luồng này không có công ty lữ hành tham gia.
            </p>
            <ul className="mt-7 grid gap-3 text-sm font-semibold text-ink/70 sm:grid-cols-3">
              <li className="rounded-2xl bg-beige p-4"><CalendarDays className="mb-2 size-5 text-clay" />Linh hoạt ngày đi</li>
              <li className="rounded-2xl bg-beige p-4"><TentTree className="mb-2 size-5 text-clay" />Tự chọn homestay</li>
              <li className="rounded-2xl bg-beige p-4"><Mountain className="mb-2 size-5 text-clay" />Tự do khám phá</li>
            </ul>
          </section>
        </article>
        <section className="mt-10">
          <SelfGuidedStartForm />
        </section>
      </section>
    </main>
  );
}
