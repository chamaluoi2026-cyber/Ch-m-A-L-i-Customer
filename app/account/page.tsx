"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  ShoppingBag,
  Sparkles,
  TicketCheck,
  User,
  Users
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser, type AuthUser } from "@/lib/supabase/browser";
import { fetchAllLeadsAction } from "@/app/actions/leads";
import { fetchAllBookingsAction, fetchCustomerBookingsAction } from "@/app/actions/bookings";
import { fetchReviewByBookingIdAction } from "@/app/actions/reviews";
import { ReviewFormModal } from "@/components/review-form-modal";
import type { LeadRecord } from "@/lib/leads";
import type { BookingRecord, ReviewRecord } from "@/lib/server-store";

type TabKey = "vouchers" | "leads" | "bookings" | "favorites";

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("vouchers");
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingReviews, setBookingReviews] = useState<Record<string, ReviewRecord | null>>({});
  const [reviewingBooking, setReviewingBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser?.id) {
        fetchCustomerBookingsAction(currentUser.id).then((bks) => {
          setBookings(bks as BookingRecord[]);
          bks.forEach((b) => {
            if (b.id) {
              fetchReviewByBookingIdAction(b.id).then((rev) => {
                setBookingReviews((prev) => ({ ...prev, [b.id!]: rev }));
              });
            }
          });
        });
      } else {
        // Khách vãng lai: Chỉ tải đơn từ lịch sử thiết bị (localStorage) để bảo mật thông tin du khách
        try {
          const localBookingIds = JSON.parse(localStorage.getItem("cal_my_bookings") || "[]");
          if (Array.isArray(localBookingIds) && localBookingIds.length > 0) {
            fetch("/api/bookings")
              .then((res) => res.json())
              .then((data) => {
                const all = data.bookings || data;
                if (Array.isArray(all)) {
                  setBookings(all.filter((b: any) => localBookingIds.includes(b.id)));
                }
              })
              .catch(() => setBookings([]));
          } else {
            setBookings([]);
          }
        } catch {
          setBookings([]);
        }
      }
    });

    // Chỉ hiển thị leads/vouchers mà chính trình duyệt này đã tạo
    try {
      const localVoucherCodes = JSON.parse(localStorage.getItem("cal_my_vouchers") || "[]");
      if (Array.isArray(localVoucherCodes) && localVoucherCodes.length > 0) {
        fetch("/api/leads")
          .then((res) => res.json())
          .then((resData) => {
            const list = resData.data || [];
            setLeads(list.filter((l: any) => localVoucherCodes.includes(l.voucherCode) || localVoucherCodes.includes(l.leadId)));
          })
          .catch(() => setLeads([]));
      } else {
        setLeads([]);
      }
    } catch {
      setLeads([]);
    }
  }, []);

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Du khách Chạm A Lưới";
  const userEmail = user?.email || "dukhach@chamaluoi.vn";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const userVouchers = leads.map((l) => ({
    voucherCode: l.voucherCode,
    leadId: l.leadId,
    placeName: l.placeName,
    placeSlug: l.placeSlug,
    businessName: l.businessName,
    status: l.status === "voucher_used" ? "Đã dùng" : "Chưa dùng",
    expectedDate: l.expectedDate,
    createdAt: l.createdAt
  }));

  return (
    <main className="pt-24 bg-beige/30 min-h-screen">
      <section className="section-shell py-10">
        {/* Profile Header */}
        <div className="grid gap-6 rounded-3xl bg-white p-6 md:p-8 shadow-card border border-forest/10 lg:grid-cols-[1fr_auto] items-center">
          <div className="flex flex-wrap items-center gap-5">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={80}
                height={80}
                className="size-20 rounded-full object-cover border-2 border-forest"
              />
            ) : (
              <span className="grid size-20 place-items-center rounded-full bg-forest text-2xl font-black text-white shadow-md">
                {fullName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-ink">{fullName}</h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  Thành viên
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/60">{userEmail}</p>
              <p className="mt-2 text-xs text-forest font-semibold flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                Chào mừng bạn đến với hệ sinh thái kết nối du lịch cộng đồng A Lưới
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" size="sm" className="border-forest/20 text-forest">
              <Link href="/places">
                <Compass className="size-4 mr-1.5" />
                Khám phá địa điểm
              </Link>
            </Button>
            {user ? <SignOutButton /> : null}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-forest/10 pb-4">
          {[
            { key: "vouchers", label: "Kho Voucher của tôi", icon: TicketCheck, count: userVouchers.length },
            { key: "leads", label: "Lịch sử tư vấn (Leads)", icon: MessageCircle, count: leads.length },
            { key: "bookings", label: "Đơn đặt & Booking", icon: Package, count: bookings.length },
            { key: "favorites", label: "Địa điểm quan tâm", icon: Heart, count: 3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`focus-ring flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs md:text-sm font-bold transition ${
                  isCurrent
                    ? "bg-forest text-white shadow-md"
                    : "bg-white text-ink/70 hover:bg-beige hover:text-forest"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    isCurrent ? "bg-white/20 text-white" : "bg-forest/10 text-forest"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="mt-6">
          {/* Vouchers Tab */}
          {activeTab === "vouchers" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-ink">Mã ưu đãi & Voucher đã nhận</h2>
                <span className="text-xs text-ink/50">Cập nhật theo thời gian thực từ cơ sở</span>
              </div>

              {userVouchers.length === 0 ? (
                <div className="rounded-3xl bg-white p-10 text-center shadow-card border border-forest/10">
                  <TicketCheck className="mx-auto size-12 text-forest/40" />
                  <h3 className="mt-3 text-lg font-bold text-ink">Bạn chưa có mã voucher nào</h3>
                  <p className="mt-2 text-sm text-ink/60 max-w-md mx-auto">
                    Hãy vào mục Địa điểm, chọn cơ sở bạn muốn ghé thăm và gửi thông tin tư vấn để nhận mã giảm giá độc quyền.
                  </p>
                  <Button asChild className="mt-5">
                    <Link href="/places">Nhận voucher ngay</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userVouchers.map((v) => (
                    <article
                      key={v.voucherCode}
                      className="rounded-3xl bg-white p-5 shadow-card border border-forest/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest font-mono">
                            {v.voucherCode}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              v.status === "Đã dùng"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-extrabold text-ink">{v.placeName}</h3>
                        <p className="text-xs text-ink/60 mt-0.5">{v.businessName}</p>

                        <div className="mt-4 rounded-xl bg-beige p-3 text-xs leading-relaxed text-ink/75">
                          <p className="font-semibold text-forest flex items-center gap-1">
                            <Gift className="size-3.5" /> Ưu đãi: Giảm giá trực tiếp theo chính sách Chạm A Lưới
                          </p>
                          <p className="mt-1 text-ink/60">Ngày dự kiến đến: {v.expectedDate}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between text-xs">
                        <Link
                          href={`/places/${v.placeSlug}`}
                          className="font-bold text-forest hover:underline"
                        >
                          Xem lại địa điểm →
                        </Link>
                        <span className="text-ink/40 text-[11px]">Lead: {v.leadId}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-ink">Lịch sử tư vấn & Nhu cầu gửi đến cơ sở</h2>
              </div>

              <div className="grid gap-4">
                {leads.map((lead) => (
                  <article
                    key={lead.leadId}
                    className="rounded-3xl bg-white p-6 shadow-card border border-forest/10"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 pb-4">
                      <div>
                        <span className="text-xs font-bold text-clay uppercase tracking-wider">Mã Lead: {lead.leadId}</span>
                        <h3 className="text-lg font-extrabold text-ink">{lead.placeName}</h3>
                        <p className="text-xs text-ink/60">Cơ sở: {lead.businessName}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
                          {lead.status === "new"
                            ? "Mới gửi"
                            : lead.status === "contacted"
                            ? "Đã liên hệ"
                            : lead.status === "consulting"
                            ? "Đang tư vấn"
                            : lead.status === "converted"
                            ? "Đã chuyển Booking"
                            : lead.status === "unsuccessful"
                            ? "Không thành công"
                            : lead.status === "voucher_used"
                            ? "Đã dùng voucher"
                            : lead.status}
                        </span>
                        <p className="mt-1 text-xs text-ink/50">
                          {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
                      <div className="rounded-xl bg-beige p-3">
                        <p className="text-ink/50 font-semibold">Khách đăng ký:</p>
                        <p className="font-bold text-ink mt-0.5">{lead.customerName} ({lead.phone})</p>
                      </div>
                      <div className="rounded-xl bg-beige p-3">
                        <p className="text-ink/50 font-semibold">Lịch trình & Đoàn:</p>
                        <p className="font-bold text-ink mt-0.5">{lead.expectedDate} • {lead.guests} người</p>
                      </div>
                      <div className="rounded-xl bg-beige p-3">
                        <p className="text-ink/50 font-semibold">Mã Voucher gắn kèm:</p>
                        <p className="font-bold text-forest mt-0.5 font-mono">{lead.voucherCode}</p>
                      </div>
                    </div>

                    {lead.convertedBookingId && (
                      <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 font-semibold flex items-center justify-between">
                        <span>Đã chuyển thành đơn đặt thành công: <strong>{lead.convertedBookingId}</strong></span>
                        <span className="text-[11px] text-emerald-700 font-mono">Status: Đã chuyển Booking</span>
                      </div>
                    )}

                    {lead.need ? (
                      <div className="mt-3 rounded-xl bg-forest/5 p-3 text-xs text-ink/75">
                        <p className="font-semibold text-forest">Nội dung bạn cần tư vấn:</p>
                        <p className="mt-1 italic">&ldquo;{lead.need}&rdquo;</p>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Bookings & Orders Tab */}
          {activeTab === "bookings" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-ink">Đơn đặt tour & Dịch vụ của bạn</h2>
                <span className="text-xs text-ink/50">{bookings.length} đơn trên hệ thống</span>
              </div>

              {bookings.length === 0 ? (
                <div className="rounded-3xl bg-white p-10 text-center shadow-card border border-forest/10">
                  <Package className="mx-auto size-12 text-forest/40" />
                  <h3 className="mt-3 text-lg font-bold text-ink">Chưa có đơn đặt nào</h3>
                  <p className="mt-2 text-sm text-ink/60 max-w-md mx-auto">
                    Đặt tour trải nghiệm hoặc đặt đặc sản bản địa để hành trình khám phá A Lưới thêm trọn vẹn.
                  </p>
                  <Button asChild className="mt-5">
                    <Link href="/places">Khám phá dịch vụ ngay</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {bookings.map((b) => (
                    <article
                      key={b.id}
                      className="rounded-3xl bg-white p-6 shadow-card border border-forest/10 flex flex-col justify-between"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-forest">{b.id}</span>
                            <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold text-forest uppercase">
                              {b.type === "tour" ? "Tour trọn gói" : b.type === "homestay" ? "Homestay" : "Đặc sản"}
                            </span>
                            {b.leadId && (
                              <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-semibold">
                                Gốc từ Lead: {b.leadId}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 text-lg font-extrabold text-ink">{b.itemTitle}</h3>
                          <p className="text-xs text-ink/60">{b.businessName}</p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                              b.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : b.status === "completed"
                                ? "bg-teal-100 text-teal-800"
                                : b.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status === "confirmed"
                              ? "Đã xác nhận"
                              : b.status === "completed"
                              ? "Hoàn tất"
                              : b.status === "cancelled"
                              ? "Đã hủy"
                              : "Chờ xác nhận"}
                          </span>
                          <p className="mt-1 font-mono text-base font-black text-forest">
                            {b.finalAmount.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
                        <div className="rounded-xl bg-beige p-3">
                          <p className="text-ink/50 font-semibold">Thời gian / Ngày đi:</p>
                          <p className="font-bold text-ink mt-0.5">{b.experienceDate || b.startDate || "Linh hoạt"}</p>
                        </div>

                        <div className="rounded-xl bg-beige p-3">
                          <p className="text-ink/50 font-semibold">Số lượng & Đơn giá:</p>
                          <p className="font-bold text-ink mt-0.5">
                            {b.numberOfPeople || b.quantity || 1} người x {(b.unitPrice || 0).toLocaleString("vi-VN")} đ
                          </p>
                        </div>

                        <div className="rounded-xl bg-beige p-3 flex flex-col justify-between">
                          <p className="text-ink/50 font-semibold">Thanh toán:</p>
                          <div className="flex items-center justify-between gap-1 mt-0.5">
                            <p className="font-bold text-ink flex items-center gap-1">
                              <CreditCard className="size-3 text-forest" />
                              {b.paymentStatus === "paid"
                                ? "Đã thanh toán đủ"
                                : b.paymentStatus === "partially_paid"
                                ? "Đã đặt cọc"
                                : b.paymentStatus === "refunded"
                                ? "Đã hoàn tiền"
                                : "Chưa thanh toán"}
                            </p>
                            {b.paymentStatus !== "paid" && b.paymentStatus !== "refunded" && b.status !== "cancelled" && (
                              <Button asChild size="sm" className="h-6 px-2 text-[10px] bg-forest text-white font-bold">
                                <Link href={`/payment/${b.id}`}>Thanh toán →</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Review Invitation for Completed Booking */}
                      {(b.status === "completed" || (b as any).bookingStatus === "completed") && (
                        <div className="mt-4 pt-4 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/50 p-4 rounded-2xl">
                          <div className="flex items-center gap-2 text-xs text-emerald-950 font-medium">
                            <Sparkles className="size-4 text-amber-500" />
                            <span>
                              {bookingReviews[b.id]
                                ? "Cảm ơn bạn! Bạn đã gửi đánh giá trải nghiệm cho đơn này."
                                : "Bạn đã hoàn thành chuyến đi này! Hãy chia sẻ trải nghiệm chân thực của bạn."}
                            </span>
                          </div>

                          {bookingReviews[b.id] ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              bookingReviews[b.id]?.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : bookingReviews[b.id]?.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              ★ {bookingReviews[b.id]?.rating} sao • {
                                bookingReviews[b.id]?.status === "approved"
                                  ? "Đã duyệt xuất bản"
                                  : bookingReviews[b.id]?.status === "pending"
                                  ? "Đang chờ Admin duyệt"
                                  : "Đã ẩn"
                              }
                            </span>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setReviewingBooking(b)}
                              className="bg-forest text-white hover:bg-forest/90 font-bold text-xs shadow-sm"
                            >
                              Viết đánh giá trải nghiệm ★
                            </Button>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold text-ink">Địa điểm yêu thích tại A Lưới</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { name: "Thác A Nôr", slug: "thac-a-nor", note: "Thác 3 tầng hùng vĩ, tắm mát tự nhiên" },
                  { name: "Làng du lịch cộng đồng A Nôr", slug: "lang-du-lich-cong-dong-a-nor", note: "Homestay nhà sàn, làm bánh A Quát" },
                  { name: "Suối Pâr Le", slug: "suoi-par-le", note: "Vịnh tắm ngọc bích tại Hồng Hạ" }
                ].map((fav) => (
                  <article key={fav.slug} className="rounded-2xl bg-white p-5 shadow-card border border-forest/10">
                    <h3 className="font-extrabold text-ink">{fav.name}</h3>
                    <p className="text-xs text-ink/60 mt-1">{fav.note}</p>
                    <Link
                      href={`/places/${fav.slug}`}
                      className="mt-3 inline-block text-xs font-bold text-forest hover:underline"
                    >
                      Khám phá lại →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {/* Review Submission Modal */}
      {reviewingBooking && (
        <ReviewFormModal
          isOpen={true}
          bookingId={reviewingBooking.id}
          placeName={reviewingBooking.itemTitle}
          placeSlug={reviewingBooking.itemSlug || reviewingBooking.placeId || "diem-den"}
          customerName={reviewingBooking.customerName || fullName}
          customerPhone={reviewingBooking.phone}
          customerId={user?.id || reviewingBooking.customerId}
          onClose={() => setReviewingBooking(null)}
          onSuccess={() => {
            if (reviewingBooking.id) {
              fetchReviewByBookingIdAction(reviewingBooking.id).then((rev) => {
                setBookingReviews((prev) => ({ ...prev, [reviewingBooking.id]: rev }));
              });
            }
          }}
        />
      )}
    </main>
  );
}
