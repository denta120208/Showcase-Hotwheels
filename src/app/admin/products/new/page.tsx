import Link from "next/link";

import { createProductAction } from "@/app/actions/admin-products";
import { requireAdmin } from "@/lib/auth";
import { getFirstParam } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const resolved = await searchParams;
  const error = getFirstParam(resolved.error);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="panel rounded-3xl border border-emerald-300/25 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="display-font text-3xl text-white sm:text-4xl">Tambah Produk</h1>
            <p className="muted-text text-sm">Tambah produk baru ke katalog.</p>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-300/35 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-200/10"
          >
            Kembali
          </Link>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <form action={createProductAction} className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="name" className="text-xs font-semibold text-slate-200">
              Nama Produk
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="price" className="text-xs font-semibold text-slate-200">
              Harga
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              required
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="stock" className="text-xs font-semibold text-slate-200">
              Stok
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min={0}
              defaultValue={0}
              required
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="description"
              className="text-xs font-semibold text-slate-200"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="cover_image"
              className="text-xs font-semibold text-slate-200"
            >
              Cover Image (wajib)
            </label>
            <input
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/*"
              required
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-400 file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-900"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="gallery_images"
              className="text-xs font-semibold text-slate-200"
            >
              Gallery Images (opsional)
            </label>
            <input
              id="gallery_images"
              name="gallery_images"
              type="file"
              accept="image/*"
              multiple
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-400 file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-900"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" name="is_limited" className="h-4 w-4" />
            Limited edition
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" name="is_soldout" className="h-4 w-4" />
            Tandai sold out
          </label>

          <button
            type="submit"
            className="md:col-span-2 mt-2 w-full rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-300"
          >
            Simpan Produk
          </button>
        </form>
      </section>
    </div>
  );
}
