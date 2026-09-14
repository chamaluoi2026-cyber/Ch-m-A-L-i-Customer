import Image from "next/image";
import { notFound } from "next/navigation";
import { TourRequestForm } from "@/components/tour-request-form";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { getPackageById, getTravelCompanyForPackage } from "@/lib/travel-data";
import { formatCurrency } from "@/lib/utils";

const steps = ["Chọn gói", "Xem lịch trình", "Chọn lữ hành", "Gửi yêu cầu", "Xác nhận"];

export default async function TourRequestPage({ params }: { params: Promise<{ packageId: string; providerId: string }> }) {
  const { packageId, providerId } = await params;
  const selected = getPackageById(packageId);
  const company = getTravelCompanyForPackage(packageId, providerId);
  if (!selected || !company) notFound();

  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={4} tone="green" />
      <section className="section-shell grid gap-10 pb-24 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-28">
          <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={company.cover} alt={`Đơn vị lữ hành ${company.name}`} fill className="object-cover" />
          </figure>
          <h1 className="mt-6 text-3xl font-extrabold text-ink">Tóm tắt tour trọn gói</h1>
          <dl className="mt-6 grid gap-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3"><dt className="text-ink/55">Gói tour</dt><dd className="font-bold text-ink">{selected.name}</dd></div>
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3"><dt className="text-ink/55">Đơn vị lữ hành</dt><dd className="font-bold text-ink">{company.name}</dd></div>
            <div className="flex justify-between gap-4 border-b border-black/10 pb-3"><dt className="text-ink/55">Thời lượng</dt><dd className="font-bold text-ink">{selected.duration}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink/55">Giá tham khảo</dt><dd className="font-bold text-forest">{formatCurrency(selected.priceFrom)} / khách</dd></div>
          </dl>
          <p className="mt-6 rounded-2xl bg-forest/10 p-4 text-sm leading-7 text-forest">
            Homestay trong tour trọn gói sẽ do {company.name} sắp xếp theo lịch trình và tình trạng phòng.
          </p>
        </aside>
        <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-forest">Tour trọn gói · Bước 4</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">Điền thông tin đặt tour</h2>
          <p className="mt-3 text-sm leading-7 text-ink/65">Yêu cầu sẽ được chuyển đến đơn vị lữ hành bạn đã chọn để tư vấn và xác nhận.</p>
          <div className="mt-7">
            <TourRequestForm successHref={`/book-tour/package/${packageId}/operators/${providerId}/success`} />
          </div>
        </section>
      </section>
    </main>
  );
}
