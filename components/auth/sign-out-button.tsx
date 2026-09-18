"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearLocalSession } from "@/lib/supabase/browser";
import { logoutAction } from "@/app/actions/auth";

export function SignOutButton() {
  async function handleSignOut() {
    clearLocalSession();
    await logoutAction();
    window.location.href = "/";
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleSignOut} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
      <LogOut className="size-4 mr-1.5" aria-hidden="true" />
      Đăng xuất
    </Button>
  );
}
