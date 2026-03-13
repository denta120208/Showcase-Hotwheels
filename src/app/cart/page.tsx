import Image from "next/image";
import Link from "next/link";

import {
  clearSelectedCartItemsAction,
  decrementCartItemQtyAction,
  deselectAllCartItemsAction,
  incrementCartItemQtyAction,
  removeCartItemAction,
  selectAllCartItemsAction,
} from "@/app/actions/cart";
import { CartSelectCheckbox } from "@/components/cart/cart-select-checkbox";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCurrency, getFirstParam, isSafeImageUrl } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

type CartRowWithProduct = {
  id: number;
  product_id: number;
  quantity: number;
  is_selected: boolean;
  products: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
    is_soldout: boolean;
    is_limited: boolean;
  } | null;
};

function buildCartWhatsappText({
  checkoutAt,
  items,
  customerFields,
}: {
  checkoutAt: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
  }>;
  customerFields: string;
}) {
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const isMoreThanTwoItems = items.length > 2 || totalQty > 2;

  const itemLines = items.flatMap((item, index) => [
    `Produk ${index + 1}: ${item.name}`,
    `Qty: ${item.qty}`,
    `Harga: ${formatCurrency(item.price)}`,
    `Subtotal: ${formatCurrency(item.qty * item.price)}`,
    "",
  ]);

  return [
    "Halo admin Gii.Diecast, saya ingin checkout beberapa barang berikut (via Cart):",
    `Catatan: Checkout cart (${items.length} produk / ${totalQty} pcs).`,
    ...(isMoreThanTwoItems ? ["Catatan tambahan: Ini checkout lebih dari 2 barang."] : []),
    "",
    ...itemLines,
    `Total Produk: ${items.length}`,
    `Total Qty: ${totalQty}`,
    `Total Harga: ${formatCurrency(totalPrice)}`,
    `Waktu Checkout: ${checkoutAt} WIB`,
    "",
    "Data Pembeli:",
    customerFields,
  ].join("\n");
}

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const message = getFirstParam(resolved.message);
  const error = getFirstParam(resolved.error);

  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    return (
      <section className="panel rounded-3xl border border-blue-200/20 p-5 sm:p-8">
        <h1 className="display-font text-3xl text-white sm:text-4xl">Cart</h1>
        <p className="muted-text mt-2 text-sm">
          Silakan login untuk menyimpan cart dan checkout beberapa produk sekaligus.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/auth/login" className="neo-btn-primary px-5 py-2 text-sm">
            Login
          </Link>
          <Link href="/products" className="neo-btn-outline px-5 py-2 text-sm">
            Lihat Produk
          </Link>
        </div>
      </section>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data, error: cartError } = await supabase
    .from("cart_items")
    .select(
      "id,product_id,quantity,is_selected,created_at,products(id,name,price,image_url,stock,is_soldout,is_limited)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const cartItems = (data ?? []) as CartRowWithProduct[];
  const selectedItems = cartItems.filter((row) => row.is_selected && row.products);
  const checkoutItems = selectedItems.map((row) => ({
    name: row.products?.name ?? "Produk",
    qty: row.quantity,
    price: row.products?.price ?? 0,
  }));

  const checkoutAt = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
    hour12: false,
  }).format(new Date());

  const customerFields = [
    ["Nama Lengkap", profile?.name],
    ["No Telp", profile?.phone],
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

  const whatsappText = buildCartWhatsappText({
    checkoutAt,
    items: checkoutItems,
    customerFields,
  });
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappText,
  )}`;

  const totalSelectedQty = checkoutItems.reduce((sum, item) => sum + item.qty, 0);
  const totalSelectedPrice = checkoutItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  return (
    <div className="space-y-5">
      <section className="panel-strong rounded-3xl border border-sky-200/20 p-5 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label">Cart</span>
            <h1 className="display-font mt-3 text-3xl text-white sm:text-4xl">
              Checkout Banyak Produk
            </h1>
            <p className="muted-text mt-2 text-sm">
              Pilih item yang mau kamu checkout, lalu lanjut ke WhatsApp admin.
            </p>
          </div>
          <Link href="/products" className="neo-btn-outline px-4 py-2 text-sm">
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

        {cartError ? (
          <div className="mt-4 rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
            {cartError.message}
          </div>
        ) : null}
      </section>

      <section className="panel rounded-3xl border border-blue-200/20 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-200">
            Dipilih:{" "}
            <span className="font-semibold text-white">
              {checkoutItems.length} produk / {totalSelectedQty} pcs
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <form action={selectAllCartItemsAction}>
              <button type="submit" className="neo-btn-outline px-3 py-1.5 text-xs">
                Pilih semua
              </button>
            </form>
            <form action={deselectAllCartItemsAction}>
              <button type="submit" className="neo-btn-outline px-3 py-1.5 text-xs">
                Batal pilih
              </button>
            </form>
            <form action={clearSelectedCartItemsAction}>
              <button
                type="submit"
                className="rounded-full border border-rose-300/40 bg-rose-500/12 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-500/20"
              >
                Hapus dipilih
              </button>
            </form>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 p-6 text-center text-sm text-slate-300">
            Cart kamu kosong.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {cartItems.map((row) => {
              const product = row.products;
              const imageUrl = isSafeImageUrl(product?.image_url) ? product?.image_url : null;
              const isSoldOut = Boolean(product?.is_soldout) || (product?.stock ?? 0) <= 0;
              const canIncrement = !isSoldOut && (product?.stock ?? 0) > row.quantity;

              return (
                <article
                  key={row.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CartSelectCheckbox cartItemId={row.id} defaultChecked={row.is_selected} />
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-blue-100/18 bg-slate-950/40">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product?.name ?? "Produk"}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {product?.name ?? "Produk"}
                      </p>
                      <p className="text-xs text-slate-300">
                        Harga:{" "}
                        <span className="font-semibold text-sky-200">
                          {formatCurrency(product?.price ?? 0)}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Stok: {product?.stock ?? 0}
                        {isSoldOut ? " (Sold out)" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <div className="flex items-center gap-1 rounded-full border border-blue-100/18 bg-slate-950/35 p-1">
                      <form action={decrementCartItemQtyAction}>
                        <input type="hidden" name="cart_item_id" value={row.id} />
                        <button
                          type="submit"
                          aria-label="Kurangi qty"
                          className="h-8 w-8 rounded-full border border-white/10 bg-slate-900/40 text-sm font-bold text-white hover:bg-slate-900/65"
                        >
                          -
                        </button>
                      </form>
                      <span className="min-w-10 text-center text-sm font-bold text-white">
                        {row.quantity}
                      </span>
                      <form action={incrementCartItemQtyAction}>
                        <input type="hidden" name="cart_item_id" value={row.id} />
                        <button
                          type="submit"
                          aria-label="Tambah qty"
                          disabled={!canIncrement}
                          className={`h-8 w-8 rounded-full border text-sm font-bold ${
                            canIncrement
                              ? "border-white/10 bg-slate-900/40 text-white hover:bg-slate-900/65"
                              : "cursor-not-allowed border-white/10 bg-slate-900/20 text-slate-500"
                          }`}
                        >
                          +
                        </button>
                      </form>
                    </div>

                    <form action={removeCartItemAction}>
                      <input type="hidden" name="cart_item_id" value={row.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-rose-300/40 bg-rose-500/12 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-500/20"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-blue-200/18 bg-slate-950/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">Total dipilih</p>
            <p className="text-sm font-black text-sky-200">
              {formatCurrency(totalSelectedPrice)}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Pesan WhatsApp akan berisi daftar item (multi-item) supaya admin tahu kamu checkout
            lebih dari 1 barang.
          </p>

          {checkoutItems.length > 0 ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn-whatsapp-admin mt-4 inline-flex min-h-11 w-full items-center justify-center px-5 py-2.5 text-sm"
            >
              Checkout via WhatsApp
            </a>
          ) : (
            <span className="mt-4 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-600 px-5 py-2.5 text-sm font-bold text-slate-300">
              Pilih item dulu untuk checkout
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
