import { NextResponse } from "next/server";
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