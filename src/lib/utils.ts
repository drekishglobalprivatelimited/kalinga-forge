import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateOrderNo(): string {
  const prefix = "FRG";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateReferenceNo(): string {
  const prefix = "Q";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateInvoiceNo(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString().substring(2, 8);
  return `INV/${year}-${Number(month) < 4 ? year - 1 : year}/${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    UNDER_REVIEW: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    QUOTED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    PAYMENT_PENDING: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    IN_PRODUCTION: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    QUALITY_CHECK: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    SHIPPED: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    DELIVERED: "bg-green-500/10 text-green-400 border-green-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
    REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    PENDING: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    PAID: "bg-green-500/10 text-green-400 border-green-500/20",
    REFUNDED: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  };
  return colors[status] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    QUOTED: "Quoted",
    PAYMENT_PENDING: "Payment Pending",
    IN_PRODUCTION: "In Production",
    QUALITY_CHECK: "Quality Check",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
    PENDING: "Pending",
    PAID: "Paid",
    REFUNDED: "Refunded",
  };
  return labels[status] ?? status;
}
