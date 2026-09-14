import Image from "next/image";
import { notFound } from "next/navigation";
import { SelfGuidedRequestForm } from "@/components/self-guided-request-form";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { getHomestayById, getSelfGuidedEstimate } from "@/lib/travel-data";
import { formatCurrency } from "@/lib/utils";

const steps = ["Chọn ngày", "Chọn homestay", "Trải nghiệm", "Xác nhận", "Thông tin"];

export default async function SelfGuidedConfirmPage({
  params,
  searchParams
}: {
  params: Promise<{ homestayId: string }>;
  searchParams: Promise<{ checkin?: string; checkout?: string; guests?: string; experiences?: string }>;
}) {
  const { homestayId } = await params;
  const query = await searchParams;
  const homestay = getHomestayById(homestayId);
  if (!homestay) notFound();
  const { guests, nights, selectedExperiences, experiencesTotal, estimatedPrice } = getSelfGuidedEstimate(query, homestay.price);

  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={4} tone="brown" />
      <section className="section-shell grid gap-10 pb-24 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-28">
          <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={homestay.image} alt={`Homestay đã chọn ${homestay.name}`} fill className="object-cover" />
          </figure>
          <h1 className="mt-6 text-3xl font-extrabold text-ink">Xác nhận dịch vụ</h1>
          <dl className="mt-6 grid gap-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3">
              <dt className="text-ink/55">Homestay</dt>
              <dd className="font-bold text-ink">{homestay.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3">
              <dt className="text-ink/55">Ngày đi</dt>
              <dd className="font-bold text-ink">{query.checkin} - {query.checkout}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3">
              <dt className="text-ink/55">Số khách</dt>
              <dd className="font-bold text-ink">{guests} khách</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3">
              <dt className="text-ink/55">Số đêm</dt>
              <dd className="font-bold text-ink">{nights} đêm</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3">
              <dt className="text-ink/55">Tiền homestay</dt>
              <dd className="font-bold text-ink">{formatCurrency(homestay.price)} x {nights} đêm</dd>
            </div>
            <div className="border-b border-black/10 pb-3">
              <dt className="text-ink/55">Trải nghiệm đã chọn</dt>
              <dd className="mt-2 font-bold text-ink">
                {selectedExperiences.length ? selectedExperiences.map((item) => item.name).join(", ") : "Không chọn thêm"}
              </dd>
            </div>
            {selectedExperiences.length ? (
              <div className="flex justify-between gap-4 border-b border-black/10 pb-3">
                <dt className="text-ink/55">Tiền trải nghiệm</dt>
                <dd className="font-bold text-ink">{formatCurrency(experiencesTotal)}</dd>
              </div>
            ) : null}
            <div className="flex items-end justify-between gap-4 rounded-2xl bg-clay p-4 text-white">
              <dt className="text-white/75">Giá dự kiến</dt>
              <dd className="text-2xl font-extrabold">{formatCurrency(estimatedPrice)}</dd>
            </div>
          </dl>
          <p className="mt-5 rounded-2xl bg-beige p-4 text-sm leading-7 text-ink/65">
            Giá homestay được tính theo số đêm lưu trú, không nhân theo số khách. Các trải nghiệm thêm mới tính theo số khách.
          </p>
        </aside>
        <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Du lịch tự túc · Bước 5</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">Điền thông tin liên hệ</h2>
          <p className="mt-3 text-sm leading-7 text-ink/65">
            Yêu cầu sẽ được gửi đến homestay hoặc người phụ trách dịch vụ địa phương. Không có công ty lữ hành trong luồng này.
          </p>
          <div className="mt-7">
            <SelfGuidedRequestForm />
          </div>
        </section>
      </section>
    </main>
  );
}
