import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import {
  HomeIcon,
  PaymentIcon,
  ProductsIcon,
  ShippingIcon,
} from "@/components/ui/app-icons";
import { getCurrentUserBasicProfile } from "@/lib/auth";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/products", label: "Produk", icon: ProductsIcon },
  { href: "/payment", label: "Payment", icon: PaymentIcon },
  { href: "/shipping", label: "Pengiriman", icon: ShippingIcon },
];

export async function SiteHeader() {
  const { profile } = await getCurrentUserBasicProfile();
  const isAdmin = profile?.role === "admin";
  const navLinks = isAdmin ? links.slice(0, 1) : links;

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/15 bg-[#020a1d]/84 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="hero-logo-shell relative h-12 w-12 overflow-hidden transition duration-200 group-hover:scale-[1.03]">
            <Image
              src="/logo-clean.png"
              alt="Logo GII.Diecast"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="display-font truncate text-xl leading-none text-white">
              Gii.<span className="brand-gradient">Diecast</span>
            </p>
            <p className="truncate text-[10px] font-semibold tracking-[0.16em] text-blue-100/80 uppercase">
              Collector Community
            </p>
          </div>
        </Link>

        <div className="order-2 ml-auto flex items-center gap-2 lg:order-3">
          {profile ? (
            <>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="rounded-full border border-emerald-300/45 bg-emerald-400/12 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-400/20"
                >
                  <span className="sm:hidden">Admin</span>
                  <span className="hidden sm:inline">Dashboard Admin</span>
                </Link>
              ) : null}
              <div className="hidden items-center gap-2 rounded-full border border-blue-200/30 bg-slate-950/45 px-2 py-1 lg:flex">
                <span className="max-w-[170px] truncate pl-1 text-xs text-slate-200">
                  Halo, {profile.name}
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-full border border-red-300/35 bg-red-500/12 px-2.5 py-1 text-[11px] font-semibold text-red-100 hover:bg-red-500/24"
                  >
                    Logout
                  </button>
                </form>
              </div>
              <form action={logoutAction} className="lg:hidden">
                <button
                  type="submit"
                  className="rounded-full border border-red-300/35 bg-red-500/12 px-3 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-500/24"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-slate-300/35 bg-slate-950/20 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:border-sky-300/60"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="neo-btn-primary px-3 py-1.5 text-xs"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <nav className="order-3 w-full overflow-x-auto rounded-2xl border border-blue-200/18 bg-[#0a1f46]/55 p-1.5 text-sm font-medium text-slate-100 lg:order-2 lg:mx-auto lg:w-auto lg:rounded-full">
          <div className="flex min-w-max items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 transition hover:border-blue-200/40 hover:bg-blue-300/12"
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-100/90" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
