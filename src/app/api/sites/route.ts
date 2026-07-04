import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const sites = await prisma.site.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sites);
  } catch (error) {
    console.error("GET /api/sites error:", error);
    return NextResponse.json(
      { error: "Failed to load sites" },
      { status: 500 },
    );
  }
}
