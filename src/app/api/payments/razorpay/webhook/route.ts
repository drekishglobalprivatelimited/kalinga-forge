import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNo } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    if (!payment) return NextResponse.json({ ok: true });

    const dbPayment = await prisma.payment.findFirst({
      where: { providerOrderId: payment.order_id },
      include: { order: true },
    });

    if (!dbPayment) return NextResponse.json({ ok: true });

    await prisma.payment.update({
      where: { id: dbPayment.id },
      data: {
        providerPaymentId: payment.id,
        status: "CAPTURED",
        paidAt: new Date(payment.created_at * 1000),
      },
    });

    await prisma.order.update({
      where: { id: dbPayment.orderId },
      data: { status: "PAID" },
    });

    // Generate invoice
    const invoiceNo = generateInvoiceNo();
    await prisma.invoice.upsert({
      where: { orderId: dbPayment.orderId },
      create: {
        orderId: dbPayment.orderId,
        invoiceNo,
        gstNumber: process.env.NEXT_PUBLIC_BUSINESS_GST,
      },
      update: {},
    });

    // Update quote status to IN_PRODUCTION if linked
    if (dbPayment.order.quoteId) {
      await prisma.quoteRequest.update({
        where: { id: dbPayment.order.quoteId },
        data: { status: "IN_PRODUCTION" },
      });
    }
  }

  if (event.event === "payment_link.paid") {
    const paymentLink = event.payload?.payment_link?.entity;
    if (!paymentLink) return NextResponse.json({ ok: true });

    const dbPayment = await prisma.payment.findFirst({
      where: { paymentLinkId: paymentLink.id },
      include: { order: true },
    });

    if (dbPayment) {
      await prisma.payment.update({
        where: { id: dbPayment.id },
        data: { status: "CAPTURED", paidAt: new Date() },
      });

      await prisma.order.update({
        where: { id: dbPayment.orderId },
        data: { status: "PAID" },
      });

      if (dbPayment.order.quoteId) {
        await prisma.quoteRequest.update({
          where: { id: dbPayment.order.quoteId },
          data: { status: "IN_PRODUCTION" },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
