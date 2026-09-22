import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (session.user.role !== "ORGANIZATION") {
    return NextResponse.json(
      { error: "Only organizations can submit opportunities." },
      { status: 403 }
    );
  }

  try {
    const { title, description, deadline, category, country } = await req.json();

    if (!title || !description || !deadline || !category || !country) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        category,
        country,
        orgId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Opportunity submitted for review.", opportunity },
      { status: 201 }
    );
  } catch (error) {
    console.error("Opportunity submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const country = searchParams.get("country");

  if (session.user.role === "ORGANIZATION") {
    const opportunities = await prisma.opportunity.findMany({
      where: { orgId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ opportunities });
  }

const opportunities = await prisma.opportunity.findMany({
  where: {
    status: "APPROVED",
    ...(category ? { category } : {}),
    ...(country ? { country: { contains: country, mode: "insensitive" } } : {}),
  },
  orderBy: { deadline: "asc" },
});
  return NextResponse.json({ opportunities });
}