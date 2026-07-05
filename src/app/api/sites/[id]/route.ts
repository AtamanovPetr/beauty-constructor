import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/sites/[id]?userId=...
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const site = await prisma.site.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        html: true,
        slug: true,
        published: true,
        createdAt: true,
        style: true,
        userId: true,
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found or access denied" },
        { status: 404 },
      );
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error("GET /api/sites/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch site" },
      { status: 500 },
    );
  }
}

// PUT /api/sites/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const body = await request.json();
  const { userId, title, html, style } = body;

  if (!userId || !title || !html) {
    return NextResponse.json(
      { error: "userId, title, and html are required" },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.site.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Site not found or access denied" },
        { status: 404 },
      );
    }

    const updated = await prisma.site.update({
      where: { id },
      data: {
        title,
        html,
        style: style || existing.style,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/sites/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 },
    );
  }
}

// DELETE /api/sites/[id]?userId=...
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const site = await prisma.site.findFirst({
      where: { id, userId },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found or access denied" },
        { status: 404 },
      );
    }

    await prisma.site.delete({ where: { id } });
    return NextResponse.json(
      { message: "Site deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/sites/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 },
    );
  }
}
