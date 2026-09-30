"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateReferenceNo } from "@/lib/utils";
import { sendQuoteSubmittedEmail, sendAdminNewQuoteAlert } from "@/lib/email";
import { quoteSubmitSchema } from "@/lib/validations";
import type { QuoteSubmitInput } from "@/lib/validations";

export async function submitQuote(data: QuoteSubmitInput) {
  const parsed = quoteSubmitSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await auth();
  const referenceNo = generateReferenceNo();

  try {
    const quote = await prisma.quoteRequest.create({
      data: {
        userId: session?.user?.id ?? undefined,
        guestName: !session ? data.guestName : undefined,
        guestEmail: !session ? data.guestEmail : undefined,
        guestPhone: !session ? data.guestPhone : undefined,
        referenceNo,
        status: "SUBMITTED",
        fileName: data.fileName,
        fileKey: data.fileKey,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
        dimensionX: data.dimensionX,
        dimensionY: data.dimensionY,
        dimensionZ: data.dimensionZ,
        volumeCm3: data.volumeCm3,
        material: data.material,
        color: data.color,
        layerHeight: data.layerHeight,
        infill: data.infill,
        finish: data.finish,
        quantity: data.quantity,
        deliverySpeed: data.deliverySpeed,
        notes: data.notes,
        estimatedPrice: data.estimatedPrice,
      },
    });

    await prisma.quoteStatusLog.create({
      data: {
        quoteId: quote.id,
        toStatus: "SUBMITTED",
        note: "Quote submitted by customer",
      },
    });

    // Send emails
    const customerEmail = session?.user?.email ?? data.guestEmail;
    const customerName = session?.user?.name ?? data.guestName ?? "Customer";

    if (customerEmail) {
      await sendQuoteSubmittedEmail({
        to: customerEmail,
        name: customerName,
        referenceNo,
        material: data.material,
        quantity: data.quantity,
        estimatedPrice: data.estimatedPrice ?? 0,
      }).catch(console.error);
    }

    await sendAdminNewQuoteAlert({
      referenceNo,
      guestName: customerName,
      material: data.material,
      quantity: data.quantity,
      estimatedPrice: data.estimatedPrice ?? 0,
      quoteId: quote.id,
    }).catch(console.error);

    revalidatePath("/quotes");
    revalidatePath("/admin/quotes");

    return { success: true, referenceNo, quoteId: quote.id };
  } catch (error) {
    console.error("Quote submission failed:", error);
    return { success: false, error: "Failed to submit quote. Please try again." };
  }
}

export async function getCustomerQuotes() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.quoteRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      statusLogs: { orderBy: { createdAt: "asc" } },
      order: { include: { payment: true } },
    },
  });
}

export async function getQuoteById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.quoteRequest.findFirst({
    where: {
      id,
      ...(session.user.role !== "ADMIN" ? { userId: session.user.id } : {}),
    },
    include: {
      statusLogs: { orderBy: { createdAt: "asc" } },
      order: { include: { payment: true, invoice: true } },
      user: { select: { name: true, email: true, phone: true } },
    },
  });
}

export async function adminFinalizeQuote(data: {
  quoteId: string;
  finalPrice: number;
  adminNotes?: string;
  printTime?: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const quote = await prisma.quoteRequest.update({
      where: { id: data.quoteId },
      data: {
        status: "QUOTED",
        finalPrice: data.finalPrice,
        adminNotes: data.adminNotes,
        printTime: data.printTime,
      },
      include: { user: true },
    });

    await prisma.quoteStatusLog.create({
      data: {
        quoteId: data.quoteId,
        fromStatus: "UNDER_REVIEW",
        toStatus: "QUOTED",
        changedById: session.user.id,
        note: `Final price set: ₹${data.finalPrice}`,
      },
    });

    revalidatePath(`/admin/quotes/${data.quoteId}`);
    revalidatePath("/admin/quotes");

    return { success: true, quote };
  } catch (error) {
    console.error("Finalize quote failed:", error);
    return { success: false, error: "Failed to finalize quote" };
  }
}

export async function adminUpdateQuoteStatus(quoteId: string, status: string, note?: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const prevQuote = await prisma.quoteRequest.findUnique({ where: { id: quoteId } });

    await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: { status: status as never },
    });

    await prisma.quoteStatusLog.create({
      data: {
        quoteId,
        fromStatus: prevQuote?.status,
        toStatus: status as never,
        changedById: session.user.id,
        note,
      },
    });

    revalidatePath(`/admin/quotes/${quoteId}`);
    revalidatePath("/admin/quotes");

    return { success: true };
  } catch (error) {
    console.error("Update quote status failed:", error);
    return { success: false, error: "Failed to update status" };
  }
}
