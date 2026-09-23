import { getProductsFromCloudAsync } from "@/lib/cloud-store";
import type { ProductRecord } from "@/data/products";
import { defaultProducts } from "@/data/products";

// ==========================================
// ASYNC API (KẾT NỐI SUPABASE CLOUD TRỰC TIẾP)
// ==========================================

export async function getAllProductsAsync(): Promise<ProductRecord[]> {
  try {
    const list = await getProductsFromCloudAsync();
    const active = list.filter((p) => !p.isDeleted);
    if (active.length > 0) return active;
  } catch (err) {
    console.error("[PRODUCTS] Error loading products from cloud:", err);
  }
  return defaultProducts;
}

/**
 * Lấy danh sách sản phẩm công khai trên website khách hàng:
 * Tự động lọc bỏ các sản phẩm bị Ẩn (status === 'hidden')
 * để TUYỆT ĐỐI KHÔNG BAO GIỜ bị tình trạng card hiển thị nhưng click vào ra lỗi 404!
 */
export async function getPublicProductsAsync(): Promise<ProductRecord[]> {
  const all = await getAllProductsAsync();
  return all.filter((p) => p.status !== "hidden");
}

export async function getProductBySlugAsync(slug: string): Promise<ProductRecord | undefined> {
  const all = await getAllProductsAsync();
  return all.find((p) => p.slug === slug);
}

export async function getFeaturedProductsAsync(limit = 4): Promise<ProductRecord[]> {
  const publicList = await getPublicProductsAsync();
  return publicList.slice(0, limit);
}
