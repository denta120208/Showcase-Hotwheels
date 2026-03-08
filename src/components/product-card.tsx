import Image from "next/image";
import Link from "next/link";

import type { ProductCardItem } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductCardItem }) {
  const isSoldOut = product.is_soldout;

  return (
    <article className="product-card panel group overflow-hidden rounded-3xl border border-blue-200/20">
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-blue-100/15 bg-slate-950/50">
          {product.image_url ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/35 to-sky-900/16" />
              <div className="absolute inset-3 overflow-hidden rounded-2xl border border-white/12 bg-black/26 shadow-[0_14px_30px_rgba(2,8,20,0.44)]">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={70}
                  className="object-contain p-2.5 transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              Belum ada foto
            </div>
          )}

          <div className="absolute -bottom-8 -left-2 h-20 w-28 rotate-12 bg-cyan-300/18 blur-xl transition duration-500 group-hover:opacity-95" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isSoldOut ? (
              <span className="rounded-full bg-rose-500 px-2 py-1 text-[10px] font-bold text-white">
                SOLD OUT
              </span>
            ) : null}
            {product.is_limited ? (
              <span className="rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-black">
                LIMITED
              </span>
            ) : null}
          </div>

          <span className="absolute right-3 bottom-3 rounded-full border border-cyan-200/45 bg-cyan-300/18 px-2.5 py-1 text-[11px] font-semibold text-cyan-100">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 min-h-12 text-base font-semibold text-white">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2 text-xs">
            <p className="text-slate-300">
              Stok: <span className="font-semibold text-white">{product.stock}</span>
            </p>
            <span
              className={`rounded-full px-2 py-1 font-semibold ${
                isSoldOut
                  ? "bg-rose-500/18 text-rose-100"
                  : "bg-emerald-500/20 text-emerald-100"
              }`}
            >
              {isSoldOut ? "Habis" : "Ready"}
            </span>
          </div>
          <span className="inline-flex rounded-full border border-blue-200/35 bg-blue-300/10 px-3 py-1 text-[11px] font-semibold text-blue-100">
            Lihat Detail
          </span>
        </div>
      </Link>
    </article>
  );
}
