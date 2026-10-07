"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuoteStore } from "@/store/quoteStore";
import { ConfiguratorPanel } from "@/components/quote/ConfiguratorPanel";
import { PriceBreakdown } from "@/components/quote/PriceBreakdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { submitQuote } from "@/actions/quote.actions";
import { toast } from "@/components/ui/toast";
import { QuoteSteps } from "@/components/quote/QuoteSteps";
import { fieldClass, labelClass, primaryButtonClass } from "@/components/storefront/fields";

export default function EstimatePage() {
  const { uploadedFile, analysis, config, estimatedPrice, computePrice, reset } = useQuoteStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Redirect if no file uploaded
  useEffect(() => {
    if (!uploadedFile) {
      router.replace("/quote");
    } else {
      computePrice();
    }
  }, [uploadedFile, router, computePrice]);

  if (!uploadedFile) return null;

  async function handleSubmit() {
    if (!session && (!guestName || !guestEmail || !guestPhone)) {
      toast("Please fill in your contact details", { type: "error" } as Parameters<typeof toast>[1]);
      return;
    }

    setSubmitting(true);

    const result = await submitQuote({
      fileKey: uploadedFile!.fileKey,
      fileName: uploadedFile!.fileName,
      fileUrl: uploadedFile!.fileUrl,
      fileSize: uploadedFile!.fileSize,
      fileType: uploadedFile!.fileType,
      dimensionX: analysis?.dimensionX,
      dimensionY: analysis?.dimensionY,
      dimensionZ: analysis?.dimensionZ,
      volumeCm3: analysis?.volumeCm3,
      material: config.material,
      color: config.color,
      layerHeight: config.layerHeight,
      infill: config.infill,
      finish: config.finish,
      quantity: config.quantity,
      deliverySpeed: config.deliverySpeed,
      notes: config.notes,
      estimatedPrice: estimatedPrice ?? undefined,
      guestName: !session ? guestName : undefined,
      guestEmail: !session ? guestEmail : undefined,
      guestPhone: !session ? guestPhone : undefined,
    });

    setSubmitting(false);

    if (result.success) {
      reset();
      router.push(`/quote/submitted?ref=${result.referenceNo}`);
    } else {
      toast(result.error ?? "Submission failed", { type: "error" } as Parameters<typeof toast>[1]);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <button
          onClick={() => router.push("/quote")}
          className="flex items-center gap-2 text-xs text-muted-ink hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Change file
        </button>

        <div className="mb-6">
          <QuoteSteps current={1} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Configure your print</h1>
        <p className="text-sm text-muted-ink mt-2">
          File: <span className="text-ink font-medium">{uploadedFile.fileName}</span>
          {analysis?.volumeCm3 && <span className="ml-2">· {analysis.volumeCm3.toFixed(2)} cm³ analysed</span>}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <ConfiguratorPanel />

          {/* Guest contact info (shown only when not logged in) */}
          {!session && (
            <div className="mt-8 pt-8 border-t border-line space-y-5">
              <div>
                <p className="text-sm font-semibold">Your contact details</p>
                <p className="text-xs text-muted-ink mt-1">
                  <a href="/login?callbackUrl=/quote/estimate" className="text-ink underline underline-offset-2">Sign in</a> to
                  auto-fill your details and track this quote.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className={labelClass}>Full name *</Label>
                  <Input className={fieldClass} placeholder="Your name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Mobile number *</Label>
                  <Input className={fieldClass} type="tel" placeholder="10-digit number" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className={labelClass}>Email address *</Label>
                <Input className={fieldClass} type="email" placeholder="you@example.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="mt-8 pt-6 border-t border-line">
            <button className={primaryButtonClass} onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                "SUBMITTING…"
              ) : (
                <>
                  <Send className="h-4 w-4" strokeWidth={1.5} />
                  SUBMIT QUOTE REQUEST
                </>
              )}
            </button>
            <p className="text-xs text-muted-ink text-center mt-3">
              Our team reviews your file and sends the final quote within 24 hours.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <PriceBreakdown />
        </motion.div>
      </div>
    </div>
  );
}
