import type { Metadata } from "next";
import "@/styles/globals.css";
import { Footer } from "@/components/footer";
import { CustomerChatbox } from "@/components/customer-chatbox";
import { Navbar } from "@/components/navbar";
import { siteUrl } from "@/lib/utils";
import { getSiteSettings, getSiteSettingsAsync } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsAsync();
  const faviconUrl = settings.favicon || "/favicon.ico";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Chạm A Lưới | Du lịch cộng đồng tại Huế",
      template: "%s | Chạm A Lưới"
    },
    description:
      "Khám phá văn hóa bản địa, thác nước, homestay, sản phẩm địa phương và tour du lịch cộng đồng tại A Lưới, Huế.",
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: [{ url: faviconUrl }],
      apple: [{ url: faviconUrl }]
    },
    openGraph: {
      title: "Chạm A Lưới",
      description: "Trải nghiệm du lịch cộng đồng cao cấp tại A Lưới, Huế.",
      url: siteUrl,
      siteName: "Chạm A Lưới",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      locale: "vi_VN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: "Chạm A Lưới",
      description: "Du lịch cộng đồng, văn hóa bản địa và homestay miền núi tại A Lưới."
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettingsAsync();
  const activeFavicon = settings.favicon || "/favicon.ico";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Chạm A Lưới",
    url: siteUrl,
    logo: settings.logo
      ? (settings.logo.startsWith("http") ? settings.logo : `${siteUrl}${settings.logo}`)
      : `${siteUrl}/images/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.contactAddress || "Huyện A Lưới",
      addressLocality: "A Lưới",
      addressRegion: "Huế",
      addressCountry: "VN"
    },
    telephone: settings.contactPhone || "0905 000 118",
    email: settings.contactEmail || "hotro@chamaluoi.vn"
  };

  return (
    <html lang="vi">
      <head>
        <link rel="icon" href={activeFavicon} sizes="any" />
      </head>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <Navbar
          initialLogo={settings.logo}
          initialMobileLogo={settings.logoMobile}
          initialLogoHeight={settings.logoHeight}
          initialLogoWidth={settings.logoWidth}
          initialLogoScale={settings.logoScale}
        />
        {children}
        <CustomerChatbox />
        <Footer logo={settings.logoDark || settings.logo} settings={settings} />
      </body>
    </html>
  );
}
