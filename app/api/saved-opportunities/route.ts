import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const saved = await prisma.savedOpportunity.findMany({
    where: { studentId: session.user.id },
    include: { opportunity: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ saved });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { opportunityId } = await req.json();

  if (!opportunityId) {
    return NextResponse.json(
      { error: "Opportunity is required." },
      { status: 400 }
    );
  }

  const existing = await prisma.savedOpportunity.findUnique({
    where: {
      studentId_opportunityId: {
        studentId: session.user.id,
        opportunityId,
      },
    },
  });

  if (existing) {
    await prisma.savedOpportunity.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedOpportunity.create({
    data: { studentId: session.user.id, opportunityId },
  });

  return NextResponse.json({ saved: true });
}