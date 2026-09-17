import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const opportunities = await prisma.opportunity.findMany({
    where: { status: "PENDING" },
    include: { organization: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ opportunities });
}