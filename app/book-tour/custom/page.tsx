"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  Car,
  MapPin,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Ticket,
  QrCode,
  MessageSquare,
  Phone,
  Mail,
  User,
  Check,
  ExternalLink,
  AlertCircle,
  Loader2,
  Heart,
  Ban,
  Info,
  BadgeCheck,
  Plus,
  Minus,
  Utensils,
  Home,
  Copy,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { AppImage } from "@/components/ui/app-image";
import { formatCurrency, cn } from "@/lib/utils";
import { getCurrentUser, type AuthUser } from "@/lib/supabase/browser";
import { submitBookingAction } from "@/app/actions/bookings";
import { fetchAllPlacesAction } from "@/app/actions/places";
import {
  ItineraryPlan,
  LIKE_CHOICES,
  DISLIKE_CHOICES,
  generateHighlandItinerary,
  DEPARTURE_TIME_OPTIONS
} from "@/lib/highland-itinerary-engine";

const HOMESTAYS_LIST = [
  {
    id: "anor-riverside",
    name: "Homestay ven suối A Nôr",
    village: "Bản A Nôr, xã Hồng Kim",
    tag: "🌊 Bên triền suối reo",
    image: "/images/aluoi/homestay-bungalow.jpg",
    rating: 4.9,
    reviews: 128,
    desc: "Nhà sàn gỗ thoáng mát sát bờ suối, gần cụm thác A Nôr 3 tầng. Ngủ đêm nghe suối róc rách, thưởng thức cá nướng."
  },
  {
    id: "pa-co-heritage",
    name: "Nhà di sản Pa Cô (Làng truyền thống)",
    village: "Bản Pa Cô, xã Hồng Bắc",
    tag: "🔥 Lửa trại & Cồng chiêng",
    image: "/images/aluoi/homestay-relax.jpg",
    rating: 4.8,
    reviews: 95,
    desc: "Không gian nhà sàn Pa Cô nguyên bản, tham gia bếp lửa, học giã gạo, giao lưu điệu múa Ra Zooc đêm."
  },
  {
    id: "ta-oi-lodge",
    name: "Nhà nghỉ sinh thái núi Tà Ôi",
    village: "Bản A Đớt, gần làng dệt Zèng",
    tag: "🧵 Gần Làng nghề Dệt Zèng",
    image: "/images/aluoi/homestay-swing.jpg",
    rating: 4.8,
    reviews: 84,
    desc: "Nằm giữa thung lũng A Đớt, tiện workshop dệt thổ cẩm Zèng di sản, view ngắm núi đồi điệp trùng."
  },
  {
    id: "cloud-hill-retreat",
    name: "Cloud Hill Retreat (Đồi mây Hồng Vân)",
    village: "Đồi thông Hồng Vân",
    tag: "☁️ Săn mây đồi thông se lạnh",
    image: "/images/aluoi/ho-sinh-thai-a-luoi.jpg",
    rating: 4.9,
    reviews: 110,
    desc: "Nằm trên triền đồi thông cao mát mẻ như Đà Lạt, thích hợp săn mây sáng sớm và ngắm hoàng hôn đỏ rực."
  },
  {
    id: "auto-assign",
    name: "Hợp tác xã tự sắp xếp Homestay tối ưu nhất",
    village: "Theo vị trí gần cung đường di chuyển",
    tag: "✨ Điều phối viên chọn phòng tốt",
    image: "/images/aluoi/homestay-bungalow.jpg",
    rating: 5.0,
    reviews: 200,
    desc: "Để đội ngũ bản địa tự kiểm tra phòng trống sạch sẽ, tiện nghi và thuận đường di chuyển nhất cho đoàn."
  }
];

