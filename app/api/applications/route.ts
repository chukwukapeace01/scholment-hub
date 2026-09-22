import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { opportunityId, status } = await req.json();

  if (!opportunityId || !status) {
    return NextResponse.json(
      { error: "Opportunity and status are required." },
      { status: 400 }
    );
  }

  const application = await prisma.application.upsert({
    where: {
      studentId_opportunityId: {
        studentId: session.user.id,
        opportunityId,
      },
    },
    update: { status },
    create: {
      studentId: session.user.id,
      opportunityId,
      status,
    },
  });

  return NextResponse.json(
    { message: "Application tracked.", application },
    { status: 201 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const applications = await prisma.application.findMany({
    where: { studentId: session.user.id },
    include: { opportunity: { select: { title: true, deadline: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ applications });
}