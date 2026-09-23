import { placeCategories, places as staticPlaces, type PlaceCategory, type Place } from "@/data/places";
import { getAllPlaces as getStorePlaces, getDynamicPlaceBySlug as getStorePlaceBySlug, getActivePlaces as getStoreActivePlaces, type PlaceRecord } from "@/lib/server-store";
import { getPlacesFromCloudAsync } from "@/lib/cloud-store";

function mapRecordToPlace(r: PlaceRecord): Place {
  const primaryImage = r.coverImage || r.image || "";
  return {
    ...r,
    category: r.category as PlaceCategory,
    commissionRate: r.commissionRate || 10,
    rating: r.rating || 4.8,
    reviewCount: r.reviewCount || 1,
    image: primaryImage,
    coverImage: primaryImage,
    gallery: (r.gallery || []).map((g) => (typeof g === "string" ? g : (g as any).url)),
    services: r.services || [],
    highlights: r.highlights || [],
    activities: r.activities || [],
    suitableFor: r.suitableFor || [],
    safetyNotes: r.safetyNotes || [],
    status: (r.status === "temporarily_closed" ? "temporarily_closed" : (r.status === "hidden" ? "hidden" : "active")) as any
  };
}

// ==========================================
// ASYNC API (KẾT NỐI TRỰC TIẾP SUPABASE CLOUD)
// ==========================================

export async function getAllPlacesAsync(): Promise<Place[]> {
  try {
    const records = await getPlacesFromCloudAsync();
    const active = records.filter((r) => !r.isDeleted);
    if (active.length > 0) {
      return active.map(mapRecordToPlace);
    }
  } catch (err) {
    console.error("[PLACES] Error loading async places from cloud:", err);
  }
  return getAllPlaces();
}

export async function getActivePlacesAsync(): Promise<Place[]> {
  const all = await getAllPlacesAsync();
  return all.filter((p) => p.status === "active");
}

export async function getPlaceBySlugAsync(slug: string): Promise<Place | undefined> {
  const all = await getAllPlacesAsync();
  return all.find((place) => place.slug === slug);
}

export async function getPlacesByCategoryAsync(categoryId?: string): Promise<Place[]> {
  const currentPlaces = await getAllPlacesAsync();
  if (!categoryId || categoryId === "all") return currentPlaces;
  return currentPlaces.filter((place) => place.category === categoryId);
}

export async function getFeaturedPlacesAsync(limit = 3): Promise<Place[]> {
  const currentPlaces = await getAllPlacesAsync();
  return currentPlaces.filter((p) => p.status !== "hidden").slice(0, limit);
}

export async function getRelatedPlacesAsync(currentSlug: string, category: PlaceCategory): Promise<Place[]> {
  const currentPlaces = await getAllPlacesAsync();
  return currentPlaces
    .filter((place) => place.status !== "hidden" && place.slug !== currentSlug && (place.category === category || category === "all"))
    .slice(0, 3);
}

// ==========================================
// SYNCHRONOUS FALLBACK API (DÙNG KHI CẦN)
// ==========================================

export function getAllPlaces(): Place[] {
  try {
    return getStorePlaces();
  } catch {
    return staticPlaces;
  }
}

export function getActivePlaces(): Place[] {
  try {
    return getStoreActivePlaces();
  } catch {
    return staticPlaces.filter((p) => p.status === "active");
  }
}

export function getPlaceBySlug(slug: string): Place | undefined {
  try {
    return getStorePlaceBySlug(slug) || staticPlaces.find((place) => place.slug === slug);
  } catch {
    return staticPlaces.find((place) => place.slug === slug);
  }
}

export function getPlaceStaticParams() {
  return getAllPlaces().map((place) => ({ slug: place.slug }));
}

export function getCategoryById(categoryId: string) {
  return placeCategories.find((category) => category.id === categoryId);
}

export function getPlacesByCategory(categoryId?: string) {
  const currentPlaces = getAllPlaces();
  if (!categoryId || categoryId === "all") return currentPlaces;
  return currentPlaces.filter((place) => place.category === categoryId);
}

export function getFeaturedPlaces(limit = 3) {
  return getAllPlaces().slice(0, limit);
}

export function getRelatedPlaces(currentSlug: string, category: PlaceCategory) {
  return getAllPlaces()
    .filter((place) => place.slug !== currentSlug && (place.category === category || category === "all"))
    .slice(0, 3);
}
