import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Функция генерации slug из названия
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${payload.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Montserrat', sans-serif;
      background: linear-gradient(135deg, #0c0f1c, #151a2d);
      color: #e2e8f0;
      line-height: 1.6;
      overflow-x: hidden;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      animation: fadeInUp 1s ease;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .logo { max-width: 150px; margin: 0 auto 20px; display: block; border-radius: 50%; box-shadow: 0 0 20px rgba(45,212,191,0.3); }
    h1 {
      font-size: 3rem;
      text-align: center;
      background: linear-gradient(135deg, #2dd4bf, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .slogan {
      text-align: center;
      font-size: 1.2rem;
      color: #94a3b8;
      margin-bottom: 40px;
    }
    .services {
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
    }
    .services h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #2dd4bf, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .service-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .contacts {
      text-align: center;
      margin-top: 30px;
    }
    .contact-btn {
      display: inline-block;
      margin: 10px;
      padding: 14px 30px;
      border-radius: 30px;
      font-weight: 600;
      text-decoration: none;
      color: white;
      background: linear-gradient(135deg, #2dd4bf, #0ea5e9);
      box-shadow: 0 4px 15px rgba(45,212,191,0.3);
      transition: all 0.3s;
    }
    .contact-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,212,191,0.5); }
    .contact-btn.wa { background: linear-gradient(135deg, #25D366, #128C7E); }
    .contact-btn.tg { background: linear-gradient(135deg, #2AABEE, #229ED9); }
    @media (max-width: 600px) {
      h1 { font-size: 2rem; }
      .contact-btn { display: block; margin: 10px auto; width: fit-content; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${payload.logo ? `<img src="${payload.logo}" alt="Логотип" class="logo" />` : ""}
    <h1>${payload.name}</h1>
    <p class="slogan">${payload.phrase}</p>

    <div class="services">
      <h2>Услуги и цены</h2>
      ${payload.skills
        .split("\n")
        .filter((line: string) => line.trim())
        .map((line: string) => {
          const parts = line.split("-").map((p) => p.trim());
          return `<div class="service-item"><span>${parts[0]}</span><span>${parts[1] || ""}</span></div>`;
        })
        .join("")}
    </div>

    <div class="contacts">
      ${payload.phone ? `<a href="tel:${payload.phone}" class="contact-btn">📞 Позвонить</a>` : ""}
      ${payload.inst ? `<a href="${payload.inst}" target="_blank" class="contact-btn tg">📷 Instagram</a>` : ""}
      <a href="https://wa.me/${payload.phone ? payload.phone.replace(/\D/g, "") : ""}" class="contact-btn wa" target="_blank">💬 WhatsApp</a>
    </div>
  </div>
</body>
</html>`;

    // Генерируем slug
    let slug = generateSlug(payload.name);

    try {
      await prisma.site.create({
        data: {
          title: payload.name,
          html: html,
          userId: payload.userId,
          slug: slug,
        },
      });
      return NextResponse.json({ html, slug });
    } catch (error: any) {
      if (error.code === "P2002") {
        slug = `${slug}-${Date.now().toString(36)}`;
        await prisma.site.create({
          data: {
            title: payload.name,
            html: html,
            userId: payload.userId,
            slug: slug,
          },
        });
        return NextResponse.json({ html, slug });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Ошибка в POST /api/generate:", error);
    return NextResponse.json({ error: "Failed to save site" }, { status: 500 });
  }
}
