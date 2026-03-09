"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getMissingAddressLabels,
  hasCompletedAddressProfile,
} from "@/lib/user-profile";

function toInputValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function redirectWithError(message: string): never {
  redirect(`/user/profile?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(message: string): never {
  redirect(`/user/profile?message=${encodeURIComponent(message)}`);
}

export async function updateUserProfileAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?error=Silakan+login+terlebih+dahulu");
  }

  const name = toInputValue(formData, "name");
  const phone = toInputValue(formData, "phone");
  const tiktok = toInputValue(formData, "tiktok");
  const addressDetail = toInputValue(formData, "address_detail");
  const village = toInputValue(formData, "village");
  const province = toInputValue(formData, "province");
  const regency = toInputValue(formData, "regency");
  const district = toInputValue(formData, "district");
  const postalCode = toInputValue(formData, "postal_code");
  const email = user.email?.trim().toLowerCase() ?? "";

  if (!name || !phone) {
    redirectWithError("Nama dan no telp wajib diisi.");
  }

  if (!email) {
    redirectWithError("Email akun tidak ditemukan.");
  }

  const nextAddressSnapshot = {
    address_detail: addressDetail || null,
    village: village || null,
    regency: regency || null,
    district: district || null,
    province: province || null,
    postal_code: postalCode || null,
  };

  const missingAddressLabels = getMissingAddressLabels(nextAddressSnapshot);
  if (missingAddressLabels.length > 0) {
    redirectWithError(`Alamat belum lengkap: ${missingAddressLabels.join(", ")}.`);
  }

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("users")
    .select("role,address_detail,village,regency,district,province,postal_code")
    .eq("id", user.id)
    .maybeSingle();

  if (currentProfileError) {
    redirectWithError(currentProfileError.message);
  }

  if (currentProfile?.role === "admin") {
    redirect("/admin");
  }

  const wasAddressCompleted = hasCompletedAddressProfile(currentProfile);

  const { error: updateError } = await supabase.from("users").upsert(
    {
      id: user.id,
      name,
      email,
      role: "user",
      phone: phone || null,
      tiktok: tiktok || null,
      address_detail: addressDetail || null,
      village: village || null,
      province: province || null,
      regency: regency || null,
      district: district || null,
      postal_code: postalCode || null,
    },
    { onConflict: "id" },
  );

  if (updateError) {
    redirectWithError(updateError.message);
  }

  if (!wasAddressCompleted) {
    await supabase.auth.signOut();
    redirect(
      "/auth/login?message=Profil+alamat+berhasil+disimpan.+Sekarang+login+pakai+akunmu.",
    );
  }

  redirectWithMessage("Profil berhasil diperbarui.");
}
