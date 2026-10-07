"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuoteStore } from "@/store/quoteStore";
import { formatCurrency } from "@/lib/utils";
import { MATERIALS, FINISH_OPTIONS, DELIVERY_OPTIONS } from "@/constants/materials";
import { Info } from "lucide-react";

export function PriceBreakdown() {
  const { priceBreakdown, estimatedPrice, config, analysis } = useQuoteStore();

  const material = MATERIALS[config.material];
  const finish = FINISH_OPTIONS.find((f) => f.id === config.finish);
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === config.deliverySpeed);

  return (
    <div className="border border-line p-6 lg:sticky lg:top-24">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-5">Price estimate</h3>

      {/* Main price */}
      <div className="text-center mb-6 p-6 bg-canvas">
        <AnimatePresence mode="wait">
          <motion.div
            key={estimatedPrice ?? "loading"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {estimatedPrice ? (
              <>
                <p className="text-4xl font-semibold tracking-tight text-ink">
                  {formatCurrency(estimatedPrice)}
                </p>
                <p className="text-xs text-muted-ink mt-1">Estimated price (excl. 18% GST)</p>
              </>
            ) : (
              <div className="space-y-2">
                <div className="h-10 bg-line animate-pulse" />
                <div className="h-4 bg-line animate-pulse w-1/2 mx-auto" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Breakdown */}
      {priceBreakdown && (
        <div className="space-y-3 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-ink">Breakdown</p>

          <div className="space-y-2 text-sm">
            <Row
              label="Material cost"
              value={formatCurrency(priceBreakdown.materialCost)}
              sub={`${priceBreakdown.materialWeight}g × ₹${material?.pricePerGram}/g`}
            />
            <Row
              label="Machine time"
              value={formatCurrency(priceBreakdown.machineTimeCost)}
              sub={`${priceBreakdown.printTimeHours} hrs × ₹150/hr`}
            />
            {priceBreakdown.finishSurcharge > 0 && (
              <Row
                label={`${finish?.name} finish`}
                value={formatCurrency(priceBreakdown.finishSurcharge)}
                sub={`${Math.round((finish?.multiplier ?? 0) * 100)}% surcharge`}
              />
            )}
            {config.quantity > 1 && (
              <Row
                label={`Qty ${config.quantity} × unit`}
                value={formatCurrency(priceBreakdown.lineTotal * config.quantity)}
                sub=""
              />
            )}
            {priceBreakdown.quantityDiscount > 0 && (
              <Row
                label="Quantity discount"
                value={`-${Math.round(priceBreakdown.quantityDiscount * 100)}%`}
                sub="Volume pricing"
                isGreen
              />
            )}
            {delivery && delivery.multiplier > 1 && (
              <Row
                label={`${delivery.name} delivery`}
                value={`+${Math.round((delivery.multiplier - 1) * 100)}%`}
                sub={delivery.days}
                isOrange
              />
            )}
          </div>

          <hr className="border-line" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Subtotal</span>
            <span className="text-sm font-semibold">
              {formatCurrency(estimatedPrice ?? 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-ink">
            <span>GST (18%)</span>
            <span>{formatCurrency((estimatedPrice ?? 0) * 0.18)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-line pt-2">
            <span className="text-sm font-semibold">Total (incl. GST)</span>
            <span className="text-lg font-semibold">
              {formatCurrency((estimatedPrice ?? 0) * 1.18)}
            </span>
          </div>
        </div>
      )}

      {/* Note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200">
        <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-ink/70 leading-relaxed">
          This is an automated estimate. Final pricing is reviewed and confirmed by our team within 24 hours.
          {!analysis?.volumeCm3 && " Volume calculated from file size — may vary after analysis."}
        </p>
      </div>

      {/* Config summary */}
      <div className="mt-4 p-4 bg-canvas space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-ink mb-2">Configuration</p>
        {[
          { label: "Material", value: config.material },
          { label: "Layer", value: `${config.layerHeight} mm` },
          { label: "Infill", value: `${config.infill}%` },
          { label: "Finish", value: config.finish },
          { label: "Color", value: config.color },
          { label: "Qty", value: config.quantity },
          { label: "Delivery", value: config.deliverySpeed },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-muted-ink">{label}</span>
            <span className="font-medium capitalize">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  isGreen = false,
  isOrange = false,
}: {
  label: string;
  value: string;
  sub: string;
  isGreen?: boolean;
  isOrange?: boolean;
}) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <span className="text-ink/80">{label}</span>
        {sub && <p className="text-xs text-muted-ink">{sub}</p>}
      </div>
      <span
        className={`font-medium shrink-0 ml-4 ${
          isGreen ? "text-green-700" : isOrange ? "text-forge" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
