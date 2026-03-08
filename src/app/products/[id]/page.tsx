import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUserWithProfile } from "@/lib/auth";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants";
import { getProductById } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

type Params = {
  id: string;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    notFound();
  }

  const productData = await getProductById(productId);
  if (!productData) {
    notFound();
  }

  const { product, images } = productData;
  const { user, profile } = await getCurrentUserWithProfile();

  const gallery = [
    ...(product.image_url
      ? [
          {
            id: -1,
            image_url: product.image_url,
          },
        ]
      : []),
    ...images.map((image) => ({
      id: image.id,
      image_url: image.image_url,
    })),
  ];

  const checkoutAt = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
    hour12: false,
  }).format(new Date());

  const customerFields = [
    ["Nama Lengkap", profile?.name],
    ["No Telp", profile?.phone],
    ["Email", profile?.email],
    ["TikTok / Instagram", profile?.tiktok],
    ["Detail Alamat", profile?.address_detail],
    ["Kota / Desa", profile?.village],
    ["Kabupaten", profile?.regency],
    ["Kecamatan", profile?.district],
    ["Provinsi", profile?.province],
    ["Kode Pos", profile?.postal_code],
  ]
    .map(([label, value]) => `${label}: ${value ? String(value).trim() : "-"}`)
    .join("\n");

  const orderMessage = encodeURIComponent(
    [
      "Halo admin Gii.Diecast, saya ingin checkout barang berikut:",
      "",
      `Produk: ${product.name}`,
      `Harga: ${formatCurrency(product.price)}`,
      `Waktu Checkout: ${checkoutAt} WIB`,
      "",
      "Data Pembeli:",
      customerFields,
    ].join("\n"),
  );
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${orderMessage}`;

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.1fr_1fr]">
      <section className="panel rounded-3xl border border-blue-200/20 p-3 sm:p-6">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className={`relative overflow-hidden rounded-2xl border border-blue-100/20 bg-black/40 ${
                  index === 0 ? "sm:col-span-2 aspect-[16/10]" : "aspect-square"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-sky-900/12" />
                <div className="absolute inset-2 overflow-hidden rounded-xl border border-white/10 bg-black/25">
                  <Image
                    src={image.image_url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={72}
                    priority={index === 0}
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center rounded-2xl border border-blue-100/15 bg-slate-950/40 text-sm text-slate-300">
            Belum ada foto produk.
          </div>
        )}
      </section>

      <section className="panel rounded-3xl border border-blue-200/20 p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-extrabold text-white sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1 text-xl font-black text-sky-300 sm:text-2xl">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span
              className={`rounded-full px-3 py-1 ${
                product.is_soldout
                  ? "bg-rose-500 text-rose-50"
                  : "bg-emerald-500 text-emerald-50"
              }`}
            >
              {product.is_soldout ? "SOLD OUT" : "READY STOCK"}
            </span>
            {product.is_limited ? (
              <span className="rounded-full bg-amber-400 px-3 py-1 text-black">
                LIMITED EDITION
              </span>
            ) : null}
          </div>

          <p className="text-sm leading-7 text-slate-200">
            {product.description || "Belum ada deskripsi produk."}
          </p>

          <p className="text-sm text-slate-200">Stok saat ini: {product.stock}</p>

          {!user ? (
            <div className="space-y-3 rounded-2xl border border-sky-300/30 bg-sky-400/10 p-4">
              <p className="text-sm text-sky-100">
                Kamu harus register/login dulu sebelum bisa memesan via WhatsApp.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/auth/register"
                  className="w-full rounded-xl bg-sky-400 px-4 py-2 text-center text-sm font-bold text-slate-900 hover:bg-sky-300 sm:w-auto"
                >
                  Register
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full rounded-xl border border-sky-200/40 px-4 py-2 text-center text-sm font-semibold text-sky-100 hover:bg-sky-200/10 sm:w-auto"
                >
                  Login
                </Link>
              </div>
            </div>
          ) : product.is_soldout ? (
            <span className="inline-flex w-full cursor-not-allowed justify-center rounded-xl bg-slate-600 px-4 py-2 text-sm font-bold text-slate-300 sm:w-auto">
              Produk Sedang Habis
            </span>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-emerald-950 hover:bg-emerald-400 sm:w-auto"
            >
              Pesan via WhatsApp
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
