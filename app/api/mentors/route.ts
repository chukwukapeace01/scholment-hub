import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ mentors });
}