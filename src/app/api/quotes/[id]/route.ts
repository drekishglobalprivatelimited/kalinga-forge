import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quote = await prisma.quoteRequest.findFirst({
    where: {
      id,
      ...(session.user.role !== "ADMIN" ? { userId: session.user.id } : {}),
    },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      statusLogs: { orderBy: { createdAt: "asc" } },
      order: {
        include: {
          payment: true,
          invoice: true,
        },
      },
    },
  });

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(quote);
}
