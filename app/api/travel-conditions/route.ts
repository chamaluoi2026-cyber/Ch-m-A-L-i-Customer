import { NextResponse } from "next/server";
import { getLiveTravelConditionsAsync } from "@/lib/travel-conditions-engine";
import { getSiteSettingsAsync } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 900; // 15 mins

export async function GET() {
  try {
    const settings = await getSiteSettingsAsync();
    const liveConditions = await getLiveTravelConditionsAsync(settings.travelConditions);
    return NextResponse.json({ success: true, data: liveConditions });
  } catch (error) {
    console.error("GET /api/travel-conditions error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch live conditions" }, { status: 500 });
  }
}
