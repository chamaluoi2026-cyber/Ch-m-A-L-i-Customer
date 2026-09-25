"use server";

import {
  getSiteSettingsAsync,
  type TravelConditions,
  defaultTravelConditions
} from "@/lib/server-store";

export async function fetchTravelConditionsAction(): Promise<TravelConditions> {
  try {
    const settings = await getSiteSettingsAsync();
    return settings.travelConditions || defaultTravelConditions;
  } catch (err) {
    console.error("fetchTravelConditionsAction error:", err);
    return defaultTravelConditions;
  }
}
