import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "noreply@kalingaforge.in";
const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Kalinga Forge";

export async function sendQuoteSubmittedEmail(data: {
  to: string;
  name: string;
  referenceNo: string;
  material: string;
  quantity: number;
  estimatedPrice: number;
}) {
  return resend.emails.send({
    from: `${BUSINESS_NAME} <${FROM}>`,
    to: data.to,
    subject: `Quote Request Received — ${data.referenceNo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0070f3; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${BUSINESS_NAME}</h1>
        </div>
        <div style="padding: 32px; background: #0a0a0a; color: #ededed;">
          <h2 style="color: #0070f3;">Quote Request Received!</h2>
          <p>Hi ${data.name},</p>
          <p>We've received your 3D printing quote request. Our team will review it and send you a final quote within 24 hours.</p>
          <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px;"><strong>Reference:</strong> ${data.referenceNo}</p>
            <p style="margin: 0 0 8px;"><strong>Material:</strong> ${data.material}</p>
            <p style="margin: 0 0 8px;"><strong>Quantity:</strong> ${data.quantity}</p>
            <p style="margin: 0;"><strong>Estimated Price:</strong> ₹${data.estimatedPrice.toLocaleString("en-IN")}</p>
          </div>
          <p style="color: #888;">This is an automated estimate. Final pricing may vary based on file complexity and requirements.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/quotes" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">Track Your Quote</a>
        </div>
        <div style="padding: 16px; text-align: center; color: #666; font-size: 12px;">
          <p>${BUSINESS_NAME} | India's Premium 3D Printing Service</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminNewQuoteAlert(data: {
  referenceNo: string;
  guestName?: string;
  material: string;
  quantity: number;
  estimatedPrice: number;
  quoteId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kalingaforge.in";
  return resend.emails.send({
    from: `${BUSINESS_NAME} <${FROM}>`,
    to: adminEmail,
    subject: `[NEW QUOTE] ${data.referenceNo} — ₹${data.estimatedPrice.toLocaleString("en-IN")}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>New Quote Request</h2>
        <p><strong>Reference:</strong> ${data.referenceNo}</p>
        <p><strong>Customer:</strong> ${data.guestName ?? "Registered User"}</p>
        <p><strong>Material:</strong> ${data.material}</p>
        <p><strong>Quantity:</strong> ${data.quantity}</p>
        <p><strong>Estimated Price:</strong> ₹${data.estimatedPrice.toLocaleString("en-IN")}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/quotes/${data.quoteId}" style="display:inline-block;background:#0070f3;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">Review Quote</a>
      </div>
    `,
  });
}

export async function sendQuoteStatusUpdate(data: {
  to: string;
  name: string;
  referenceNo: string;
  status: string;
  message?: string;
}) {
  return resend.emails.send({
    from: `${BUSINESS_NAME} <${FROM}>`,
    to: data.to,
    subject: `Quote Update: ${data.referenceNo} — ${data.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0070f3; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">${BUSINESS_NAME}</h1>
        </div>
        <div style="padding: 32px; background: #0a0a0a; color: #ededed;">
          <h2>Quote Status Update</h2>
          <p>Hi ${data.name},</p>
          <p>Your quote <strong>${data.referenceNo}</strong> status has been updated to <strong>${data.status}</strong>.</p>
          ${data.message ? `<p>${data.message}</p>` : ""}
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/quotes" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Details</a>
        </div>
      </div>
    `,
  });
}

export async function sendOrderStatusUpdate(data: {
  to: string;
  name: string;
  orderNo: string;
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
}) {
  return resend.emails.send({
    from: `${BUSINESS_NAME} <${FROM}>`,
    to: data.to,
    subject: `Order Update: ${data.orderNo} — ${data.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0070f3; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">${BUSINESS_NAME}</h1>
        </div>
        <div style="padding: 32px; background: #0a0a0a; color: #ededed;">
          <h2>Order Status Update</h2>
          <p>Hi ${data.name},</p>
          <p>Your order <strong>${data.orderNo}</strong> status: <strong>${data.status}</strong></p>
          ${data.trackingNumber ? `<p>Tracking: <strong>${data.trackingNumber}</strong></p>` : ""}
          ${data.trackingUrl ? `<a href="${data.trackingUrl}" style="color:#0070f3;">Track Shipment →</a>` : ""}
          <br/><br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Order</a>
        </div>
      </div>
    `,
  });
}
