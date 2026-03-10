import Image from "next/image";

import { PAYMENT_METHODS } from "@/lib/constants";

function getPaymentType(title: string) {
  const normalized = title.toUpperCase();

  if (["GO-PAY", "DANA", "SPAY", "OVO"].includes(normalized)) {
    return "E-Wallet";
  }

  return "Bank Transfer";
}

export default function PaymentPage() {
  return (
    <div className="space-y-5">
      <section className="panel rounded-3xl border border-blue-200/20 p-6">
        <h1 className="display-font page-title text-white">Payment Method</h1>
        <p className="muted-text mt-2 text-sm">
          Transfer hanya ke rekening dan e-wallet resmi di bawah ini.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PAYMENT_METHODS.map((item) => {
          const typeLabel = getPaymentType(item.title);

          return (
            <article
              key={`${item.title}-${item.accountNumber}`}
              className="panel rounded-2xl border border-blue-200/20 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-blue-200/35 bg-white/95">
                  <Image
                    src={item.logoSrc}
                    alt={`Logo ${item.title}`}
                    fill
                    sizes="44px"
                    className="object-contain p-1.5"
                  />
                </span>
                <span className="rounded-full border border-white/20 bg-slate-900/35 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-slate-200 uppercase">
                  {typeLabel}
                </span>
              </div>

              <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-slate-300 uppercase">
                {item.title}
              </p>
              <p className="mt-1.5 text-lg font-black text-white tabular-nums">{item.accountNumber}</p>
              <p className="text-sm text-slate-200">{item.accountName}</p>
            </article>
          );
        })}
      </section>

      <section className="panel rounded-2xl border border-amber-300/35 bg-amber-500/10 p-5 text-sm text-amber-100">
        <ul className="list-disc space-y-1 pl-5">
          <li>Jika terjadi salah transfer, tidak ada refund.</li>
          <li>Wajib kirim bukti transfer ke admin setelah pembayaran.</li>
        </ul>
      </section>
    </div>
  );
}