export default function CustomItineraryBookingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isEn = language === "en";

  // State: Plan loaded from sessionStorage (or fallback)
  const [plan, setPlan] = useState<ItineraryPlan | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form custom state
  const [guestsCount, setGuestsCount] = useState<number>(4);
  const [transportChoice, setTransportChoice] = useState<"car" | "self">("car");
  const [selectedHomestayId, setSelectedHomestayId] = useState<string>("anor-riverside");
  const [homestayList, setHomestayList] = useState(HOMESTAYS_LIST);
  const [oneDayAddHomestay, setOneDayAddHomestay] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [paymentChoice, setPaymentChoice] = useState<"zalo_consult" | "vietqr_deposit">("zalo_consult");

  // Submission state
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    id: string;
    finalAmount: number;
    depositAmount: number;
    customerName: string;
    phone: string;
    homestayName: string;
    homestayVillage?: string;
    numDays: number;
    numNights: number;
    guestsCount: number;
    transportLabel: string;
    departureDate: string;
  } | null>(null);

  // Load plan from sessionStorage & check user session
  useEffect(() => {
    // 1. Fetch current logged-in user
    getCurrentUser().then((u: any) => {
      if (u) {
        setCurrentUser(u);
        const metaName = String(u.user_metadata?.full_name || u.user_metadata?.name || u.name || "");
        if (metaName) setCustomerName(metaName);
        if (u.email) setEmail(String(u.email));
        const metaPhone = String(u.user_metadata?.phone || u.phone || "");
        if (metaPhone) setPhone(metaPhone);
      }
    });

    // 2. Load dynamic homestays from database (places with category === "stay")
    fetchAllPlacesAction().then((places) => {
      if (places && places.length > 0) {
        const stayPlaces = places.filter(
          (p: any) =>
            (p.category === "stay" || p.name?.toLowerCase().includes("homestay")) &&
            p.status !== "hidden" &&
            !p.isDeleted
        );
        if (stayPlaces.length > 0) {
          const dynamicStays = stayPlaces.map((p: any) => ({
            id: p.slug,
            name: p.name,
            village: p.address || p.businessName || "Huyện A Lưới, Thừa Thiên Huế",
            tag: p.highlights?.[0] ? `🏡 ${p.highlights[0]}` : "🏡 Homestay bản địa",
            image: p.image || "/images/aluoi/homestay-bungalow.jpg",
            rating: Number(p.rating) || 4.8,
            reviews: Number(p.reviewCount) || 12,
            desc: p.summary || p.description || `Homestay ${p.name} tại A Lưới.`
          }));

          const autoOption = HOMESTAYS_LIST.find((h) => h.id === "auto-assign");
          setHomestayList([...dynamicStays, ...(autoOption ? [autoOption] : [])]);
        }
      }
    }).catch((err) => {
      console.warn("Could not load dynamic stays, using fallback list:", err);
    });

    // 3. Load plan from sessionStorage
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("chamaluoi_custom_tour_plan");
        if (stored) {
          const parsed = JSON.parse(stored) as ItineraryPlan;
          setPlan(parsed);
          // Set initial guest count based on companion
          if (parsed.companion === "solo") setGuestsCount(1);
          else if (parsed.companion === "couple") setGuestsCount(2);
          else if (parsed.companion === "family") setGuestsCount(4);
          else setGuestsCount(4);

          // Set initial transport choice
          setTransportChoice(parsed.transport === "car" ? "car" : "self");
          setLoadingInitial(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load stored itinerary:", err);
    }

    // Fallback default plan if user directly visits /book-tour/custom
    const fallback = generateHighlandItinerary({
      duration: "2-days",
      transport: "car",
      companion: "friends",
      departureTime: "07:30",
      likes: ["waterfalls", "hotspring", "zeng", "cuisine"],
      dislikes: []
    });
    setPlan(fallback);
    setLoadingInitial(false);
  }, []);

  // Map likes and dislikes to readable badges
  const activeLikeItems = useMemo(() => {
    if (!plan?.likes) return [];
    return LIKE_CHOICES.filter((c) => plan.likes.includes(c.id));
  }, [plan?.likes]);

  const activeDislikeItems = useMemo(() => {
    if (!plan?.dislikes) return [];
    return DISLIKE_CHOICES.filter((c) => plan.dislikes.includes(c.id));
  }, [plan?.dislikes]);

  // Departure Time label
  const departureTimeObj = useMemo(() => {
    if (!plan?.departureTime) return DEPARTURE_TIME_OPTIONS[1];
    return DEPARTURE_TIME_OPTIONS.find((o) => o.id === plan.departureTime) || DEPARTURE_TIME_OPTIONS[1];
  }, [plan?.departureTime]);

  // Number of days and nights
  const numDays = plan?.duration === "3-days" ? 3 : plan?.duration === "1-day" ? 1 : 2;
  const numNights = numDays > 1 ? numDays - 1 : (oneDayAddHomestay ? 1 : 0);

  // Pricing Calculation Breakdown
  const pricing = useMemo(() => {
    // 1. Homestay per person
    const homestayPerPerson = numNights * 250000;
    const totalHomestay = homestayPerPerson * guestsCount;

    // 2. Meals per person (1-day = 2 meals, 2-days = 4 meals, 3-days = 6 meals)
    const numMeals = numDays * 2;
    const mealsPerPerson = numMeals * 150000;
    const totalMeals = mealsPerPerson * guestsCount;

    // 3. Sightseeing & Activities (waterfall entry, hotspring, zeng demo)
    const activitiesPerPerson = numDays * 100000;
    const totalActivities = activitiesPerPerson * guestsCount;

    // 4. Private Transport (Car roundtrip Hue - A Luoi)
    // 1-day: 1.200.000đ; 2-days: 1.600.000đ; 3-days: 2.200.000đ (per vehicle, not per person!)
    const carFee = transportChoice === "car" ? (numDays === 1 ? 1200000 : numDays === 2 ? 1600000 : 2200000) : 0;

    // Subtotal
    const subtotal = totalHomestay + totalMeals + totalActivities + carFee;

    // Voucher Discount: 10%
    const discount = Math.round(subtotal * 0.1);
    const finalAmount = Math.max(0, subtotal - discount);

    // Deposit: 30%
    const depositAmount = Math.round((finalAmount * 0.3) / 1000) * 1000;

    return {
      homestayPerPerson,
      totalHomestay,
      numMeals,
      mealsPerPerson,
      totalMeals,
      activitiesPerPerson,
      totalActivities,
      carFee,
      subtotal,
      discount,
      finalAmount,
      depositAmount,
      perPersonAvg: Math.round(finalAmount / guestsCount)
    };
  }, [guestsCount, numDays, numNights, transportChoice]);

  // Selected Homestay
  const selectedHomestay = useMemo(() => {
    return homestayList.find((h) => h.id === selectedHomestayId) || homestayList[0] || HOMESTAYS_LIST[0];
  }, [homestayList, selectedHomestayId]);

  // Extract major stops from all days
  const allStops = useMemo(() => {
    if (!plan?.days) return [];
    return plan.days.flatMap((d) =>
      d.stops.filter((s) => !s.isTravelLeg).map((s) => ({ ...s, dayNumber: d.dayNumber }))
    );
  }, [plan?.days]);

  // Handle Form Submit
  const handleConfirmBooking = () => {
    setErrorMsg(null);
    if (!customerName.trim()) {
      setErrorMsg(isEn ? "Please enter your full name." : "Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg(isEn ? "Please enter a valid phone number." : "Vui lòng nhập số điện thoại hoặc Zalo hợp lệ (tối thiểu 9 số).");
      return;
    }

    startTransition(async () => {
      try {
        const itemTitle = `Tour riêng theo lịch trình AI (${numDays} ngày ${numNights} đêm) - ${plan?.title || "Chạm A Lưới"}`;
        const daysSummary = plan?.days?.map((d) => {
          const stopsSummary = d.stops.map((s) => `  • [${s.timeSlot}] ${s.name}`).join("\n");
          return `Ngày ${d.dayNumber} - ${d.title}:\n${stopsSummary}`;
        }).join("\n\n");

        const fullNotes = [
          `Lịch trình AI: ${plan?.id || "custom"} - ${plan?.title || "Tour Chạm A Lưới"}`,
          `Số khách: ${guestsCount} người | Phương tiện: ${transportChoice === "car" ? "Xe riêng đưa đón từ TP. Huế" : "Tự túc xe cá nhân/xe máy"}`,
          numNights > 0 ? `Lưu trú: ${selectedHomestay.name} (${selectedHomestay.village})` : "Tour 1 ngày (không ở đêm)",
          pickupAddress ? `Điểm đón: ${pickupAddress}` : "",
          specialNotes ? `Yêu cầu riêng: ${specialNotes}` : "",
          `Hình thức: ${paymentChoice === "vietqr_deposit" ? "Đặt cọc 30% VietQR" : "Tư vấn & xác nhận qua Zalo (0đ trả trước)"}`,
          daysSummary ? `\n--- CHI TIẾT CÁC ĐIỂM DỪNG ---\n${daysSummary}` : ""
        ]
          .filter(Boolean)
          .join("\n");

        const itineraryDetails = plan ? {
          planId: plan.id,
          title: plan.title,
          enTitle: plan.enTitle,
          duration: plan.duration,
          departureDate: plan.departureDate,
          departureTime: plan.departureTime || "07:30",
          transport: transportChoice === "car" ? "Xe riêng đưa đón từ TP. Huế" : "Tự túc xe cá nhân/xe máy",
          companion: plan.companion,
          homestayName: numNights > 0 ? selectedHomestay.name : undefined,
          homestayVillage: numNights > 0 ? selectedHomestay.village : undefined,
          pickupAddress: pickupAddress || undefined,
          specialNotes: specialNotes || undefined,
          likes: plan.likes || [],
          dislikes: plan.dislikes || [],
          days: plan.days?.map((d) => ({
            dayNumber: d.dayNumber,
            title: d.title,
            enTitle: d.enTitle,
            theme: d.theme,
            stops: d.stops?.map((s) => ({
              id: s.id,
              timeSlot: s.timeSlot,
              name: s.name,
              enName: s.enName,
              category: s.category,
              summary: s.summary,
              wisdomTip: s.wisdomTip,
              duration: s.duration,
              googleMapsQuery: s.googleMapsQuery
            }))
          }))
        } : undefined;

        const res = await submitBookingAction({
          type: "tour",
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          itemTitle,
          itemSlug: plan?.id || "custom-ai-itinerary",
          numberOfPeople: guestsCount,
          startDate: plan?.departureDate || new Date().toISOString().split("T")[0],
          experienceDate: plan?.departureDate,
          experienceTime: plan?.departureTime || "07:30",
          unitPrice: pricing.perPersonAvg,
          finalAmount: pricing.finalAmount,
          paymentMethod: paymentChoice === "vietqr_deposit" ? "vietqr" : "cash_on_delivery",
          customerNote: fullNotes,
          notes: fullNotes,
          itineraryDetails,
          metadata: { itinerary: itineraryDetails },
          businessName: "Hợp tác xã Du lịch Cộng đồng A Lưới",
          source: "ai_itinerary_fast_track"
        });

        if (res.success && res.booking) {
          setBookingSuccess({
            id: res.booking.id,
            finalAmount: pricing.finalAmount,
            depositAmount: pricing.depositAmount,
            customerName: customerName.trim(),
            phone: phone.trim(),
            homestayName: numNights > 0 ? selectedHomestay.name : (isEn ? "Day trip (No overnight stay)" : "Đi về trong ngày (Không ở đêm)"),
            homestayVillage: numNights > 0 ? selectedHomestay.village : undefined,
            numDays,
            numNights,
            guestsCount,
            transportLabel: transportChoice === "car" ? (isEn ? "Private car roundtrip from Hue" : "Xe riêng đưa đón từ TP. Huế") : (isEn ? "Self-guided (motorbike/car)" : "Tự túc xe cá nhân/xe máy"),
            departureDate: plan?.departureDate || (isEn ? "This Saturday" : "Thứ Bảy tuần này")
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setErrorMsg(res.error || (isEn ? "Could not process booking. Please try again." : "Không thể tạo đơn đặt. Vui lòng thử lại."));
        }
      } catch (err: any) {
        setErrorMsg(err?.message || (isEn ? "System error. Please try again." : "Lỗi hệ thống khi gửi đơn. Vui lòng thử lại."));
      }
    });
  };

  if (loadingInitial) {
    return (
      <main className="min-h-screen bg-[#F8F7F2] pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="size-8 animate-spin text-forest mx-auto" />
          <p className="text-xs font-bold text-ink/70">
            {isEn ? "Loading your custom itinerary..." : "Đang tải lịch trình riêng của bạn..."}
          </p>
        </div>
      </main>
    );
  }

  // SUCCESS SCREEN
  if (bookingSuccess) {
    const vietQrUrl = `https://img.vietqr.io/image/970422-0905000118-compact2.png?amount=${bookingSuccess.depositAmount}&addInfo=${encodeURIComponent(
      `COC ${bookingSuccess.id} ${bookingSuccess.phone}`
    )}&accountName=${encodeURIComponent("CHAM A LUOI TRAVEL")}`;

    return (
      <main className="min-h-screen bg-[#F8F7F2] pt-28 pb-20">
        <div className="section-shell max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-card border border-forest/15 text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 text-xs font-bold">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>{isEn ? "Booking Request Confirmed" : "Đã Ghi Nhận Yêu Cầu Đặt Tour"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-ink">
              {isEn ? "Thank you, " : "Cảm ơn bạn, "} {bookingSuccess.customerName}!
            </h1>

            <p className="text-sm text-ink/75 leading-relaxed max-w-lg mx-auto">
              {paymentChoice === "vietqr_deposit"
                ? isEn
                  ? "Your custom tour is temporarily reserved. Please complete the 30% deposit via VietQR below to secure your homestay and private driver."
                  : `Đơn đặt tour riêng của bạn đã được giữ chỗ thành công với mã `
                : isEn
                ? "Your custom itinerary has been sent to our local community coordinators. We will reach out via Zalo/Phone within 5 minutes to confirm details."
                : "Yêu cầu đặt tour của bạn đã được chuyển tới Điều phối viên Chạm A Lưới. Chúng tôi sẽ kết nối qua Zalo/Điện thoại trong vòng 5 phút để xác nhận giữ chỗ và giải đáp mọi thắc mắc."}
              {paymentChoice !== "vietqr_deposit" && (
                <strong className="block text-forest mt-1 text-base font-bold">Mã đơn: {bookingSuccess.id}</strong>
              )}
            </p>

            {/* TOUR BOOKING SUMMARY DETAILS CARD */}
            <div className="rounded-2xl border border-forest/20 bg-[#F8F7F2] p-4 sm:p-5 text-left space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                <span className="font-extrabold text-xs uppercase tracking-wider text-forest flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-600" />
                  <span>Chi tiết hành trình bạn vừa đặt</span>
                </span>
                <span className="rounded-full bg-forest/10 text-forest text-[11px] font-bold px-2.5 py-0.5">
                  {bookingSuccess.numDays} ngày {bookingSuccess.numNights > 0 ? `${bookingSuccess.numNights} đêm` : ""}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-ink/50 flex items-center gap-1 font-medium">
                    <Home className="size-3.5 text-clay" />
                    Lưu trú Homestay:
                  </span>
                  <p className="font-bold text-ink text-sm">
                    {bookingSuccess.homestayName}
                  </p>
                  {bookingSuccess.homestayVillage && (
                    <p className="text-[10px] text-ink/50">{bookingSuccess.homestayVillage}</p>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-ink/50 flex items-center gap-1 font-medium">
                    <Calendar className="size-3.5 text-forest" />
                    Ngày khởi hành:
                  </span>
                  <p className="font-bold text-ink text-sm">
                    {bookingSuccess.departureDate}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-ink/50 flex items-center gap-1 font-medium">
                    <Users className="size-3.5 text-forest" />
                    Số lượng khách:
                  </span>
                  <p className="font-bold text-ink text-sm">
                    {bookingSuccess.guestsCount} khách
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-ink/50 flex items-center gap-1 font-medium">
                    <Car className="size-3.5 text-blue-600" />
                    Phương tiện di chuyển:
                  </span>
                  <p className="font-bold text-ink text-sm">
                    {bookingSuccess.transportLabel}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-black/10 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-ink/60 font-medium">Tổng chi phí dự kiến:</span>
                <span className="text-base sm:text-lg font-black text-forest">
                  {formatCurrency(bookingSuccess.finalAmount)}
                </span>
              </div>
            </div>

            {/* AUTO ACCOUNT NOTIFICATION */}
            <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-left flex items-start gap-3 text-xs text-amber-900">
              <BadgeCheck className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {isEn ? "Account Auto-Synced with Phone:" : "Tài khoản đã tự động đồng bộ theo SĐT:"}{" "}
                  {bookingSuccess.phone}
                </strong>
                <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                  {isEn
                    ? "You can track this booking, view vouchers, and see full itinerary details anytime in your Account."
                    : "Hệ thống đã tự động liên kết đơn hàng này với số điện thoại của bạn. Bạn có thể vào mục Tài khoản để xem lại vé điện tử và voucher bất kỳ lúc nào."}
                </p>
              </div>
            </div>

            {/* VIETQR DEPOSIT QR BOX IF SELECTED */}
            {paymentChoice === "vietqr_deposit" && (
              <div className="rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/40 p-5 space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-forest font-bold text-sm">
                  <QrCode className="size-4" />
                  <span>Quét mã VietQR để thanh toán tiền cọc 30%</span>
                </div>

                <div className="relative size-56 mx-auto rounded-xl overflow-hidden border border-black/10 bg-white shadow-md p-2">
                  <AppImage src={vietQrUrl} alt="VietQR Napas247 Chạm A Lưới" fill className="object-contain" />
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-ink/65">
                    Số tiền cọc: <strong className="text-base text-forest">{formatCurrency(bookingSuccess.depositAmount)}</strong> (30% tổng chi phí)
                  </p>
                  <p className="text-ink/50 text-[11px]">
                    Nội dung chuyển khoản: <strong className="font-mono text-ink">COC {bookingSuccess.id} {bookingSuccess.phone}</strong>
                  </p>
                  <p className="text-emerald-800 font-medium text-[11px] mt-1">
                    ✓ Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận và gửi vé điện tử qua Zalo.
                  </p>
                </div>
              </div>
            )}

            {/* ACTIONS BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://zalo.me/0905000118?text=${encodeURIComponent(
                  `Xin chào Chạm A Lưới, tôi vừa đặt tour theo lịch trình AI (Mã đơn: ${bookingSuccess.id} - SĐT: ${bookingSuccess.phone}). Nhờ bên mình kiểm tra và hỗ trợ xác nhận giúp tôi!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0068FF] hover:bg-[#0055d4] px-6 py-3 text-xs font-bold text-white shadow-md transition"
              >
                <MessageSquare className="size-4" />
                <span>{isEn ? "Chat on Zalo Now (Instant Reply)" : "Mở Chat Zalo Với Điều Phối Viên"}</span>
              </a>

              <Link
                href="/account/bookings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-forest/30 bg-white hover:bg-forest/5 px-6 py-3 text-xs font-bold text-forest transition"
              >
                <User className="size-4" />
                <span>{isEn ? "View in My Account" : "Xem Đơn Trong Tài Khoản"}</span>
              </Link>
            </div>

            <div className="pt-2">
              <Link href="/itinerary" className="text-xs text-ink/50 hover:text-forest transition underline">
                ← {isEn ? "Return to Itinerary Planner" : "Quay lại trang Lập Lịch Trình AI"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // MAIN FAST-TRACK BOOKING VIEW
  return (
    <main className="min-h-screen bg-[#F8F7F2] pt-24 pb-20">
      <div className="section-shell max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/itinerary"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>{isEn ? "Back to Itinerary" : "Quay lại lịch trình vừa tạo"}</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
            <Sparkles className="size-3.5 text-amber-500" />
            <span>{isEn ? "Fast-Track Custom Booking" : "Đặt Tour Riêng Trọn Gói 1-Chạm"}</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            {isEn ? "Confirm & Book Your Custom Tour" : "Xác Nhận & Đặt Tour Riêng Theo Lịch Trình Của Bạn"}
          </h1>
          <p className="text-xs sm:text-sm text-ink/70 leading-relaxed max-w-3xl">
            {isEn
              ? "All your previously selected highland destinations, travel dates, companions, and preferences have been preserved below. Review your route, adjust guest count, and choose your preferred confirmation method."
              : "Toàn bộ điểm đến, ngày đi, bạn đồng hành và sở thích bạn vừa chọn đã được hệ thống lưu giữ nguyên vẹn dưới đây. Bạn chỉ cần rà soát lại, chỉnh số lượng người và chọn cách xác nhận tiện nhất."}
          </p>
        </div>

        {/* Auto-Account / Logged-in Notice Banner */}
        {currentUser ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-emerald-600 shrink-0" />
              <span>
                Đang đặt với tài khoản: <strong className="font-bold">{currentUser.email || customerName}</strong> (Thông tin đã được tự động điền)
              </span>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
              Đã đăng nhập
            </span>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-forest/15 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-ink/80">
              <ShieldCheck className="size-4 text-forest shrink-0" />
              <span>
                <strong>Đặt nhanh không cần mật khẩu:</strong> Chỉ cần nhập SĐT, hệ thống sẽ tự tạo tài khoản để bạn theo dõi đơn.
              </span>
            </div>
            <Link
              href={`/login?next=/book-tour/custom`}
              className="inline-flex items-center gap-1 font-bold text-forest hover:underline shrink-0 text-[11px]"
            >
              <span>Đã có tài khoản? Đăng nhập</span>
              <ChevronRight className="size-3" />
            </Link>
          </div>
        )}

        {/* 2-Column Main Layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Recap of Previously Selected Choices (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Summary Card of Key Itinerary Parameters */}
            <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-card border border-black/5 space-y-5">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <h3 className="font-extrabold text-ink text-base flex items-center gap-2">
                  <Calendar className="size-4 text-forest" />
                  <span>{isEn ? "1. Your Chosen Travel Details" : "1. Thông Tin Chuyến Đi Đã Chọn Khi Nãy"}</span>
                </h3>
                <span className="rounded-full bg-forest/10 text-forest text-[11px] font-bold px-3 py-1">
                  {numDays} ngày {numNights > 0 ? `${numNights} đêm` : ""}
                </span>
              </div>

              {/* Grid of Choices */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                {/* Ngày khởi hành */}
                <div className="rounded-2xl bg-[#F8F7F2] p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-ink/50 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-clay" />
                    <span>Ngày khởi hành:</span>
                  </div>
                  <p className="font-bold text-ink text-sm">
                    {plan?.departureDate || "Thứ Bảy tuần này"}
                  </p>
                  <p className="text-[10px] text-ink/50">
                    Khung giờ đón: <strong>{departureTimeObj.label}</strong>
                  </p>
                </div>

                {/* Bạn đồng hành */}
                <div className="rounded-2xl bg-[#F8F7F2] p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-ink/50 flex items-center gap-1.5">
                    <Users className="size-3.5 text-forest" />
                    <span>Bạn đồng hành:</span>
                  </div>
                  <p className="font-bold text-ink text-sm capitalize">
                    {plan?.companion === "friends"
                      ? "Nhóm Bạn Bè"
                      : plan?.companion === "family"
                      ? "Gia Đình Có Trẻ / Người Cao Tuổi"
                      : plan?.companion === "couple"
                      ? "Cặp Đôi Lãng Mạn"
                      : "Đi Một Mình (Solo)"}
                  </p>
                  <p className="text-[10px] text-ink/50">Lịch trình đã tối ưu độ dốc và nhịp nghỉ</p>
                </div>
              </div>

              {/* Guests Count Selector (+ / - buttons) */}
              <div className="rounded-2xl border border-forest/15 bg-forest/5 p-4 flex items-center justify-between gap-4">
                <div>
                  <label className="text-xs font-bold text-ink block">
                    {isEn ? "Number of Guests:" : "Số lượng khách tham gia:"}
                  </label>
                  <span className="text-[11px] text-ink/60">
                    (Giá phòng và các bữa ăn sẽ tự động nhân theo số khách)
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white border border-forest/20 rounded-2xl px-3 py-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setGuestsCount((prev) => Math.max(1, prev - 1))}
                    disabled={guestsCount <= 1}
                    className="size-7 rounded-lg hover:bg-beige/60 text-ink disabled:opacity-30 flex items-center justify-center transition"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="font-extrabold text-forest text-base min-w-6 text-center">
                    {guestsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestsCount((prev) => Math.min(20, prev + 1))}
                    disabled={guestsCount >= 20}
                    className="size-7 rounded-lg hover:bg-beige/60 text-ink disabled:opacity-30 flex items-center justify-center transition"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Transport Choice Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Car className="size-3.5 text-forest" />
                  <span>Phương tiện di chuyển:</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTransportChoice("car")}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition flex flex-col justify-between",
                      transportChoice === "car"
                        ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/30 font-bold"
                        : "border-black/10 bg-white hover:bg-beige/40 text-ink/75"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Xe ô tô riêng đưa đón từ Huế</span>
                      {transportChoice === "car" && <Check className="size-3.5 text-forest" />}
                    </div>
                    <span className="text-[10px] text-ink/55 font-normal mt-1">
                      Xe 7-16 chỗ khứ hồi, tài xế người bản địa chạy đèo an toàn
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransportChoice("self")}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition flex flex-col justify-between",
                      transportChoice === "self"
                        ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/30 font-bold"
                        : "border-black/10 bg-white hover:bg-beige/40 text-ink/75"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Tự túc xe cá nhân / Xe máy</span>
                      {transportChoice === "self" && <Check className="size-3.5 text-forest" />}
                    </div>
                    <span className="text-[10px] text-ink/55 font-normal mt-1">
                      Chỉ đặt phòng homestay, các bữa ăn và vé trải nghiệm
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Previously Selected Likes & Dislikes */}
              <div className="space-y-2 pt-2 border-t border-black/5">
                <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Heart className="size-3.5 text-rose-500" />
                  <span>Sở thích & Điểm nhấn bạn đã chọn:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {activeLikeItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 text-xs font-semibold"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  ))}
                  {activeLikeItems.length === 0 && (
                    <span className="text-xs text-ink/50 italic">Không có lựa chọn đặc biệt</span>
                  )}
                </div>

                {activeDislikeItems.length > 0 && (
                  <div className="pt-2">
                    <label className="text-xs font-bold text-ink/70 flex items-center gap-1.5">
                      <Ban className="size-3 text-amber-600" />
                      <span>Điều bạn đã chọn tránh:</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeDislikeItems.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-0.5 text-[11px]"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. CHỌN HOMESTAY NGHỈ ĐÊM (KHI ĐI 2N1Đ HOẶC 3N2Đ) */}
            {/* 2. CHỌN HOMESTAY NGHỈ ĐÊM */}
            <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-card border border-black/5 space-y-4">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <div>
                  <h3 className="font-extrabold text-ink text-base flex items-center gap-2">
                    <Home className="size-4 text-forest" />
                    <span>{isEn ? "2. Choose Your Preferred Homestay" : "2. Tùy Chọn Homestay Bản Địa Nghỉ Đêm"}</span>
                  </h3>
                  <p className="text-[11px] text-ink/60 mt-0.5">
                    {numDays === 1
                      ? isEn
                        ? "1-day trips typically return the same day. You can optionally add an overnight stay below."
                        : "Chuyến đi 1 ngày thường đi về trong ngày. Bạn có thể chọn thêm đêm nghỉ tại homestay nếu muốn."
                      : isEn
                      ? `Select your preferred community homestay for ${numNights} night(s)`
                      : `Bạn được tự do chọn homestay ưng ý nhất trong mạng lưới du lịch cộng đồng A Lưới (${numNights} đêm)`}
                  </p>
                </div>
                <span className="rounded-full bg-clay/10 text-clay text-[11px] font-bold px-3 py-1 shrink-0">
                  {numNights > 0 ? `${numNights} đêm nghỉ` : isEn ? "Day trip" : "Không ở đêm"}
                </span>
              </div>

              {/* Nếu là tour 1 ngày: Cho phép tích chọn thêm đêm nghỉ */}
              {numDays === 1 && (
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-forest/20 bg-forest/5 cursor-pointer text-xs font-semibold text-forest">
                  <input
                    type="checkbox"
                    checked={oneDayAddHomestay}
                    onChange={(e) => setOneDayAddHomestay(e.target.checked)}
                    className="size-4 accent-forest rounded"
                  />
                  <span>
                    {isEn
                      ? "I want to add 1 overnight stay at a local homestay (+250,000 VND / guest)"
                      : "Tôi muốn ở lại thêm 1 đêm tại Homestay bản địa (+250.000đ / khách)"}
                  </span>
                </label>
              )}

              {/* Danh sách Homestay để chọn */}
              {(numDays > 1 || oneDayAddHomestay) ? (
                <div className="grid gap-3 sm:grid-cols-1">
                  {homestayList.map((h) => {
                    const isSelected = selectedHomestayId === h.id;
                    return (
                      <div
                        key={h.id}
                        onClick={() => setSelectedHomestayId(h.id)}
                        className={cn(
                          "p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row gap-3 sm:items-center justify-between",
                          isSelected
                            ? "border-forest bg-forest/5 ring-2 ring-forest/30 shadow-sm"
                            : "border-black/10 bg-white hover:bg-beige/40"
                        )}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="relative size-16 sm:size-20 rounded-xl overflow-hidden shrink-0 border border-black/10 bg-forest/10">
                            <AppImage src={h.image} alt={h.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-extrabold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                                {h.tag}
                              </span>
                              <span className="text-[10px] text-ink/50 flex items-center gap-1 font-semibold">
                                ⭐ {h.rating} ({h.reviews} đánh giá)
                              </span>
                            </div>
                            <h4 className="font-bold text-ink text-sm sm:text-base leading-snug truncate">
                              {h.name}
                            </h4>
                            <p className="text-[11px] text-ink/60 flex items-center gap-1">
                              <MapPin className="size-3 text-clay shrink-0" />
                              <span>{h.village}</span>
                            </p>
                            <p className="text-[11px] text-ink/75 line-clamp-2 leading-relaxed font-normal">
                              {h.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 shrink-0">
                          <div
                            className={cn(
                              "size-6 rounded-full border flex items-center justify-center transition",
                              isSelected
                                ? "border-forest bg-forest text-white shadow"
                                : "border-black/20 bg-white"
                            )}
                          >
                            {isSelected && <Check className="size-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-[11px] font-bold text-forest mt-1">
                            {isSelected ? (isEn ? "Selected" : "Đang chọn") : (isEn ? "Select" : "Bấm để chọn")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-black/15 p-4 text-center text-xs text-ink/60">
                  <p>
                    {isEn
                      ? "Your current itinerary is for 1 day without overnight stay. Check the box above if you wish to reserve a homestay."
                      : "Lịch trình hiện tại của bạn là 1 ngày đi về trong ngày. Hãy tích chọn ô phía trên nếu bạn muốn giữ phòng nghỉ đêm tại homestay."}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Mini Timeline: Destinations in this Route */}
            <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-card border border-black/5 space-y-4">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <h3 className="font-extrabold text-ink text-base flex items-center gap-2">
                  <MapPin className="size-4 text-forest" />
                  <span>Các Điểm Dừng Chân Trong Hành Trình ({allStops.length} điểm)</span>
                </h3>
                <span className="text-[11px] text-ink/50 font-medium">Theo đúng AI Planner</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {allStops.map((stop, idx) => (
                  <div
                    key={`${stop.id}-${idx}`}
                    className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#F8F7F2] p-2.5 hover:bg-beige/40 transition"
                  >
                    <div className="relative size-14 rounded-xl overflow-hidden shrink-0 border border-black/10">
                      <AppImage src={stop.image} alt={stop.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-forest uppercase bg-forest/10 px-2 py-0.5 rounded-full">
                          Ngày {stop.dayNumber} · {stop.timeSlot}
                        </span>
                      </div>
                      <h4 className="font-bold text-ink text-xs truncate mt-0.5">{stop.name}</h4>
                      <p className="text-[11px] text-ink/60 line-clamp-1">{stop.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Breakdown & Guest Info Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pricing Breakdown Card */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-forest/15 space-y-4">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <h3 className="font-extrabold text-ink text-base flex items-center gap-1.5">
                  <Ticket className="size-4 text-forest" />
                  <span>Dự Toán Chi Phí Minh Bạch</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {guestsCount} khách
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Homestay */}
                {numNights > 0 && (
                  <div className="flex items-start justify-between text-ink/80 gap-2">
                    <div className="flex items-start gap-1.5 max-w-[68%]">
                      <Home className="size-3.5 text-clay shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-ink block truncate">{selectedHomestay.name}</span>
                        <span className="text-[10px] text-ink/50">({numNights} đêm x {guestsCount} khách)</span>
                      </div>
                    </div>
                    <span className="font-semibold text-ink shrink-0">{formatCurrency(pricing.totalHomestay)}</span>
                  </div>
                )}

                {/* Ăn uống */}
                <div className="flex items-center justify-between text-ink/80">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="size-3.5 text-amber-600" />
                    Ẩm thực đặc sản ({pricing.numMeals} bữa x {guestsCount} khách):
                  </span>
                  <span className="font-semibold text-ink">{formatCurrency(pricing.totalMeals)}</span>
                </div>

                {/* Trải nghiệm & vé */}
                <div className="flex items-center justify-between text-ink/80">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-forest" />
                    Vé suối thác & trải nghiệm ({guestsCount} khách):
                  </span>
                  <span className="font-semibold text-ink">{formatCurrency(pricing.totalActivities)}</span>
                </div>

                {/* Xe đưa đón */}
                {transportChoice === "car" && (
                  <div className="flex items-center justify-between text-ink/80">
                    <span className="flex items-center gap-1.5">
                      <Car className="size-3.5 text-blue-600" />
                      Xe riêng khứ hồi Huế - A Lưới (trọn gói xe):
                    </span>
                    <span className="font-semibold text-ink">{formatCurrency(pricing.carFee)}</span>
                  </div>
                )}

                {/* Tạm tính & Voucher */}
                <div className="border-t border-dashed border-black/10 pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-ink/60">
                    <span>Tổng chi phí gốc:</span>
                    <span>{formatCurrency(pricing.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-800 font-medium">
                    <span>Ưu đãi đặt qua Chạm A Lưới (-10%):</span>
                    <span>-{formatCurrency(pricing.discount)}</span>
                  </div>
                </div>

                {/* Tổng thanh toán */}
                <div className="rounded-2xl bg-forest/5 border border-forest/15 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-ink/70 block uppercase">
                      Tổng dự kiến trọn gói:
                    </span>
                    <span className="text-[10px] text-ink/50">
                      (~{formatCurrency(pricing.perPersonAvg)} / khách)
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-forest">
                    {formatCurrency(pricing.finalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Guest Info Form Card */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-black/5 space-y-4">
              <h3 className="font-extrabold text-ink text-base flex items-center gap-1.5 border-b border-black/5 pb-3">
                <User className="size-4 text-forest" />
                <span>Thông Tin Người Đặt & Liên Hệ</span>
              </h3>

              {errorMsg && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-ink block mb-1">
                    Họ và tên người đại diện đoàn *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-[#F8F7F2] focus:bg-white focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-bold text-ink block mb-1">
                      Số điện thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0905 000 118"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-[#F8F7F2] focus:bg-white focus:outline-none focus:border-forest font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">
                      Email (Tùy chọn)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-[#F8F7F2] focus:bg-white focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                {transportChoice === "car" && (
                  <div>
                    <label className="font-bold text-ink block mb-1">
                      Địa chỉ đón tại TP. Huế (Khách sạn / Nhà riêng)
                    </label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Vd: Khách sạn Mường Thanh, 38 Lê Lợi, TP. Huế"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-[#F8F7F2] focus:bg-white focus:outline-none focus:border-forest"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-ink block mb-1">
                    Yêu cầu đặc biệt (Ăn chay, trẻ nhỏ, giường ngủ...)
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Ghi chú thêm cho điều phối viên..."
                    className="w-full px-3.5 py-2 rounded-xl border border-black/10 bg-[#F8F7F2] focus:bg-white focus:outline-none focus:border-forest resize-none"
                  />
                </div>
              </div>

              {/* 2 Confirmation Choices */}
              <div className="space-y-2 pt-2 border-t border-black/5">
                <label className="text-xs font-bold text-ink block">
                  Chọn hình thức chốt đơn:
                </label>

                {/* Option 1: Zalo Consult (0đ) */}
                <label
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition text-xs",
                    paymentChoice === "zalo_consult"
                      ? "border-forest bg-forest/5 text-ink ring-2 ring-forest/30 font-semibold"
                      : "border-black/10 bg-white hover:bg-beige/40 text-ink/75"
                  )}
                >
                  <input
                    type="radio"
                    name="paymentChoice"
                    checked={paymentChoice === "zalo_consult"}
                    onChange={() => setPaymentChoice("zalo_consult")}
                    className="mt-0.5 accent-forest size-4"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-forest">Giữ chỗ & Nhận tư vấn qua Zalo (0đ trả trước)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Khuyên dùng
                      </span>
                    </div>
                    <p className="text-[11px] text-ink/60 mt-0.5 font-normal">
                      Hợp tác xã sẽ kiểm tra phòng homestay và nhắn Zalo xác nhận lịch trình cho bạn trong 5 phút.
                    </p>
                  </div>
                </label>

                {/* Option 2: VietQR 30% Deposit */}
                <label
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition text-xs",
                    paymentChoice === "vietqr_deposit"
                      ? "border-forest bg-forest/5 text-ink ring-2 ring-forest/30 font-semibold"
                      : "border-black/10 bg-white hover:bg-beige/40 text-ink/75"
                  )}
                >
                  <input
                    type="radio"
                    name="paymentChoice"
                    checked={paymentChoice === "vietqr_deposit"}
                    onChange={() => setPaymentChoice("vietqr_deposit")}
                    className="mt-0.5 accent-forest size-4"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-ink">Đặt cọc giữ chỗ 30% qua VietQR ({formatCurrency(pricing.depositAmount)})</span>
                    <p className="text-[11px] text-ink/60 mt-0.5 font-normal">
                      Khóa giữ phòng & xe ngay lập tức qua mã QR ngân hàng. Phần còn lại thanh toán khi đến nơi.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={handleConfirmBooking}
                  className="w-full rounded-2xl bg-amber-400 hover:bg-amber-300 font-black text-ink py-4 text-sm shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Đang xử lý đơn đặt...
                    </span>
                  ) : paymentChoice === "vietqr_deposit" ? (
                    <span className="inline-flex items-center gap-2">
                      <QrCode className="size-4" />
                      Xác Nhận & Quét Mã VietQR Cọc 30%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-forest" />
                      Hoàn Tất Đặt Tour (0đ Trả Trước)
                    </span>
                  )}
                </Button>
                <p className="text-[11px] text-center text-ink/50 mt-2">
                  Bằng việc bấm xác nhận, bạn đồng ý với chính sách dịch vụ du lịch cộng đồng Chạm A Lưới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
