"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SelfGuidedRequestForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      type: "homestay",
      customerName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      note: formData.get("note") as string,
      itemTitle: "Du lịch tự túc / Homestay A Lưới"
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
      setError("Lỗi kết nối khi gửi yêu cầu.");
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
        <section role="dialog" aria-modal="true" className="fixed inset-0 z-[80] grid place-items-center bg-ink/55 px-5 backdrop-blur-sm">
          <article className="max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto size-14 text-clay" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-ink">Đã gửi yêu cầu tự túc thành công</h2>
            {bookingId && (
              <p className="mt-2 text-sm font-bold text-forest">Mã đơn đặt: {bookingId}</p>
            )}
            <p className="mt-3 text-sm leading-7 text-ink/65">Homestay hoặc người phụ trách dịch vụ địa phương sẽ liên hệ lại trong vòng 24 giờ.</p>
            <Button className="mt-6 bg-clay hover:bg-brown" onClick={() => setDone(false)}>Đóng</Button>
          </article>
        </section>
      ) : null}
    </>
  );
}
