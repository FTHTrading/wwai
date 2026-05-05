import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAgentBalance } from "@/lib/apostle";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { address } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Optionally fetch live ATP balance
  let atpBalance: number | null = null;
  try {
    atpBalance = await getAgentBalance(address);
  } catch {
    // Apostle may be offline; ignore
  }

  return NextResponse.json({ ...user, atpBalance });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, chain, displayName } = body;

    if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });

    const user = await prisma.user.upsert({
      where: { address },
      create: { address, chain: chain ?? "apo", displayName },
      update: { displayName: displayName ?? undefined },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
