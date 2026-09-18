import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/roles";
import { getAllUsers, updateUser } from "@/lib/server-store";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const users = getAllUsers();
    const foundUser = users.find(
      (u) => u.id === session.id || (u.email && u.email.toLowerCase() === session.email.toLowerCase())
    );

    const userData = {
      id: foundUser?.id || session.id,
      name: foundUser?.name || session.name,
      email: foundUser?.email || session.email,
      phone: foundUser?.phone || session.phone,
      avatarUrl: foundUser?.avatarUrl || session.avatarUrl,
      provider: foundUser?.provider || session.provider || "email",
      role: foundUser?.role || session.role,
    };

    return NextResponse.json({ authenticated: true, user: userData });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập." }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    const users = getAllUsers();
    const targetUser = users.find(
      (u) => u.id === session.id || (u.email && u.email.toLowerCase() === session.email.toLowerCase())
    );

    if (targetUser) {
      updateUser(targetUser.id, {
        name: name ? name.trim() : targetUser.name,
        phone: phone ? phone.trim() : targetUser.phone,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
