import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MENTOR") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { feedback } = await req.json();

  if (!feedback) {
    return NextResponse.json(
      { error: "Feedback is required." },
      { status: 400 }
    );
  }

  const essay = await prisma.essay.findUnique({
    where: { id: params.id },
    include: { request: true },
  });

  if (!essay || essay.request.mentorId !== session.user.id) {
    return NextResponse.json({ error: "Essay not found." }, { status: 404 });
  }

  const updated = await prisma.essay.update({
    where: { id: params.id },
    data: { feedback },
  });

  return NextResponse.json({ message: "Feedback saved.", essay: updated });
}