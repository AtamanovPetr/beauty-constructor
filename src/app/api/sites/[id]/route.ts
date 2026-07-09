import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const STYLES: Record<string, string> = {
  premium: `
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family:'Montserrat',sans-serif;
    background:linear-gradient(135deg, #fff5f7, #fdf2f4, #fff5f7);
    color:#4a3f47;
    overflow-x:hidden;
  }
  header {
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .fade-in-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .services .service-card:nth-child(1) { transition-delay: 0.05s; }
  .services .service-card:nth-child(2) { transition-delay: 0.1s; }
  .services .service-card:nth-child(3) { transition-delay: 0.15s; }
  .services .service-card:nth-child(4) { transition-delay: 0.2s; }
  .services .service-card:nth-child(5) { transition-delay: 0.25s; }
  .services .service-card:nth-child(6) { transition-delay: 0.3s; }
  .hero-premium {
    position:relative; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:linear-gradient(135deg, #fdf2f4, #f9eef2);
    overflow:hidden;
  }
  .hero-ticker {
    position:absolute; top:0; left:0; width:100%; overflow:hidden;
    opacity:0.08; font-size:2rem; font-weight:900; letter-spacing:0.2em; color:#b07a8c;
  }
  .ticker-wrapper { display:flex; white-space:nowrap; animation:ticker 20s linear infinite; }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .hero-container {
    display:flex; align-items:center; gap:60px; max-width:1200px; padding:0 20px; z-index:1;
  }
  .hero-text-side { flex:1; }
  .hero-tag-badge {
    display:inline-block; border:1px solid #b07a8c; color:#b07a8c; padding:6px 16px;
    border-radius:20px; font-size:0.9rem; margin-bottom:20px; background:rgba(176,122,140,0.05);
  }
  .hero-main-title { font-size:3.5rem; line-height:1.2; font-weight:700; color:#4a3f47; }
  .text-accent { color:#b07a8c; }
  .hero-description { color:#8b6e7a; margin-top:20px; max-width:400px; line-height:1.6; }
  .hero-actions { margin-top:40px; display:flex; gap:20px; flex-direction: column; align-items: center }
  .hero-primary-btn {
    background:#b07a8c; color:#fff; padding:14px 32px; border-radius:30px; font-weight:700;
    text-decoration:none; transition:background 0.3s, transform 0.2s;
  }
  .hero-primary-btn:hover { background:#c9879b; transform:translateY(-2px); }
  .hero-secondary-btn {
    border:1px solid #b07a8c; color:#b07a8c; padding:14px 32px; border-radius:30px;
    text-decoration:none; font-weight:600; transition:all 0.3s; background:rgba(255,255,255,0.6); backdrop-filter:blur(10px);
  }
  .hero-secondary-btn:hover { background:rgba(176,122,140,0.1); transform:translateY(-2px); }
  .hero-visual-side {
    flex: 1;
    display: flex;
    justify-content: center;
    position: relative;
    height: 500px;
  }
  .photo-frame {
    border-radius: 20px;
    overflow: hidden;
    position: absolute;
    box-shadow: 0 12px 30px rgba(176, 122, 140, 0.2);
    background: linear-gradient(135deg, #f8c3d3, #e4b5c6);
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
  .frame-main {
    width: 320px;
    height: 420px;
    top: 0;
    left: 0;
    z-index: 2;
    transform: rotate(-3deg);
  }
  .frame-sub {
    width: 260px;
    height: 360px;
    top: 60px;
    left: 180px;
    z-index: 1;
    transform: rotate(5deg);
  }
  .photo-slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    animation: slidePhoto 8s infinite;
    background-color: transparent;
  }
  .slide-img-1 { animation-delay: 0s; }
  .slide-img-2 { animation-delay: 4s; }
  .slide-img-3 { animation-delay: 2s; }
  .slide-img-4 { animation-delay: 6s; }
  @keyframes slidePhoto { 0%,45%{opacity:1} 50%,95%{opacity:0} 100%{opacity:1} }
  .services { padding:80px 0; background:#fff; }
  .services-header { text-align:center; margin-bottom:60px; }
  .services-subtitle { color:#b07a8c; font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; }
  .services-title { font-size:2.5rem; font-weight:700; color:#4a3f47; margin-bottom:20px; }
  .services-decor-line {
    width:60px; height:3px; background:linear-gradient(135deg, #f8c3d3, #e4b5c6); margin:0 auto; border-radius:2px;
  }
  .services-slider-wrapper { position:relative; max-width:1200px; margin:0 auto; }
  .services-carousel {
    display:flex; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth;
    gap:24px; padding:0 20px 20px; -webkit-overflow-scrolling:touch;
  }
  .services-carousel::-webkit-scrollbar { display:none; }
  .service-card {
    flex:0 0 280px; scroll-snap-align:start; background:white; border-radius:20px; overflow:hidden;
    box-shadow:0 4px 16px rgba(176,122,140,0.1); border:1px solid rgba(176,122,140,0.15);
    transition:transform 0.3s, box-shadow 0.3s;
  }
  .service-card:hover { transform:translateY(-5px); box-shadow:0 12px 24px rgba(176,122,140,0.2); }
  .service-card-image img { width:100%; height:200px; object-fit:cover; }
  .service-info { padding:20px; }
  .service-name { font-size:1.2rem; font-weight:600; color:#4a3f47; margin-bottom:8px; }
  .service-desc { color:#8b6e7a; font-size:0.9rem; line-height:1.5; margin-bottom:16px; }
  .service-price { font-size:1.2rem; font-weight:700; color:#b07a8c; }
  .slider-arrow {
    position:absolute; top:50%; transform:translateY(-50%); width:44px; height:44px;
    border-radius:50%; background:white; border:1px solid rgba(176,122,140,0.3); color:#b07a8c;
    font-size:1.5rem; cursor:pointer; z-index:5; transition:all 0.3s; box-shadow:0 4px 10px rgba(0,0,0,0.05);
  }
  .slider-arrow:hover { background:#fdf2f4; box-shadow:0 6px 16px rgba(176,122,140,0.2); }
  .arrow-prev { left:-20px; }
  .arrow-next { right:-20px; }
  .reviews { padding:80px 0; background:#fdf2f4; }
  .reviews-header { text-align:center; margin-bottom:60px; }
  .reviews-subtitle { color:#b07a8c; font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; }
  .reviews-title { font-size:2.5rem; font-weight:700; color:#4a3f47; margin-bottom:20px; }
  .reviews-decor-line {
    width:60px; height:3px; background:linear-gradient(135deg, #f8c3d3, #e4b5c6); margin:0 auto; border-radius:2px;
  }
  .slider-wrapper { max-width:700px; margin:0 auto; position:relative; }
  .slides-container { position:relative; min-height:250px; }
  .review-slide {
    position:absolute; top:0; left:0; width:100%; opacity:0; transition:opacity 0.6s;
    text-align:center; padding:0 20px;
  }
  input[name="slider"] { display:none; }
  #slide-1:checked ~ .slides-container .slide-content-1,
  #slide-2:checked ~ .slides-container .slide-content-2,
  #slide-3:checked ~ .slides-container .slide-content-3 { opacity:1; }
  .review-stars-box { margin-bottom:20px; }
  .review-star { color:#b07a8c; font-size:1.2rem; }
  .review-text {
    font-style:italic; color:#5c4b56; line-height:1.7; font-size:1.1rem;
    background:white; padding:24px; border-radius:16px; box-shadow:0 4px 12px rgba(176,122,140,0.08);
  }
  .review-author { color:#b07a8c; font-weight:600; margin-top:16px; display:block; font-size:1.1rem; }
  .slider-dots { display:flex; justify-content:center; gap:12px; margin-top:150px; }
  .dot-label {
    width:12px; height:12px; border-radius:50%; background:rgba(176,122,140,0.3);
    cursor:pointer; transition:background 0.3s;
  }
  #slide-1:checked ~ .slider-dots .dot-label:nth-child(1),
  #slide-2:checked ~ .slider-dots .dot-label:nth-child(2),
  #slide-3:checked ~ .slider-dots .dot-label:nth-child(3) { background:#b07a8c; }
  .contacts { background:#fff; padding:60px 0; }
  .contacts-wrapper { display:flex; gap:60px; max-width:1200px; margin:0 auto; padding:0 20px; flex-wrap:wrap; }
  .contacts-info { flex:1; }
  .contacts-subtitle { color:#b07a8c; font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; }
  .contacts-title { font-size:2rem; font-weight:700; color:#4a3f47; margin:10px 0 20px; }
  .contacts-decor-line {
    width:60px; height:3px; background:linear-gradient(135deg, #f8c3d3, #e4b5c6); margin-bottom:30px; border-radius:2px;
  }
  .contacts-item { margin-bottom:20px; }
  .item-label { color:#b07a8c; font-weight:600; display:block; margin-bottom:4px; }
  .item-value { color:#5c4b56; }
  .phone-link { color:#5c4b56; text-decoration:none; transition:color 0.3s; }
  .phone-link:hover { color:#b07a8c; }
  .contacts-action-card {
    background:white; border-radius:20px; padding:30px; flex:1;
    border:1px solid rgba(176,122,140,0.2); box-shadow:0 8px 20px rgba(176,122,140,0.08);
  }
  .action-card-title { font-size:1.5rem; font-weight:700; color:#4a3f47; margin-bottom:10px; }
  .action-card-desc { color:#8b6e7a; margin-bottom:20px; }
  .footer-bottom { text-align:center; padding-top:40px; color:#8b6e7a; font-size:0.9rem; }
  @media (max-width:768px) {
    .hero-container { flex-direction:column; text-align:center; }
    .hero-text-side { margin-bottom: 30px; }
    .hero-main-title { font-size: 2.5rem; }
    .hero-description { max-width: 100%; }
    .hero-visual-side {
      position: relative;
      height: auto;
      justify-content: center;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    .photo-frame {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      bottom: auto;
      width: 45%;
      height: 250px;
      transform: none;
      flex: 1;
      min-width: 140px;
      margin: 0;
    }
    .frame-main, .frame-sub {
      width: 100%;
      height: 250px;
      transform: none;
    }
    .services-carousel { gap:16px; }
    .service-card { flex:0 0 220px; }
    .contacts-wrapper { flex-direction:column; }
    .slider-arrow { display: none; }
  }
`,
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ===== Генерация HTML =====
function generateHTMLFromForm(form: any): string {
  const styleKey = form.style || "premium";
  const customStyles = STYLES[styleKey] || STYLES.premium;

  const services = (form.skills || "")
    .split("\n")
    .filter((line: string) => line.trim())
    .map((line: string) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        name: parts[0] || "",
        price: parts[1] || "",
        image: parts[2] || "",
        desc: parts[3] || "",
      };
    });

  const reviews = (form.reviews || "")
    .split("\n")
    .filter((line: string) => line.trim())
    .map((line: string) => {
      const parts = line.split("|").map((p) => p.trim());
      return { author: parts[0] || "Гость", text: parts[1] || "" };
    });

  const galleryImages = (form.gallery || "")
    .split("|")
    .map((u: string) => u.trim())
    .filter(Boolean);
  const cleanPhone = form.phone ? form.phone.replace(/\D/g, "") : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(form.title || form.name || "")}</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap" rel="stylesheet">
  <style>${customStyles}
    .slide-img-1 { background-image:url('${escapeHtml(form.logo || "")}'); }
    .slide-img-2 { background-image:url('${escapeHtml(galleryImages[0] || "")}'); }
    .slide-img-3 { background-image:url('${escapeHtml(galleryImages[1] || "")}'); }
    .slide-img-4 { background-image:url('${escapeHtml(galleryImages[2] || "")}'); }
  </style>
