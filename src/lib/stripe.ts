import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

export async function createStripePaymentIntent(
  amount: number,
  currency = "inr",
  metadata?: Record<string, string>
) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // smallest currency unit
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

export function constructWebhookEvent(
  payload: string | Buffer,
  sig: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(payload, sig, secret);
}
