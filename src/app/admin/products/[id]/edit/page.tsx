import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProductAction } from "@/app/actions/admin-products";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { getFirstParam } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;
type Params = {
  id: string;
};

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const [{ id }, resolvedSearch] = await Promise.all([params, searchParams]);
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    notFound();
  }

  const data = await getProductById(productId);
  if (!data) {
    notFound();
  }

  const { product, images } = data;
  const message = getFirstParam(resolvedSearch.message);
  const error = getFirstParam(resolvedSearch.error);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <section className="panel rounded-3xl border border-emerald-300/25 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="display-font text-3xl text-white sm:text-4xl">Edit Produk</h1>
            <p className="muted-text text-sm">Ubah data, stok, dan foto produk.</p>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-300/35 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-200/10"
          >
            Kembali
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

        <form action={updateProductAction} className="mt-5 grid gap-3 md:grid-cols-2">
          <input type="hidden" name="product_id" value={product.id} />

          <div className="space-y-1 md:col-span-2">
            <label htmlFor="name" className="text-xs font-semibold text-slate-200">
              Nama Produk
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={product.name}
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
              defaultValue={product.price}
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
              required
              defaultValue={product.stock}
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
              defaultValue={product.description ?? ""}
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="text-xs font-semibold text-slate-200">Cover Saat Ini</p>
            {product.image_url ? (
              <div className="relative h-52 overflow-hidden rounded-2xl border border-blue-100/20 bg-black/30">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400">Belum ada cover.</p>
            )}
          </div>

          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="cover_image"
              className="text-xs font-semibold text-slate-200"
            >
              Ganti Cover (opsional)
            </label>
            <input
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-400 file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-900"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <p className="text-xs font-semibold text-slate-200">Gallery Saat Ini</p>
            {images.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada gambar gallery.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((image) => (
                  <label
                    key={image.id}
                    className="space-y-2 rounded-xl border border-blue-100/20 bg-slate-950/40 p-2"
                  >
                    <div className="relative h-28 overflow-hidden rounded-lg">
                      <Image
                        src={image.image_url}
                        alt={`Gallery ${image.id}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <input type="checkbox" name="remove_image_ids" value={image.id} />
                      Hapus foto ini
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="gallery_images"
              className="text-xs font-semibold text-slate-200"
            >
              Tambah Gallery Baru
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
            <input
              type="checkbox"
              name="is_limited"
              defaultChecked={product.is_limited}
              className="h-4 w-4"
            />
            Limited edition
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              name="is_soldout"
              defaultChecked={product.is_soldout}
              className="h-4 w-4"
            />
            Tandai sold out
          </label>

          <button
            type="submit"
            className="md:col-span-2 mt-2 w-full rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-300"
          >
            Simpan Perubahan
          </button>
        </form>
      </section>
    </div>
  );
}
