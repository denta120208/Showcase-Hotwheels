import { NextResponse } from "next/server";

import { createSimplePdf, wrapTextForPdf } from "@/lib/simple-pdf";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserRegistrationsForExport } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
    hour12: false,
  }).format(date);
}

function toSafeInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function valueOrDash(value: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

function appendField(lines: string[], label: string, value: string | null) {
  const wrapped = wrapTextForPdf(`${label}: ${valueOrDash(value)}`, 90);
  wrapped.forEach((line, index) => {
    lines.push(index === 0 ? line : `   ${line}`);
  });
}

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = toSafeInt(searchParams.get("page"), 1);
  const pageSize = toSafeInt(searchParams.get("pageSize"), 12);

  const users = await getUserRegistrationsForExport({
    search: q,
    page,
    pageSize,
  });

  const lines: string[] = [];
  const now = new Date();
  lines.push("GII.DIECAST - DATA REGISTRASI USER");
  lines.push("===========================================================");
  lines.push(`Waktu Export   : ${formatDateTime(now)} WIB`);
  lines.push(`Filter Pencarian : ${q || "-"}`);
  lines.push(`Halaman Export : ${Math.max(1, page)} (jumlah data: ${users.length})`);
  lines.push("===========================================================");
  lines.push("");

  users.forEach((item, index) => {
    const registeredAt = formatDateTime(new Date(item.created_at));
    lines.push(`USER #${index + 1}`);
    lines.push("-----------------------------------------------------------");
    appendField(lines, "Nama Lengkap", item.name);
    appendField(lines, "No Telp", item.phone);
    appendField(lines, "Email", item.email);
    appendField(lines, "TikTok / Instagram", item.tiktok);
    appendField(lines, "Detail Alamat", item.address_detail);
    appendField(lines, "Kota / Desa", item.village);
    appendField(lines, "Kecamatan", item.district);
    appendField(lines, "Kabupaten", item.regency);
    appendField(lines, "Provinsi", item.province);
    appendField(lines, "Kode Pos", item.postal_code);
    appendField(lines, "Terdaftar", `${registeredAt} WIB`);
    lines.push("-----------------------------------------------------------");
    lines.push("");
  });

  if (users.length === 0) {
    lines.push("Tidak ada data user pada filter/halaman ini.");
  }

  const pdfBuffer = createSimplePdf(lines);
  const fileDate = now.toISOString().slice(0, 10);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="data-registrasi-user-${fileDate}.pdf"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
