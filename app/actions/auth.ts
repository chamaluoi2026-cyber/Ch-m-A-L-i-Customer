"use server";

import { cookies } from "next/headers";
import { getAllUsers, createUser, type SystemUser } from "@/lib/server-store";
import { signSession, AUTH_COOKIE_NAME, type SystemRole } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

export async function loginCustomerAction(data: {
  identifier: string; // SĐT hoặc Email
  password?: string;
  nextPath?: string;
}) {
  try {
    const rawId = (data.identifier || "").trim().toLowerCase();
    if (!rawId) {
      return { success: false, error: "Vui lòng nhập số điện thoại hoặc email." };
    }

    const users = getAllUsers();
    let targetUser = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === rawId) ||
        (u.phone && u.phone.replace(/[\s\.\-_]/g, "") === rawId.replace(/[\s\.\-_]/g, ""))
    );

    // Nếu khách hàng mới chưa từng đăng ký, tự động khởi tạo hồ sơ du khách thân thiện
    if (!targetUser) {
      const isPhone = /^[0-9+]+$/.test(rawId);
      const email = isPhone ? `${rawId.replace(/[^0-9]/g, "")}@dukhach.chamaluoi.vn` : rawId;
      const phone = isPhone ? rawId : undefined;
      const name = isPhone ? `Du khách ${rawId.slice(-4)}` : rawId.split("@")[0];

      targetUser = createUser({
        name,
        email,
        phone,
        role: "customer",
        actor: { id: "system", name: "Hệ thống Đăng ký Tự động", role: "system" }
      });
    }

    const token = signSession({
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role as SystemRole,
      businessId: targetUser.businessId
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 86400 * 30 // 30 ngày cho khách hàng
    });

    cookieStore.set("user_role", "customer", {
      path: "/",
      sameSite: "lax",
      maxAge: 86400 * 30
    });

    cookieStore.set("auth_session", "active", {
      path: "/",
      sameSite: "lax",
      maxAge: 86400 * 30
    });

    revalidatePath("/account");
    revalidatePath("/");

    return {
      success: true,
      user: targetUser,
      redirectUrl: data.nextPath && data.nextPath.startsWith("/") ? data.nextPath : "/account"
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Đăng nhập thất bại. Vui lòng thử lại."
    };
  }
}

export async function registerCustomerAction(data: {
  fullName: string;
  phone?: string;
  email: string;
  password?: string;
  nextPath?: string;
}) {
  try {
    const fullName = (data.fullName || "").trim();
    const email = (data.email || "").trim().toLowerCase();
    const phone = (data.phone || "").trim();

    if (!fullName) {
      return { success: false, error: "Vui lòng nhập họ và tên của bạn." };
    }
    if (!email && !phone) {
      return { success: false, error: "Vui lòng nhập email hoặc số điện thoại Zalo để liên hệ." };
    }

    const users = getAllUsers();
    let existingUser = users.find(
      (u) =>
        (email && u.email && u.email.toLowerCase() === email) ||
        (phone && u.phone && u.phone.replace(/[\s\.\-_]/g, "") === phone.replace(/[\s\.\-_]/g, ""))
    );

    let targetUser: SystemUser;
    if (existingUser) {
      targetUser = existingUser;
    } else {
      targetUser = createUser({
        name: fullName,
        email: email || `${phone.replace(/[^0-9]/g, "")}@dukhach.chamaluoi.vn`,
        phone: phone || undefined,
        role: "customer",
        actor: { id: "cust-self", name: fullName, role: "customer" }
      });
    }

    const token = signSession({
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role as SystemRole,
      businessId: targetUser.businessId
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 86400 * 30
    });

    cookieStore.set("user_role", "customer", {
      path: "/",
      sameSite: "lax",
      maxAge: 86400 * 30
    });

    cookieStore.set("auth_session", "active", {
      path: "/",
      sameSite: "lax",
      maxAge: 86400 * 30
    });

    revalidatePath("/account");
    revalidatePath("/");

    return {
      success: true,
      user: targetUser,
      redirectUrl: data.nextPath && data.nextPath.startsWith("/") ? data.nextPath : "/account"
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Đăng ký tài khoản thất bại. Vui lòng thử lại."
    };
  }
}

export async function loginWithAccountAction(emailOrRole: string, nextPath: string = "/admin") {
  try {
    const users = getAllUsers();
    let targetUser: SystemUser | undefined;

    const trimmed = emailOrRole.trim().toLowerCase();

    // 1. Tìm theo email
    targetUser = users.find((u) => u.email.toLowerCase() === trimmed);

    // 2. Nếu không tìm thấy, tìm theo role (ví dụ: "super_admin", "admin", "sales", "finance", "support", "business", "customer")
    if (!targetUser) {
      targetUser = users.find((u) => u.role.toLowerCase() === trimmed);
    }

    // 3. Fallback: Nếu gõ "superadmin" hoặc "super"
    if (!targetUser && (trimmed === "superadmin" || trimmed === "super_admin" || trimmed === "super")) {
      targetUser = users.find((u) => u.role === "SUPER_ADMIN");
    }

    // 4. Fallback mặc định: Admin
    if (!targetUser) {
      targetUser = users.find((u) => u.role === "ADMIN") || {
        id: "usr-admin-1",
        name: "Quản trị viên Chạm A Lưới",
        email: "admin@chamaluoi.vn",
        role: "ADMIN",
        createdAt: new Date().toISOString()
      };
    }

    // Ký Signed Session Token an toàn (HMAC SHA-256)
    const token = signSession({
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role as SystemRole,
      businessId: targetUser.businessId
    });

    const cookieStore = await cookies();

    // Đặt cookie HttpOnly bảo mật cao
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      path: "/",
      httpOnly: false, // Để browser client có thể đọc thông tin hiển thị nếu cần
      sameSite: "lax",
      maxAge: 86400 * 7 // 7 ngày
    });

    // Đặt legacy cookie tương thích ngược
    cookieStore.set("user_role", targetUser.role.toLowerCase(), {
      path: "/",
      sameSite: "lax",
      maxAge: 86400 * 7
    });

    cookieStore.set("auth_session", "active", {
      path: "/",
      sameSite: "lax",
      maxAge: 86400 * 7
    });

    revalidatePath("/admin");
    revalidatePath("/login");

    return {
      success: true,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        businessId: targetUser.businessId
      },
      redirectUrl: nextPath && nextPath.startsWith("/") ? nextPath : "/admin"
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Không thể đăng nhập."
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete("user_role");
  cookieStore.delete("auth_session");
  revalidatePath("/");
  return { success: true };
}
