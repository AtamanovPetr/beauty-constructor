import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firebaseUid = searchParams.get("firebaseUid");

  if (!firebaseUid) {
    return NextResponse.json(
      { error: "firebaseUid required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) {
    return NextResponse.json({ plan: "FREE", sitesLimit: 1 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { firebaseUid, plan, sitesLimit } = body;

  if (!firebaseUid) {
    return NextResponse.json(
      { error: "firebaseUid required" },
      { status: 400 },
    );
  }

  const updated = await prisma.user.update({
    where: { firebaseUid },
    data: {
      plan: plan || undefined,
      sitesLimit: sitesLimit || undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { firebaseUid, name, email } = body;

  if (!firebaseUid) {
    return NextResponse.json(
      { error: "firebaseUid required" },
      { status: 400 },
    );
  }

  let user = await prisma.user.findUnique({ where: { firebaseUid } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid,
        name: name || null,
        email: email || null,
      },
    });

    // ─── Уведомление в VK ─────────────────────
    const VK_TOKEN = process.env.VK_ACCESS_TOKEN!;
    const VK_USER_ID = process.env.VK_USER_ID!;

    const message = `🆕 Новый пользователь!\n👤 Имя: ${name || "не указано"}\n📧 Email: ${email || "не указан"}\n🕒 Дата: ${new Date().toLocaleString("ru-RU")}`;

    fetch(`https://api.vk.com/method/messages.send`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        user_id: VK_USER_ID,
        message: message,
        access_token: VK_TOKEN,
        v: "5.199",
        random_id: Date.now().toString(),
      }),
    }).catch(console.error); // ошибка не должна ломать регистрацию
  }

  return NextResponse.json(user);
}
