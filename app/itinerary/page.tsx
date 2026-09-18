"use client";

import { useState } from "react";
import {
  Sparkles,
  Compass,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Bike,
  Car,
  Users,
  User,
  Heart,
  Ban,
  Check,
  RotateCcw
} from "lucide-react";
import {
  TripDuration,
  TransportType,
  TravelCompanion,
  LIKE_CHOICES,
  DISLIKE_CHOICES,
  generateHighlandItinerary,
  ItineraryPlan
} from "@/lib/highland-itinerary-engine";
import { HighlandItineraryView } from "@/components/itinerary/highland-itinerary-view";
import { useLanguage } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

export default function ItineraryPage() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  // Form State
  const [duration, setDuration] = useState<TripDuration>("2-days");
  const [transport, setTransport] = useState<TransportType>("motorbike");
  const [companion, setCompanion] = useState<TravelCompanion>("friends");
  const [selectedLikes, setSelectedLikes] = useState<string[]>([
    "waterfalls",
    "hotspring",
    "zeng",
    "cuisine"
  ]);
  const [selectedDislikes, setSelectedDislikes] = useState<string[]>([]);

  // Workflow State
  const [step, setStep] = useState<number>(1);
  const [plan, setPlan] = useState<ItineraryPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const toggleLike = (id: string) => {
    setSelectedLikes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDislike = (id: string) => {
    setSelectedDislikes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateHighlandItinerary({
        duration,
        transport,
        companion,
        likes: selectedLikes,
        dislikes: selectedDislikes
      });
      setPlan(generated);
      setIsGenerating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  const handleReset = () => {
    setPlan(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2] pb-24 pt-28 sm:pt-32">
      <div className="section-shell max-w-5xl">
        {/* If plan is generated, render Itinerary Result View */}
        {plan ? (
          <HighlandItineraryView plan={plan} onReset={handleReset} />
        ) : (
          <div className="space-y-10">
            {/* Hero Header */}
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-forest">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>{t.quiz.heroBadge}</span>
              </div>
              <h1 className="font-extrabold text-3xl sm:text-4xl tracking-tight text-ink sm:text-4xl md:text-5xl">
                {t.quiz.heroTitle}
              </h1>
              <p className="text-sm leading-relaxed text-ink/75 sm:text-base">
                {t.quiz.heroSubtitle}
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStep(s)}
                    className="flex flex-col items-center gap-1.5 focus-visible:outline-none"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        step === s
                          ? "bg-forest text-white shadow-md ring-4 ring-forest/20"
                          : step > s
                          ? "bg-emerald-600 text-white"
                          : "border border-forest/20 bg-white text-ink/60"
                      }`}
                    >
                      {step > s ? <Check className="h-4 w-4" /> : s}
                    </div>
                    <span className="hidden text-[11px] font-semibold text-ink/70 sm:inline">
                      {s === 1 && (isEn ? "Duration" : "Thời gian")}
                      {s === 2 && (isEn ? "Companions" : "Bạn đồng hành")}
                      {s === 3 && (isEn ? "Likes" : "Thích")}
                      {s === 4 && (isEn ? "Avoids" : "Tránh")}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-forest/10">
                <div
                  className="h-full bg-gradient-to-r from-forest to-amber-500 transition-all duration-500"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Card Container for Steps */}
            <div className="rounded-3xl border border-forest/15 bg-white p-6 shadow-xl sm:p-10">
              {/* STEP 1: DURATION & TRANSPORT */}
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-bold text-2xl text-ink">
                      {t.quiz.step1Title}
                    </h2>
                    <p className="text-sm text-ink/60">{t.quiz.step1Desc}</p>
                  </div>

                  {/* Sub-section: Duration */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/70">
                      {t.quiz.durationLabel}
                    </label>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        {
                          id: "1-day",
                          title: isEn ? "1 Day (Express)" : "1 Ngày (Đi về trong ngày)",
                          desc: isEn
                            ? "Highlight: Par Le stream & A Nor falls"
                            : "Tập trung suối Pâr Le & Thác A Nôr"
                        },
                        {
                          id: "2-days",
                          title: isEn ? "2 Days 1 Night (Recommended)" : "2 Ngày 1 Đêm (Khuyên dùng)",
                          desc: isEn
                            ? "Campfire, homestay, hot springs & Zèng weaving"
                            : "Ngủ nhà sàn, cồng chiêng, khoáng nóng A Roàng"
                        },
                        {
                          id: "3-days",
                          title: isEn ? "3 Days 2 Nights (Deep Trail)" : "3 Ngày 2 Đêm (Khám phá sâu)",
                          desc: isEn
                            ? "Full mountain circuit, Hill 937 & highland market"
                            : "Trọn vẹn đồi A Bia, rừng già và chợ phiên"
                        }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setDuration(item.id as TripDuration)}
                          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                            duration === item.id
                              ? "border-forest bg-forest/5 ring-2 ring-forest"
                              : "border-forest/15 bg-[#FAF9F5] hover:border-forest/40 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Calendar className="h-5 w-5 text-forest" />
                            {duration === item.id && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                                ✓
                              </span>
                            )}
                          </div>
                          <h3 className="mt-3 font-bold text-ink">{item.title}</h3>
                          <p className="mt-1 text-xs text-ink/60">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub-section: Transport */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/70">
                      {t.quiz.transportLabel}
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div
                        onClick={() => setTransport("motorbike")}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                          transport === "motorbike"
                            ? "border-forest bg-forest/5 ring-2 ring-forest"
                            : "border-forest/15 bg-[#FAF9F5] hover:border-forest/40 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Bike className="h-5 w-5 text-forest" />
                          {transport === "motorbike" && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 font-bold text-ink">
                          {isEn ? "Motorbike / Scooter" : "Xe máy phượt đèo QL49"}
                        </h3>
                        <p className="mt-1 text-xs text-ink/60">
                          {isEn
                            ? "Thrilling bends, feel the cool mountain breeze directly."
                            : "Chinh phục cua đèo A Co, tự do dừng chân ngắm cảnh ven đường."}
                        </p>
                      </div>

                      <div
                        onClick={() => setTransport("car")}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                          transport === "car"
                            ? "border-forest bg-forest/5 ring-2 ring-forest"
                            : "border-forest/15 bg-[#FAF9F5] hover:border-forest/40 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Car className="h-5 w-5 text-forest" />
                          {transport === "car" && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 font-bold text-ink">
                          {isEn ? "Private Car / Taxi Tour" : "Xe ô tô đưa đón / Tự lái"}
                        </h3>
                        <p className="mt-1 text-xs text-ink/60">
                          {isEn
                            ? "Safe & comfortable for families, couples, and large groups."
                            : "Thoải mái, che nắng mưa, an toàn tuyệt đối cho người thân."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: COMPANIONS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-bold text-2xl text-ink">
                      {t.quiz.step2Title}
                    </h2>
                    <p className="text-sm text-ink/60">{t.quiz.step2Desc}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        id: "solo",
                        icon: User,
                        title: isEn ? "Solo Traveler" : "Đi một mình",
                        desc: isEn ? "Freedom & deep quietude" : "Tự do, thích tĩnh lặng"
                      },
                      {
                        id: "couple",
                        icon: Heart,
                        title: isEn ? "Couple / Duo" : "Cặp đôi",
                        desc: isEn ? "Romantic pine hills & sunset" : "Lãng mạn, săn mây ngắm hoàng hôn"
                      },
                      {
                        id: "family",
                        icon: Users,
                        title: isEn ? "Family Group" : "Gia đình",
                        desc: isEn ? "Safe paths & wellness hot springs" : "An toàn, suối khoáng & trẻ em"
                      },
                      {
                        id: "friends",
                        icon: Users,
                        title: isEn ? "Friends / Group" : "Nhóm bạn bè",
                        desc: isEn ? "Campfire, waterfalls & feast" : "Tắm thác, nướng gà & cồng chiêng"
                      }
                    ].map((item) => {
                      const IconComp = item.icon;
                      const active = companion === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setCompanion(item.id as TravelCompanion)}
                          className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                            active
                              ? "border-forest bg-forest/5 ring-2 ring-forest"
                              : "border-forest/15 bg-[#FAF9F5] hover:border-forest/40 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <IconComp className="h-6 w-6 text-forest" />
                            {active && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                                ✓
                              </span>
                            )}
                          </div>
                          <h3 className="mt-3 font-bold text-ink">{item.title}</h3>
                          <p className="mt-1 text-xs text-ink/60">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: LIKES */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-bold text-2xl text-ink">
                      {t.quiz.step3Title}
                    </h2>
                    <p className="text-sm text-ink/60">{t.quiz.step3Desc}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {LIKE_CHOICES.map((choice) => {
                      const active = selectedLikes.includes(choice.id);
                      return (
                        <div
                          key={choice.id}
                          onClick={() => toggleLike(choice.id)}
                          className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                            active
                              ? "border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-600"
                              : "border-forest/15 bg-[#FAF9F5] hover:border-forest/40 hover:bg-white"
                          }`}
                        >
                          <span className="text-2xl">{choice.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-ink">
                                {isEn ? choice.enLabel : choice.label}
                              </h3>
                              {active && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-ink/65">
                              {isEn ? choice.enDescription : choice.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: DISLIKES & AVOIDS */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-bold text-2xl text-ink">
                      {t.quiz.step4Title}
                    </h2>
                    <p className="text-sm text-ink/60">{t.quiz.step4Desc}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {DISLIKE_CHOICES.map((choice) => {
                      const active = selectedDislikes.includes(choice.id);
                      return (
                        <div
                          key={choice.id}
                          onClick={() => toggleDislike(choice.id)}
                          className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                            active
                              ? "border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-600"
                              : "border-forest/15 bg-[#FAF9F5] hover:border-forest/40 hover:bg-white"
                          }`}
                        >
                          <span className="text-2xl">{choice.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-ink">
                                {isEn ? choice.enLabel : choice.label}
                              </h3>
                              {active && (
                                <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                  {isEn ? "EXCLUDED" : "LOẠI TRỪ"}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-ink/65">
                              {isEn ? choice.enDescription : choice.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="mt-10 flex items-center justify-between border-t border-forest/10 pt-6">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    className="border-forest/20 text-ink"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    {t.common.back}
                  </Button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="bg-forest text-white hover:bg-forest-light"
                  >
                    {t.common.next}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-forest via-emerald-700 to-amber-600 px-7 py-3 font-bold text-white shadow-lg transition-all hover:opacity-95"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? t.quiz.generatingMessage : t.quiz.generateButton}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
