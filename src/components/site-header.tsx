import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { getCurrentUserWithProfile } from "@/lib/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Produk" },
  { href: "/payment", label: "Payment" },
  { href: "/shipping", label: "Pengiriman" },
];

export async function SiteHeader() {
  const { profile } = await getCurrentUserWithProfile();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/15 bg-[#020a1d]/84 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
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

        <div className="ml-auto flex items-center gap-2">
          {profile ? (
            <>
              {profile.role === "admin" ? (
                <Link
                  href="/admin"
                  className="rounded-full border border-emerald-300/45 bg-emerald-400/12 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-400/20"
                >
                  <span className="sm:hidden">Admin</span>
                  <span className="hidden sm:inline">Dashboard Admin</span>
                </Link>
              ) : null}
              <span className="hidden text-xs text-slate-300 md:inline">
                Halo, {profile.name}
              </span>
              <form action={logoutAction}>
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

        <nav className="order-3 w-full overflow-x-auto rounded-2xl border border-blue-200/18 bg-[#0a1f46]/55 p-1.5 text-sm font-medium text-slate-100 sm:order-none sm:w-auto sm:rounded-full">
          <div className="flex min-w-max items-center gap-1.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-blue-200/40 hover:bg-blue-300/12"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
