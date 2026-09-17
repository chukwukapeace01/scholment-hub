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

  const { status } = await req.json();

  if (!["ACCEPTED", "DECLINED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: params.id },
  });

  if (!request || request.mentorId !== session.user.id) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  const updated = await prisma.mentorshipRequest.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ message: "Request updated.", request: updated });
}