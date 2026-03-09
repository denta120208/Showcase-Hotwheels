import { BankIcon, PaymentIcon, WalletIcon } from "@/components/ui/app-icons";
import { PAYMENT_METHODS } from "@/lib/constants";

function getPaymentVisual(title: string) {
  const normalized = title.toUpperCase();

  if (["GO-PAY", "DANA", "SPAY", "OVO"].includes(normalized)) {
    return {
      icon: WalletIcon,
      badgeClass: "border-fuchsia-300/40 bg-fuchsia-500/18 text-fuchsia-100",
      typeLabel: "E-Wallet",
    };
  }

  return {
    icon: BankIcon,
    badgeClass: "border-sky-300/45 bg-sky-500/18 text-sky-100",
    typeLabel: "Bank Transfer",
  };
}

export default function PaymentPage() {
  return (
    <div className="space-y-5">
      <section className="panel rounded-3xl border border-blue-200/20 p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200/35 bg-sky-400/15 text-sky-100">
            <PaymentIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="display-font page-title text-white">Payment Method</h1>
        </div>
        <p className="muted-text mt-2 text-sm">
          Transfer hanya ke rekening dan e-wallet resmi di bawah ini.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PAYMENT_METHODS.map((item) => {
          const visual = getPaymentVisual(item.title);
          const Icon = visual.icon;

          return (
            <article
              key={`${item.title}-${item.accountNumber}`}
              className="panel rounded-2xl border border-blue-200/20 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${visual.badgeClass}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-white/20 bg-slate-900/35 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-slate-200 uppercase">
                  {visual.typeLabel}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-slate-300 uppercase">
                {item.title}
              </p>
              <p className="mt-1.5 text-lg font-black text-white">{item.accountNumber}</p>
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
