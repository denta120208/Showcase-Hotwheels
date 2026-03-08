import Link from "next/link";

import { deleteProductAction } from "@/app/actions/admin-products";
import { loginAction } from "@/app/actions/auth";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { getPaginatedProducts } from "@/lib/products";
import { formatCurrency, getFirstParam, toInt } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function buildAdminUrl({ q, page }: { q: string; page: number }) {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }
  params.set("page", String(page));
  return `/admin?${params.toString()}`;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const q = getFirstParam(resolved.q).trim();
  const page = toInt(getFirstParam(resolved.page, "1"), 1);
  const message = getFirstParam(resolved.message);
  const error = getFirstParam(resolved.error);
  const { user, profile } = await getCurrentUserWithProfile();
  const isAdmin = Boolean(user && profile?.role === "admin");

  if (!isAdmin) {
    const accessError = error || (user ? "Akun ini bukan admin." : "");

    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <section className="panel rounded-3xl border border-blue-200/20 p-5 sm:p-6">
          <h1 className="display-font text-3xl text-white sm:text-4xl">Admin Login</h1>
          <p className="muted-text mt-1 text-sm">
            Akses dashboard admin hanya melalui halaman ini: /admin
          </p>

          {accessError ? (
            <div className="mt-4 rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
              {accessError}
            </div>
          ) : null}

          {message ? (
            <div className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {message}
            </div>
          ) : null}

          <form action={loginAction} className="mt-5 space-y-3">
            <input type="hidden" name="intent" value="admin" />
            <div className="space-y-1">
              <label htmlFor="identifier" className="text-xs font-semibold text-slate-200">
                Username / Email Admin
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                placeholder="contoh: admin"
                className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-300/60"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-300"
            >
              Login Admin
            </button>
          </form>
        </section>
      </div>
    );
  }

  const products = await getPaginatedProducts({
    search: q,
    page,
    pageSize: 10,
  });

  return (
    <div className="space-y-5">
      <section className="panel rounded-3xl border border-emerald-300/25 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="display-font page-title text-white">Admin Dashboard</h1>
            <p className="muted-text mt-1 text-sm">
              Kelola produk, stok, harga, dan foto katalog.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-emerald-950 hover:bg-emerald-300"
          >
            + Tambah Produk
          </Link>
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

        <form className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari produk..."
            className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
          />
          <button
            type="submit"
            className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-sky-300"
          >
            Cari
          </button>
        </form>
      </section>

      <section className="panel overflow-hidden rounded-2xl border border-blue-200/20">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/40 text-xs text-slate-300 uppercase">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.items.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                  <td className="px-4 py-3 text-sky-200">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{item.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                      {item.is_soldout ? (
                        <span className="rounded-full bg-rose-500 px-2 py-1 text-white">
                          SOLD OUT
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500 px-2 py-1 text-emerald-50">
                          READY
                        </span>
                      )}
                      {item.is_limited ? (
                        <span className="rounded-full bg-amber-400 px-2 py-1 text-black">
                          LIMITED
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${item.id}/edit`}
                        className="rounded-lg border border-sky-200/40 px-3 py-1.5 text-xs font-semibold text-sky-100 hover:bg-sky-200/10"
                      >
                        Edit
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="product_id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-rose-300/40 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-400/15"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {products.items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-slate-300" colSpan={5}>
                    Produk belum ada.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={buildAdminUrl({ q, page: Math.max(1, products.page - 1) })}
          className="rounded-lg border border-blue-200/30 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-blue-100/10"
        >
          Prev
        </Link>
        <span className="text-xs text-slate-300">
          Page {products.page} / {products.totalPages}
        </span>
        <Link
          href={buildAdminUrl({
            q,
            page: Math.min(products.totalPages, products.page + 1),
          })}
          className="rounded-lg border border-blue-200/30 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-blue-100/10"
        >
          Next
        </Link>
      </section>
    </div>
  );
}
