import type { Metadata } from "next";
import { siteConfig, teamMembers } from "@/data/site";
import { getSiteSettingsAsync } from "@/lib/server-store";
import { AboutClientView } from "@/components/about/about-client-view";

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
    <AboutClientView
      settings={settings}
      aboutHeroImage={aboutHeroImage}
      members={members}
      coreValues={coreValues}
      impactList={impactList}
    />
  );
}
