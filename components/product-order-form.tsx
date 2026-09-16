"use client";

import { useState } from "react";
import { CheckCircle2, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProductOrderForm({ productName, unitPrice }: { productName: string; unitPrice?: number }) {
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const qty = Number(formData.get("quantity")) || 1;
    const price = unitPrice || 0;
    const payload = {
      type: "product",
      customerName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      quantity: qty,
      deliveryAddress: formData.get("address") as string,
      note: formData.get("note") as string,
      itemTitle: productName,
      unitPrice: price,
      finalAmount: price > 0 ? price * qty : 0
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

        setOrderId(data.booking.id);
        setOrdered(true);
      } else {
        setError(data.error || "Không thể đặt hàng. Vui lòng thử lại.");
      }
    } catch {
      setError("Lỗi kết nối khi gửi đơn đặt hàng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form id="dat-hang" className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
            {error}
          </div>
        )}
        <fieldset className="grid gap-4">
          <legend className="sr-only">Thông tin đặt hàng</legend>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Họ và tên<Input required name="name" placeholder="Nhập họ và tên" disabled={submitting} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Số điện thoại<Input required name="phone" placeholder="+84..." disabled={submitting} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Số lượng<Input required type="number" min={1} defaultValue={1} name="quantity" disabled={submitting} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Địa chỉ nhận hàng<Input required name="address" placeholder="Số nhà, phường/xã, tỉnh/thành" disabled={submitting} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Ghi chú<Textarea name="note" placeholder="Màu sắc, gói quà, thời gian liên hệ..." disabled={submitting} />
          </label>
        </fieldset>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Đang gửi yêu cầu...
            </>
          ) : (
            <>
              <ShoppingBag className="size-5" aria-hidden="true" />
              Gửi yêu cầu đặt hàng
            </>
          )}
        </Button>
      </form>
      {ordered ? (
        <section role="dialog" aria-modal="true" className="fixed inset-0 z-[80] grid place-items-center bg-ink/55 px-5 backdrop-blur-sm">
          <article className="max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto size-14 text-forest" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-ink">Đã nhận yêu cầu đặt hàng</h2>
            {orderId && (
              <p className="mt-2 text-sm font-bold text-forest">Mã đơn hàng: {orderId}</p>
            )}
            <p className="mt-3 text-sm leading-7 text-ink/65">
              Cảm ơn bạn đã quan tâm {productName}. Chạm A Lưới sẽ liên hệ xác nhận đơn trong vòng 24 giờ.
            </p>
            <Button className="mt-6" onClick={() => setOrdered(false)}>Đóng</Button>
          </article>
        </section>
      ) : null}
    </>
  );
}
