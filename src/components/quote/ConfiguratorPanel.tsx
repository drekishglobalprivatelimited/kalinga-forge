"use client";

import { useQuoteStore } from "@/store/quoteStore";
import {
  MATERIALS,
  LAYER_HEIGHTS,
  INFILL_OPTIONS,
  FINISH_OPTIONS,
  DELIVERY_OPTIONS,
  COLORS,
} from "@/constants/materials";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  fieldClass,
  labelClass,
  selectContentClass,
  selectItemClass,
  textareaClass,
} from "@/components/storefront/fields";

const optionClass = (selected: boolean) =>
  `p-3 border text-left transition-colors ${
    selected ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink"
  }`;

export function ConfiguratorPanel() {
  const { config, updateConfig, analysis } = useQuoteStore();

  return (
    <div className="space-y-6">
      {/* File Analysis Summary */}
      {analysis?.volumeCm3 && (
        <div className="bg-canvas p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink mb-3">File analysis</p>
          <div className="grid grid-cols-2 gap-3">
            {analysis.dimensionX && (
              <div>
                <p className="text-xs text-muted-ink">Dimensions (mm)</p>
                <p className="text-sm font-medium text-ink">
                  {analysis.dimensionX?.toFixed(1)} × {analysis.dimensionY?.toFixed(1)} × {analysis.dimensionZ?.toFixed(1)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-ink">Volume</p>
              <p className="text-sm font-medium text-ink">{analysis.volumeCm3?.toFixed(2)} cm³</p>
            </div>
          </div>
        </div>
      )}

      {/* Material */}
      <div className="space-y-2">
        <Label className={labelClass}>Material</Label>
        <Select value={config.material} onValueChange={(v) => updateConfig({ material: v })}>
          <SelectTrigger className={fieldClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {Object.values(MATERIALS).map((mat) => (
              <SelectItem key={mat.id} value={mat.id} className={selectItemClass}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={
                      mat.color === "gradient"
                        ? { background: "linear-gradient(135deg, #0070f3, #7c3aed)" }
                        : { background: mat.color }
                    }
                  />
                  {mat.name}
                  {mat.recommended && (
                    <span className="text-[10px] font-medium text-forge ml-1">Popular</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-ink">{MATERIALS[config.material]?.description}</p>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label className={labelClass}>Color</Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => updateConfig({ color: color.id })}
              className={`flex flex-col items-center gap-1 p-2 border transition-colors ${
                config.color === color.id ? "border-ink" : "border-line hover:border-ink/50"
              }`}
              title={color.name}
            >
              <span
                className="w-6 h-6 rounded-full border border-line"
                style={
                  color.hex === "gradient"
                    ? { background: "linear-gradient(135deg, #0070f3, #7c3aed)" }
                    : { background: color.hex }
                }
              />
              <span className="text-[9px] text-muted-ink">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layer Height */}
      <div className="space-y-2">
        <Label className={labelClass}>Layer Height</Label>
        <div className="grid grid-cols-2 gap-2">
          {LAYER_HEIGHTS.map((lh) => (
            <button
              key={lh.value}
              onClick={() => updateConfig({ layerHeight: lh.value })}
              className={optionClass(config.layerHeight === lh.value)}
            >
              <p className="text-xs font-bold">{lh.value} mm</p>
              <p className="text-[10px] opacity-60">{lh.qualityLabel}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Infill */}
      <div className="space-y-2">
        <Label className={labelClass}>Infill Density</Label>
        <Select value={String(config.infill)} onValueChange={(v) => updateConfig({ infill: Number(v) })}>
          <SelectTrigger className={fieldClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {INFILL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)} className={selectItemClass}>
                <div>
                  <span className="font-medium">{opt.value}%</span>
                  <span className="text-muted-ink ml-2 text-xs">{opt.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Finish */}
      <div className="space-y-2">
        <Label className={labelClass}>Surface Finish</Label>
        <div className="grid grid-cols-2 gap-2">
          {FINISH_OPTIONS.map((finish) => (
            <button
              key={finish.id}
              onClick={() => updateConfig({ finish: finish.id })}
              className={optionClass(config.finish === finish.id)}
            >
              <p className="text-xs font-bold">{finish.name}</p>
              <p className="text-[10px] opacity-60 mt-0.5">{finish.description.substring(0, 30)}...</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label className={labelClass}>Quantity</Label>
        <Input
          className={fieldClass}
          type="number"
          min={1}
          max={10000}
          value={config.quantity}
          onChange={(e) => updateConfig({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
        />
        <p className="text-xs text-muted-ink">Discounts: 5+ = 5%, 10+ = 10%, 25+ = 15%, 50+ = 20%</p>
      </div>

      {/* Delivery */}
      <div className="space-y-2">
        <Label className={labelClass}>Delivery Speed</Label>
        <div className="grid grid-cols-3 gap-2">
          {DELIVERY_OPTIONS.map((del) => (
            <button
              key={del.id}
              onClick={() => updateConfig({ deliverySpeed: del.id })}
              className={optionClass(config.deliverySpeed === del.id)}
            >
              <p className="text-xs font-bold">{del.name}</p>
              <p className="text-[10px] opacity-60">{del.days}</p>
              {del.multiplier > 1 && (
                <p className="text-[10px] opacity-80">+{Math.round((del.multiplier - 1) * 100)}%</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className={labelClass}>Special Instructions (optional)</Label>
        <Textarea
          className={textareaClass}
          placeholder="Any specific requirements, tolerances, or notes for our team..."
          value={config.notes}
          onChange={(e) => updateConfig({ notes: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
