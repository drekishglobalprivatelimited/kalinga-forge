import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export const quoteSubmitSchema = z.object({
  fileKey: z.string().min(1, "File is required"),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(),
  fileType: z.string().min(1),
  dimensionX: z.number().optional(),
  dimensionY: z.number().optional(),
  dimensionZ: z.number().optional(),
  volumeCm3: z.number().optional(),
  material: z.string().min(1, "Material is required"),
  color: z.string().min(1, "Color is required"),
  layerHeight: z.number().positive(),
  infill: z.number().min(10).max(100),
  finish: z.string().min(1),
  quantity: z.number().min(1).max(10000),
  deliverySpeed: z.string().min(1),
  notes: z.string().optional(),
  estimatedPrice: z.number().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Enter a valid phone number"),
  message: z.string().min(10, "Message too short").optional(),
  source: z.string().default("contact-form"),
});

export const addressSchema = z.object({
  line1: z.string().min(5, "Street address required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit pincode"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export const adminFinalQuoteSchema = z.object({
  quoteId: z.string().min(1),
  finalPrice: z.number().positive("Final price must be positive"),
  adminNotes: z.string().optional(),
  printTime: z.number().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type QuoteSubmitInput = z.infer<typeof quoteSubmitSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type AdminFinalQuoteInput = z.infer<typeof adminFinalQuoteSchema>;