</head>
<body>
  <header class="hero-premium fade-in-up">
    <div class="hero-ticker">
      <div class="ticker-wrapper">
        <span>HAIR STUDIO • COLOR EXPERT • SHAPING THE STYLE • SMART CUTS • PREMIUM CARE • BEAUTY OASIS • </span>
        <span>HAIR STUDIO • COLOR EXPERT • SHAPING THE STYLE • SMART CUTS • PREMIUM CARE • BEAUTY OASIS • </span>
      </div>
    </div>
    <div class="container hero-container">
      <div class="hero-text-side">
        <div class="hero-tag-badge">Premium Hair Studio</div>
        <h1 class="hero-main-title">${escapeHtml(form.title || form.name || "")}</h1>
        <p class="hero-description">${escapeHtml(form.phrase || "")}</p>
        <div class="hero-actions">
          <a href="#contacts" class="hero-primary-btn">Записаться на визит</a>
          <a href="#services" class="hero-secondary-btn">Смотреть прайс</a>
        </div>
      </div>
      <div class="hero-visual-side">
        <div class="photo-frame frame-main">
          <div class="photo-slide slide-img-1"></div>
          <div class="photo-slide slide-img-2"></div>
        </div>
        <div class="photo-frame frame-sub">
          <div class="photo-slide slide-img-3"></div>
          <div class="photo-slide slide-img-4"></div>
        </div>
      </div>
    </div>
  </header>

  <section class="services fade-in-up" id="services">
    <div class="container">
      <div class="services-header">
        <span class="services-subtitle">Прайс-лист</span>
        <h2 class="services-title">Наши услуги</h2>
        <div class="services-decor-line"></div>
      </div>
      <div class="services-slider-wrapper">
        <button class="slider-arrow arrow-prev" onclick="this.nextElementSibling.scrollBy({left:-300,behavior:'smooth'})">←</button>
        <div class="services-carousel">
          ${services
            .map(
              (s: { image: any; name: string; desc: any; price: any }) => `
            <div class="service-card fade-in-up">
              ${s.image ? `<div class="service-card-image"><img src="${s.image}" alt="${escapeHtml(s.name)}"></div>` : ""}
              <div class="service-info">
                <h3 class="service-name">${escapeHtml(s.name)}</h3>
                <p class="service-desc">${escapeHtml(s.desc || "")}</p>
                <div class="service-price">${escapeHtml(s.price || "")}</div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        <button class="slider-arrow arrow-next" onclick="this.previousElementSibling.scrollBy({left:300,behavior:'smooth'})">→</button>
      </div>
    </div>
  </section>

  <section class="reviews fade-in-up" id="reviews">
    <div class="container">
      <div class="reviews-header">
        <span class="reviews-subtitle">Отзывы клиентов</span>
        <h2 class="reviews-title">Что говорят о нас</h2>
        <div class="reviews-decor-line"></div>
      </div>
      <div class="slider-wrapper">
        <input type="radio" name="slider" id="slide-1" checked />
        <input type="radio" name="slider" id="slide-2" />
        <input type="radio" name="slider" id="slide-3" />
        <div class="slides-container">
          ${reviews
            .map(
              (r: { text: string; author: string }, i: number) => `
            <div class="review-slide slide-content-${i + 1}">
              <div class="review-stars-box">${"★".repeat(5)}</div>
              <p class="review-text">«${escapeHtml(r.text)}»</p>
              <span class="review-author">${escapeHtml(r.author)}</span>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="slider-dots">
          <label for="slide-1" class="dot-label"></label>
          <label for="slide-2" class="dot-label"></label>
          <label for="slide-3" class="dot-label"></label>
        </div>
      </div>
    </div>
  </section>

  <footer class="contacts fade-in-up" id="contacts">
    <div class="container">
      <div class="contacts-wrapper">
        <div class="contacts-info">
          <span class="contacts-subtitle">Ждем вас</span>
          <h2 class="contacts-title">Контакты</h2>
          <div class="contacts-decor-line"></div>
          <div class="contacts-list">
            ${form.address ? `<div class="contacts-item"><span class="item-label">Адрес:</span><p class="item-value">${escapeHtml(form.address)}</p></div>` : ""}
            <div class="contacts-item"><span class="item-label">Режим работы:</span><p class="item-value">Ежедневно с 10:00 до 21:00</p></div>
            ${form.phone ? `<div class="contacts-item"><span class="item-label">Телефон:</span><a href="tel:${form.phone}" class="item-value phone-link">${escapeHtml(form.phone)}</a></div>` : ""}
          </div>
        </div>
        <div class="contacts-action-card">
          <h3 class="action-card-title">Записаться онлайн</h3>
          <p class="action-card-desc">Выберите удобное время. Мы подтвердим запись в течение 5 минут.</p>
          <form id="bookingForm" action="https://formspree.io/f/xlgyvvbz" method="POST" style="display:flex;flex-direction:column;gap:15px;margin-top:20px;">
            <input type="text" name="name" placeholder="Ваше имя" required style="background:rgba(255,255,255,0.08);border:1px solid #c9a96e;color:#000;padding:12px 14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:0.95rem;outline:none;">
            <input type="tel" name="phone" placeholder="Телефон" required style="background:rgba(255,255,255,0.08);border:1px solid #c9a96e;color:#000;padding:12px 14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:0.95rem;outline:none;">
            <select name="service" required style="background:rgba(255,255,255,0.08);border:1px solid #c9a96e;color:#000;padding:12px 14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:0.95rem;outline:none;appearance:none;cursor:pointer;">
              <option value="" disabled selected>Выберите услугу</option>
              ${services.map((s: { name: string; price: any }) => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} (${escapeHtml(s.price || "")})</option>`).join("")}
            </select>
            <label style="color:#c9a96e;font-size:0.85rem;font-weight:500;margin-bottom:-8px;">Желаемая дата</label>
            <input type="date" name="date" id="bookingDate" required style="background:rgba(255,255,255,0.08);border:1px solid #c9a96e;color:#000;padding:12px 14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:0.95rem;outline:none;">
            <label style="color:#c9a96e;font-size:0.85rem;font-weight:500;margin-bottom:-8px;">Удобное время</label>
            <select name="time" required style="background:rgba(255,255,255,0.08);border:1px solid #c9a96e;color:#000;padding:12px 14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:0.95rem;outline:none;appearance:none;cursor:pointer;">
              <option value="" disabled selected>Выберите время</option>
              ${["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"].map((t) => `<option value="${t}">${t}</option>`).join("")}
            </select>
            <input type="hidden" name="_subject" value="Новая запись с сайта">
            <button type="submit" style="background:#c9a96e;color:#111;border:none;padding:14px;font-weight:700;font-size:1rem;border-radius:6px;cursor:pointer;transition:background 0.3s,transform 0.2s;margin-top:10px;letter-spacing:0.5px;">Записаться</button>
            <p id="formMessage" style="display:none;color:#c9a96e;margin-top:8px;font-size:0.9rem;text-align:center;">✔ Спасибо! Ваша заявка отправлена. Мы свяжемся для подтверждения.</p>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ${escapeHtml(form.title || form.name || "")}. Все права защищены.</p>
      </div>
    </div>
  </footer>
  <script>
    document.getElementById('bookingDate').min = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('bookingForm').addEventListener('submit', function(){setTimeout(function(){document.getElementById('formMessage').style.display='block'},500)});
  </script>
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
</script>
</body>
</html>`;
}

// ===== GET =====
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "userId is required" }, { status: 400 });

  const site = await prisma.site.findFirst({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      phrase: true,
      skills: true,
      logo: true,
      inst: true,
      phone: true,
      reviews: true,
      address: true,
      gallery: true,
      html: true,
      slug: true,
      published: true,
      createdAt: true,
      style: true,
      userId: true,
      metaTitle: true,
      metaDescription: true,
    },
  });
  if (!site)
    return NextResponse.json(
      { error: "Site not found or access denied" },
      { status: 404 },
    );
  return NextResponse.json(site);
}

