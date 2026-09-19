import { redirect } from "next/navigation";

export default function AccountBookingsRedirectPage() {
  redirect("/account?tab=bookings");
}

