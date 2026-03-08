import { NextResponse } from "next/server";

const TRACKED_METRICS = new Set(["LCP", "CLS", "INP"]);

type MetricPayload = {
  id: string;
  name: string;
  value: number;
  rating: string;
  delta: number;
  navigationType?: string;
  path?: string;
  ts?: number;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as MetricPayload;

    if (!payload || !TRACKED_METRICS.has(payload.name)) {
      return NextResponse.json({ ok: true });
    }

    const metric = {
      id: payload.id,
      name: payload.name,
      value: Number(payload.value ?? 0),
      rating: payload.rating,
      delta: Number(payload.delta ?? 0),
      navigationType: payload.navigationType ?? "",
      path: payload.path ?? "",
      ts: Number(payload.ts ?? Date.now()),
    };

    const endpoint = process.env.WEB_VITALS_ENDPOINT;

    if (endpoint) {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(metric),
        cache: "no-store",
      });
    } else if (process.env.NODE_ENV !== "production") {
      console.log("[web-vitals]", metric);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
