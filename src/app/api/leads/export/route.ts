/**
 * GET /api/leads/export
 * Returns the full lead pipeline as a CSV download.
 * Server-only — uses prisma + crm lib directly.
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildLeadCSVRow, leadsToCSV } from "@/lib/crm";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    const rows = leads.map(l => buildLeadCSVRow({
      id:             l.id,
      name:           l.name,
      email:          l.email,
      company:        l.company,
      phone:          l.phone,
      type:           l.type,
      status:         l.status,
      source:         l.source,
      estimatedValue: l.estimatedValue,
      createdAt:      l.createdAt,
    }));

    const csv = leadsToCSV(rows);
    const filename = `troptions-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type":        "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/leads/export]", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
