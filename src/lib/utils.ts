import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "KRW"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORDER-${timestamp}-${random}`;
}
