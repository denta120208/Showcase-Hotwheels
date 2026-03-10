import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import {
  ForumIcon,
  ProductsIcon,
  ShopeeIcon,
  UserIcon,
  WhatsappIcon,
} from "@/components/ui/app-icons";
import { getLatestProducts } from "@/lib/products";
import {
  ADMIN_WHATSAPP_NUMBER,
  SHOPEE_STORE_URL,
  WHATSAPP_GROUP_FORUM,
  WHATSAPP_GROUP_MAIN,
} from "@/lib/constants";

export default async function HomePage() {
  const latestProducts = await getLatestProducts(6);
  const personalWhatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}`;

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

            <div className="sm:hidden">
              <div className="relative overflow-hidden rounded-2xl border border-cyan-200/22 bg-[#071d40]/52 p-3">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-cyan-300/18 blur-2xl" />
                <div className="relative space-y-2.5">
                  <div className="grid gap-2">
                    <a
                      href={personalWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-btn-whatsapp-admin inline-flex min-h-12 w-full items-center justify-center gap-2.5 px-5 py-2.5 text-[0.95rem] font-extrabold"
                    >
                      <UserIcon className="h-5 w-5 text-emerald-950/85" aria-hidden="true" />
                      Chat WhatsApp Admin
                    </a>
                    <Link
                      href="/products"
                      className="neo-btn-primary inline-flex min-h-11 w-full items-center justify-center gap-2 px-5 py-2 text-sm"
                    >
                      <ProductsIcon className="h-4 w-4" aria-hidden="true" />
                      Lihat Produk
                    </Link>
                    <a
                      href={WHATSAPP_GROUP_MAIN}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-400/14 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/24"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsappIcon className="h-4 w-4 text-emerald-100" aria-hidden="true" />
                      Join WhatsApp Group
                    </a>
                  </div>

                  <div className="grid gap-2">
                    <a
                      href={SHOPEE_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-orange-200/40 bg-orange-400/14 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-400/24"
                    >
                      <ShopeeIcon className="h-4 w-4 text-orange-100" aria-hidden="true" />
                      Shopee Store
                    </a>
                    <a
                      href={WHATSAPP_GROUP_FORUM}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-sky-200/35 bg-sky-400/12 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-300/22"
                    >
                      <ForumIcon className="h-4 w-4 text-cyan-100" aria-hidden="true" />
                      Forum Chat WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={personalWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn-whatsapp-admin inline-flex min-h-12 w-full basis-full items-center justify-center gap-2.5 px-7 py-3 text-base font-extrabold"
                >
                  <UserIcon className="h-5 w-5 text-emerald-950/85" aria-hidden="true" />
                  Chat WhatsApp Admin
                </a>
                <Link
                  href="/products"
                  className="neo-btn-primary inline-flex w-full items-center justify-center gap-2 px-5 py-2 text-sm sm:w-auto"
                >
                  <ProductsIcon className="h-4 w-4" aria-hidden="true" />
                  Lihat Produk
                </Link>
                <a
                  href={WHATSAPP_GROUP_MAIN}
                  className="neo-btn-outline inline-flex w-full items-center justify-center gap-2 px-5 py-2 text-sm sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                  Join WhatsApp Group
                </a>
                <a
                  href={SHOPEE_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn-outline inline-flex w-full items-center justify-center gap-2 px-5 py-2 text-sm sm:w-auto"
                >
                  <ShopeeIcon className="h-4 w-4 text-orange-200" aria-hidden="true" />
                  Shopee Store
                </a>
              </div>

              <a
                href={WHATSAPP_GROUP_FORUM}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-blue-200/25 bg-blue-400/8 px-4 py-1.5 text-xs font-semibold text-slate-100 hover:bg-blue-300/16"
              >
                <ForumIcon className="h-4 w-4 text-cyan-100" aria-hidden="true" />
                Forum Chat WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="hero-logo-shell relative mx-auto h-[220px] w-[220px] overflow-hidden sm:h-[280px] sm:w-[280px] lg:h-[320px] lg:w-[320px]">
              <Image
                src="/logo.png"
                alt="Logo Gii.Diecast"
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
                className="rounded-full object-contain object-center p-2 sm:p-3"
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