// ===== PUT =====
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const {
    userId,
    title,
    phrase,
    skills,
    logo,
    inst,
    phone,
    reviews,
    address,
    gallery,
    style,
    metaTitle,
    metaDescription,
  } = body;

  if (!userId || !title) {
    return NextResponse.json(
      { error: "userId and title required" },
      { status: 400 },
    );
  }

  const existing = await prisma.site.findFirst({ where: { id, userId } });
  if (!existing)
    return NextResponse.json(
      { error: "Site not found or access denied" },
      { status: 404 },
    );

  const html = generateHTMLFromForm({
    ...body,
    title,
    phrase,
    skills,
    logo,
    inst,
    phone,
    reviews,
    address,
    gallery,
    style,
    metaTitle,
    metaDescription,
  });

  const updated = await prisma.site.update({
    where: { id },
    data: {
      title,
      phrase,
      skills,
      logo,
      inst,
      phone,
      reviews,
      address,
      gallery,
      style,
      html,
      metaTitle: body.metaTitle ?? existing.metaTitle,
      metaDescription: body.metaDescription ?? existing.metaDescription,
    },
  });

  return NextResponse.json(updated);
}

// ===== DELETE =====
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "userId is required" }, { status: 400 });

  const site = await prisma.site.findFirst({ where: { id, userId } });
  if (!site)
    return NextResponse.json(
      { error: "Site not found or access denied" },
      { status: 404 },
    );

  await prisma.site.delete({ where: { id } });
  return NextResponse.json(
    { message: "Site deleted successfully" },
    { status: 200 },
  );
}
