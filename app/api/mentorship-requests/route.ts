import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Only students can request mentorship." },
      { status: 403 }
    );
  }

  const { mentorId } = await req.json();

  if (!mentorId) {
    return NextResponse.json({ error: "Mentor is required." }, { status: 400 });
  }

  const existing = await prisma.mentorshipRequest.findFirst({
    where: { studentId: session.user.id, mentorId, status: "PENDING" },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You already have a pending request with this mentor." },
      { status: 409 }
    );
  }

  const request = await prisma.mentorshipRequest.create({
    data: { studentId: session.user.id, mentorId },
  });

  return NextResponse.json(
    { message: "Mentorship request sent.", request },
    { status: 201 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Students see their own sent requests; mentors see requests sent to them
  if (session.user.role === "STUDENT") {
  const requests = await prisma.mentorshipRequest.findMany({
    where: { studentId: session.user.id },
    include: {
      mentor: { select: { name: true } },
      essays: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ requests });
}

  if (session.user.role === "MENTOR") {
    const requests = await prisma.mentorshipRequest.findMany({
      where: { mentorId: session.user.id },
      include: { student: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests });
  }

  return NextResponse.json({ requests: [] });
}