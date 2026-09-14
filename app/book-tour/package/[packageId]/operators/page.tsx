import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, ShieldCheck, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { TripFlowStepper } from "@/components/trip-flow-stepper";
import { Button } from "@/components/ui/button";
import { getPackageById, getTravelCompaniesForPackage } from "@/lib/travel-data";

const steps = ["Chọn gói", "Xem lịch trình", "Chọn lữ hành", "Gửi yêu cầu", "Xác nhận"];

export default async function TourOperatorsPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const selected = getPackageById(packageId);
  if (!selected) notFound();
  const companies = getTravelCompaniesForPackage(packageId);

  return (
    <main className="pt-24">
      <TripFlowStepper steps={steps} current={3} tone="green" />
      <section className="section-shell pb-24">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-forest">Tour trọn gói · Bước 3</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">Chọn công ty lữ hành</h1>
          <p className="mt-5 text-lg leading-8 text-ink/65">
            Các đơn vị dưới đây sẽ chịu trách nhiệm tổ chức toàn bộ tour {selected.name}, bao gồm homestay và hoạt động trải nghiệm.
          </p>
        </header>
        <div className="mt-10 grid gap-8">
          {companies.map((company) => (
            <article key={company.id} className="grid overflow-hidden rounded-3xl bg-white shadow-card lg:grid-cols-[0.9fr_1.1fr]">
              <figure className="relative min-h-80">
                <Image src={company.cover} alt={`Ảnh bìa công ty lữ hành ${company.name}`} fill className="object-cover" />
              </figure>
              <section className="p-7">
                <Image src={company.logo} alt={`Logo ${company.name}`} width={72} height={72} className="size-18 rounded-2xl object-cover shadow-sm" />
                <h2 className="mt-4 text-3xl font-bold text-ink">{company.name}</h2>
                <p className="mt-3 text-base leading-7 text-ink/65">{company.description}</p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-beige p-4"><dt className="text-xs text-ink/50">Kinh nghiệm</dt><dd className="font-bold text-forest">{company.years} năm</dd></div>
                  <div className="rounded-2xl bg-beige p-4"><dt className="text-xs text-ink/50">Đánh giá</dt><dd className="flex items-center gap-1 font-bold text-forest"><Star className="size-4 fill-current" />{company.rating}</dd></div>
                  <div className="rounded-2xl bg-beige p-4"><dt className="text-xs text-ink/50">Tour đã tổ chức</dt><dd className="font-bold text-forest">{company.operatedTours}+</dd></div>
                </dl>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {company.services.map((service) => (
                    <li key={service} className="rounded-full bg-stone px-4 py-2 text-xs font-bold text-ink/70">
                      <ShieldCheck className="mr-1 inline size-4" />{service}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 flex items-center gap-2 text-sm font-bold text-ink"><Phone className="size-4 text-forest" />{company.contact}</p>
                <Button asChild size="lg" className="mt-7">
                  <Link href={`/book-tour/package/${packageId}/operators/${company.id}/request`}>Đặt tour với đơn vị này<ArrowRight className="size-5" /></Link>
                </Button>
              </section>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
