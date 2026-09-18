"use client";

import { getOptionalSupabasePublicConfig } from "@/lib/supabase/config";

const ACCESS_TOKEN_KEY = "cham_a_luoi_supabase_access_token";
const REFRESH_TOKEN_KEY = "cham_a_luoi_supabase_refresh_token";
const EXPIRES_AT_KEY = "cham_a_luoi_supabase_expires_at";
const USER_CACHE_KEY = "cham_a_luoi_auth_user";

export type AuthUser = {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
};

type AuthSessionPayload = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: AuthUser;
  msg?: string;
  error?: string;
  error_description?: string;
};

function saveSession(payload: AuthSessionPayload) {
  if (!payload.access_token) return false;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);

  if (payload.refresh_token) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh_token);
  }

  if (payload.expires_in) {
    window.localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + payload.expires_in * 1000));
  }

  if (payload.user) {
    window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(payload.user));
  }

  return true;
}

async function requestAuth(path: string, body: Record<string, unknown>) {
  const config = getOptionalSupabasePublicConfig();

  if (!config) {
    throw new Error("Chưa cấu hình Supabase.");
  }

  const response = await fetch(`${config.url}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = (await response.json().catch(() => ({}))) as AuthSessionPayload;

  if (!response.ok) {
    throw new Error(payload.error_description ?? payload.msg ?? payload.error ?? "Không thể xử lý đăng nhập.");
  }

  return payload;
}

export function hasProviderConfig(provider: "google" | "facebook"): boolean {
  const config = getOptionalSupabasePublicConfig();
  if (config) return true;
  if (provider === "google") {
    return Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  }
  if (provider === "facebook") {
    return Boolean(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
  }
  return false;
}

export function getProviderOAuthUrl(provider: "google" | "facebook", next = "/account"): string | null {
  const config = getOptionalSupabasePublicConfig();
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  // 1. Supabase OAuth nếu đã cấu hình Supabase
  if (config) {
    const params = new URLSearchParams({
      provider,
      redirect_to: callbackUrl
    });
    return `${config.url}/auth/v1/authorize?${params.toString()}`;
  }

  // 2. Google Direct OAuth nếu có Google Client ID
  if (provider === "google" && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: "token",
      scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
      prompt: "select_account"
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // 3. Facebook Direct OAuth nếu có Facebook App ID
  if (provider === "facebook" && process.env.NEXT_PUBLIC_FACEBOOK_APP_ID) {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const cleanCallbackUrl = `${origin}/auth/callback`;
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: cleanCallbackUrl,
      state: next,
      response_type: "token",
      scope: "email,public_profile"
    });
    return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
  }

  return null;
}

export function getGoogleLoginUrl(next = "/account") {
  const oauthUrl = getProviderOAuthUrl("google", next);
  if (!oauthUrl) {
    throw new Error("Chưa cấu hình Google OAuth hoặc Supabase trong .env.local.");
  }
  return oauthUrl;
}

export function saveSessionFromHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const expiresIn = Number(params.get("expires_in") ?? 0);

  if (!accessToken) return false;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (expiresIn) {
    window.localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + expiresIn * 1000));
  }

  return true;
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const config = getOptionalSupabasePublicConfig();

  if (!config) {
    throw new Error("Chưa cấu hình Supabase. Không thể tạo tài khoản thật khi thiếu .env.local.");
  }

  const payload = await requestAuth("signup", {
    email,
    password,
    data: {
      full_name: fullName
    }
  });

  saveSession(payload);
  return payload;
}

export async function signInWithEmail(email: string, password: string) {
  const config = getOptionalSupabasePublicConfig();

  if (!config) {
    throw new Error("Chưa cấu hình Supabase. Không thể đăng nhập thật khi thiếu .env.local.");
  }

  const payload = await requestAuth("token?grant_type=password", {
    email,
    password
  });

  saveSession(payload);
  return payload;
}

export async function sendPhoneOtp(phone: string) {
  const config = getOptionalSupabasePublicConfig();

  if (!config) {
    throw new Error("Chưa cấu hình Supabase. Không thể gửi OTP thật khi thiếu .env.local.");
  }

  return requestAuth("otp", {
    phone
  });
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const config = getOptionalSupabasePublicConfig();

  if (!config) {
    throw new Error("Chưa cấu hình Supabase. Không thể xác nhận OTP thật khi thiếu .env.local.");
  }

  const payload = await requestAuth("verify", {
    phone,
    token,
    type: "sms"
  });

  saveSession(payload);
  return payload;
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearLocalSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(EXPIRES_AT_KEY);
  window.localStorage.removeItem(USER_CACHE_KEY);
  window.localStorage.removeItem("cham_a_luoi_demo_user");
  window.localStorage.removeItem("cham_a_luoi_demo_otp");
  window.localStorage.removeItem("cham_current_customer");
  window.localStorage.removeItem("cham_customer_profile");
}

export function saveCustomerSession(customer: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  provider?: string;
  role?: string;
}) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("cham_current_customer", JSON.stringify(customer));
  const authUser: AuthUser = {
    id: customer.id,
    email: customer.email,
    phone: customer.phone,
    user_metadata: {
      full_name: customer.name,
      avatar_url: customer.avatarUrl,
      provider: customer.provider || "email",
      role: customer.role || "customer",
    }
  };
  window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(authUser));
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  // 1. Kiểm tra session khách hàng đã lưu trong localStorage (hiển thị tức thì không độ trễ)
  if (typeof window !== "undefined") {
    try {
      const localCust = window.localStorage.getItem("cham_current_customer");
      if (localCust) {
        const parsed = JSON.parse(localCust);
        if (parsed && (parsed.id || parsed.email)) {
          return {
            id: parsed.id || `usr-cust-${Date.now()}`,
            email: parsed.email,
            phone: parsed.phone,
            user_metadata: {
              full_name: parsed.name || parsed.fullName,
              avatar_url: parsed.avatarUrl,
              provider: parsed.provider,
              role: parsed.role || "customer",
            }
          };
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Đồng bộ với Server Session qua Cookie (/api/auth/me)
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          phone: data.user.phone,
          user_metadata: {
            full_name: data.user.name,
            avatar_url: data.user.avatarUrl,
            provider: data.user.provider,
            role: data.user.role,
          }
        };
        if (typeof window !== "undefined") {
          window.localStorage.setItem("cham_current_customer", JSON.stringify(data.user));
          window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
        }
        return user;
      }
    }
  } catch {
    // ignore fetch error in offline/SSR
  }

  // 3. Fallback sang Supabase token nếu có cấu hình
  const token = getAccessToken();
  const config = getOptionalSupabasePublicConfig();
  if (!token || !config) return null;

  try {
    const response = await fetch(`${config.url}/auth/v1/user`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      clearLocalSession();
      return null;
    }

    const user = (await response.json()) as AuthUser;
    window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}
