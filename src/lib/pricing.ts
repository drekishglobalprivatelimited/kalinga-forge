import {
  MATERIALS,
  LAYER_HEIGHTS,
  FINISH_OPTIONS,
  DELIVERY_OPTIONS,
  QUANTITY_DISCOUNTS,
  MACHINE_RATE_PER_HOUR,
} from "@/constants/materials";

export interface PricingInput {
  volumeCm3: number;
  material: string;
  layerHeight: number;
  infill: number;
  finish: string;
  quantity: number;
  deliverySpeed: string;
}

export interface PricingBreakdown {
  materialWeight: number;
  materialCost: number;
  printTimeHours: number;
  machineTimeCost: number;
  finishSurcharge: number;
  lineTotal: number;
  quantityDiscount: number;
  deliveryMultiplier: number;
  subtotal: number;
  estimatedPrice: number;
}

export function calculatePrice(input: PricingInput): PricingBreakdown {
  const material = MATERIALS[input.material];
  if (!material) throw new Error(`Unknown material: ${input.material}`);

  const layerConfig = LAYER_HEIGHTS.find((l) => l.value === input.layerHeight);
  const layerSpeedMult = layerConfig?.speedMult ?? 1.0;

  const finishConfig = FINISH_OPTIONS.find((f) => f.id === input.finish);
  const finishMult = finishConfig?.multiplier ?? 0;

  const deliveryConfig = DELIVERY_OPTIONS.find((d) => d.id === input.deliverySpeed);
  const deliveryMult = deliveryConfig?.multiplier ?? 1.0;

  // Infill factor: adjusts actual material used
  const infillFactor = input.infill / 100;
  // Shell factor: outer walls always solid (approx 20% of volume)
  const effectiveInfill = 0.2 + infillFactor * 0.8;

  // Material weight in grams
  const materialWeight = input.volumeCm3 * effectiveInfill * material.density;
  const materialCost = materialWeight * material.pricePerGram;

  // Print time in hours
  // Base: 1 cm³ at 0.2mm layer = 0.5 hrs (rough heuristic for avg geometry)
  const basePrintHours = (input.volumeCm3 * 0.5) / 1;
  const printTimeHours =
    basePrintHours * layerSpeedMult * material.printSpeedMult;
  const machineTimeCost = printTimeHours * MACHINE_RATE_PER_HOUR;

  // Finish surcharge on top of material + machine cost
  const baseBeforeFinish = materialCost + machineTimeCost;
  const finishSurcharge = baseBeforeFinish * finishMult;

  const lineTotal = baseBeforeFinish + finishSurcharge;

  // Quantity discount
  const discountRow = [...QUANTITY_DISCOUNTS]
    .reverse()
    .find((d) => input.quantity >= d.minQty);
  const quantityDiscount = discountRow?.discount ?? 0;

  // Total
  const subtotal = lineTotal * input.quantity * (1 - quantityDiscount);
  const estimatedPrice = subtotal * deliveryMult;

  // Minimum price floor: ₹150
  const finalPrice = Math.max(estimatedPrice, 150);

  return {
    materialWeight: Math.round(materialWeight * 100) / 100,
    materialCost: Math.round(materialCost),
    printTimeHours: Math.round(printTimeHours * 10) / 10,
    machineTimeCost: Math.round(machineTimeCost),
    finishSurcharge: Math.round(finishSurcharge),
    lineTotal: Math.round(lineTotal),
    quantityDiscount,
    deliveryMultiplier: deliveryMult,
    subtotal: Math.round(subtotal),
    estimatedPrice: Math.round(finalPrice),
  };
}

export function getQuantityDiscount(qty: number): number {
  const row = [...QUANTITY_DISCOUNTS].reverse().find((d) => qty >= d.minQty);
  return row?.discount ?? 0;
}
