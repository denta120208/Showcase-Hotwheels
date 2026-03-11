import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProductAction } from "@/app/actions/admin-products";
import { GalleryImageInputs } from "@/components/admin/gallery-image-inputs";
import { ValidatedImageInput } from "@/components/admin/validated-image-input";
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
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <section className="panel rounded-2xl border border-emerald-300/25 p-4 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="display-font text-2xl text-white sm:text-4xl">Edit Produk</h1>
            <p className="muted-text text-sm">Ubah data, stok, dan foto produk.</p>
          </div>
          <Link
            href="/admin"
            className="w-full rounded-lg border border-slate-300/35 px-3 py-2 text-center text-xs font-semibold text-slate-200 hover:bg-slate-200/10 sm:w-auto sm:py-1.5"
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

        <form
          action={updateProductAction}
          className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2"
        >
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
              <a
                href={product.image_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Klik untuk melihat gambar ukuran asli"
                className="group relative block h-44 overflow-hidden rounded-2xl border border-blue-100/20 bg-black/30 sm:h-52"
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute right-3 bottom-3 rounded-full border border-sky-200/45 bg-sky-400/20 px-2.5 py-1 text-[10px] font-semibold text-sky-100">
                  Klik ukuran asli
                </span>
              </a>
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
            <ValidatedImageInput
              id="cover_image"
              name="cover_image"
              hint="Maks 3 MB per foto. Jika lebih, kompres terlebih dahulu."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <p className="text-xs font-semibold text-slate-200">Gallery Saat Ini</p>
            {images.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada gambar gallery.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="space-y-2 rounded-xl border border-blue-100/20 bg-slate-950/40 p-2"
                  >
                    <a
                      href={image.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Klik untuk melihat gambar ukuran asli"
                      className="group relative block h-32 overflow-hidden rounded-lg sm:h-28"
                    >
                      <Image
                        src={image.image_url}
                        alt={`Gallery ${image.id}`}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                      <span className="absolute right-1.5 bottom-1.5 rounded-full border border-sky-200/45 bg-sky-400/20 px-2 py-0.5 text-[9px] font-semibold text-sky-100">
                        Ukuran asli
                      </span>
                    </a>
                    <label className="flex items-center gap-2 text-xs text-slate-200">
                      <input type="checkbox" name="remove_image_ids" value={image.id} />
                      Hapus foto ini
                    </label>
                  </div>
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
            <GalleryImageInputs idBase="gallery_images" />
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
            className="mt-2 w-full rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-300 md:col-span-2"
          >
            Simpan Perubahan
          </button>
        </form>
      </section>
    </div>
  );
}
