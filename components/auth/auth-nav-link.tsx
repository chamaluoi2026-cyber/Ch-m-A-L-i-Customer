"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, type AuthUser } from "@/lib/supabase/browser";
import { useLanguage } from "@/components/i18n-provider";

export function AuthNavLink() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <Button asChild size="sm" variant={user ? "outline" : "ghost"} className="h-8.5 px-3 text-xs font-semibold text-ink/80 hover:bg-forest/10 hover:text-forest whitespace-nowrap">
      <Link href={user ? "/account" : "/login"} aria-label={user ? t.nav.account : t.nav.login}>
        <UserCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
        <span>{user ? t.nav.account : t.nav.login}</span>
      </Link>
    </Button>
  );
}