import { redirect } from "next/navigation";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "./supabase/server";
import type { UserProfile } from "./supabase/types";

export type BasicUserProfile = Pick<UserProfile, "id" | "name" | "email" | "role">;

async function getCurrentUserProfileBySelect<TProfile extends Partial<UserProfile>>(
  select: string,
): Promise<{
  user: User | null;
  profile: TProfile | null;
}> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null as TProfile | null };
  }

  const { data: profile } = await supabase
    .from("users")
    .select(select)
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (profile ?? null) as TProfile | null };
}

const getCurrentUserBasicProfileCached = cache(() =>
  getCurrentUserProfileBySelect<BasicUserProfile>("id,name,email,role"),
);
const getCurrentUserFullProfileCached = cache(() =>
  getCurrentUserProfileBySelect<UserProfile>("*"),
);

export async function getCurrentUserBasicProfile() {
  return getCurrentUserBasicProfileCached();
}

export async function getCurrentUserWithProfile() {
  return getCurrentUserFullProfileCached();
}

export async function requireUser() {
  const { user, profile } = await getCurrentUserBasicProfile();

  if (!user) {
    redirect("/auth/login?error=Silakan+login+terlebih+dahulu");
  }

  return { user, profile };
}

export async function requireAdmin() {
  const { user, profile } = await getCurrentUserBasicProfile();

  if (!user) {
    redirect("/admin?error=Silakan+login+sebagai+admin");
  }

  if (!profile || profile.role !== "admin") {
    redirect("/admin?error=Akun+ini+bukan+admin");
  }

  return { user, profile };
}
