import { createServerSupabaseClient, hasSupabaseEnv } from "./supabase/server";
import type { Product, ProductImage } from "./supabase/types";

export type ProductFilter = "all" | "ready" | "soldout" | "limited";
export type ProductCardImage = Pick<ProductImage, "id" | "image_url" | "sort_order">;
export type ProductCardItem = Pick<
  Product,
  "id" | "name" | "price" | "image_url" | "stock" | "is_limited" | "is_soldout"
> & {
  product_images?: ProductCardImage[] | null;
};
export type ProductDetailItem = Pick<
  Product,
  "id" | "name" | "price" | "description" | "image_url" | "stock" | "is_limited" | "is_soldout"
>;
export type ProductDetailImage = Pick<ProductImage, "id" | "image_url">;

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
        "id,name,price,image_url,stock,is_limited,is_soldout,product_images(id,image_url,sort_order)",
      )
      .order("created_at", { ascending: false })
      .order("sort_order", { referencedTable: "product_images", ascending: true })
      .limit(limit);

    return (data ?? []) as ProductCardItem[];
  } catch {
    return [];
  }
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
        "id,name,price,image_url,stock,is_limited,is_soldout,product_images(id,image_url,sort_order)",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .order("sort_order", { referencedTable: "product_images", ascending: true })
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
      .select("id,name,price,description,image_url,stock,is_limited,is_soldout")
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
