import { placeCategories, places as defaultPlaces, type PlaceCategory } from "@/data/places";
import { getPlaces, getPlaceBySlug as getStorePlaceBySlug, type PlaceRecord } from "@/lib/server-store";

export type { PlaceRecord };

/**
 * Lấy danh sách toàn bộ địa điểm từ server-store (fallback sang defaultPlaces nếu store rỗng)
 */
export function getAllPlacesList(): PlaceRecord[] {
  try {
    const list = getPlaces();
    if (list && list.length > 0) return list;
  } catch {
    // fallback
  }
  return defaultPlaces as unknown as PlaceRecord[];
}

export function getPlaceBySlug(slug: string): PlaceRecord | undefined {
  try {
    const p = getStorePlaceBySlug(slug);
    if (p) return p;
  } catch {
    // fallback
  }
  return (defaultPlaces as unknown as PlaceRecord[]).find((place) => place.slug === slug);
}

export function getPlaceStaticParams() {
  const all = getAllPlacesList();
  return all.map((place) => ({ slug: place.slug }));
}

export function getCategoryById(categoryId: string) {
  return placeCategories.find((category) => category.id === categoryId);
}

export function getPlacesByCategory(categoryId?: string, includeHidden = false) {
  const all = getAllPlacesList().filter((p) => includeHidden || p.status !== "hidden");
  if (!categoryId || categoryId === "all") return all;
  return all.filter((place) => place.category === categoryId);
}

export function getFeaturedPlaces(limit = 3) {
  const all = getAllPlacesList().filter((p) => p.status === "active");
  return all.slice(0, limit);
}

export function getRelatedPlaces(currentSlug: string, category: PlaceCategory) {
  const all = getAllPlacesList().filter((p) => p.status === "active");
  return all.filter((place) => place.slug !== currentSlug && (place.category === category || category === "all")).slice(0, 3);
}
