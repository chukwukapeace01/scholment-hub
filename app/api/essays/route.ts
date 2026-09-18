import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { requestId, opportunityId, content } = await req.json();

  if (!requestId || !opportunityId || !content) {
    return NextResponse.json(
      { error: "Request, opportunity, and essay content are required." },
      { status: 400 }
    );
  }

  const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
  });

  if (
    !mentorshipRequest ||
    mentorshipRequest.studentId !== session.user.id ||
    mentorshipRequest.status !== "ACCEPTED"
  ) {
    return NextResponse.json(
      { error: "You can only submit essays to accepted mentors." },
      { status: 403 }
    );
  }

  const essay = await prisma.essay.create({
    data: { requestId, opportunityId, content },
  });

  return NextResponse.json(
    { message: "Essay submitted for review.", essay },
    { status: 201 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (session.user.role === "STUDENT") {
    const essays = await prisma.essay.findMany({
      where: { request: { studentId: session.user.id } },
      include: {
        request: { include: { mentor: { select: { name: true } } } },
        opportunity: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ essays });
  }

  if (session.user.role === "MENTOR") {
    const essays = await prisma.essay.findMany({
      where: { request: { mentorId: session.user.id } },
      include: {
        request: { include: { student: { select: { name: true } } } },
        opportunity: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ essays });
  }

  return NextResponse.json({ essays: [] });
}