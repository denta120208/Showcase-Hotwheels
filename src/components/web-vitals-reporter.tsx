"use client";

import { useReportWebVitals } from "next/web-vitals";

const TRACKED_METRICS = new Set(["LCP", "CLS", "INP"]);

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (!TRACKED_METRICS.has(metric.name)) {
      return;
    }

    const payload = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      path: window.location.pathname,
      ts: Date.now(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/web-vitals", payload);
      return;
    }

    void fetch("/api/web-vitals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    });
  });

  return null;
}
