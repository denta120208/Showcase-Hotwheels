import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants";

export function FloatingWhatsappButton() {
  const url = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-3 bottom-3 z-50 flex items-center gap-2 rounded-full border border-emerald-300/40 bg-gradient-to-r from-emerald-400 to-emerald-300 px-3 py-2 text-xs font-bold text-emerald-950 shadow-xl shadow-emerald-950/40 transition hover:scale-[1.03] hover:from-emerald-300 hover:to-emerald-200 sm:right-4 sm:bottom-4 sm:px-4 sm:text-sm"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-900/20 text-[11px] font-extrabold">
        WA
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
      <span className="sm:hidden">Chat</span>
    </a>
  );
}
