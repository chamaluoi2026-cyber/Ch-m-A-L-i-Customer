import type { Metadata } from "next";
import { AppImage } from "@/components/ui/app-image";
import { siteConfig, teamMembers } from "@/data/site";
import { Users2, Sparkles, HeartHandshake } from "lucide-react";
import { getSiteSettings, getSiteSettingsAsync } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Giới thiệu - Chạm A Lưới",
  description: "Sứ mệnh, tầm nhìn, đội ngũ thực hiện và nghệ nhân đồng hành cùng dự án du lịch cộng đồng Chạm A Lưới."
};

const impact = [
  "Tạo thu nhập trực tiếp cho chủ nhà và nghệ nhân địa phương",
  "Bảo tồn văn hóa thông qua trải nghiệm có hướng dẫn",
  "Giáo dục du lịch có trách nhiệm cho du khách",
  "Tăng khả năng tiếp cận thị trường cho sản phẩm vùng cao"
];

export default async function AboutPage() {
  const settings = await getSiteSettingsAsync();
  const aboutHeroImage = settings.aboutHeroImage || siteConfig.aboutHeroImage;
  const members = (settings.aboutTeamMembers && settings.aboutTeamMembers.length > 0)
    ? settings.aboutTeamMembers
    : teamMembers;
  const coreValues = settings.aboutCoreValues && settings.aboutCoreValues.length > 0
    ? settings.aboutCoreValues
    : [
        { title: "Sứ mệnh", text: "Giúp du lịch cộng đồng A Lưới dễ hiểu hơn, dễ đặt hơn và đem lại nguồn sinh kế thực sự cho người dân địa phương." },
        { title: "Tầm nhìn", text: "Trở thành điểm chạm số uy tín nhất phía Tây Thừa Thiên Huế cho những chuyến đi văn hóa bền vững và giàu cảm xúc." },
        { title: "Giá trị cốt lõi", text: "Đặt con người và bản sắc dân tộc Pa Cô, Tà Ôi, Cơ Tu làm trung tâm, công nghệ đóng vai trò cầu nối tiện lợi." }
      ];
  const impactList = settings.aboutImpactItems && settings.aboutImpactItems.length > 0
    ? settings.aboutImpactItems
    : impact;

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <article>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
            {settings.aboutBadge || "Về chúng tôi"}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl">
            {settings.aboutTitle || "Cầu nối số cho du lịch cộng đồng"}
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink/65">
            {settings.aboutSubtitle ||
              "Chạm A Lưới là nền tảng du lịch trung gian giúp kết nối du khách với nét đẹp văn hóa bản địa, các chủ nhà homestay ấm áp, đơn vị dịch vụ trách nhiệm và những nghệ nhân vùng cao kiên trì gìn giữ nghề truyền thống."}
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm font-bold text-forest">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-clay" />
              <span>{settings.aboutCommitment1 || "Minh bạch đối soát"}</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="size-5 text-emerald-600" />
              <span>{settings.aboutCommitment2 || "Đồng hành cùng bà con"}</span>
            </div>
          </div>
        </article>
        <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
          <AppImage
            src={aboutHeroImage}
            alt="Cảnh quan du lịch cộng đồng ở núi rừng A Lưới"
            fill
            priority
            className="object-cover"
          />
        </figure>
      </section>

      {/* Sứ mệnh & Tầm nhìn */}
      <section className="bg-white py-20">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {coreValues.map((item) => (
            <article key={item.title} className="rounded-3xl border border-forest/10 bg-beige/60 p-8 shadow-sm transition hover:shadow-card">
              <h2 className="text-2xl font-bold text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-ink/70">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ĐỘI NGŨ THỰC HIỆN & NGHỆ NHÂN ĐỒNG HÀNH ("Ảnh giới thiệu nhóm") */}
      <section className="section-shell py-24">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-clay">
            <Users2 className="size-4" /> Con người đằng sau dự án
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink md:text-5xl">
            Đội ngũ sáng lập & Nghệ nhân A Lưới
          </h2>
          <p className="mt-4 text-base leading-8 text-ink/65">
            Sự kết hợp giữa nhiệt huyết của những người trẻ yêu du lịch trải nghiệm và kinh nghiệm, sự chân thành của đồng bào địa phương tại thung lũng A Lưới.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <article
              key={member.id}
              className="group overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-forest/5">
                <AppImage
                  src={member.avatar}
                  alt={`Chân dung ${member.name} - ${member.role}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-ink group-hover:text-forest transition">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-bold text-clay uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="mt-3 text-xs leading-5 text-ink/65">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tác động cộng đồng & Đối tác */}
      <section className="bg-white py-20">
        <div className="section-shell">
          <h2 className="text-3xl font-bold text-ink">
            {settings.aboutImpactTitle || "Tác động cộng đồng"}
          </h2>
          <ul className="mt-7 grid gap-4 md:grid-cols-4">
            {impactList.map((item, idx) => (
              <li key={idx} className="rounded-2xl border border-forest/10 bg-beige/40 p-5 text-sm font-semibold leading-6 text-ink/75 shadow-sm">
                {item}
              </li>
            ))}
          </ul>
          <aside className="mt-14 rounded-3xl bg-forest p-8 text-white shadow-card">
            <h2 className="text-3xl font-bold">
              {settings.aboutPartnersTitle || "Mạng lưới Đối tác"}
            </h2>
            <p className="mt-4 max-w-3xl text-white/80 leading-7">
              {settings.aboutPartnersText ||
                "Các gia đình homestay địa phương, hợp tác xã dệt thổ cẩm Zèng A Đớt, các đội trekking rừng nguyên sinh, đơn vị lữ hành Huế và các giảng viên cố vấn phát triển cộng đồng."}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
