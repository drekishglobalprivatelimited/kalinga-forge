import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});

export async function createRazorpayOrder(amount: number, currency = "INR", receipt: string) {
  return razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt,
  });
}

export async function createPaymentLink(
  amount: number,
  description: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  referenceId: string
) {
  return razorpay.paymentLink.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    description,
    customer: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    reference_id: referenceId,
    reminder_enable: true,
    notify: {
      sms: true,
      email: true,
    },
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation`,
    callback_method: "get",
  });
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(text)
    .digest("hex");
  return expectedSignature === signature;
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}
