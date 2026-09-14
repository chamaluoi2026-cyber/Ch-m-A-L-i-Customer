import { notFound } from "next/navigation";
import { SelfGuidedExperienceSelector } from "@/components/self-guided-experience-selector";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { selfGuidedExperiences } from "@/data/booking";
import { getHomestayById, parseExperienceIds, parseGuests } from "@/lib/travel-data";

const steps = ["Chọn ngày", "Chọn homestay", "Trải nghiệm", "Xác nhận", "Thông tin"];

export default async function SelfGuidedExperiencesPage({
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
  const guests = parseGuests(query.guests);
  const baseQuery = `checkin=${encodeURIComponent(query.checkin ?? "")}&checkout=${encodeURIComponent(query.checkout ?? "")}&guests=${encodeURIComponent(String(guests))}`;
  const selectedIds = parseExperienceIds(query.experiences);

  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={3} tone="brown" />
      <section className="section-shell pb-24">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Du lịch tự túc · Bước 3</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">Chọn trải nghiệm</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">
            Bạn có thể thêm từng hoạt động theo nhu cầu, xem tạm tính ngay bên cạnh, hoặc bỏ qua để chỉ đặt homestay.
          </p>
        </header>
        <SelfGuidedExperienceSelector
          homestayId={homestay.id}
          experiences={selfGuidedExperiences}
          baseQuery={baseQuery}
          guests={guests}
          initialSelectedIds={selectedIds}
        />
      </section>
    </main>
  );
}
