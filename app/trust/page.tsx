import { Metadata } from "next";
import TrustClient from "./trust-client";

export const metadata: Metadata = {
  title: "Trung Tâm Tin Cậy & An Toàn (Trust & Safety) | Chạm A Lưới",
  description: "5 cam kết minh bạch, quy trình thẩm định cơ sở bản địa thực tế, bảo vệ thanh toán và cẩm nang an toàn du lịch A Lưới, Thừa Thiên Huế.",
};

export default function TrustPage() {
  return <TrustClient />;
}
