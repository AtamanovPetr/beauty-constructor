import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Функция экранирования HTML-сущностей (защита от XSS)
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Пресеты стилей (CSS не экранируем!)
const STYLES: Record<string, string> = {
  rose: `
    .beauty-site { background: linear-gradient(135deg, #fdf2f4, #f9eef2); min-height: 100vh; }
    .beauty-site .hero { background: radial-gradient(circle at 50% 0%, rgba(232,180,184,0.25), transparent); }
    .beauty-site .service-card { border-left: 4px solid #e4b8bc; }
    .beauty-site h1, .beauty-site .section-title { color: #6d4c5e; }
  `,
  lavender: `
    .beauty-site { background: linear-gradient(135deg, #f4f2f9, #edeaf4); min-height: 100vh; }
    .beauty-site .hero { background: radial-gradient(circle at 50% 0%, rgba(186,175,215,0.25), transparent); }
    .beauty-site .service-card { border-left: 4px solid #b7aed5; }
    .beauty-site h1, .beauty-site .section-title { color: #504974; }
  `,
  mint: `
    .beauty-site { background: linear-gradient(135deg, #eef5f0, #e8f3eb); min-height: 100vh; }
    .beauty-site .hero { background: radial-gradient(circle at 50% 0%, rgba(160,200,170,0.25), transparent); }
    .beauty-site .service-card { border-left: 4px solid #b4cfbc; }
    .beauty-site h1, .beauty-site .section-title { color: #42634b; }
  `,
};

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
    const styleKey = payload.style || "rose";
    const customStyles = STYLES[styleKey] || STYLES.rose;

    // Парсинг услуг, отзывов, галереи
    const servicesRaw = (payload.skills || "")
      .split("\n")
      .filter((line: string) => line.trim());
    const services = servicesRaw.map((line: string) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        name: parts[0] || "Без названия",
        price: parts[1] || "",
        image: parts[2] || "",
        desc: parts[3] || "",
      };
    });

    const reviewsRaw = (payload.reviews || "")
      .split("\n")
      .filter((line: string) => line.trim());
    const reviews = reviewsRaw.map((line: string) => {
      const parts = line.split("|").map((p) => p.trim());
      return { author: parts[0] || "Гость", text: parts[1] || "" };
    });

    const galleryImages = (payload.gallery || "")
      .split("|")
      .map((u: string) => u.trim())
      .filter(Boolean);
    const cleanPhone = payload.phone ? payload.phone.replace(/\D/g, "") : "";

    // Генерация HTML с правильным экранированием
    const html = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :host, :root { font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; }
    ${customStyles}
    .container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
    .hero { text-align: center; padding: 80px 20px; border-radius: 32px; margin-bottom: 60px; }
    .logo { width: 130px; height: 130px; border-radius: 50%; object-fit: cover; margin: 0 auto 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
    h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 10px; }
    .subtitle { font-size: 1.2rem; color: #7a6e75; margin-bottom: 30px; }
    .section-title { font-size: 2.2rem; font-weight: 600; margin-bottom: 40px; text-align: center; }
    .slider-wrapper { position: relative; }
    .services-slider { display: flex; overflow-x: auto; scroll-behavior: smooth; gap: 20px; padding-bottom: 20px; -webkit-overflow-scrolling: touch; }
    .services-slider::-webkit-scrollbar { display: none; }
    .service-card { flex: 0 0 300px; background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border-radius: 20px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.04); transition: transform 0.2s; display: flex; flex-direction: column; }
    .service-card:hover { transform: translateY(-4px); }
    .service-img { width: 100%; height: 200px; object-fit: cover; }
    .service-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
    .service-name { font-size: 1.3rem; font-weight: 600; margin-bottom: 5px; }
    .service-price { font-weight: 700; font-size: 1.2rem; margin-bottom: 10px; }
    .service-desc { color: #5a4e55; font-size: 0.95rem; line-height: 1.5; flex: 1; }
    .slider-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.8); border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; z-index: 10; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .slider-btn:hover { background: #fff; }
    .slider-btn.left { left: -22px; }
    .slider-btn.right { right: -22px; }
    .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .review-card { background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
    .review-text { font-style: italic; margin-bottom: 12px; color: #4a3f47; }
    .review-author { font-weight: 600; text-align: right; }
    .contacts { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin-top: 30px; }
    .contact-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; border-radius: 40px; font-weight: 600; text-decoration: none; transition: all 0.3s; }
    .btn-phone { background: #e4b8bc; color: #4a2e38; box-shadow: 0 4px 12px rgba(180,130,140,0.25); }
    .btn-phone:hover { background: #3b82f6; color: white; box-shadow: 0 8px 20px rgba(59,130,246,0.4); }
    .btn-instagram { background: #e4b8bc; color: #4a2e38; box-shadow: 0 4px 12px rgba(180,130,140,0.25); }
    .btn-instagram:hover { background: linear-gradient(135deg, #833AB4, #E1306C); color: white; box-shadow: 0 8px 20px rgba(225,48,108,0.4); }
    .btn-whatsapp { background: #e4b8bc; color: #4a2e38; box-shadow: 0 4px 12px rgba(180,130,140,0.25); }
    .btn-whatsapp:hover { background: #25D366; color: white; box-shadow: 0 8px 20px rgba(37,211,102,0.4); }
    .icon { width: 20px; height: 20px; fill: currentColor; display: inline-block; vertical-align: middle; }
    .fade-in-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-in-up.visible { opacity: 1; transform: translateY(0); }
    .map-container { margin-top: 60px; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
    iframe { width: 100%; height: 300px; border: none; }
    @media (max-width: 640px) {
      h1 { font-size: 2.5rem; }
      .section-title { font-size: 1.8rem; }
      .service-card { flex: 0 0 260px; }
      .slider-btn.left { left: -12px; }
      .slider-btn.right { right: -12px; }
      .contact-btn { padding: 12px 20px; }
    }
  </style>
  <div class="beauty-site">
    <div class="container">
      <div class="hero fade-in-up">
        ${payload.logo ? `<img src="${payload.logo}" alt="Логотип" class="logo" />` : ""}
        <h1>${escapeHtml(payload.name)}</h1>
        <p class="subtitle">${escapeHtml(payload.phrase) || ""}</p>
      </div>

      <section class="fade-in-up" style="margin-bottom: 80px;">
        <h2 class="section-title">Наши услуги</h2>
        <div class="slider-wrapper">
          <button class="slider-btn left" onclick="this.nextElementSibling.scrollBy({left: -320, behavior: 'smooth'})">‹</button>
          <div class="services-slider">
            ${services
              .map(
                (s: {
                  image: any;
                  name: string;
                  price: string;
                  desc: string;
                }) => `
              <div class="service-card">
                ${s.image ? `<img src="${s.image}" alt="${escapeHtml(s.name)}" class="service-img" onerror="this.style.display='none'">` : ""}
                <div class="service-body">
                  <div class="service-name">${escapeHtml(s.name)}</div>
                  ${s.price ? `<div class="service-price">${escapeHtml(s.price)}</div>` : ""}
                  ${s.desc ? `<div class="service-desc">${escapeHtml(s.desc)}</div>` : ""}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
          <button class="slider-btn right" onclick="this.previousElementSibling.scrollBy({left: 320, behavior: 'smooth'})">›</button>
        </div>
      </section>

      ${
        galleryImages.length > 0
          ? `
      <section class="fade-in-up" style="margin-bottom: 80px;">
        <h2 class="section-title">Наши работы</h2>
        <div class="slider-wrapper">
          <button class="slider-btn left" onclick="this.nextElementSibling.scrollBy({left: -320, behavior: 'smooth'})">‹</button>
          <div class="services-slider" style="gap: 16px;">
            ${galleryImages
              .map(
                (img: any) => `
              <div class="service-card" style="border-left: none; flex: 0 0 280px;">
                <img src="${img}" alt="Работа" class="service-img" style="height: 250px;" onerror="this.style.display='none'">
              </div>
            `,
              )
              .join("")}
          </div>
          <button class="slider-btn right" onclick="this.previousElementSibling.scrollBy({left: 320, behavior: 'smooth'})">›</button>
        </div>
      </section>
      `
          : ""
      }

      ${
        reviews.length > 0
          ? `
      <section class="fade-in-up" style="margin-bottom: 80px;">
        <h2 class="section-title">Отзывы</h2>
        <div class="reviews-grid">
          ${reviews
            .map(
              (r: { text: string; author: string }) => `
            <div class="review-card">
              <p class="review-text">«${escapeHtml(r.text)}»</p>
              <p class="review-author">${escapeHtml(r.author)}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>
      `
          : ""
      }

      <section class="fade-in-up">
        <h2 class="section-title">Контакты</h2>
        <div class="contacts">
          ${
            payload.phone
              ? `<a href="tel:${payload.phone}" class="contact-btn btn-phone">
            <svg class="icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Позвонить
          </a>`
              : ""
          }
          ${
            payload.inst
              ? `<a href="${payload.inst}" target="_blank" class="contact-btn btn-instagram">
            <svg class="icon" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </a>`
              : ""
          }
          ${
            cleanPhone
              ? `<a href="https://wa.me/${cleanPhone}" target="_blank" class="contact-btn btn-whatsapp">
            <svg class="icon" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            WhatsApp
          </a>`
              : ""
          }
        </div>
        ${
          payload.address
            ? `
        <div class="map-container">
          <iframe src="https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(payload.address)}&z=15" allowfullscreen></iframe>
        </div>`
            : ""
        }
      </section>
    </div>
  </div>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
  </script>`;

    let slug = generateSlug(payload.name);

    try {
      await prisma.site.create({
        data: {
          title: payload.name,
          phrase: payload.phrase || "",
          skills: payload.skills || "",
          logo: payload.logo || "",
          inst: payload.inst || "",
          phone: payload.phone || "",
          reviews: payload.reviews || "",
          address: payload.address || "",
          gallery: payload.gallery || "",
          html: html,
          userId: payload.userId,
          slug: slug,
          style: styleKey,
        },
      });
      return NextResponse.json({ html, slug });
    } catch (error: any) {
      if (error.code === "P2002") {
        slug = `${slug}-${Date.now().toString(36)}`;
        await prisma.site.create({
          data: {
            title: payload.name,
            phrase: payload.phrase || "",
            skills: payload.skills || "",
            logo: payload.logo || "",
            inst: payload.inst || "",
            phone: payload.phone || "",
            reviews: payload.reviews || "",
            address: payload.address || "",
            gallery: payload.gallery || "",
            html: html,
            userId: payload.userId,
            slug: slug,
            style: styleKey,
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
