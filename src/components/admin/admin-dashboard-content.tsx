import Image from "next/image";
import Link from "next/link";

import { deleteProductAction } from "@/app/actions/admin-products";
import { getPaginatedProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

function buildAdminUrl({ q, page }: { q: string; page: number }) {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }
  params.set("page", String(page));
  return `/admin?${params.toString()}`;
}

function ProductStatusBadges({
  isSoldOut,
  isLimited,
}: {
  isSoldOut: boolean;
  isLimited: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1 text-[10px] font-bold">
      {isSoldOut ? (
        <span className="rounded-full bg-rose-500 px-2 py-1 text-white">SOLD OUT</span>
      ) : (
        <span className="rounded-full bg-emerald-500 px-2 py-1 text-emerald-50">
          READY
        </span>
      )}
      {isLimited ? (
        <span className="rounded-full bg-amber-400 px-2 py-1 text-black">LIMITED</span>
      ) : null}
    </div>
  );
}

export async function AdminDashboardContent({
  q,
  page,
  message,
  error,
}: {
  q: string;
  page: number;
  message: string;
  error: string;
}) {
  const products = await getPaginatedProducts({
    search: q,
    page,
    pageSize: 10,
  });
  const prevPage = Math.max(1, products.page - 1);
  const nextPage = Math.min(products.totalPages, products.page + 1);
  const hasPrev = products.page > 1;
  const hasNext = products.page < products.totalPages;

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="panel rounded-2xl border border-emerald-300/25 p-4 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="display-font text-3xl text-white sm:text-4xl lg:text-5xl">
              Admin Dashboard
            </h1>
            <p className="muted-text mt-1 text-sm">
              Kelola produk, stok, harga, dan foto katalog.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
            <Link
              href="/admin/users"
              className="rounded-xl border border-sky-200/45 bg-sky-400/12 px-4 py-2 text-center text-sm font-semibold text-sky-100 hover:bg-sky-400/22"
            >
              Data Registrasi
            </Link>
            <Link
              href="/admin/products/new"
              className="rounded-xl bg-emerald-400 px-4 py-2 text-center text-sm font-bold text-emerald-950 hover:bg-emerald-300"
            >
              + Tambah Produk
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
            placeholder="Cari produk..."
            className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
          />
          <button
            type="submit"
            className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-sky-300 sm:min-w-[100px]"
          >
            Cari
          </button>
        </form>
      </section>

      <section className="panel overflow-hidden rounded-2xl border border-blue-200/20">
        <div className="space-y-3 p-3 lg:hidden">
          {products.items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/10 bg-slate-950/35 p-3 sm:rounded-2xl"
            >
              <div className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-blue-100/20 bg-slate-900/50 sm:h-16 sm:w-16">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-sm font-semibold text-sky-200">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-xs text-slate-300">Stok: {item.stock}</p>
                  <ProductStatusBadges
                    isSoldOut={item.is_soldout}
                    isLimited={item.is_limited}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                <Link
                  href={`/admin/products/${item.id}/edit`}
                  className="rounded-lg border border-sky-200/40 px-3 py-2 text-center text-xs font-semibold text-sky-100 hover:bg-sky-200/10"
                >
                  Edit
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="product_id" value={item.id} />
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-rose-300/40 px-3 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-400/15"
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </article>
          ))}

          {products.items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/30 px-4 py-6 text-center text-sm text-slate-300">
              Produk belum ada.
            </div>
          ) : null}
        </div>

        <div className="hidden overflow-x-auto lg:block">
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-blue-100/20 bg-slate-900/50">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                            No
                          </div>
                        )}
                      </div>
                      <span className="max-w-[280px] truncate font-semibold text-white lg:max-w-[360px]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sky-200">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{item.stock}</td>
                  <td className="px-4 py-3">
                    <ProductStatusBadges
                      isSoldOut={item.is_soldout}
                      isLimited={item.is_limited}
                    />
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

      <section className="flex flex-wrap items-center justify-between gap-2 sm:justify-center">
        <Link
          href={buildAdminUrl({ q, page: prevPage })}
          className={`min-w-[72px] rounded-lg border border-blue-200/30 px-3 py-1.5 text-center text-xs font-semibold text-slate-200 hover:bg-blue-100/10 ${
            hasPrev ? "" : "pointer-events-none opacity-40"
          }`}
          aria-disabled={!hasPrev}
        >
          Prev
        </Link>
        <span className="text-xs text-slate-300">
          Page {products.page} / {products.totalPages}
        </span>
        <Link
          href={buildAdminUrl({ q, page: nextPage })}
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

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-5">
      <section className="panel rounded-3xl border border-emerald-300/25 p-5 sm:p-6">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-700/45" />
        <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded-lg bg-slate-700/35" />
        <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-slate-700/30" />
      </section>
      <section className="panel h-[420px] animate-pulse rounded-2xl border border-blue-200/20 bg-slate-900/20" />
    </div>
  );
}
