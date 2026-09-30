"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  createRazorpayOrder,
  createPaymentLink,
  verifyPaymentSignature,
} from "@/lib/razorpay";
import { generateOrderNo, generateInvoiceNo } from "@/lib/utils";

export async function createRazorpayOrderForQuote(quoteId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: { user: true },
  });

  if (!quote || !quote.finalPrice) {
    return { success: false, error: "Quote not found or not finalized" };
  }

  try {
    let order = await prisma.order.findUnique({ where: { quoteId } });

    if (!order) {
      const taxAmount = quote.finalPrice * 0.18;
      order = await prisma.order.create({
        data: {
          orderNo: generateOrderNo(),
          userId: quote.userId!,
          quoteId: quote.id,
          type: "QUOTE",
          status: "PAYMENT_PENDING",
          subtotal: quote.finalPrice,
          taxAmount,
          total: quote.finalPrice + taxAmount,
        },
      });
    }

    const total = order.total;
    const customerName = quote.user?.name ?? quote.guestName ?? "Customer";
    const customerEmail = quote.user?.email ?? quote.guestEmail ?? "";
    const customerPhone = quote.user?.phone ?? quote.guestPhone ?? "";

    const paymentLinkData = await createPaymentLink(
      total,
      `3D Printing Order — ${quote.referenceNo}`,
      customerName,
      customerEmail,
      customerPhone,
      quote.referenceNo
    );

    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        provider: "RAZORPAY",
        paymentLinkId: (paymentLinkData as { id?: string }).id,
        paymentLinkUrl: (paymentLinkData as { short_url?: string }).short_url,
        status: "CREATED",
        amount: total,
      },
      update: {
        paymentLinkId: (paymentLinkData as { id?: string }).id,
        paymentLinkUrl: (paymentLinkData as { short_url?: string }).short_url,
      },
    });

    await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: { status: "PAYMENT_PENDING" },
    });

    revalidatePath(`/admin/quotes/${quoteId}`);

    return {
      success: true,
      paymentLinkUrl: (paymentLinkData as { short_url?: string }).short_url,
    };
  } catch (error) {
    console.error("Payment link creation failed:", error);
    return { success: false, error: "Failed to create payment link" };
  }
}

export async function createRazorpayOrderForCart(
  items: Array<{ name: string; price: number; quantity: number; productId: string; variantId?: string; sku: string }>,
  addressId?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Please login to checkout" };

  try {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxAmount = subtotal * 0.18;
    const total = subtotal + taxAmount;

    const order = await prisma.order.create({
      data: {
        orderNo: generateOrderNo(),
        userId: session.user.id,
        addressId,
        type: "PRODUCT",
        status: "PAYMENT_PENDING",
        subtotal,
        taxAmount,
        total,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.price,
            total: i.price * i.quantity,
          })),
        },
      },
    });

    const rzpOrder = await createRazorpayOrder(total, "INR", order.orderNo);

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "RAZORPAY",
        providerOrderId: rzpOrder.id,
        status: "CREATED",
        amount: total,
      },
    });

    return {
      success: true,
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: total,
      currency: "INR",
    };
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function verifyRazorpayPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}) {
  const isValid = verifyPaymentSignature(
    data.razorpayOrderId,
    data.razorpayPaymentId,
    data.razorpaySignature
  );

  if (!isValid) {
    return { success: false, error: "Payment verification failed" };
  }

  try {
    const payment = await prisma.payment.update({
      where: { orderId: data.orderId },
      data: {
        providerPaymentId: data.razorpayPaymentId,
        signature: data.razorpaySignature,
        status: "CAPTURED",
        paidAt: new Date(),
      },
      include: { order: true },
    });

    await prisma.order.update({
      where: { id: data.orderId },
      data: { status: "PAID" },
    });

    // Generate invoice
    const invoiceNo = generateInvoiceNo();
    await prisma.invoice.create({
      data: {
        orderId: data.orderId,
        invoiceNo,
        gstNumber: process.env.NEXT_PUBLIC_BUSINESS_GST,
      },
    });

    if (payment.order.quoteId) {
      await prisma.quoteRequest.update({
        where: { id: payment.order.quoteId },
        data: { status: "IN_PRODUCTION" },
      });
    }

    revalidatePath("/orders");
    revalidatePath("/dashboard");

    return { success: true, orderId: data.orderId };
  } catch (error) {
    console.error("Payment verification DB update failed:", error);
    return { success: false, error: "Payment recorded but order update failed" };
  }
}
