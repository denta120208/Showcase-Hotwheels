import Image from "next/image";
import Link from "next/link";

import { SHOPEE_STORE_URL, WHATSAPP_GROUP_MAIN } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-blue-200/10 bg-[#010814]/95">
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="flex items-center gap-3">
          <div className="hero-logo-shell relative h-12 w-12 overflow-hidden">
            <Image src="/logo-clean.png" alt="Logo GII.Diecast" fill sizes="48px" />
          </div>
          <div className="min-w-0">
            <p className="display-font truncate text-xl leading-none text-white">
              Gii.<span className="brand-gradient">Diecast</span>
            </p>
            <p className="text-xs text-slate-300 sm:line-clamp-2">
              Katalog komunitas kolektor diecast. Pemesanan via WhatsApp admin.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href={WHATSAPP_GROUP_MAIN}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn-outline w-full px-3 py-1.5 text-center sm:w-auto"
          >
            Join Group
          </a>
          <a
            href={SHOPEE_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn-outline w-full px-3 py-1.5 text-center sm:w-auto"
          >
            Shopee Store
          </a>
          <Link href="/products" className="neo-btn-outline w-full px-3 py-1.5 text-center sm:w-auto">
            Katalog
          </Link>
        </div>
      </div>
    </footer>
  );
}
