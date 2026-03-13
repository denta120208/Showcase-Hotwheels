import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import {
  CartIcon,
  HomeIcon,
  PaymentIcon,
  ProductsIcon,
  ShippingIcon,
} from "@/components/ui/app-icons";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasCompletedAddressProfile } from "@/lib/user-profile";

const homeLink = { href: "/", label: "Home", icon: HomeIcon };
const catalogLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/products", label: "Produk", icon: ProductsIcon },
  { href: "/payment", label: "Payment Method", icon: PaymentIcon },
  { href: "/shipping", label: "Pengiriman", icon: ShippingIcon },
];

export async function SiteHeader() {
  const { user, profile } = await getCurrentUserWithProfile();
  const isAdmin = profile?.role === "admin";
  const addressCompleted = hasCompletedAddressProfile(profile);
  const navLinks = isAdmin
    ? [homeLink]
    : profile
      ? addressCompleted
        ? catalogLinks
        : [homeLink]
      : catalogLinks;

  let cartQty = 0;
  const showCartLink = !isAdmin && (!profile || addressCompleted);
  if (user && showCartLink) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: cartRows } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id);

      cartQty = (cartRows ?? []).reduce(
        (sum, row) => sum + (typeof row.quantity === "number" ? row.quantity : 0),
        0,
      );
    } catch {
      cartQty = 0;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/15 bg-[#020a1d]/84 backdrop-blur-md">
      <div className="flex w-full flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="hero-logo-shell relative h-12 w-12 overflow-hidden transition duration-200 group-hover:scale-[1.03]">
            <Image
              src="/logo.png"
              alt="Logo GII.Diecast"
              fill
              sizes="48px"
              className="scale-[1.02] rounded-full object-cover object-[46%_50%]"
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
          {showCartLink ? (
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/45 bg-emerald-400/12 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-400/20"
              aria-label="Buka cart"
            >
              <CartIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              {cartQty > 0 ? (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-[10px] font-extrabold text-emerald-950">
                  {cartQty}
                </span>
              ) : null}
            </Link>
          ) : null}
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
              ) : (
                <Link
                  href="/user/profile"
                  className="rounded-full border border-sky-300/40 bg-sky-400/12 px-3 py-1.5 text-xs font-semibold text-sky-100 hover:bg-sky-400/24"
                >
                  Profil
                </Link>
              )}
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

        <nav className="order-3 w-full overflow-x-auto rounded-2xl border border-blue-200/18 bg-[#0a1f46]/55 p-1.5 text-sm font-medium text-slate-100 lg:order-2 lg:mx-auto lg:w-auto lg:overflow-x-visible lg:rounded-full">
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
