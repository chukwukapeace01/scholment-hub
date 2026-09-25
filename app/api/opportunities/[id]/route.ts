import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: params.id },
    include: { organization: { select: { name: true } } },
  });

  if (!opportunity) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ opportunity });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const existing = await prisma.opportunity.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.orgId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { title, description, deadline, category, country } = await req.json();

  const opportunity = await prisma.opportunity.update({
    where: { id: params.id },
    data: {
      title,
      description,
      deadline: new Date(deadline),
      category,
      country,
      status: "PENDING", // edits require re-approval
    },
  });

  return NextResponse.json({
    message: "Opportunity updated and sent for re-approval.",
    opportunity,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const existing = await prisma.opportunity.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.orgId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.opportunity.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Opportunity withdrawn." });
}