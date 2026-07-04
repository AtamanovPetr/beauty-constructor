import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { siteId, userId } = body;

    if (!siteId || !userId) {
      return NextResponse.json(
        { error: "siteId and userId required" },
        { status: 400 },
      );
    }

    // Проверяем, что сайт принадлежит пользователю
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found or access denied" },
        { status: 404 },
      );
    }

    // Публикуем
    const updated = await prisma.site.update({
      where: { id: siteId },
      data: { published: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }
}
