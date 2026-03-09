import type { UserProfile } from "@/lib/supabase/types";

export const requiredAddressFields = [
  { key: "address_detail", label: "Detail Alamat / Patokan" },
  { key: "village", label: "Kota / Desa" },
  { key: "regency", label: "Kabupaten" },
  { key: "district", label: "Kecamatan" },
  { key: "province", label: "Provinsi" },
  { key: "postal_code", label: "Kode Pos" },
] as const;

type RequiredAddressKey = (typeof requiredAddressFields)[number]["key"];

export type AddressProfileSnapshot = Pick<UserProfile, RequiredAddressKey> | null | undefined;

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export function hasCompletedAddressProfile(profile: AddressProfileSnapshot) {
  return requiredAddressFields.every((field) => hasValue(profile?.[field.key]));
}

export function getMissingAddressLabels(profile: AddressProfileSnapshot) {
  return requiredAddressFields
    .filter((field) => !hasValue(profile?.[field.key]))
    .map((field) => field.label);
}
