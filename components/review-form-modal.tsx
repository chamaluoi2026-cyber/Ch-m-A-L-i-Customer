"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { Star, UploadCloud, X, AlertCircle, CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReviewAction } from "@/app/actions/reviews";

interface ReviewFormModalProps {
  bookingId: string;
  placeName: string;
  placeSlug: string;
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewFormModal({
  bookingId,
  placeName,
  placeSlug,
  customerName = "",
  customerPhone = "",
  customerId = "",
  isOpen,
  onClose,
  onSuccess
}: ReviewFormModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(customerName);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setErrorMessage("Chỉ có thể tải lên tối đa 5 hình ảnh cho mỗi đánh giá.");
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate size (< 15MB)
        if (file.size > 15 * 1024 * 1024) {
          setErrorMessage(`File ${file.name} vượt quá dung lượng cho phép (15MB).`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        if (data.success && data.url) {
          setImages((prev) => [...prev, data.url]);
        } else {
          setErrorMessage(data.error || "Lỗi tải ảnh lên.");
        }
      }
    } catch (err: any) {
      setErrorMessage("Không thể kết nối đến máy chủ tải ảnh.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!content.trim() || content.trim().length < 5) {
      setErrorMessage("Vui lòng chia sẻ cảm nhận của bạn (tối thiểu 5 ký tự).");
      return;
    }

    startTransition(async () => {
      const res = await submitReviewAction({
        bookingId,
        customerId,
        authorName: authorName.trim() || "Du khách Chạm A Lưới",
        authorPhone: customerPhone,
        rating,
        title: title.trim() || `Trải nghiệm tại ${placeName}`,
        content: content.trim(),
        images
      });

      if (res.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || "Không thể gửi đánh giá.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute right-5 top-5 text-ink/40 hover:text-ink text-lg font-bold p-1 rounded-full hover:bg-forest/5"
        >
          <X className="size-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="text-2xl font-black text-ink">Cảm ơn bạn đã đánh giá!</h3>
            <p className="text-sm text-ink/70 leading-relaxed max-w-sm mx-auto">
              Ý kiến đóng góp chân thực của bạn là nguồn động lực vô giá giúp cộng đồng bản địa A Lưới ngày càng hoàn thiện dịch vụ.
            </p>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              Đánh giá của bạn đang được Ban Quản Trị kiểm duyệt và sẽ xuất hiện công khai trên trang địa điểm trong ít phút.
            </div>
            <Button onClick={onClose} className="bg-forest text-white hover:bg-forest/90 font-bold px-8 mt-4">
              Đóng
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Đánh giá từ khách đã trải nghiệm</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-ink">Đánh giá trải nghiệm của bạn</h3>
              <p className="text-xs text-ink/60 mt-0.5">
                Địa điểm: <strong className="text-forest">{placeName}</strong> • Đơn: <span className="font-mono font-bold text-ink">{bookingId}</span>
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Star Rating Selection */}
            <div className="p-4 rounded-2xl bg-beige/60 border border-forest/10 text-center space-y-2">
              <label className="text-xs font-bold text-ink block uppercase tracking-wider">
                Mức độ hài lòng chung
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const active = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      type="button"
                      key={starVal}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`size-8 ${
                          active ? "fill-amber-400 text-amber-400" : "text-gray-300 stroke-[1.5]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-forest">
                {rating === 5 && "Xuất sắc! Rất đáng trải nghiệm"}
                {rating === 4 && "Rất tốt! Hài lòng với dịch vụ"}
                {rating === 3 && "Bình thường! Đúng như mong đợi"}
                {rating === 2 && "Chưa hài lòng! Cần cải thiện"}
                {rating === 1 && "Không hài lòng"}
              </p>
            </div>

            {/* Author Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">Họ tên hiển thị:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Nhập tên bạn muốn hiển thị"
                className="w-full text-xs p-3 rounded-xl border border-forest/20 focus:outline-none focus:border-forest"
              />
            </div>

            {/* Review Content */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">
                Điều gì khiến bạn hài lòng hoặc muốn góp ý? <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ về cảnh quan, ẩm thực, sự hiếu khách của người dân địa phương..."
                className="w-full text-xs p-3 rounded-xl border border-forest/20 focus:outline-none focus:border-forest leading-relaxed"
              />
              <p className="text-[10px] text-ink/40 text-right">{content.length}/2000 ký tự</p>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-ink">Thêm ảnh chuyến đi thực tế:</label>
                <span className="text-[11px] text-ink/50">{images.length}/5 ảnh</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {images.map((img, idx) => (
                  <div key={idx} className="relative size-16 rounded-xl overflow-hidden border border-forest/20 group">
                    <Image src={img} alt="review upload" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-90 hover:opacity-100"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="size-16 rounded-xl border-2 border-dashed border-forest/30 flex flex-col items-center justify-center text-forest/70 hover:border-forest hover:text-forest transition bg-forest/5"
                  >
                    {uploading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <>
                        <UploadCloud className="size-5" />
                        <span className="text-[9px] font-bold mt-0.5">+ Ảnh</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-[10px] text-ink/40">Hỗ trợ JPG, PNG, WebP (Tối đa 15MB/ảnh).</p>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="text-xs text-ink/60">
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isPending || uploading}
                className="bg-forest text-white hover:bg-forest/90 font-bold text-xs px-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    Đang gửi đánh giá...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-1.5" />
                    Gửi đánh giá trải nghiệm
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
