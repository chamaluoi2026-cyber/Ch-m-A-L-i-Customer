import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { getPackageById, getTravelCompanyForPackage } from "@/lib/travel-data";

const steps = ["Chọn gói", "Xem lịch trình", "Chọn lữ hành", "Gửi yêu cầu", "Xác nhận"];

export default async function TourSuccessPage({ params }: { params: Promise<{ packageId: string; providerId: string }> }) {
  const { packageId, providerId } = await params;
  const selected = getPackageById(packageId);
  const company = getTravelCompanyForPackage(packageId, providerId);
  if (!selected || !company) notFound();

  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={5} tone="green" />
      <section className="section-shell grid min-h-[60vh] place-items-center pb-24">
        <article className="max-w-2xl rounded-3xl bg-white p-10 text-center shadow-card">
          <CheckCircle2 className="mx-auto size-16 text-forest" aria-hidden="true" />
          <h1 className="mt-5 text-4xl font-extrabold text-ink">Cảm ơn bạn đã gửi yêu cầu.</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">
            {company.name} sẽ liên hệ với bạn trong vòng 24 giờ để tư vấn và xác nhận tour {selected.name}.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/book-tour">Quay lại Đặt chuyến đi</Link>
          </Button>
        </article>
      </section>
    </main>
  );
}
