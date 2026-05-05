export const runtime = 'edge';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packages = await prisma.sponsorPackage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(packages);
}
