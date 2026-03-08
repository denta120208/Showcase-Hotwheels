import Link from "next/link";

import { loginAction } from "@/app/actions/auth";
import { getFirstParam } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const error = getFirstParam(resolved.error);
  const message = getFirstParam(resolved.message);

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <section className="panel rounded-3xl border border-blue-200/20 p-6">
        <h1 className="display-font text-4xl text-white">Login User</h1>
        <p className="muted-text mt-1 text-sm">
          Login untuk bisa melakukan pemesanan via WhatsApp.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-300/35 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        <form action={loginAction} className="mt-5 space-y-3">
          <input type="hidden" name="intent" value="user" />
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-slate-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-sky-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-xs text-slate-300">
          <Link href="/auth/register" className="hover:text-white">
            Belum punya akun? Register
          </Link>
        </div>
      </section>
    </div>
  );
}
