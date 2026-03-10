import type { ClassValue } from "clsx";
import { clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function isSafeImageUrl(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function toSlug(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getFirstParam(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return fallback;
}

export function toInt(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return parsed;
}
