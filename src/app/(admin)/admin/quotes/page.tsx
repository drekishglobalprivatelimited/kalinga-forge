import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Quotes" };

const STATUSES = [
  "ALL", "SUBMITTED", "UNDER_REVIEW", "QUOTED", "PAYMENT_PENDING",
  "IN_PRODUCTION", "QUALITY_CHECK", "SHIPPED", "DELIVERED", "COMPLETED",
];

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status && params.status !== "ALL" ? params.status : undefined;

  const quotes = await prisma.quoteRequest.findMany({
    where: status ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quote Requests</h1>
        <p className="text-white/50 mt-1">{quotes.length} total</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/quotes" : `/admin/quotes?status=${s}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              (s === "ALL" && !status) || s === status
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
            }`}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Reference", "Customer", "File", "Material", "Qty", "Status", "Price", "Date", ""].map((h) => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4 font-mono text-xs text-blue-400">{q.referenceNo}</td>
                  <td className="p-4 text-white/70">{q.user?.name ?? q.guestName ?? "Guest"}</td>
                  <td className="p-4 text-white/60 max-w-[120px] truncate">{q.fileName}</td>
                  <td className="p-4 text-white/60">{q.material}</td>
                  <td className="p-4 text-white/60">{q.quantity}</td>
                  <td className="p-4">
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${getStatusColor(q.status)}`}>
                      {getStatusLabel(q.status)}
                    </span>
                  </td>
                  <td className="p-4 text-white/80">
                    {q.finalPrice ? formatCurrency(q.finalPrice) : q.estimatedPrice ? `~${formatCurrency(q.estimatedPrice)}` : "—"}
                  </td>
                  <td className="p-4 text-white/40 text-xs">{formatDate(q.createdAt)}</td>
                  <td className="p-4">
                    <Link href={`/admin/quotes/${q.id}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
                      Review <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
