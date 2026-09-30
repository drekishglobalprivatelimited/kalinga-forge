"use client";

import { create } from "zustand";
import { calculatePrice } from "@/lib/pricing";

export interface QuoteConfig {
  material: string;
  color: string;
  layerHeight: number;
  infill: number;
  finish: string;
  quantity: number;
  deliverySpeed: string;
  notes: string;
}

export interface UploadedFile {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface FileAnalysis {
  dimensionX?: number;
  dimensionY?: number;
  dimensionZ?: number;
  volumeCm3?: number;
  surfaceArea?: number;
}

interface QuoteStore {
  uploadedFile: UploadedFile | null;
  analysis: FileAnalysis | null;
  config: QuoteConfig;
  estimatedPrice: number | null;
  priceBreakdown: ReturnType<typeof calculatePrice> | null;
  isAnalyzing: boolean;

  setUploadedFile: (file: UploadedFile | null) => void;
  setAnalysis: (analysis: FileAnalysis | null) => void;
  setAnalyzing: (v: boolean) => void;
  updateConfig: (updates: Partial<QuoteConfig>) => void;
  computePrice: () => void;
  reset: () => void;
}

const DEFAULT_CONFIG: QuoteConfig = {
  material: "PLA",
  color: "Black",
  layerHeight: 0.2,
  infill: 20,
  finish: "Standard",
  quantity: 1,
  deliverySpeed: "Standard",
  notes: "",
};

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  uploadedFile: null,
  analysis: null,
  config: DEFAULT_CONFIG,
  estimatedPrice: null,
  priceBreakdown: null,
  isAnalyzing: false,

  setUploadedFile: (file) => set({ uploadedFile: file }),
  setAnalysis: (analysis) => set({ analysis }),
  setAnalyzing: (v) => set({ isAnalyzing: v }),

  updateConfig: (updates) => {
    set((state) => ({ config: { ...state.config, ...updates } }));
    get().computePrice();
  },

  computePrice: () => {
    const { config, analysis } = get();
    const volumeCm3 = analysis?.volumeCm3;

    if (!volumeCm3 || volumeCm3 <= 0) {
      // Use a placeholder volume for estimation when no file analyzed
      const placeholderVolume = 10;
      try {
        const breakdown = calculatePrice({ ...config, volumeCm3: placeholderVolume });
        set({ priceBreakdown: breakdown, estimatedPrice: breakdown.estimatedPrice });
      } catch {
        set({ priceBreakdown: null, estimatedPrice: null });
      }
      return;
    }

    try {
      const breakdown = calculatePrice({ ...config, volumeCm3 });
      set({ priceBreakdown: breakdown, estimatedPrice: breakdown.estimatedPrice });
    } catch {
      set({ priceBreakdown: null, estimatedPrice: null });
    }
  },

  reset: () =>
    set({
      uploadedFile: null,
      analysis: null,
      config: DEFAULT_CONFIG,
      estimatedPrice: null,
      priceBreakdown: null,
      isAnalyzing: false,
    }),
}));
