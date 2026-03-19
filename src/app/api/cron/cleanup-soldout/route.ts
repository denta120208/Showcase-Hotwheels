import { NextResponse } from "next/server";

import { cleanupExpiredSoldoutProducts } from "@/lib/products";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim() === secret;
  }

  const url = new URL(request.url);
  return url.searchParams.get("token") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await cleanupExpiredSoldoutProducts();
  return NextResponse.json({ ok: true });
}
