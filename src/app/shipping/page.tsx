export default function ShippingPage() {
  return (
    <div className="space-y-5">
      <section className="panel rounded-3xl border border-blue-200/20 p-6">
        <h1 className="display-font page-title text-white">Pengiriman</h1>
        <p className="muted-text mt-2 text-sm">
          Untuk saat ini pengiriman resmi hanya menggunakan Lion Parcel.
        </p>
      </section>

      <section className="panel rounded-2xl border border-blue-200/20 p-5">
        <h2 className="text-lg font-bold text-white">Syarat Komplain</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
          <li>Wajib menyertakan video unboxing dari awal paket dibuka.</li>
          <li>Video tidak boleh terpotong (no cut).</li>
        </ul>
      </section>
    </div>
  );
}
