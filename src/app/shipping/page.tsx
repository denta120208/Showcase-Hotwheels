import { ForumIcon, ShippingIcon } from "@/components/ui/app-icons";

export default function ShippingPage() {
  return (
    <div className="space-y-5">
      <section className="panel rounded-3xl border border-blue-200/20 p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200/35 bg-cyan-400/15 text-cyan-100">
            <ShippingIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="display-font page-title text-white">Pengiriman</h1>
        </div>
        <p className="muted-text mt-2 text-sm">
          Untuk saat ini pengiriman resmi hanya menggunakan Lion Parcel.
        </p>
      </section>

      <section className="panel rounded-2xl border border-blue-200/20 p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <ForumIcon className="h-5 w-5 text-cyan-100" aria-hidden="true" />
          Syarat Komplain
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
          <li>Wajib menyertakan video unboxing dari awal paket dibuka.</li>
          <li>Video tidak boleh terpotong (no cut).</li>
        </ul>
      </section>
    </div>
  );
}
