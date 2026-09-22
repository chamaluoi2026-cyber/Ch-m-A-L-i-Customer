import { NextResponse } from "next/server";
import { getPlacesFromCloudAsync } from "@/lib/cloud-store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const places = await getPlacesFromCloudAsync();

    let filtered = places.filter((p) => !p.isDeleted);
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      places: filtered,
      total: filtered.length
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Lỗi khi lấy danh sách địa điểm" },
      { status: 500 }
    );
  }
}
