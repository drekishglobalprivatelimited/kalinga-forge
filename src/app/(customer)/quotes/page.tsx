import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { FileText, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Quotes" };

export default async function QuotesPage() {
  const session = await auth();
  const quotes = await prisma.quoteRequest.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { statusLogs: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Quotes</h1>
        <p className="text-white/50 mt-1">{quotes.length} quote{quotes.length !== 1 ? "s" : ""} submitted</p>
      </div>

      {quotes.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <FileText className="h-10 w-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">You haven&apos;t submitted any quotes yet</p>
          <Link href="/quote" className="text-blue-400 hover:underline text-sm">
            Get your first instant quote →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <Link key={q.id} href={`/quotes/${q.id}`}>
              <div className="glass rounded-2xl p-5 hover:border-white/15 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <p className="font-medium text-white">{q.fileName}</p>
                    </div>
                    <p className="text-xs text-white/40">
                      {q.referenceNo} · {formatDate(q.createdAt)} · {q.material} · Qty {q.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      {q.finalPrice ? (
                        <>
                          <p className="text-sm font-bold text-white">{formatCurrency(q.finalPrice)}</p>
                          <p className="text-xs text-white/30">Final price</p>
                        </>
                      ) : q.estimatedPrice ? (
                        <>
                          <p className="text-sm font-semibold text-white/70">~{formatCurrency(q.estimatedPrice)}</p>
                          <p className="text-xs text-white/30">Estimate</p>
                        </>
                      ) : null}
                    </div>
                    <span className={`text-xs border rounded-full px-2.5 py-0.5 ${getStatusColor(q.status)}`}>
                      {getStatusLabel(q.status)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
