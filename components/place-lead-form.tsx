"use client";

import {
  CalendarDays,
  Check,
  Clock,
  Copy,
  DollarSign,
  Gift,
  Lock,
  MessageCircle,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Users
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { Place } from "@/data/places";
import { submitLeadAction } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LeadResult = {
  leadId: string;
  voucherCode: string;
  discountOffer: string;
  expiresAt: string;
  placeName: string;
};

export function PlaceLeadForm({ place }: { place: Place }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zalo, setZalo] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("buoi-sang");
  const [guests, setGuests] = useState(2);
  const [serviceOrTour, setServiceOrTour] = useState("");
  const [budget, setBudget] = useState("");
  const [need, setNeed] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadResult | null>(null);

  // Tracking UTM & referrer
  const [trackingInfo, setTrackingInfo] = useState<{
    landingPage: string;
    source: "WEBSITE" | "FACEBOOK" | "TIKTOK" | "ZALO" | "DIRECT" | "OTHER";
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }>({
    landingPage: "",
    source: "WEBSITE"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const utm_source = url.searchParams.get("utm_source") || "";
      const utm_medium = url.searchParams.get("utm_medium") || "";
      const utm_campaign = url.searchParams.get("utm_campaign") || "";

      let resolvedSource: "WEBSITE" | "FACEBOOK" | "TIKTOK" | "ZALO" | "DIRECT" | "OTHER" = "WEBSITE";
      const srcUpper = utm_source.toUpperCase();
      if (srcUpper.includes("FB") || srcUpper.includes("FACEBOOK")) resolvedSource = "FACEBOOK";
      else if (srcUpper.includes("TIKTOK")) resolvedSource = "TIKTOK";
      else if (srcUpper.includes("ZALO")) resolvedSource = "ZALO";
      else if (srcUpper.includes("DIRECT")) resolvedSource = "DIRECT";

      setTrackingInfo({
        landingPage: window.location.pathname,
        source: resolvedSource,
        utmSource: utm_source || undefined,
        utmMedium: utm_medium || undefined,
        utmCampaign: utm_campaign || undefined
      });
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setError("Vui lòng đồng ý để Chạm A Lưới lưu trữ thông tin và kết nối với cơ sở dịch vụ.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeSlug: place.slug,
          placeName: place.name,
          businessName: place.businessName,
          businessId: place.businessId,
          customerName,
          phone,
          email: email.trim() || undefined,
          zalo: zalo.trim() || phone,
          expectedDate,
          preferredTime,
          guests,
          serviceOrTour: serviceOrTour.trim() || undefined,
          budget: budget.trim() || undefined,
          need: need.trim() || "Cần tư vấn chi tiết dịch vụ tại điểm đến",
          consent,
          source: trackingInfo.source,
          landingPage: trackingInfo.landingPage,
          utmSource: trackingInfo.utmSource,
          utmMedium: trackingInfo.utmMedium,
          utmCampaign: trackingInfo.utmCampaign
        })
      });

      const res = await response.json();
      setSubmitting(false);

      if (res.success && res.leadId && res.voucherCode) {
        try {
          const list = JSON.parse(localStorage.getItem("cal_my_vouchers") || "[]");
          if (!list.includes(res.voucherCode)) {
            list.unshift(res.voucherCode);
            localStorage.setItem("cal_my_vouchers", JSON.stringify(list));
          }
        } catch {}

        setResult({
          leadId: res.leadId,
          voucherCode: res.voucherCode,
          discountOffer: res.discountOffer || place.voucherOffer,
          expiresAt: res.expiresAt || "30 ngày",
          placeName: res.placeName || place.name
        });
      } else {
        setError(res.error || "Không thể gửi thông tin. Vui lòng thử lại.");
      }
    } catch (err) {
      setSubmitting(false);
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const zaloChatUrl = result
    ? `${place.zaloUrl}?text=${encodeURIComponent(
        `Xin chào ${place.businessName}, tôi là ${customerName} (SĐT: ${phone}), có mã Voucher [${result.voucherCode}] và Lead ID [${result.leadId}] từ Chạm A Lưới. Tôi dự kiến đến vào ngày ${expectedDate} (${guests} người) và muốn được tư vấn: ${need || "các dịch vụ tại cơ sở"}.`
      )}`
    : "#";

  if (result) {
    return (
      <section id="nhan-voucher" className="rounded-3xl bg-white p-6 shadow-card md:p-8 border-2 border-forest/20">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-emerald-700 text-white shadow-md">
            <Sparkles className="size-6" aria-hidden="true" />
          </span>
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
              Đã tạo Lead thành công
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">Mã Voucher Ưu Đãi Của Bạn</h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-forest/5 via-beige to-clay/5 p-6 border-2 border-dashed border-forest/30 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-forest font-bold">Mã xác nhận ưu đãi</p>
          <p className="mt-2 font-mono text-3xl md:text-4xl font-black tracking-widest text-forest select-all">
            {result.voucherCode}
          </p>
          <p className="mt-2 text-xs font-bold text-clay uppercase tracking-wider">
            Mã Lead hệ thống: {result.leadId}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-forest/40 hover:bg-forest/5 font-semibold"
            >
              {copied ? (
                <>
                  <Check className="size-4 mr-1.5 text-forest" /> Đã sao chép mã
                </>
              ) : (
                <>
                  <Copy className="size-4 mr-1.5" /> Sao chép mã
                </>
              )}
            </Button>
          </div>

          <div className="mt-5 border-t border-black/5 pt-4 text-xs text-ink/75 space-y-1 text-left">
            <p className="font-semibold text-ink flex items-center gap-1.5">
              <TicketCheck className="size-4 text-forest" /> Quyền lợi: {result.discountOffer}
            </p>
            <p className="text-ink/60">Áp dụng tại: <strong>{result.placeName}</strong></p>
            <p className="text-ink/60">Hạn sử dụng: <strong>{result.expiresAt}</strong></p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {/* Thông báo tiếp nhận */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center text-xs text-emerald-900 font-bold">
            ✓ Thông tin đã được tiếp nhận thành công!
          </div>

          {/* Nút Chat Zalo chuẩn tracking */}
          <Button asChild size="lg" className="w-full bg-[#0068FF] hover:bg-[#0054cc] text-white font-bold shadow-md text-sm md:text-base">
            <a href={zaloChatUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="size-5 mr-2" aria-hidden="true" />
              Chat với đơn vị trên Zalo
            </a>
          </Button>

          {/* Zalo Fallback: Không để khách rơi vào dead-end */}
          <div className="rounded-2xl bg-beige/80 p-3.5 border border-forest/10 space-y-2 text-xs">
            <p className="font-bold text-ink/70 text-center">
              Nếu Zalo không khả dụng hoặc chưa phản hồi ngay:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" variant="outline" className="border-forest text-forest hover:bg-forest/5 font-bold">
                <a href={`tel:${place.phone.replace(/[^0-9]/g, "")}`}>
                  <Phone className="size-3.5 mr-1 text-forest" />
                  ☎ Gọi hotline
                </a>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-forest text-forest hover:bg-forest/5 font-bold">
                <a href={`sms:${place.phone.replace(/[^0-9]/g, "")}?body=${encodeURIComponent("Tôi là " + customerName + " (Lead: " + result.leadId + ", Voucher: " + result.voucherCode + "). Cần tư vấn dịch vụ tại " + result.placeName)}`}>
                  <MessageSquare className="size-3.5 mr-1 text-forest" />
                  💬 Nhắn tin SMS
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="nhan-voucher" className="rounded-3xl bg-white p-6 shadow-card md:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-clay text-white shadow-md">
          <Gift className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">Ưu đãi độc quyền</p>
          <h2 className="text-2xl font-extrabold text-ink">Nhận voucher & Đặt trải nghiệm</h2>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs leading-6 text-amber-900">
        <p className="font-bold flex items-center gap-1.5">
          <Lock className="size-3.5 text-amber-700" /> Hệ thống sẽ kết nối trực tiếp với cơ sở bản địa:
        </p>
        <p className="mt-0.5 text-amber-800/90">
          Website sẽ cấp cho bạn một <strong>Mã Voucher</strong> và <strong>Lead ID</strong> để <em>{place.businessName}</em> ưu tiên tư vấn & giữ chỗ cho bạn.
        </p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm font-bold text-ink">
          Họ và tên của bạn <span className="text-red-500">*</span>
          <Input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Ví dụ: Nguyễn Văn An"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            Số điện thoại / Zalo <span className="text-red-500">*</span>
            <Input
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                if (!zalo) setZalo(event.target.value);
              }}
              placeholder="09xx xxx xxx"
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-bold text-ink">
            Email nhận xác nhận <span className="text-xs text-ink/40 font-normal">(không bắt buộc)</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ban@gmail.com"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-clay" />
              Ngày dự kiến <span className="text-red-500">*</span>
            </span>
            <Input
              type="date"
              value={expectedDate}
              onChange={(event) => setExpectedDate(event.target.value)}
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-clay" />
              Khung giờ
            </span>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full rounded-2xl border border-input bg-white px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="buoi-sang">Buổi sáng (07:00 - 11:30)</option>
              <option value="buoi-trua">Buổi trưa (11:30 - 14:00)</option>
              <option value="buoi-chieu">Buổi chiều (14:00 - 18:00)</option>
              <option value="buoi-toi">Buổi tối (18:00 - 21:00)</option>
              <option value="ca-ngay">Trọn cả ngày</option>
            </select>
          </label>

          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-clay" />
              Số lượng khách <span className="text-red-500">*</span>
            </span>
            <Input
              type="number"
              min={1}
              value={guests}
              onChange={(event) => setGuests(Math.max(1, Number(event.target.value) || 1))}
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-ink">
            Dịch vụ / Tour quan tâm
            <Input
              value={serviceOrTour}
              onChange={(e) => setServiceOrTour(e.target.value)}
              placeholder="VD: Thuê lều trại ven thác, Ăn mâm cơm Pa Cô..."
            />
          </label>

          <label className="grid gap-1.5 text-sm font-bold text-ink">
            <span className="flex items-center gap-1.5">
              <DollarSign className="size-4 text-clay" />
              Dự trù ngân sách (nếu có)
            </span>
            <Input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="VD: 500.000đ - 1.500.000đ/người"
            />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm font-bold text-ink">
          Nhu cầu & Ghi chú thêm
          <Textarea
            value={need}
            onChange={(event) => setNeed(event.target.value)}
            placeholder="Ví dụ: Có người cao tuổi/trẻ em, muốn ăn chay hoặc có dị ứng thực phẩm, cần hướng dẫn viên bản địa..."
            rows={3}
          />
        </label>

        <label className="flex items-start gap-2.5 text-xs text-ink/75 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 rounded border-forest text-forest focus:ring-forest size-4"
          />
          <span>
            Tôi đồng ý cho Chạm A Lưới lưu thông tin để chuyển đến <strong>{place.businessName}</strong> nhằm mục đích hỗ trợ tư vấn và áp dụng voucher ưu đãi.
          </span>
        </label>

        {error ? (
          <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
            {error}
          </div>
        ) : null}

        <Button type="submit" size="lg" disabled={submitting} className="w-full text-base font-bold">
          {submitting ? "Đang tạo mã voucher & Lead..." : "Nhận voucher & Đặt trải nghiệm"}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50">
          <ShieldCheck className="size-4 text-forest" />
          Bảo mật thông tin • Cam kết không làm phiền du khách
        </p>
      </form>
    </section>
  );
}
