export interface MaterialConfig {
  id: string;
  name: string;
  pricePerGram: number;
  density: number;
  printSpeedMult: number;
  minInfill: number;
  description: string;
  color: string;
  recommended: boolean;
  properties: string[];
}

export const MATERIALS: Record<string, MaterialConfig> = {
  PLA: {
    id: "PLA",
    name: "PLA",
    pricePerGram: 2.5,
    density: 1.24,
    printSpeedMult: 1.0,
    minInfill: 10,
    description: "Best for beginners. Biodegradable, easy to print, vibrant colors.",
    color: "#22c55e",
    recommended: true,
    properties: ["Biodegradable", "Easy to print", "Vibrant colors", "Low warping"],
  },
  "PLA+": {
    id: "PLA+",
    name: "PLA+",
    pricePerGram: 3.0,
    density: 1.24,
    printSpeedMult: 1.0,
    minInfill: 10,
    description: "Enhanced PLA with better strength and impact resistance.",
    color: "#16a34a",
    recommended: true,
    properties: ["Stronger than PLA", "Better layer adhesion", "Easy to print"],
  },
  PETG: {
    id: "PETG",
    name: "PETG",
    pricePerGram: 3.5,
    density: 1.27,
    printSpeedMult: 0.9,
    minInfill: 10,
    description: "Food-safe, moisture resistant, flexible yet strong.",
    color: "#0ea5e9",
    recommended: false,
    properties: ["Food-safe", "Moisture resistant", "Chemical resistant", "Semi-flexible"],
  },
  ABS: {
    id: "ABS",
    name: "ABS",
    pricePerGram: 3.0,
    density: 1.05,
    printSpeedMult: 0.85,
    minInfill: 20,
    description: "Heat resistant, post-processable, automotive grade.",
    color: "#f59e0b",
    recommended: false,
    properties: ["Heat resistant", "Sandable", "Paintable", "Impact resistant"],
  },
  ASA: {
    id: "ASA",
    name: "ASA",
    pricePerGram: 4.0,
    density: 1.07,
    printSpeedMult: 0.85,
    minInfill: 20,
    description: "UV and weather resistant, outdoor-grade ABS alternative.",
    color: "#f97316",
    recommended: false,
    properties: ["UV resistant", "Weather resistant", "Outdoor grade", "High heat"],
  },
  TPU: {
    id: "TPU",
    name: "TPU",
    pricePerGram: 5.0,
    density: 1.21,
    printSpeedMult: 0.7,
    minInfill: 20,
    description: "Flexible, rubber-like, impact absorbing. Ideal for gaskets and grips.",
    color: "#a855f7",
    recommended: false,
    properties: ["Flexible", "Rubber-like", "Impact absorbing", "Chemical resistant"],
  },
  Nylon: {
    id: "Nylon",
    name: "Nylon",
    pricePerGram: 6.0,
    density: 1.14,
    printSpeedMult: 0.8,
    minInfill: 30,
    description: "Engineering grade. High strength, fatigue resistant, wear resistant.",
    color: "#64748b",
    recommended: false,
    properties: ["High strength", "Fatigue resistant", "Wear resistant", "Chemical resistant"],
  },
  "Carbon Fiber": {
    id: "Carbon Fiber",
    name: "Carbon Fiber",
    pricePerGram: 12.0,
    density: 1.3,
    printSpeedMult: 0.75,
    minInfill: 40,
    description: "Ultra high strength-to-weight. Premium aerospace and motorsport grade.",
    color: "#1e293b",
    recommended: false,
    properties: ["Ultra light", "Extreme strength", "Stiff", "Premium finish"],
  },
  Resin: {
    id: "Resin",
    name: "Resin (SLA)",
    pricePerGram: 8.0,
    density: 1.1,
    printSpeedMult: 0.6,
    minInfill: 100,
    description: "Highest detail resolution. Perfect for miniatures, dental, jewelry.",
    color: "#ec4899",
    recommended: false,
    properties: ["Highest detail", "Smooth surface", "Isotropic", "Post-curable"],
  },
};

export const LAYER_HEIGHTS = [
  { value: 0.1, label: "0.10 mm — Ultra Fine", speedMult: 1.6, qualityLabel: "Ultra Fine" },
  { value: 0.15, label: "0.15 mm — Fine", speedMult: 1.3, qualityLabel: "Fine" },
  { value: 0.2, label: "0.20 mm — Standard", speedMult: 1.0, qualityLabel: "Standard" },
  { value: 0.28, label: "0.28 mm — Draft", speedMult: 0.8, qualityLabel: "Draft" },
];

export const INFILL_OPTIONS = [
  { value: 10, label: "10% — Light", description: "Display models, low-stress parts" },
  { value: 20, label: "20% — Standard", description: "General purpose, good balance" },
  { value: 40, label: "40% — Strong", description: "Functional parts, moderate loads" },
  { value: 60, label: "60% — Heavy", description: "High-stress mechanical parts" },
  { value: 100, label: "100% — Solid", description: "Maximum strength, heavy parts" },
];

export const FINISH_OPTIONS = [
  {
    id: "Standard",
    name: "Standard",
    description: "As-printed finish. Layer lines visible.",
    multiplier: 0,
    priceAdd: 0,
  },
  {
    id: "Sanded",
    name: "Sanded",
    description: "Hand-sanded smooth finish. Reduced layer lines.",
    multiplier: 0.15,
    priceAdd: 0,
  },
  {
    id: "Painted",
    name: "Painted",
    description: "Primed and painted in your specified color.",
    multiplier: 0.3,
    priceAdd: 0,
  },
  {
    id: "Premium",
    name: "Premium",
    description: "Sanded, primed, painted, and clear-coated. Gallery quality.",
    multiplier: 0.5,
    priceAdd: 0,
  },
];

export const DELIVERY_OPTIONS = [
  {
    id: "Standard",
    name: "Standard",
    description: "5–7 business days",
    multiplier: 1.0,
    days: "5–7 days",
  },
  {
    id: "Express",
    name: "Express",
    description: "2–3 business days",
    multiplier: 1.25,
    days: "2–3 days",
  },
  {
    id: "Urgent",
    name: "Urgent",
    description: "Next business day",
    multiplier: 1.5,
    days: "Next day",
  },
];

export const COLORS = [
  { id: "Black", name: "Black", hex: "#000000" },
  { id: "White", name: "White", hex: "#FFFFFF" },
  { id: "Red", name: "Red", hex: "#EF4444" },
  { id: "Blue", name: "Blue", hex: "#3B82F6" },
  { id: "Green", name: "Green", hex: "#22C55E" },
  { id: "Yellow", name: "Yellow", hex: "#EAB308" },
  { id: "Orange", name: "Orange", hex: "#F97316" },
  { id: "Purple", name: "Purple", hex: "#A855F7" },
  { id: "Gray", name: "Gray", hex: "#6B7280" },
  { id: "Natural", name: "Natural", hex: "#F5F0E8" },
  { id: "Custom", name: "Custom", hex: "gradient" },
];

export const MACHINE_RATE_PER_HOUR = 150; // ₹150/hr

export const QUANTITY_DISCOUNTS = [
  { minQty: 1, discount: 0 },
  { minQty: 5, discount: 0.05 },
  { minQty: 10, discount: 0.10 },
  { minQty: 25, discount: 0.15 },
  { minQty: 50, discount: 0.20 },
  { minQty: 100, discount: 0.25 },
];
