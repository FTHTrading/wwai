export const runtime = 'edge';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sponsor:  { select: { id: true, name: true } },
      proposal: { select: { id: true, campaignType: true, termMonths: true } },
    },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const body = await req.json();
  const invoice = await prisma.invoice.create({
    data: {
      sponsorId:   body.sponsorId   ?? null,
      proposalId:  body.proposalId  ?? null,
      invoiceNumber: body.invoiceNumber,
      amount:      body.amount,
      currency:    body.currency ?? "USD",
      description: body.description ?? null,
      status:      "draft",
      dueDate:     body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return NextResponse.json(invoice, { status: 201 });
}
