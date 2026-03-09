import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { getPaginatedUserRegistrations } from "@/lib/users";
import { getFirstParam, toInt } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function buildUsersUrl({ q, page }: { q: string; page: number }) {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }
  params.set("page", String(page));
  return `/admin/users?${params.toString()}`;
}

function formatRegisteredAt(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
    hour12: false,
  }).format(new Date(value));
}

function valueOrDash(value: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const resolved = await searchParams;
  const q = getFirstParam(resolved.q).trim();
  const page = toInt(getFirstParam(resolved.page, "1"), 1);
  const message = getFirstParam(resolved.message);
  const error = getFirstParam(resolved.error);

  const users = await getPaginatedUserRegistrations({
    search: q,
    page,
    pageSize: 12,
  });

  const prevPage = Math.max(1, users.page - 1);
  const nextPage = Math.min(users.totalPages, users.page + 1);
  const hasPrev = users.page > 1;
  const hasNext = users.page < users.totalPages;

  const exportParams = new URLSearchParams();
  if (q) {
    exportParams.set("q", q);
  }
  exportParams.set("page", String(users.page));
  exportParams.set("pageSize", String(users.pageSize));

  const exportAllParams = new URLSearchParams();
  if (q) {
    exportAllParams.set("q", q);
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="panel rounded-2xl border border-emerald-300/25 p-4 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="display-font text-2xl text-white sm:text-4xl">
              Data Registrasi User
            </h1>
            <p className="muted-text mt-1 text-sm">
              Data lengkap mengikuti field registrasi user, termasuk alamat detail.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Link
              href="/admin"
              className="rounded-xl border border-slate-300/35 px-4 py-2 text-center text-sm font-semibold text-slate-200 hover:bg-slate-200/10"
            >
              Kembali Dashboard
            </Link>
            <Link
              href={`/admin/users/export?${exportParams.toString()}`}
              className="rounded-xl bg-sky-400 px-4 py-2 text-center text-sm font-bold text-slate-900 hover:bg-sky-300"
            >
              Export PDF Halaman Ini
            </Link>
            <Link
              href={`/admin/users/export-all?${exportAllParams.toString()}`}
              className="rounded-xl border border-emerald-300/45 bg-emerald-400/16 px-4 py-2 text-center text-sm font-bold text-emerald-100 hover:bg-emerald-400/26"
            >
              Export PDF Semua User
            </Link>
          </div>
        </div>

        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <form className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama / email / no telp (min 2 huruf)"
            className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-300 sm:min-w-[96px]"
          >
            Cari
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-300">
          Menampilkan {users.items.length} dari {users.totalCount} user.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Export semua user diproses bertahap agar tetap aman di hosting free tier.
        </p>
      </section>

      <section className="panel overflow-hidden rounded-2xl border border-blue-200/20">
        <div className="space-y-3 p-3 lg:hidden">
          {users.items.map((item) => {
            return (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-slate-950/35 p-3 sm:rounded-2xl"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="break-all text-xs text-sky-200">{item.email}</p>
                  <p className="text-xs text-slate-300">No Telp: {valueOrDash(item.phone)}</p>
                  <p className="text-xs text-slate-300">
                    TikTok/Instagram: {valueOrDash(item.tiktok)}
                  </p>
                  <p className="text-xs text-slate-200">
                    Detail Alamat: {valueOrDash(item.address_detail)}
                  </p>
                  <p className="text-xs text-slate-200">
                    Kota/Desa: {valueOrDash(item.village)}
                  </p>
                  <p className="text-xs text-slate-200">
                    Kecamatan: {valueOrDash(item.district)}
                  </p>
                  <p className="text-xs text-slate-200">
                    Kabupaten: {valueOrDash(item.regency)}
                  </p>
                  <p className="text-xs text-slate-200">
                    Provinsi: {valueOrDash(item.province)}
                  </p>
                  <p className="text-xs text-slate-200">
                    Kode Pos: {valueOrDash(item.postal_code)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Terdaftar: {formatRegisteredAt(item.created_at)}
                  </p>
                </div>
              </article>
            );
          })}

          {users.items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/30 px-4 py-6 text-center text-sm text-slate-300">
              Data user belum ada.
            </div>
          ) : null}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/40 text-xs text-slate-300 uppercase">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Alamat Lengkap Registrasi</th>
                <th className="px-4 py-3">Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              {users.items.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="mt-0.5 text-xs text-sky-200">{item.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    <p>No Telp: {valueOrDash(item.phone)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      TikTok/IG: {valueOrDash(item.tiktok)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    <div className="max-w-[480px] space-y-0.5 text-xs">
                      <p>Detail Alamat: {valueOrDash(item.address_detail)}</p>
                      <p>Kota/Desa: {valueOrDash(item.village)}</p>
                      <p>Kecamatan: {valueOrDash(item.district)}</p>
                      <p>Kabupaten: {valueOrDash(item.regency)}</p>
                      <p>Provinsi: {valueOrDash(item.province)}</p>
                      <p>Kode Pos: {valueOrDash(item.postal_code)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    {formatRegisteredAt(item.created_at)}
                  </td>
                </tr>
              ))}

              {users.items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-slate-300" colSpan={4}>
                    Data user belum ada.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-2 sm:justify-center">
        <Link
          href={buildUsersUrl({ q, page: prevPage })}
          className={`min-w-[72px] rounded-lg border border-blue-200/30 px-3 py-1.5 text-center text-xs font-semibold text-slate-200 hover:bg-blue-100/10 ${
            hasPrev ? "" : "pointer-events-none opacity-40"
          }`}
          aria-disabled={!hasPrev}
        >
          Prev
        </Link>
        <span className="text-xs text-slate-300">
          Page {users.page} / {users.totalPages}
        </span>
        <Link
          href={buildUsersUrl({ q, page: nextPage })}
          className={`min-w-[72px] rounded-lg border border-blue-200/30 px-3 py-1.5 text-center text-xs font-semibold text-slate-200 hover:bg-blue-100/10 ${
            hasNext ? "" : "pointer-events-none opacity-40"
          }`}
          aria-disabled={!hasNext}
        >
          Next
        </Link>
      </section>
    </div>
  );
}
