export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-sky-200/25" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-300 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-100">Memuat katalog...</p>
        <p className="text-xs text-slate-400">Tunggu sebentar ya.</p>
      </div>
    </div>
  );
}
