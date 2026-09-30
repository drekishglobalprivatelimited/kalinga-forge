import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Invoices" };

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      order: {
        select: { orderNo: true, total: true, user: { select: { name: true, email: true } } },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <p className="text-white/50 mt-1">{invoices.length} total</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Invoice No", "Order", "Customer", "Total", "Issued", "Due", "PDF"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4 font-mono text-xs text-blue-400">{i.invoiceNo}</td>
                  <td className="p-4 font-mono text-xs text-white/60">{i.order.orderNo}</td>
                  <td className="p-4 text-white/70">{i.order.user?.name ?? "—"}</td>
                  <td className="p-4 text-white/80">{formatCurrency(i.order.total)}</td>
                  <td className="p-4 text-white/40 text-xs">{formatDate(i.issuedAt)}</td>
                  <td className="p-4 text-white/40 text-xs">{i.dueDate ? formatDate(i.dueDate) : "—"}</td>
                  <td className="p-4">
                    {i.pdfUrl ? (
                      <a
                        href={i.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    No invoices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
