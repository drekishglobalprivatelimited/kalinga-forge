"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuoteStore } from "@/store/quoteStore";
import { ConfiguratorPanel } from "@/components/quote/ConfiguratorPanel";
import { PriceBreakdown } from "@/components/quote/PriceBreakdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { submitQuote } from "@/actions/quote.actions";
import { toast } from "@/components/ui/toast";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/quote")}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Change file
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {["Upload", "Configure", "Submit"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                i === 0 ? "bg-blue-600/30 text-blue-400" : i === 1 ? "bg-blue-600 text-white" : "bg-white/10 text-white/40"
              }`}>
                {i < 1 ? "✓" : i + 1}
              </div>
              <span className={`text-sm ${i === 1 ? "text-white" : "text-white/40"}`}>{step}</span>
              {i < 2 && <div className="w-8 h-px bg-white/15" />}
            </div>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Configure Your <span className="gradient-text">Print</span>
        </h1>
        <p className="text-white/50 mt-1">
          File: <span className="text-white/80 font-medium">{uploadedFile.fileName}</span>
          {analysis?.volumeCm3 && (
            <span className="ml-2 text-blue-400">— {analysis.volumeCm3.toFixed(2)} cm³ analyzed</span>
          )}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Left: Configurator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="glass rounded-2xl p-6">
            <ConfiguratorPanel />

            {/* Guest contact info (shown only when not logged in) */}
            {!session && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <p className="text-sm font-semibold text-white">Your Contact Details</p>
                <p className="text-xs text-white/40">
                  <a href="/login" className="text-blue-400 hover:underline">Sign in</a> to auto-fill your details and track this quote.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name *</Label>
                    <Input placeholder="Your name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mobile Number *</Label>
                    <Input type="tel" placeholder="10-digit number" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address *</Label>
                  <Input type="email" placeholder="you@example.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <Button
                variant="gradient"
                size="lg"
                className="w-full gap-2"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Quote Request
                  </>
                )}
              </Button>
              <p className="text-xs text-white/30 text-center mt-2">
                Our team reviews and sends final quote within 24 hours
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: Price breakdown (sticky) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <PriceBreakdown />
        </motion.div>
      </div>
    </div>
  );
}
