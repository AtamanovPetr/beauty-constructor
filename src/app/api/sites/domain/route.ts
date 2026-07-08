import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { siteId, userId, domain } = body;

  if (!siteId || !userId || !domain) {
    return NextResponse.json(
      { error: "siteId, userId and domain required" },
      { status: 400 },
    );
  }

  // Простая валидация
  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return NextResponse.json(
      { error: "Неверный формат домена" },
      { status: 400 },
    );
  }

  // Проверим, не занят ли домен другим сайтом
  const existing = await prisma.site.findFirst({
    where: { domain, NOT: { id: siteId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Домен уже используется" },
      { status: 409 },
    );
  }

  // Проверим права
  const site = await prisma.site.findFirst({ where: { id: siteId, userId } });
  if (!site)
    return NextResponse.json(
      { error: "Сайт не найден или доступ запрещён" },
      { status: 404 },
    );

  const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
  if (!user || user.plan !== "PRO") {
    return NextResponse.json(
      { error: "Кастомные домены доступны только на тарифе PRO" },
      { status: 403 },
    );
  }

  await prisma.site.update({ where: { id: siteId }, data: { domain } });
  return NextResponse.json({ success: true, domain });
}
