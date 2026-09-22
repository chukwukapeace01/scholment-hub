import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const resources = await prisma.learningResource.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { title, description, link } = await req.json();

  if (!title || !description || !link) {
    return NextResponse.json(
      { error: "Title, description, and link are required." },
      { status: 400 }
    );
  }

  const resource = await prisma.learningResource.create({
    data: { title, description, link },
  });

  return NextResponse.json(
    { message: "Resource added.", resource },
    { status: 201 }
  );
}