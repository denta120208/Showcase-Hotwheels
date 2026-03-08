import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getLatestProducts } from "@/lib/products";
import {
  SHOPEE_STORE_URL,
  WHATSAPP_GROUP_FORUM,
  WHATSAPP_GROUP_MAIN,
} from "@/lib/constants";

export default async function HomePage() {
  const latestProducts = await getLatestProducts(6);

  return (
    <div className="space-y-10 sm:space-y-14">
      <section className="panel-strong hero-scan dot-pattern relative overflow-hidden rounded-[24px] p-5 sm:rounded-[28px] sm:p-10">
        <div className="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <span className="section-label">Modern Collector Store</span>
            <h1 className="display-font page-title text-white">
              Gii.<span className="brand-gradient">Diecast</span> Showcase
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200">
              Katalog diecast komunitas dengan gaya motorsport premium. Pilih
              koleksi favoritmu lalu pesan langsung ke admin via WhatsApp.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <Link href="/products" className="neo-btn-primary w-full px-5 py-2 text-center text-sm sm:w-auto">
                Lihat Produk
              </Link>
              <a
                href={WHATSAPP_GROUP_MAIN}
                className="neo-btn-outline w-full px-5 py-2 text-center text-sm sm:w-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join WhatsApp Group
              </a>
              <a
                href={SHOPEE_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn-outline w-full px-5 py-2 text-center text-sm sm:w-auto"
              >
                Shopee Store
              </a>
            </div>

            <a
              href={WHATSAPP_GROUP_FORUM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-blue-200/25 bg-blue-400/8 px-4 py-1.5 text-xs font-semibold text-slate-100 hover:bg-blue-300/16"
            >
              Forum Chat WhatsApp
            </a>
          </div>

          <div className="space-y-4">
            <div className="hero-logo-shell relative mx-auto h-[220px] w-[220px] overflow-hidden sm:h-[280px] sm:w-[280px] lg:h-[320px] lg:w-[320px]">
              <Image
                src="/logo-clean.png"
                alt="Logo Gii.Diecast"
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
                className="object-cover"
                priority
              />
            </div>
            <div className="panel mx-auto max-w-sm rounded-2xl border border-blue-200/20 px-4 py-3 text-sm text-slate-200">
              <p className="font-semibold text-white">
                Pemesanan tidak checkout otomatis.
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Semua order diproses manual via WhatsApp admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
          <div>
            <p className="section-label mb-3">Drop Terbaru</p>
            <h2 className="display-font text-3xl text-white sm:text-4xl">
              Produk Terbaru
            </h2>
            <p className="muted-text max-w-xl text-sm">
              Koleksi update terbaru dari Gii.Diecast. Setiap item bisa dicek
              status stock, limited tag, dan detail foto.
            </p>
          </div>
          <Link
            href="/products"
            className="neo-btn-outline w-full px-4 py-2 text-center text-xs sm:w-auto"
          >
            Lihat Semua
          </Link>
        </div>

        {latestProducts.length === 0 ? (
          <div className="panel rounded-2xl p-8 text-sm text-slate-200">
            Produk belum tersedia. Login sebagai admin lalu tambahkan produk.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
