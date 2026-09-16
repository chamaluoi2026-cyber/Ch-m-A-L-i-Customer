"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface SelfGuidedRequestFormProps {
  homestayName?: string;
  homestayId?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  estimatedPrice?: number;
  experienceNames?: string[];
}

export function SelfGuidedRequestForm({
  homestayName,
  homestayId,
  checkin,
  checkout,
  guests,
  estimatedPrice,
  experienceNames
}: SelfGuidedRequestFormProps = {}) {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const itemTitle = homestayName
      ? `Homestay ${homestayName} (Tự túc)`
      : "Du lịch tự túc / Homestay A Lưới";
    const dateRange = checkin
      ? checkout
        ? `${checkin} đến ${checkout}`
        : checkin
      : undefined;

    const payload = {
      type: "homestay",
      customerName: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      note: String(formData.get("note") || "").trim(),
      itemTitle,
      businessName: homestayName ? `Homestay ${homestayName}` : "Đối tác du lịch A Lưới",
      itemId: homestayId,
      experienceDate: dateRange,
      numberOfPeople: guests || 1,
      quantity: guests || 1,
      unitPrice: estimatedPrice || 0,
      subtotal: estimatedPrice || 0,
      finalAmount: estimatedPrice || 0,
      paymentStatus: "unpaid",
      paymentMethod: "cod",
      bookingStatus: "pending"
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.booking) {
        try {
          const list = JSON.parse(localStorage.getItem("cal_my_bookings") || "[]");
          if (!list.includes(data.booking.id)) {
            list.unshift(data.booking.id);
            localStorage.setItem("cal_my_bookings", JSON.stringify(list));
          }
        } catch {}

        setBookingId(data.booking.id);
        setDone(true);
      } else {
        setError(data.error || "Không thể gửi yêu cầu.");
      }
    } catch {
      setError("Lỗi kết nối khi gửi yêu cầu. Vui lòng kiểm tra lại mạng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} className="grid gap-5">
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
            {error}
          </div>
        )}
        <fieldset className="grid gap-4 md:grid-cols-2">
          <legend className="sr-only">Thông tin khách tự túc</legend>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Họ tên<Input required name="name" placeholder="Nhập họ tên" disabled={submitting} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Điện thoại<Input required name="phone" placeholder="+84..." disabled={submitting} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
            Email<Input required type="email" name="email" placeholder="you@example.com" disabled={submitting} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
            Ghi chú<Textarea name="note" placeholder="Thời gian đến, nhu cầu ăn uống, trải nghiệm muốn ưu tiên..." disabled={submitting} />
          </label>
        </fieldset>
        <Button type="submit" size="lg" className="bg-clay hover:bg-brown" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Đang gửi yêu cầu...
            </>
          ) : (
            "Gửi yêu cầu"
          )}
        </Button>
      </form>

      {done ? (
        <section role="dialog" aria-modal="true" className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <article className="max-w-md w-full rounded-3xl bg-white p-6 md:p-8 text-center shadow-2xl border border-black/5">
            <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto shadow-inner">
              <CheckCircle2 className="size-9" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-ink">Gửi yêu cầu thành công!</h2>
            {bookingId && (
              <div className="mt-3 inline-block rounded-full bg-forest/10 px-4 py-1.5 font-mono text-sm font-black text-forest">
                Mã đơn: {bookingId}
              </div>
            )}

            <div className="mt-4 rounded-2xl bg-stone-50 border border-black/5 p-4 text-left text-xs space-y-1.5 text-stone-700">
              <p><span className="font-semibold text-ink">Dịch vụ:</span> {homestayName ? `Homestay ${homestayName}` : "Du lịch tự túc"}</p>
              {checkin && <p><span className="font-semibold text-ink">Thời gian:</span> {checkin} {checkout ? `đến ${checkout}` : ""}</p>}
              {guests ? <p><span className="font-semibold text-ink">Số khách:</span> {guests} người</p> : null}
              {estimatedPrice && estimatedPrice > 0 ? (
                <p><span className="font-semibold text-ink">Dự kiến chi phí:</span> <span className="font-bold text-forest">{estimatedPrice.toLocaleString("vi-VN")} đ</span></p>
              ) : null}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-ink/65">
              Hệ thống đã chuyển thông tin đến homestay và quản trị viên. Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ để xác nhận lịch trình.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/account"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-2xl bg-forest px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-forest/90 transition"
              >
                <User className="size-4" /> Xem trong Tài khoản
              </Link>
              <Button
                variant="outline"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-2xl border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold py-3"
                onClick={() => {
                  setDone(false);
                  window.location.href = "/";
                }}
              >
                <Home className="size-4" /> Về trang chủ
              </Button>
            </div>
          </article>
        </section>
      ) : null}
    </>
  );
}
