import Link from "next/link";

import { createProductAction } from "@/app/actions/admin-products";
import { GalleryImageInputs } from "@/components/admin/gallery-image-inputs";
import { ValidatedImageInput } from "@/components/admin/validated-image-input";
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
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <section className="panel rounded-2xl border border-emerald-300/25 p-4 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="display-font text-2xl text-white sm:text-4xl">Tambah Produk</h1>
            <p className="muted-text text-sm">Tambah produk baru ke katalog.</p>
          </div>
          <Link
            href="/admin"
            className="w-full rounded-lg border border-slate-300/35 px-3 py-2 text-center text-xs font-semibold text-slate-200 hover:bg-slate-200/10 sm:w-auto sm:py-1.5"
          >
            Kembali
          </Link>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <form
          action={createProductAction}
          className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2"
        >
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
            <ValidatedImageInput
              id="cover_image"
              name="cover_image"
              required
              hint="Maks 3 MB per foto. Jika lebih, kompres terlebih dahulu."
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="gallery_images"
              className="text-xs font-semibold text-slate-200"
            >
              Gallery Images (opsional)
            </label>
            <GalleryImageInputs idBase="gallery_images" />
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
            className="mt-2 w-full rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-300 md:col-span-2"
          >
            Simpan Produk
          </button>
        </form>
      </section>
    </div>
  );
}
