import { createAdminSupabaseClient } from "./supabase/admin";
import { createServerSupabaseClient, hasSupabaseEnv } from "./supabase/server";
import type { Product, ProductCategory, ProductImage } from "./supabase/types";

export type ProductFilter = "all" | "ready" | "soldout" | "limited";
export type ProductCategoryFilter = "all" | ProductCategory;
export type ProductCardImage = Pick<ProductImage, "id" | "image_url" | "sort_order">;
export type ProductCardItem = Pick<
  Product,
  | "id"
  | "name"
  | "category"
  | "price"
  | "image_url"
  | "stock"
  | "is_limited"
  | "is_soldout"
> & {
  product_images?: ProductCardImage[] | null;
};
export type ProductDetailItem = Pick<
  Product,
  | "id"
  | "name"
  | "category"
  | "price"
  | "description"
  | "image_url"
  | "stock"
  | "is_limited"
  | "is_soldout"
>;
export type ProductDetailImage = Pick<ProductImage, "id" | "image_url">;

const PRODUCT_CARD_GALLERY_LIMIT = 3;
const SOLDOUT_AUTO_DELETE_AFTER_MS = 24 * 60 * 60 * 1000;
const SOLDOUT_CLEANUP_COOLDOWN_MS = 10 * 60 * 1000;
const SOLDOUT_CLEANUP_BATCH_SIZE = 20;
const STORAGE_BUCKET = "product-images";

let lastSoldoutCleanupAt = 0;

function hasSupabaseServiceRoleKey() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function cleanupExpiredSoldoutProducts() {
  const now = Date.now();
  if (now - lastSoldoutCleanupAt < SOLDOUT_CLEANUP_COOLDOWN_MS) {
    return;
  }
  lastSoldoutCleanupAt = now;

  if (!hasSupabaseServiceRoleKey()) {
    return;
  }

  const cutoff = new Date(now - SOLDOUT_AUTO_DELETE_AFTER_MS).toISOString();

  try {
    const admin = createAdminSupabaseClient();
    const { data } = await admin
      .from("products")
      .select("id,image_path,product_images(image_path)")
      .eq("is_soldout", true)
      .lt("updated_at", cutoff)
      .limit(SOLDOUT_CLEANUP_BATCH_SIZE);

    const rows = (data ?? []) as Array<{
      id: number;
      image_path: string | null;
      product_images: Array<{ image_path: string | null }> | null;
    }>;

    if (rows.length === 0) {
      return;
    }

    const storagePaths = rows
      .flatMap((row) => [
        row.image_path,
        ...(row.product_images ?? []).map((image) => image.image_path),
      ])
      .filter((path): path is string => Boolean(path));

    const uniqueStoragePaths = Array.from(new Set(storagePaths));

    if (uniqueStoragePaths.length > 0) {
      try {
        await admin.storage.from(STORAGE_BUCKET).remove(uniqueStoragePaths);
      } catch {
        // Best-effort. We still want the soldout products removed from the catalog.
      }
    }

    await admin
      .from("products")
      .delete()
      .in(
        "id",
        rows.map((row) => row.id),
      );
  } catch {
    // Ignore cleanup failure to keep catalog fetch resilient.
  }
}

export interface ProductListResult {
  items: ProductCardItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function getLatestProducts(limit = 6) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data } = await supabase
      .from("products")
      .select(
        "id,name,category,price,image_url,stock,is_limited,is_soldout,product_images(id,image_url,sort_order)",
      )
      .order("created_at", { ascending: false })
      .order("sort_order", { referencedTable: "product_images", ascending: true })
      .limit(PRODUCT_CARD_GALLERY_LIMIT, { referencedTable: "product_images" })
      .limit(limit);

    return (data ?? []) as ProductCardItem[];
  } catch {
    return [];
  }
}

export async function getPaginatedProducts({
  search = "",
  filter = "all",
  category = "all",
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  filter?: ProductFilter;
  category?: ProductCategoryFilter;
  page?: number;
  pageSize?: number;
}): Promise<ProductListResult> {
  const safePage = page < 1 ? 1 : page;
  const safePageSize = pageSize < 1 ? 12 : pageSize;
  const emptyResult: ProductListResult = {
    items: [],
    page: safePage,
    pageSize: safePageSize,
    totalCount: 0,
    totalPages: 1,
  };

  if (!hasSupabaseEnv()) {
    return emptyResult;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;

    let query = supabase
      .from("products")
      .select(
        "id,name,category,price,image_url,stock,is_limited,is_soldout,product_images(id,image_url,sort_order)",
        { count: "estimated" },
      )
      .order("created_at", { ascending: false })
      .order("sort_order", { referencedTable: "product_images", ascending: true })
      .limit(PRODUCT_CARD_GALLERY_LIMIT, { referencedTable: "product_images" })
      .range(from, to);

    if (search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    if (filter === "ready") {
      query = query.eq("is_soldout", false);
    } else if (filter === "soldout") {
      query = query.eq("is_soldout", true);
    } else if (filter === "limited") {
      query = query.eq("is_limited", true);
    }

    if (category !== "all") {
      query = query.eq("category", category);
    }

    const { data, count } = await query;
    const totalCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

    return {
      items: (data ?? []) as ProductCardItem[],
      page: safePage,
      pageSize: safePageSize,
      totalCount,
      totalPages,
    };
  } catch {
    return emptyResult;
  }
}

export async function getProductById(productId: number) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data: product } = await supabase
      .from("products")
      .select("id,name,category,price,description,image_url,stock,is_limited,is_soldout")
      .eq("id", productId)
      .maybeSingle();

    if (!product) {
      return null;
    }

    const { data: images } = await supabase
      .from("product_images")
      .select("id,image_url")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    return {
      product: product as ProductDetailItem,
      images: (images ?? []) as ProductDetailImage[],
    };
  } catch {
    return null;
  }
}
