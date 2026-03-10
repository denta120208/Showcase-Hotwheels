import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gii.Diecast | Showcase Catalog",
  description: "Katalog diecast komunitas Gii.Diecast dengan pemesanan via WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="poppins-regular antialiased">
        <WebVitalsReporter />
        <SiteHeader />
        <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
