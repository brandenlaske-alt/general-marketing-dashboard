import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function formatCurrency(n: number, opts: { fraction?: number } = {}): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.fraction ?? 0,
    maximumFractionDigits: opts.fraction ?? 0,
  }).format(n);
}

export function formatPercent(n: number, fraction = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(n);
}
