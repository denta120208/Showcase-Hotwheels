import { loginAction } from "@/app/actions/auth";
import { PasswordField } from "@/components/auth/password-field";

export function AdminLoginPanel({
  error,
  message,
}: {
  error: string;
  message: string;
}) {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <section className="panel rounded-2xl border border-blue-200/20 p-4 sm:rounded-3xl sm:p-6">
        <h1 className="display-font text-2xl text-white sm:text-4xl">Admin Login</h1>
        <p className="muted-text mt-1 text-sm">
          Akses dashboard admin hanya melalui halaman ini: /admin
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

        <form action={loginAction} className="mt-5 space-y-3 sm:space-y-4">
          <input type="hidden" name="intent" value="admin" />
          <div className="space-y-1">
            <label htmlFor="identifier" className="text-xs font-semibold text-slate-200">
              Username / Email Admin
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              placeholder="contoh: admin"
              className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-300/60"
            />
          </div>

          <PasswordField id="password" label="Password" required />

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-300"
          >
            Login Admin
          </button>
        </form>
      </section>
    </div>
  );
}
