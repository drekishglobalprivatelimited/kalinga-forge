"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminFinalizeQuote, adminUpdateQuoteStatus } from "@/actions/quote.actions";
import { createRazorpayOrderForQuote } from "@/actions/payment.actions";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { ExternalLink, FileText, Link2 } from "lucide-react";

const ORDER_STATUSES = [
  "SUBMITTED", "UNDER_REVIEW", "QUOTED", "PAYMENT_PENDING",
  "IN_PRODUCTION", "QUALITY_CHECK", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "REJECTED",
];

// Client component — fetches quote via fetch from an API
export default function AdminQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [finalPrice, setFinalPrice] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [printTime, setPrintTime] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);

  useEffect(() => {
    fetch(`/api/quotes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setQuote(d);
        if (d.finalPrice) setFinalPrice(String(d.finalPrice));
        if (d.adminNotes) setAdminNotes(d.adminNotes);
        if (d.printTime) setPrintTime(String(d.printTime));
        if (d.status) setNewStatus(d.status);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleFinalize() {
    if (!finalPrice || isNaN(Number(finalPrice))) {
      toast("Enter a valid final price", { type: "error" } as Parameters<typeof toast>[1]);
      return;
    }
    setSubmitting(true);
    const result = await adminFinalizeQuote({
      quoteId: id,
      finalPrice: Number(finalPrice),
      adminNotes,
      printTime: printTime ? Number(printTime) : undefined,
    });
    setSubmitting(false);
    if (result.success) {
      toast("Quote finalized! ✓", { type: "success" } as Parameters<typeof toast>[1]);
      router.refresh();
    } else {
      toast(result.error ?? "Failed", { type: "error" } as Parameters<typeof toast>[1]);
    }
  }

  async function handleStatusUpdate() {
    if (!newStatus) return;
    setSubmitting(true);
    const result = await adminUpdateQuoteStatus(id, newStatus, statusNote);
    setSubmitting(false);
    if (result.success) {
      toast("Status updated", { type: "success" } as Parameters<typeof toast>[1]);
      router.refresh();
    } else {
      toast(result.error ?? "Failed", { type: "error" } as Parameters<typeof toast>[1]);
    }
  }

  async function handleCreatePaymentLink() {
    setCreatingLink(true);
    const result = await createRazorpayOrderForQuote(id);
    setCreatingLink(false);
    if (result.success) {
      toast("Payment link created!", { type: "success" } as Parameters<typeof toast>[1]);
      router.refresh();
    } else {
      toast(result.error ?? "Failed to create link", { type: "error" } as Parameters<typeof toast>[1]);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
      </div>
    );
  }

  if (!quote) {
    return <div className="text-white/50 text-center py-20">Quote not found</div>;
  }

  const payment = quote.order as Record<string, unknown> | undefined;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quote Detail</h1>
          <p className="font-mono text-blue-400 text-sm">{String(quote.referenceNo)}</p>
        </div>
        <span className={`text-sm border rounded-full px-3 py-1.5 ${getStatusColor(String(quote.status))}`}>
          {getStatusLabel(String(quote.status))}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* File info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400" />
            File & Specifications
          </h2>
          <dl className="space-y-3">
            {[
              { label: "File", value: String(quote.fileName) },
              { label: "Type", value: String(quote.fileType).toUpperCase() },
              { label: "Material", value: String(quote.material) },
              { label: "Color", value: String(quote.color) },
              { label: "Layer Height", value: `${quote.layerHeight} mm` },
              { label: "Infill", value: `${quote.infill}%` },
              { label: "Finish", value: String(quote.finish) },
              { label: "Quantity", value: String(quote.quantity) },
              { label: "Delivery", value: String(quote.deliverySpeed) },
              ...(quote.dimensionX ? [{ label: "Dimensions (mm)", value: `${Number(quote.dimensionX).toFixed(1)} × ${Number(quote.dimensionY).toFixed(1)} × ${Number(quote.dimensionZ).toFixed(1)}` }] : []),
              ...(quote.volumeCm3 ? [{ label: "Volume", value: `${Number(quote.volumeCm3).toFixed(2)} cm³` }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-white/40">{label}</span>
                <span className="text-white/80 font-medium text-right max-w-[60%] truncate">{value}</span>
              </div>
            ))}
          </dl>
          {Boolean(quote.notes) && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">Customer Notes</p>
              <p className="text-sm text-white/70">{String(quote.notes)}</p>
            </div>
          )}
          <a
            href={String(quote.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <ExternalLink className="h-4 w-4" />
            Download / View File
          </a>
        </div>

        {/* Customer info */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Customer</h2>
            <dl className="space-y-2 text-sm">
              {[
                { label: "Name", value: (quote.user as Record<string, string> | undefined)?.name ?? String(quote.guestName ?? "Guest") },
                { label: "Email", value: (quote.user as Record<string, string> | undefined)?.email ?? String(quote.guestEmail ?? "—") },
                { label: "Phone", value: String(quote.guestPhone ?? "—") },
                { label: "Submitted", value: formatDate(new Date(String(quote.createdAt))) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-white/40">{label}</span>
                  <span className="text-white/80">{value}</span>
                </div>
              ))}
            </dl>
          </div>

          {/* Estimate */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Pricing</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/40">Customer Estimate</span>
              <span className="text-white/80">{Boolean(quote.estimatedPrice) ? formatCurrency(Number(quote.estimatedPrice)) : "—"}</span>
            </div>
            {Boolean(quote.finalPrice) && (
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Final Price</span>
                <span className="text-green-400 font-bold">{formatCurrency(Number(quote.finalPrice))}</span>
              </div>
            )}
          </div>

          {/* Payment link */}
          {Boolean(payment?.paymentLinkUrl) && (
            <div className="glass rounded-2xl p-4 border border-green-500/20 bg-green-500/5">
              <p className="text-xs text-white/50 mb-2">Payment Link Created</p>
              <a
                href={String((payment as Record<string, unknown>).paymentLinkUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 break-all"
              >
                <Link2 className="h-4 w-4 shrink-0" />
                {String((payment as Record<string, unknown>).paymentLinkUrl)}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Admin actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Set final price */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Set Final Quote</h3>
          <div className="space-y-2">
            <Label className="text-xs">Final Price (₹)</Label>
            <Input type="number" placeholder="e.g. 2500" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Print Time (hours)</Label>
            <Input type="number" placeholder="e.g. 4.5" value={printTime} onChange={(e) => setPrintTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Admin Notes</Label>
            <Textarea placeholder="Internal notes..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2} />
          </div>
          <Button variant="gradient" size="sm" className="w-full" onClick={handleFinalize} disabled={submitting}>
            Finalize Quote
          </Button>
        </div>

        {/* Update status */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Update Status</h3>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Status note (optional)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} />
          <Button variant="outline" size="sm" className="w-full" onClick={handleStatusUpdate} disabled={submitting}>
            Update Status
          </Button>
        </div>

        {/* Generate payment link */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Payment Link</h3>
          <p className="text-xs text-white/50">
            Generate a Razorpay payment link for the customer. Final price must be set first.
          </p>
          <Button
            variant="default"
            size="sm"
            className="w-full bg-green-600 hover:bg-green-500"
            onClick={handleCreatePaymentLink}
            disabled={creatingLink || !quote.finalPrice}
          >
            {creatingLink ? "Generating..." : "Create Payment Link"}
          </Button>
          {!quote.finalPrice && (
            <p className="text-xs text-yellow-400">Set final price first</p>
          )}
        </div>
      </div>
    </div>
  );
}
