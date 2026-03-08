import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getPaginatedProducts, type ProductFilter } from "@/lib/products";
import { getFirstParam, toInt } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

const filterOptions: { label: string; value: ProductFilter }[] = [
  { label: "Semua", value: "all" },
  { label: "Ready", value: "ready" },
  { label: "Sold Out", value: "soldout" },
  { label: "Limited", value: "limited" },
];

function buildProductsUrl({
  q,
  filter,
  page,
}: {
  q: string;
  filter: ProductFilter;
  page: number;
}) {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }
  if (filter !== "all") {
    params.set("filter", filter);
  }
  params.set("page", String(page));

  return `/products?${params.toString()}`;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const q = getFirstParam(resolved.q).trim();
  const rawFilter = getFirstParam(resolved.filter, "all");
  const filter = filterOptions.some((item) => item.value === rawFilter)
    ? (rawFilter as ProductFilter)
    : "all";
  const page = toInt(getFirstParam(resolved.page, "1"), 1);
  const message = getFirstParam(resolved.message);

  const result = await getPaginatedProducts({
    search: q,
    filter,
    page,
    pageSize: 12,
  });

  const pageNumbers = Array.from(
    { length: result.totalPages },
    (_, index) => index + 1,
  ).slice(Math.max(0, result.page - 3), Math.min(result.totalPages, result.page + 2));

  return (
    <div className="space-y-6">
      <section className="panel-strong rounded-3xl border border-sky-200/20 p-4 sm:p-6">
        <div className="space-y-3">
          <span className="section-label">Catalog</span>
          <h1 className="display-font page-title text-white">Katalog Produk</h1>
          <p className="muted-text text-sm">
            Cari produk diecast favoritmu dan pesan langsung via WhatsApp admin.
          </p>
        </div>

        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        <form className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama produk..."
            className="rounded-xl border border-blue-100/20 bg-slate-950/45 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-300/60"
          />
          <select
            name="filter"
            defaultValue={filter}
            className="rounded-xl border border-blue-100/20 bg-slate-950/45 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-900">
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="neo-btn-primary w-full px-4 py-2.5 text-sm md:w-auto"
          >
            Cari
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <p className="muted-text text-sm">
          Menampilkan {result.items.length} dari {result.totalCount} produk.
        </p>

        {result.items.length === 0 ? (
          <div className="panel rounded-2xl p-8 text-sm text-slate-200">
            Produk tidak ditemukan. Coba ubah kata kunci atau filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={buildProductsUrl({
            q,
            filter,
            page: Math.max(1, result.page - 1),
          })}
          className="neo-btn-outline px-3 py-1.5 text-xs"
        >
          Prev
        </Link>

        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={buildProductsUrl({ q, filter, page: pageNumber })}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              pageNumber === result.page
                ? "neo-btn-primary"
                : "neo-btn-outline"
            }`}
          >
            {pageNumber}
          </Link>
        ))}

        <Link
          href={buildProductsUrl({
            q,
            filter,
            page: Math.min(result.totalPages, result.page + 1),
          })}
          className="neo-btn-outline px-3 py-1.5 text-xs"
        >
          Next
        </Link>
      </section>
    </div>
  );
}
