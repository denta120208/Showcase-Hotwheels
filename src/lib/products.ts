import { createServerSupabaseClient } from "./supabase/server";
import type { Product, ProductImage } from "./supabase/types";

export type ProductFilter = "all" | "ready" | "soldout" | "limited";

export interface ProductListResult {
  items: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function getLatestProducts(limit = 6) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Product[];
}

export async function getPaginatedProducts({
  search = "",
  filter = "all",
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  filter?: ProductFilter;
  page?: number;
  pageSize?: number;
}): Promise<ProductListResult> {
  const supabase = await createServerSupabaseClient();
  const safePage = page < 1 ? 1 : page;
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
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

  const { data, count } = await query;
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items: (data ?? []) as Product[],
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
  };
}

export async function getProductById(productId: number) {
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (!product) {
    return null;
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  return {
    product: product as Product,
    images: (images ?? []) as ProductImage[],
  };
}
