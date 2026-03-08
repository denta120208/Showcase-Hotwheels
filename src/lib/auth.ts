import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "./supabase/server";
import type { UserProfile } from "./supabase/types";

export async function getCurrentUserWithProfile(): Promise<{
  user: User | null;
  profile: UserProfile | null;
}> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null as UserProfile | null };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (profile ?? null) as UserProfile | null };
}

export async function requireUser() {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/login?error=Silakan+login+terlebih+dahulu");
  }

  return { user, profile };
}

export async function requireAdmin() {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/admin?error=Silakan+login+sebagai+admin");
  }

  if (!profile || profile.role !== "admin") {
    redirect("/admin?error=Akun+ini+bukan+admin");
  }

  return { user, profile };
}
