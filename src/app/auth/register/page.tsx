import Link from "next/link";

import { registerAction } from "@/app/actions/auth";
import { getFirstParam } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function Field({
  id,
  label,
  required = false,
  type = "text",
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
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
        required={required}
        className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
      />
    </div>
  );
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const error = getFirstParam(resolved.error);
  const message = getFirstParam(resolved.message);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="panel rounded-3xl border border-blue-200/20 p-6">
        <h1 className="display-font text-4xl text-white">Register User</h1>
        <p className="muted-text mt-1 text-sm">
          Isi data lengkap user sebelum melakukan pemesanan.
        </p>

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

        <form action={registerAction} className="mt-5 grid gap-3 md:grid-cols-2">
          <Field id="name" label="Nama Lengkap" required />
          <Field id="phone" label="No Telp" required />
          <Field id="tiktok" label="Nama TikTok / Instagram" />
          <Field id="email" label="Email" required type="email" />
          <Field id="village" label="Kota / Desa" />
          <Field id="province" label="Provinsi" />
          <Field id="regency" label="Kabupaten" />
          <Field id="district" label="Kecamatan" />
          <Field id="postal_code" label="Kode Pos" />
          <Field id="password" label="Password" required type="password" />

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
              placeholder="Contoh: pagar hitam, tembok putih, samping sekolah..."
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-300/60"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 mt-1 w-full rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-sky-300"
          >
            Buat Akun
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-300">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-semibold text-sky-200 hover:text-white">
            Login di sini
          </Link>
        </p>
      </section>
    </div>
  );
}
