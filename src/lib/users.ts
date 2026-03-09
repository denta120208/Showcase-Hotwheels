import { createServerSupabaseClient, hasSupabaseEnv } from "./supabase/server";
import type { UserProfile } from "./supabase/types";

export type UserRegistrationItem = Pick<
  UserProfile,
  | "id"
  | "name"
  | "email"
  | "phone"
  | "tiktok"
  | "address_detail"
  | "village"
  | "regency"
  | "district"
  | "province"
  | "postal_code"
  | "created_at"
>;

export interface UserRegistrationListResult {
  items: UserRegistrationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface UserRegistrationExportAllResult {
  items: UserRegistrationItem[];
  truncated: boolean;
}

const USER_SELECT_FIELDS =
  "id,name,email,phone,tiktok,address_detail,village,regency,district,province,postal_code,created_at";

function normalizeSearchKeyword(search: string) {
  return search.trim();
}

export async function getPaginatedUserRegistrations({
  search = "",
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<UserRegistrationListResult> {
  const safePage = page < 1 ? 1 : page;
  const safePageSize = Math.min(Math.max(pageSize, 8), 20);

  if (!hasSupabaseEnv()) {
    return {
      items: [],
      page: safePage,
      pageSize: safePageSize,
      totalCount: 0,
      totalPages: 1,
    };
  }

  const supabase = await createServerSupabaseClient();
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  const keyword = normalizeSearchKeyword(search);

  let query = supabase
    .from("users")
    .select(USER_SELECT_FIELDS, { count: "planned" })
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (keyword.length >= 2) {
    const escaped = keyword.replace(/[%_]/g, "");
    query = query.or(`name.ilike.%${escaped}%,email.ilike.%${escaped}%,phone.ilike.%${escaped}%`);
  }

  const { data, count } = await query;
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

  return {
    items: (data ?? []) as UserRegistrationItem[],
    page: safePage,
    pageSize: safePageSize,
    totalCount,
    totalPages,
  };
}

export async function getUserRegistrationsForExport({
  search = "",
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const safePage = page < 1 ? 1 : page;
  const safePageSize = Math.min(Math.max(pageSize, 8), 30);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  const keyword = normalizeSearchKeyword(search);

  let query = supabase
    .from("users")
    .select(USER_SELECT_FIELDS)
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (keyword.length >= 2) {
    const escaped = keyword.replace(/[%_]/g, "");
    query = query.or(`name.ilike.%${escaped}%,email.ilike.%${escaped}%,phone.ilike.%${escaped}%`);
  }

  const { data } = await query;
  return (data ?? []) as UserRegistrationItem[];
}

export async function getAllUserRegistrationsForExport({
  search = "",
  batchSize = 100,
  maxRows = 2000,
}: {
  search?: string;
  batchSize?: number;
  maxRows?: number;
}): Promise<UserRegistrationExportAllResult> {
  if (!hasSupabaseEnv()) {
    return { items: [], truncated: false };
  }

  const supabase = await createServerSupabaseClient();
  const safeBatchSize = Math.min(Math.max(batchSize, 50), 200);
  const safeMaxRows = Math.min(Math.max(maxRows, 200), 5000);
  const keyword = normalizeSearchKeyword(search);
  const items: UserRegistrationItem[] = [];
  let from = 0;
  let truncated = false;

  while (items.length < safeMaxRows) {
    const limit = Math.min(safeBatchSize, safeMaxRows - items.length);
    let query = supabase
      .from("users")
      .select(USER_SELECT_FIELDS)
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (keyword.length >= 2) {
      const escaped = keyword.replace(/[%_]/g, "");
      query = query.or(
        `name.ilike.%${escaped}%,email.ilike.%${escaped}%,phone.ilike.%${escaped}%`,
      );
    }

    const { data } = await query;
    const chunk = (data ?? []) as UserRegistrationItem[];

    if (chunk.length === 0) {
      break;
    }

    items.push(...chunk);
    from += chunk.length;

    if (chunk.length < limit) {
      break;
    }
  }

  if (items.length >= safeMaxRows) {
    truncated = true;
  }

  return { items, truncated };
}
