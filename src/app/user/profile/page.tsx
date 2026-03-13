import { redirect } from "next/navigation";

import { updateUserProfileAction } from "@/app/actions/user-profile";
import { getCurrentUserWithProfile } from "@/lib/auth";
import {
  getMissingAddressLabels,
  hasCompletedAddressProfile,
} from "@/lib/user-profile";
import { getFirstParam } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function InputField({
  id,
  label,
  defaultValue,
  type = "text",
  required = false,
  readOnly = false,
}: {
  id: string;
  label: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-200">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        readOnly={readOnly}
        className={`w-full rounded-xl border border-blue-100/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400 ${
          readOnly
            ? "bg-slate-900/70 text-slate-300"
            : "bg-slate-950/45 focus:border-sky-300/60"
        }`}
      />
    </div>
  );
}

export default async function UserProfilePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/login?error=Silakan+login+terlebih+dahulu");
  }

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  const fallbackName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name.trim()
      : "";

  const fallbackUsername =
    typeof user.user_metadata?.username === "string"
      ? user.user_metadata.username.trim().toLowerCase()
      : "";

  const derivedUsername =
    !fallbackUsername && typeof user.email === "string" && user.email.endsWith("@user.gii-diecast.local")
      ? user.email.split("@")[0] ?? ""
      : fallbackUsername;

  const data = {
    name: profile?.name ?? fallbackName,
    username: profile?.username ?? derivedUsername,
    phone: profile?.phone ?? "",
    tiktok: profile?.tiktok ?? "",
    address_detail: profile?.address_detail ?? "",
    village: profile?.village ?? "",
    province: profile?.province ?? "",
    regency: profile?.regency ?? "",
    district: profile?.district ?? "",
    postal_code: profile?.postal_code ?? "",
  };

  const resolved = await searchParams;
  const error = getFirstParam(resolved.error);
  const message = getFirstParam(resolved.message);
  const addressCompleted = hasCompletedAddressProfile(data);
  const missingAddress = getMissingAddressLabels(data);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <section className="panel-strong rounded-3xl border border-blue-200/25 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="section-label">User Profile</span>
            <h1 className="display-font mt-3 text-3xl text-white sm:text-4xl">
              Profil Pengguna
            </h1>
            <p className="muted-text mt-1 text-sm">
              Lengkapi dan update alamat untuk kebutuhan pengiriman pesanan.
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              addressCompleted
                ? "border-emerald-300/45 bg-emerald-500/15 text-emerald-100"
                : "border-amber-300/45 bg-amber-500/15 text-amber-100"
            }`}
          >
            {addressCompleted ? "Alamat Lengkap" : "Alamat Wajib Dilengkapi"}
          </span>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        {!addressCompleted ? (
          <div className="mt-4 rounded-xl border border-amber-200/35 bg-amber-500/10 p-3 text-sm text-amber-100">
            Lengkapi dulu semua data alamat berikut: {missingAddress.join(", ")}.
          </div>
        ) : null}

        <form action={updateUserProfileAction} className="mt-5 grid gap-3 md:grid-cols-2">
          <InputField id="name" label="Nama Lengkap" defaultValue={data.name} required />
          <InputField id="phone" label="No Telp" defaultValue={data.phone} required />
          <InputField
            id="tiktok"
            label="Nama TikTok / Instagram"
            defaultValue={data.tiktok}
          />
          <InputField
            id="username"
            label="Username"
            defaultValue={data.username}
            readOnly
          />

          <InputField id="village" label="Kota / Desa" defaultValue={data.village} required />
          <InputField id="province" label="Provinsi" defaultValue={data.province} required />
          <InputField id="regency" label="Kabupaten" defaultValue={data.regency} required />
          <InputField id="district" label="Kecamatan" defaultValue={data.district} required />
          <InputField
            id="postal_code"
            label="Kode Pos"
            defaultValue={data.postal_code}
            required
          />

          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="address_detail"
              className="text-xs font-semibold text-slate-200"
            >
              Detail Alamat / Patokan
            </label>
            <textarea
              id="address_detail"
              name="address_detail"
              rows={4}
              required
              defaultValue={data.address_detail}
              placeholder="Contoh: pagar hitam, tembok putih, samping sekolah..."
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/45 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-300/60"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 mt-1 w-full rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-sky-300"
          >
            Simpan Profil
          </button>
        </form>
      </section>
    </div>
  );
}
