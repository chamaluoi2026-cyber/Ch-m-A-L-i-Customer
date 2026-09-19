"use client";

import { AppImage } from "@/components/ui/app-image";
import { Users2, Sparkles, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/components/i18n-provider";
import type { SiteSettings, TeamMemberItem, CoreValueItem } from "@/lib/server-store";

interface AboutClientViewProps {
  settings: SiteSettings;
  aboutHeroImage: string;
  members: TeamMemberItem[];
  coreValues: CoreValueItem[];
  impactList: string[];
}

const defaultEnCoreValues = [
  {
    title: "Mission",
    text: "Making A Luoi community tourism more accessible, transparent, and creating sustainable livelihoods for local indigenous families."
  },
  {
    title: "Vision",
    text: "To be Western Thua Thien Hue's most trusted digital gateway for authentic, heart-warming, and environmentally responsible highland journeys."
  },
  {
    title: "Core Values",
    text: "Centering the indigenous identity of the Pa Co, Ta Oi, and Co Tu people, using technology as a compassionate bridge."
  }
];

const defaultEnImpact = [
  "Direct sustainable income for local highland homestay hosts and artisans",
  "Indigenous heritage preservation through guided cultural experiences",
  "Responsible, mindful tourism education for domestic and international travelers",
  "Enhanced market reach and fair trade for authentic mountain specialties"
];

const memberTranslations: Record<string, { role: string; bio: string }> = {
  "team-1": {
    role: "Team Lead & Product Experience",
    bio: "Driving digital user experience and connecting community tourism households in A Luoi with modern travelers."
  },
  "team-2": {
    role: "Community Liaison & Ta Oi Artisan",
    bio: "Highland cultural advisor, connecting traditional Zeng weaving villages and warm homestays with guests."
  },
  "team-3": {
    role: "Indigenous Content & Storytelling",
    bio: "Documenting ethnic heritage stories, supporting local partners in digital presence and exclusive voucher perks."
  }
};

export function AboutClientView({
  settings,
  aboutHeroImage,
  members,
  coreValues,
  impactList
}: AboutClientViewProps) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const badge = isEn ? t.about.badge : (settings.aboutBadge || t.about.badge);
  const title = isEn ? t.about.title : (settings.aboutTitle || t.about.title);
  const subtitle = isEn
    ? t.about.subtitle
    : (settings.aboutSubtitle || t.about.subtitle);

  const commitment1 = isEn ? t.about.commitment1 : (settings.aboutCommitment1 || t.about.commitment1);
  const commitment2 = isEn ? t.about.commitment2 : (settings.aboutCommitment2 || t.about.commitment2);

  const displayCoreValues = isEn ? defaultEnCoreValues : coreValues;
  const displayImpact = isEn ? defaultEnImpact : impactList;

  const teamEyebrow = isEn ? t.about.teamEyebrow : t.about.teamEyebrow;
  const teamTitle = isEn ? t.about.teamTitle : t.about.teamTitle;
  const teamDesc = isEn ? t.about.teamDesc : t.about.teamDesc;

  const impactTitle = isEn ? t.about.impactTitle : (settings.aboutImpactTitle || t.about.impactTitle);
  const partnersTitle = isEn ? t.about.partnersTitle : (settings.aboutPartnersTitle || t.about.partnersTitle);
  const partnersText = isEn
    ? t.about.partnersText
    : (settings.aboutPartnersText || t.about.partnersText);

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <article>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">
            {badge}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink md:text-6xl leading-[1.15]">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink/65">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm font-bold text-forest">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-clay" />
              <span>{commitment1}</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="size-5 text-emerald-600" />
              <span>{commitment2}</span>
            </div>
          </div>
        </article>
        <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
          <AppImage
            src={aboutHeroImage}
            alt={isEn ? "Community tourism landscape in A Luoi highlands" : "Canh quan du lich cong dong o nui rung A Luoi"}
            fill
            priority
            className="object-cover"
          />
        </figure>
      </section>

      {/* Su menh & Tam nhin */}
      <section className="bg-white py-20">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {displayCoreValues.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-forest/10 bg-beige/60 p-8 shadow-sm transition hover:shadow-card"
            >
              <h2 className="text-2xl font-bold text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-ink/70">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* DOI NGU THUC HIEN & NGHE NHAN DONG HANH */}
      <section className="section-shell py-24">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-clay">
            <Users2 className="size-4" /> {teamEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink md:text-5xl">
            {teamTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-ink/65">
            {teamDesc}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => {
            const trans = isEn && memberTranslations[member.id];
            const memberRole = trans ? trans.role : member.role;
            const memberBio = trans ? trans.bio : member.bio;

            return (
              <article
                key={member.id}
                className="group overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-forest/5">
                  <AppImage
                    src={member.avatar}
                    alt={`Portrait ${member.name} - ${memberRole}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-ink group-hover:text-forest transition">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-clay uppercase tracking-wider">
                    {memberRole}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-ink/65">
                    {memberBio}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Tac dong cong dong & Doi tac */}
      <section className="bg-white py-20">
        <div className="section-shell">
          <h2 className="text-3xl font-bold text-ink">
            {impactTitle}
          </h2>
          <ul className="mt-7 grid gap-4 md:grid-cols-4">
            {displayImpact.map((item, idx) => (
              <li
                key={idx}
                className="rounded-2xl border border-forest/10 bg-beige/40 p-5 text-sm font-semibold leading-6 text-ink/75 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
          <aside className="mt-14 rounded-3xl bg-forest p-8 text-white shadow-card">
            <h2 className="text-3xl font-bold">
              {partnersTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-white/80 leading-7">
              {partnersText}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
