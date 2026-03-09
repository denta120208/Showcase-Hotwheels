import { NextResponse } from "next/server";

import { createSimplePdf, wrapTextForPdf } from "@/lib/simple-pdf";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAllUserRegistrationsForExport } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXPORT_BATCH_SIZE = 100;
const EXPORT_MAX_ROWS = 2500;

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
    hour12: false,
  }).format(date);
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
  const now = new Date();

  const { items: users, truncated } = await getAllUserRegistrationsForExport({
    search: q,
    batchSize: EXPORT_BATCH_SIZE,
    maxRows: EXPORT_MAX_ROWS,
  });

  const lines: string[] = [];
  lines.push("GII.DIECAST - DATA REGISTRASI USER (EXPORT SEMUA)");
  lines.push("===========================================================");
  lines.push(`Waktu Export   : ${formatDateTime(now)} WIB`);
  lines.push(`Filter Pencarian : ${q || "-"}`);
  lines.push(`Total Data Export : ${users.length}`);
  lines.push(`Mode Export    : Semua Data (batch ${EXPORT_BATCH_SIZE})`);

  if (truncated) {
    lines.push(`Catatan        : Data dipotong maksimal ${EXPORT_MAX_ROWS} user per file.`);
  }

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
    lines.push("Tidak ada data user untuk filter ini.");
  }

  const pdfBuffer = createSimplePdf(lines);
  const fileDate = now.toISOString().slice(0, 10);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="data-registrasi-user-semua-${fileDate}.pdf"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
