"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Phone,
  Camera,
  Upload,
  X,
  MessageCircle,
  ExternalLink,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initiatePaymentAction, verifyPaymentCallbackAction, submitPaymentProofAction } from "@/app/actions/payments";
import { fetchBookingByIdAction } from "@/app/actions/bookings";
import type { BookingRecord, PaymentRecord, PaymentMethodType } from "@/lib/server-store";

export default function PaymentCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("qr");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Payment proof states
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [bankRefCode, setBankRefCode] = useState("");
  const [transactionNote, setTransactionNote] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptUploadedSuccess, setReceiptUploadedSuccess] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Check if id is a booking or payment
      let currentBooking: BookingRecord | null = null;
      let currentPayment: PaymentRecord | null = null;

      const bkRes = await fetchBookingByIdAction(id);
      if (bkRes) {
        currentBooking = bkRes;
      } else {
        const payRes = await fetch(`/api/payments?id=${id}`).then(r => r.json());
        if (payRes.success && payRes.payment) {
          currentPayment = payRes.payment;
          if (currentPayment) {
            const relatedBk = await fetchBookingByIdAction(currentPayment.bookingId);
            if (relatedBk) currentBooking = relatedBk;
          }
        }
      }

      setBooking(currentBooking);

      if (currentBooking) {
        // Khởi tạo payment request
        const initRes = await initiatePaymentAction({
          bookingId: currentBooking.id,
          method: selectedMethod,
          amount: currentBooking.finalAmount,
          customerId: currentBooking.customerId || currentBooking.userId,
          customerName: currentBooking.customerName,
          customerPhone: currentBooking.phone
        });

        if (initRes.success && initRes.payment) {
          setPayment(initRes.payment);
          setPaymentDetails(initRes.details);
        }
      }
    } catch (err) {
      console.error("Error loading payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id, selectedMethod]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setReceiptError("Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setReceiptError("Dung lượng ảnh tối đa là 15MB.");
      return;
    }
    setReceiptError(null);
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptError(null);
  };

  const handleSubmitReceipt = async () => {
    if (!receiptFile && !receiptPreview) {
      setReceiptError("Vui lòng chọn ảnh chụp màn hình / biên lai chuyển khoản.");
      return;
    }
    if (!booking) return;

    setUploadingReceipt(true);
    setReceiptError(null);

    try {
      let uploadedUrl = receiptPreview || "";

      // Upload qua /api/upload
      if (receiptFile) {
        try {
          const formData = new FormData();
          formData.append("file", receiptFile);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.url) {
            uploadedUrl = uploadData.url;
          }
        } catch (uploadErr) {
          console.warn("Upload API error, fallback to base64 preview:", uploadErr);
        }
      }

      // Gọi server action submitPaymentProofAction
      const res = await submitPaymentProofAction({
        bookingId: booking.id,
        paymentId: payment?.id,
        receiptUrl: uploadedUrl,
        bankRefCode: bankRefCode.trim() || undefined,
        transactionNote: transactionNote.trim() || undefined
      });

      if (res.success && res.booking) {
        setBooking(res.booking);
        setReceiptUploadedSuccess(true);
        setTimeout(() => setReceiptUploadedSuccess(false), 6000);
      } else {
        setReceiptError(res.error || "Không thể gửi biên lai. Vui lòng thử lại hoặc gửi qua Zalo.");
      }
    } catch (err: any) {
      setReceiptError(err?.message || "Lỗi khi tải biên lai. Vui lòng thử lại.");
    } finally {
      setUploadingReceipt(false);
    }
  };

  // Giả lập quét mã và xác thực giao dịch
  const handleSimulatePayment = () => {
    if (!payment) return;
    startTransition(async () => {
      const res = await verifyPaymentCallbackAction({
        paymentIdOrCode: payment.id,
        receivedAmount: payment.amount,
        providerTransactionId: `SIM-DEMO-${Date.now()}`,
        callbackId: `cb-${Date.now()}`
      });

      if (res.success && res.payment) {
        setPayment(res.payment);
      }
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-beige/30 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="size-8 animate-spin text-forest mx-auto" />
          <p className="text-sm font-bold text-ink">Đang tạo thông tin thanh toán an toàn...</p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-beige/30 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-forest/10 shadow-card text-center space-y-4 max-w-md">
          <AlertCircle className="size-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-ink">Không tìm thấy thông tin đơn đặt</h2>
          <p className="text-xs text-ink/60">Vui lòng kiểm tra lại đường dẫn hoặc quay về trang tài khoản của bạn.</p>
          <Button asChild className="bg-forest text-white">
            <Link href="/account">Về trang tài khoản</Link>
          </Button>
        </div>
      </main>
    );
  }

  const isPaid = payment?.status === "PAID" || booking.paymentStatus === "paid";

  return (
    <main className="min-h-screen pt-24 pb-20 bg-beige/30">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link href="/account" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/70 hover:text-forest">
            <ArrowLeft className="size-4" /> Quay lại tài khoản
          </Link>
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="size-4" /> Thanh toán được bảo vệ an toàn
          </div>
        </div>

        {isPaid ? (
          /* Payment Success State */
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-card border border-emerald-200 space-y-5 animate-fadeIn">
            <div className="size-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="size-12" />
            </div>
            <h1 className="text-3xl font-black text-ink">Thanh toán thành công!</h1>
            <p className="text-sm text-ink/75 max-w-md mx-auto leading-relaxed">
              Cảm ơn bạn! Giao dịch đã được hệ thống xác thực an toàn. Đơn đặt dịch vụ tại <strong className="text-forest">{booking.itemTitle}</strong> đã được chuyển sang trạng thái <strong>ĐÃ XÁC NHẬN (CONFIRMED)</strong>.
            </p>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-beige/60 border border-forest/10 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-ink/60">Mã đơn đặt:</span>
                <span className="font-mono font-bold text-forest">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Mã giao dịch:</span>
                <span className="font-mono font-bold text-ink">{payment?.paymentCode || payment?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Số tiền thanh toán:</span>
                <span className="font-bold text-ink text-sm">{booking.finalAmount.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Ngày diễn ra trải nghiệm:</span>
                <span className="font-bold text-ink">{booking.experienceDate || booking.startDate || "Linh hoạt"}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="bg-forest text-white hover:bg-forest/90 font-bold px-8">
                <Link href="/account">Xem chi tiết đơn trong Tài khoản</Link>
              </Button>
              <Button asChild variant="outline" className="border-forest/20 text-forest">
                <Link href={booking.itemSlug ? `/places/${booking.itemSlug}` : "/places"}>Xem lại địa điểm</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Processing State */
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Left: Payment Method & Details */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-forest/10 space-y-6">
              <div>
                <h1 className="text-2xl font-black text-ink">Thanh toán trải nghiệm</h1>
                <p className="text-xs text-ink/60 mt-1">
                  Chọn phương thức thuận tiện nhất cho bạn để hoàn tất đặt chỗ tại Chạm A Lưới.
                </p>
              </div>

              {/* Method Selector */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: "qr", label: "VietQR Chuyển nhanh", icon: QrCode, sub: "Quét mã App Ngân hàng" },
                  { key: "bank_transfer", label: "Chuyển khoản", icon: Building2, sub: "STK Ngân hàng" },
                  { key: "cod", label: "Tiền mặt (COD)", icon: CreditCard, sub: "Thanh toán tại điểm" }
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSelectedMethod(m.key as PaymentMethodType)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      selectedMethod === m.key
                        ? "border-forest bg-forest/5 ring-1 ring-forest"
                        : "border-forest/15 hover:border-forest/30"
                    }`}
                  >
                    <m.icon className={`size-5 mb-1.5 ${selectedMethod === m.key ? "text-forest" : "text-ink/50"}`} />
                    <p className="text-xs font-black text-ink">{m.label}</p>
                    <p className="text-[10px] text-ink/50 mt-0.5">{m.sub}</p>
                  </button>
                ))}
              </div>

              {/* QR Code display */}
              {selectedMethod === "qr" && paymentDetails?.qrUrl && (
                <div className="p-6 rounded-3xl bg-beige/40 border border-forest/10 text-center space-y-4">
                  <div className="relative size-60 mx-auto bg-white p-3 rounded-2xl shadow-sm border border-forest/15">
                    <Image
                      src={paymentDetails.qrUrl}
                      alt="VietQR Napas247"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-forest">Quét mã bằng ứng dụng bất kỳ của 40+ Ngân hàng</p>
                    <p className="text-[11px] text-ink/60">Tự động điền số tiền và nội dung chuyển khoản chính xác 100%.</p>
                  </div>
                </div>
              )}

              {/* Bank Account Info */}
              {paymentDetails?.bankAccount && (
                <div className="p-4 rounded-2xl bg-forest/5 border border-forest/10 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-forest/10 pb-2">
                    <span className="text-ink/60">Ngân hàng:</span>
                    <span className="font-bold text-ink">{paymentDetails.bankAccount.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-forest/10 pb-2">
                    <span className="text-ink/60">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5 font-mono font-black text-sm text-forest">
                      <span>{paymentDetails.bankAccount.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(paymentDetails.bankAccount.accountNumber)}
                        className="p-1 text-ink/40 hover:text-forest"
                        title="Sao chép STK"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-forest/10 pb-2">
                    <span className="text-ink/60">Chủ tài khoản:</span>
                    <span className="font-bold text-ink uppercase">{paymentDetails.bankAccount.accountName}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-forest/10 pb-2">
                    <span className="text-ink/60">Số tiền:</span>
                    <span className="font-black text-sm text-ink">{booking.finalAmount.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink/60">Nội dung chuyển khoản (bắt buộc):</span>
                    <div className="flex items-center gap-1.5 font-mono font-black text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg">
                      <span>{payment?.paymentCode}</span>
                      <button
                        onClick={() => handleCopy(payment?.paymentCode || "")}
                        className="p-0.5 text-rose-600 hover:text-rose-900"
                        title="Sao chép nội dung"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* COD description */}
              {selectedMethod === "cod" && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <Clock className="size-4 text-amber-600" />
                    Thanh toán tiền mặt trực tiếp tại cơ sở
                  </p>
                  <p className="text-[11px] leading-relaxed opacity-85">
                    Đơn đặt của bạn sẽ được giữ chỗ. Vui lòng thanh toán trực tiếp cho nhân viên phụ trách tại địa điểm trước khi bắt đầu hoạt động trải nghiệm.
                  </p>
                </div>
              )}

              {/* PHẦN TẢI LÊN HÌNH ẢNH BIÊN LAI CHUYỂN KHOẢN */}
              {(selectedMethod === "qr" || selectedMethod === "bank_transfer") && (
                <div className="rounded-2xl border-2 border-dashed border-forest/25 bg-forest/5 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-ink flex items-center gap-2">
                        <Camera className="size-4 text-forest" />
                        Cung cấp hình ảnh / Biên lai đã chuyển khoản
                      </h3>
                      <p className="text-xs text-ink/65 mt-0.5 leading-relaxed">
                        Sau khi chuyển khoản qua App Ngân hàng thành công, vui lòng tải ảnh chụp màn hình giao dịch lên đây để hệ thống đối soát và xuất vé điện tử ngay cho bạn.
                      </p>
                    </div>
                    {booking.paymentReceiptUrl && (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1">
                        <CheckCircle2 className="size-3" /> Đã có biên lai
                      </span>
                    )}
                  </div>

                  {/* ---- THÔNG TIN CHUYỂN KHOẢN: Luôn hiển thị để khách không phải cuộn lên ---- */}
                  {paymentDetails?.bankAccount && (
                    <div className="rounded-xl bg-white border border-forest/20 p-4 space-y-2 text-xs">
                      <p className="text-[11px] font-extrabold text-forest uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Building2 className="size-3.5" /> Thông tin chuyển khoản
                      </p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                        <div className="flex justify-between items-center border-b border-forest/10 pb-1.5">
                          <span className="text-ink/60">Ngân hàng:</span>
                          <span className="font-bold text-ink">{paymentDetails.bankAccount.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-forest/10 pb-1.5">
                          <span className="text-ink/60">Số tài khoản:</span>
                          <div className="flex items-center gap-1 font-mono font-black text-sm text-forest">
                            <span>{paymentDetails.bankAccount.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(paymentDetails.bankAccount.accountNumber)}
                              className="p-0.5 text-ink/40 hover:text-forest transition"
                              title="Sao chép STK"
                            >
                              <Copy className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-b border-forest/10 pb-1.5">
                          <span className="text-ink/60">Chủ tài khoản:</span>
                          <span className="font-bold text-ink uppercase">{paymentDetails.bankAccount.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-forest/10 pb-1.5">
                          <span className="text-ink/60">Số tiền:</span>
                          <span className="font-black text-sm text-ink">{booking.finalAmount.toLocaleString("vi-VN")} đ</span>
                        </div>
                        <div className="sm:col-span-2 flex justify-between items-center pt-0.5">
                          <span className="text-ink/60 shrink-0 mr-2">Nội dung CK <span className="text-rose-600 font-bold">(bắt buộc)</span>:</span>
                          <div className="flex items-center gap-1.5 font-mono font-black text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                            <span>{payment?.paymentCode}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(payment?.paymentCode || "")}
                              className="p-0.5 text-rose-500 hover:text-rose-900 transition"
                              title="Sao chép nội dung"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {copied && (
                        <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                          <CheckCircle2 className="size-3.5" /> Đã sao chép!
                        </p>
                      )}
                    </div>
                  )}
                  {booking.paymentReceiptUrl && !receiptPreview && (
                    <div className="rounded-xl bg-white border border-forest/10 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-forest">Ảnh biên lai đã gửi:</span>
                        <a
                          href={booking.paymentReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          Xem ảnh gốc ↗
                        </a>
                      </div>
                      <div className="relative h-48 w-full rounded-lg overflow-hidden bg-black/5 border">
                        <Image
                          src={booking.paymentReceiptUrl}
                          alt="Biên lai chuyển khoản"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        ✓ Biên lai của bạn đã được ghi nhận. Điều phối viên đang đối soát với tài khoản ngân hàng và sẽ duyệt đơn trong ít phút.
                      </p>
                    </div>
                  )}

                  {/* Form chọn ảnh mới */}
                  <div className="space-y-3">
                    {receiptPreview ? (
                      <div className="relative rounded-xl border border-forest/20 bg-white p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">Ảnh bạn đã chọn:</span>
                          <button
                            type="button"
                            onClick={handleClearReceipt}
                            className="text-xs text-rose-600 hover:text-rose-800 font-bold inline-flex items-center gap-1"
                          >
                            <X className="size-3.5" /> Chọn ảnh khác
                          </button>
                        </div>
                        <div className="relative h-52 w-full rounded-lg overflow-hidden bg-black/5">
                          <Image
                            src={receiptPreview}
                            alt="Ảnh xem trước"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-forest/30 bg-white hover:bg-forest/5 p-6 cursor-pointer transition">
                        <div className="size-10 rounded-full bg-forest/10 text-forest flex items-center justify-center">
                          <Upload className="size-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-forest">
                            Bấm vào đây để chọn ảnh hoặc chụp màn hình chuyển khoản
                          </p>
                          <p className="text-[10px] text-ink/50 mt-0.5">
                            Hỗ trợ JPG, PNG, WEBP (Dung lượng tối đa 15MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptFileChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Mã giao dịch ngân hàng tùy chọn */}
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-ink/70 mb-1">
                          Mã giao dịch ngân hàng (Mã GD / Mã FT - không bắt buộc):
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: FT2609198888..."
                          value={bankRefCode}
                          onChange={(e) => setBankRefCode(e.target.value)}
                          className="w-full rounded-xl border border-forest/20 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:ring-1 focus:ring-forest"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-ink/70 mb-1">
                          Ghi chú thêm (không bắt buộc):
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Đã chuyển khoản cọc..."
                          value={transactionNote}
                          onChange={(e) => setTransactionNote(e.target.value)}
                          className="w-full rounded-xl border border-forest/20 bg-white px-3 py-2 text-xs text-ink focus:border-forest focus:ring-1 focus:ring-forest"
                        />
                      </div>
                    </div>

                    {receiptError && (
                      <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="size-3.5" /> {receiptError}
                      </p>
                    )}

                    {receiptUploadedSuccess && (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 font-bold flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        <span>Biên lai chuyển khoản đã được gửi thành công! Ban điều phối sẽ duyệt đơn và gửi vé điện tử ngay.</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={handleSubmitReceipt}
                        disabled={uploadingReceipt || (!receiptFile && !receiptPreview)}
                        className="w-full sm:w-auto bg-forest hover:bg-forest/90 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm"
                      >
                        {uploadingReceipt ? (
                          <>
                            <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
                            Đang tải biên lai lên...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-3.5 mr-1.5" />
                            Gửi biên lai & Xác nhận đã chuyển tiền
                          </>
                        )}
                      </Button>

                      <a
                        href={`https://zalo.me/0905000118?text=${encodeURIComponent(
                          `Chào Chạm A Lưới, tôi vừa chuyển khoản cho đơn hàng ${booking.id} (${booking.customerName} - SĐT: ${booking.phone}). Tôi gửi ảnh biên lai qua Zalo này để bên mình đối soát duyệt giúp tôi nhé!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 text-xs font-bold transition"
                      >
                        <MessageCircle className="size-3.5" />
                        <span>Hoặc gửi ảnh bill qua Zalo</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* COD confirmation action */}
              {selectedMethod === "cod" && (
                <div className="pt-2 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-ink/50 flex items-center gap-1">
                    <Clock className="size-3.5" /> Trạng thái: <strong>{payment?.status || "PENDING"}</strong>
                  </span>

                  <Button
                    onClick={handleSimulatePayment}
                    disabled={isPending}
                    className="bg-forest hover:bg-forest/90 text-white font-bold text-xs"
                  >
                    <Sparkles className="size-3.5 mr-1.5" />
                    Xác nhận giữ chỗ (Thanh toán tại điểm)
                  </Button>
                </div>
              )}
            </div>

            {/* Right: Booking Summary Sidebar */}
            <aside className="bg-white rounded-3xl p-6 shadow-card border border-forest/10 space-y-4 h-fit sticky top-24">
              <p className="text-xs font-bold uppercase tracking-wider text-clay">Thông tin đơn đặt</p>
              <div>
                <h3 className="font-extrabold text-base text-ink">{booking.itemTitle}</h3>
                <p className="text-xs text-ink/60 mt-0.5">{booking.businessName || "Chạm A Lưới"}</p>
              </div>

              <div className="pt-3 border-t border-forest/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink/60">Khách hàng:</span>
                  <span className="font-bold text-ink">{booking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Số điện thoại:</span>
                  <span className="font-bold text-ink">{booking.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Ngày đi:</span>
                  <span className="font-bold text-ink">{booking.experienceDate || booking.startDate || "Linh hoạt"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Số lượng:</span>
                  <span className="font-bold text-ink">{booking.numberOfPeople || booking.quantity || 1} người</span>
                </div>
              </div>

              <div className="pt-3 border-t border-forest/10 space-y-1.5">
                <div className="flex justify-between text-xs text-ink/70">
                  <span>Tạm tính:</span>
                  <span>{(booking.subtotal || booking.unitPrice * (booking.numberOfPeople || 1)).toLocaleString("vi-VN")} đ</span>
                </div>
                {booking.discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                    <span>Ưu đãi voucher:</span>
                    <span>-{booking.discount.toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-forest/10">
                  <span className="font-extrabold text-sm text-ink">Tổng thanh toán:</span>
                  <span className="font-black text-xl text-forest">{booking.finalAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
