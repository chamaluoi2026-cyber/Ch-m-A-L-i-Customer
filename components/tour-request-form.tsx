"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function TourRequestForm({ successHref, tourTitle }: { successHref: string; tourTitle?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      type: "tour",
      customerName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      startDate: formData.get("startDate") as string,
      numberOfPeople: Number(formData.get("guests")) || 2,
      note: formData.get("note") as string,
      itemTitle: tourTitle || "Tour du lịch trọn gói A Lưới"
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.booking) {
        const querySep = successHref.includes("?") ? "&" : "?";
        router.push(`${successHref}${querySep}bookingId=${data.booking.id}`);
      } else {
        setError(data.error || "Không thể gửi yêu cầu đặt tour. Vui lòng thử lại.");
        setSubmitting(false);
      }
    } catch {
      setError("Lỗi kết nối mạng khi gửi yêu cầu.");
      setSubmitting(false);
    }
  };

  return (
    <form className="grid gap-5" onSubmit={submit}>
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
          {error}
        </div>
      )}
      <fieldset className="grid gap-4 md:grid-cols-2">
        <legend className="sr-only">Thông tin đặt tour</legend>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Họ tên<Input required name="name" placeholder="Nhập họ tên" disabled={submitting} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Số điện thoại<Input required name="phone" placeholder="+84..." disabled={submitting} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
          Email<Input required type="email" name="email" placeholder="you@example.com" disabled={submitting} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Ngày khởi hành<Input required type="date" name="startDate" disabled={submitting} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Số lượng khách<Input required type="number" min={1} defaultValue={2} name="guests" disabled={submitting} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
          Yêu cầu thêm<Textarea name="note" placeholder="Nhu cầu ăn uống, người lớn/trẻ em, điểm đón..." disabled={submitting} />
        </label>
      </fieldset>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Đang gửi yêu cầu...
          </>
        ) : (
          "Gửi yêu cầu đặt tour"
        )}
      </Button>
    </form>
  );
}
