"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="panel mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-rose-300/30 p-6 text-center sm:p-8">
      <p className="section-label border-rose-300/40 bg-rose-500/15 text-rose-100">
        Gangguan Sementara
      </p>
      <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
        Halaman gagal dimuat
      </h2>
      <p className="mt-2 text-sm text-slate-200 sm:text-base">
        Biasanya ini karena koneksi lambat atau request ke server sedang sibuk.
      </p>

      <div className="mt-5 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="neo-btn-primary w-full px-4 py-2 text-sm sm:w-auto"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="neo-btn-outline w-full px-4 py-2 text-sm sm:w-auto"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
