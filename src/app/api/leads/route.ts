export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { listLeads, createLead, updateLeadStatus } from "@/lib/leads";

export async function GET(req: NextRequest) {
  const type   = req.nextUrl.searchParams.get("type")   ?? undefined;
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const limit  = Number(req.nextUrl.searchParams.get("limit") ?? "100");
  const rows   = await listLeads({ type, status, limit });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, company, message, source, estimatedValue } = body;
    if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
    const lead = await createLead({
      type:           type           || undefined,
      name:           name.trim(),
      email:          email          || undefined,
      phone:          phone          || undefined,
      company:        company        || undefined,
      message:        message        || undefined,
      source:         source         || "web",
      estimatedValue: estimatedValue != null ? Number(estimatedValue) : undefined,
    });
    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
    const lead = await updateLeadStatus(id, status);
    return NextResponse.json(lead);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
