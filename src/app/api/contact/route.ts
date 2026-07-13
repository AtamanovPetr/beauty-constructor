import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  // Читаем данные как FormData (подходит для обычной HTML-формы)
  const formData = await request.formData();
  const slug = formData.get("slug")?.toString() || "";
  const name = formData.get("name")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const service = formData.get("service")?.toString() || "";
  const date = formData.get("date")?.toString() || "";
  const time = formData.get("time")?.toString() || "";

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  // Находим сайт и его email для заявок
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site || !site.clientEmail) {
    return NextResponse.json(
      { error: "Site email not configured" },
      { status: 400 },
    );
  }

  // Настройки SMTP (Яндекс)
  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: site.clientEmail,
    subject: `Новая запись с сайта ${site.title}`,
    text:
      `Имя: ${name || "не указано"}\n` +
      `Телефон: ${phone || "не указан"}\n` +
      `Услуга: ${service || "не указана"}\n` +
      `Дата: ${date || "не указана"}\n` +
      `Время: ${time || "не указано"}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
