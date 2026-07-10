import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Стили ────────────────────────────────────────────────
const STYLES: Record<string, string> = {
  // Текущий премиум-стиль (PRO)
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

  /* Hero */
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

  /* Услуги */
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

  /* Отзывы (исправленное позиционирование) */
  .reviews { padding:80px 0; background:#fdf2f4; }
  .reviews-header { text-align:center; margin-bottom:60px; }
  .reviews-subtitle { color:#b07a8c; font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; }
  .reviews-title { font-size:2.5rem; font-weight:700; color:#4a3f47; margin-bottom:20px; }
  .reviews-decor-line {
    width:60px; height:3px; background:linear-gradient(135deg, #f8c3d3, #e4b5c6); margin:0 auto; border-radius:2px;
  }
  .slider-wrapper {
    max-width:700px; margin:0 auto; position:relative;
    padding-bottom: 40px; /* место под точки */
  }
  .slides-container {
    position: relative;
    min-height: 300px;   /* достаточно высоты для самого большого отзыва */
  }
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

  /* Точки – абсолютно внизу wrapper, не влияют на поток */
  .slider-dots {
    display:flex; justify-content:center; gap:12px;
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  }
  .dot-label {
    width:12px; height:12px; border-radius:50%; background:rgba(176,122,140,0.3);
    cursor:pointer; transition:background 0.3s;
  }
  #slide-1:checked ~ .slider-dots .dot-label:nth-child(1),
  #slide-2:checked ~ .slider-dots .dot-label:nth-child(2),
  #slide-3:checked ~ .slider-dots .dot-label:nth-child(3) { background:#b07a8c; }

  /* Контакты */
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
    min-width:280px; box-sizing:border-box;
  }
  .action-card-title { font-size:1.5rem; font-weight:700; color:#4a3f47; margin-bottom:10px; }
  .action-card-desc { color:#8b6e7a; margin-bottom:20px; }
  .footer-bottom { text-align:center; padding:20px 0 10px; color:#8b6e7a; font-size:0.9rem; }

  /* Форма записи */
  #bookingForm {
    display:flex; flex-direction:column; gap:15px; margin-top:20px;
    width:100%; max-width:100%; box-sizing:border-box;
  }
  #bookingForm input,
  #bookingForm select,
  #bookingForm textarea {
    background:rgba(255,255,255,0.08);
    border:1px solid #c9a96e;
    color:#000;
    padding:12px 14px;
    border-radius:6px;
    font-family:'Montserrat',sans-serif;
    font-size:0.95rem;
    outline:none;
    width:100%;
    box-sizing:border-box;
  }
  #bookingForm button {
    background:#c9a96e;
    color:#111;
    border:none;
    padding:14px;
    font-weight:700;
    font-size:1rem;
    border-radius:6px;
    cursor:pointer;
    transition:background 0.3s, transform 0.2s;
    margin-top:10px;
    letter-spacing:0.5px;
    width:100%;
    box-sizing:border-box;
  }
  #bookingForm button:hover { background:#dbb87c; transform:translateY(-1px); }
  #formMessage { display:none; color:#c9a96e; margin-top:8px; font-size:0.9rem; text-align:center; }

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
    .contacts-wrapper { flex-direction:column; align-items:center; padding:0 10px; }
    .contacts-info { text-align:center; }
    .contacts-action-card {
      min-width:0;
      padding:20px 15px;
      width:100%;
    }
    .slider-arrow { display: none; }

    /* Отзывы: уменьшаем высоту контейнера и текста */
    .slides-container { min-height: 250px; }
    .review-text { font-size:1rem; padding:16px; }
  }

  /* Совсем маленькие экраны (320–480px) */
  @media (max-width:480px) {
    .hero-main-title { font-size:2rem; }
    .contacts-action-card { padding:15px 10px; }
    #bookingForm input,
    #bookingForm select,
    #bookingForm button { font-size:0.9rem; padding:10px 12px; }
    .slides-container { min-height: 280px; } /* чуть выше, чтобы уместился отзыв */
  }
`,
  // Бесплатный упрощённый стиль (FREE)
  free: `
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family:'Montserrat',sans-serif;
    background:#fff8fa;
    color:#4a3f47;
    overflow-x:hidden;
    line-height:1.5;
  }
  header { padding: 40px 20px; }
  .hero-premium {
    min-height:70vh; display:flex; align-items:center; justify-content:center;
    background:#fff0f3; text-align:center; border-bottom:1px solid #fce4e8;
  }
  .hero-ticker { display:none; }
  .hero-container {
    display:flex; flex-direction:column; align-items:center; gap:30px; max-width:800px; margin:0 auto;
  }
  .hero-text-side { order:1; }
  .hero-tag-badge {
    display:inline-block; border:1px solid #d49ba7; color:#b07a8c; padding:6px 16px;
    border-radius:20px; font-size:0.9rem; margin-bottom:20px; background:rgba(255,255,255,0.8);
  }
  .hero-main-title { font-size:2.4rem; font-weight:700; color:#4a3f47; margin-bottom:10px; }
  .hero-description { color:#8b6e7a; margin:15px 0 25px; max-width:450px; }
  .hero-actions { margin-top:20px; display:flex; gap:15px; flex-wrap:wrap; justify-content:center; }
  .hero-primary-btn {
    background:#b07a8c; color:#fff; padding:14px 32px; border-radius:30px; font-weight:700;
    text-decoration:none; display:inline-block; transition:0.2s;
  }
  .hero-primary-btn:hover { background:#c9879b; transform:translateY(-2px); }
  .hero-secondary-btn {
    border:1px solid #b07a8c; color:#b07a8c; padding:14px 32px; border-radius:30px;
    text-decoration:none; font-weight:600; background:white; transition:0.2s;
  }
  .hero-secondary-btn:hover { background:rgba(176,122,140,0.08); transform:translateY(-2px); }
  .hero-visual-side {
    order:0; width:160px; height:160px; border-radius:50%; overflow:hidden;
    box-shadow:0 12px 24px rgba(176,122,140,0.15); background:#f8c3d3;
    transition:0.3s;
  }
  .hero-visual-side:hover { transform:scale(1.03); }
  .photo-frame { width:100%; height:100%; position:static; border-radius:50%; }
  .photo-slide { width:100%; height:100%; background-size:cover; background-position:center; }
  .frame-main { display:block; }
  .frame-sub { display:none; }

  /* Услуги */
  .services { padding:70px 0; background:#fff; }
  .services-header { text-align:center; margin-bottom:40px; }
  .services-subtitle { color:#b07a8c; font-size:0.85rem; text-transform:uppercase; letter-spacing:2px; }
  .services-title { font-size:2rem; font-weight:700; color:#4a3f47; margin-bottom:15px; }
  .services-decor-line {
    width:50px; height:3px; background:linear-gradient(135deg, #f8c3d3, #e4b5c6); margin:0 auto; border-radius:2px;
  }
  .services-slider-wrapper { max-width:1100px; margin:0 auto; }
  .services-carousel {
    display:flex; overflow-x:auto; gap:24px; padding:0 20px 20px; scroll-snap-type:x mandatory;
    justify-content:center;
  }
  .services-carousel::-webkit-scrollbar { display:none; }
  .service-card {
    flex:0 0 260px; scroll-snap-align:start; background:#fff; border-radius:18px; overflow:hidden;
    box-shadow:0 4px 14px rgba(0,0,0,0.04); border:1px solid #f2d9e0;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  .service-card:hover { transform:translateY(-4px); box-shadow:0 10px 20px rgba(176,122,140,0.12); }
  .service-card-image img { width:100%; height:170px; object-fit:cover; border-bottom:1px solid #fce4e8; }
  .service-info { padding:18px; }
  .service-name { font-size:1.1rem; font-weight:600; color:#4a3f47; margin-bottom:6px; }
  .service-desc { color:#8b6e7a; font-size:0.85rem; line-height:1.5; margin-bottom:12px; }
  .service-price { font-size:1.1rem; font-weight:700; color:#b07a8c; }
  .slider-arrow { display:none; }

  /* Отзывы */
  .reviews { padding:70px 0; background:#fff5f7; }
  .reviews-header { text-align:center; margin-bottom:40px; }
  .reviews-subtitle { color:#b07a8c; font-size:0.85rem; text-transform:uppercase; letter-spacing:2px; }
  .reviews-title { font-size:2rem; font-weight:700; color:#4a3f47; margin-bottom:15px; }
  .reviews-decor-line {
    width:50px; height:3px; background:linear-gradient(135deg, #f8c3d3, #e4b5c6); margin:0 auto; border-radius:2px;
  }
  .slider-wrapper { max-width:650px; margin:0 auto; }
  .review-slide {
    background:#fff; border-radius:18px; padding:24px; margin-bottom:24px;
    box-shadow:0 4px 14px rgba(0,0,0,0.03); border:1px solid #f2d9e0;
    text-align:center;
  }
  .review-stars-box { margin-bottom:12px; }
  .review-text { font-style:italic; color:#5c4b56; line-height:1.6; }
  .review-author { color:#b07a8c; font-weight:600; margin-top:12px; display:block; }

  /* Контакты и форма */
  .contacts { background:#fff; padding-top:70px; }
  .contacts-wrapper {
    display:flex; gap:40px; max-width:900px; margin:0 auto; padding:0 20px;
    flex-wrap:wrap; justify-content:center;
  }
  .contacts-info { flex:1; min-width:250px; text-align:left; }
  .contacts-title { font-size:2rem; font-weight:700; color:#4a3f47; margin:10px 0 20px; }
  .contacts-decor-line {
    width:50px; height:3px; background:linear-gradient(135deg, #f8c3d3, #e4b5c6); margin-bottom:30px; border-radius:2px;
  }
  .contacts-item { margin-bottom:20px; }
  .item-label { color:#b07a8c; font-weight:600; display:block; margin-bottom:4px; }
  .item-value { color:#5c4b56; }
  .phone-link { color:#5c4b56; text-decoration:none; transition:color 0.2s; }
  .phone-link:hover { color:#b07a8c; }

  .contacts-action-card {
    background:#fff; border-radius:18px; padding:30px; flex:1; min-width:280px;
    border:1px solid #f2d9e0; box-shadow:0 8px 20px rgba(176,122,140,0.06);
    text-align:center;
    box-sizing:border-box;
  }
  .action-card-title { font-size:1.5rem; font-weight:700; color:#4a3f47; margin-bottom:10px; }
  .action-card-desc { color:#8b6e7a; margin-bottom:20px; }

  /* Форма записи */
  #bookingForm {
    display:flex; flex-direction:column; gap:15px; margin-top:20px;
    width:100%; max-width:100%; box-sizing:border-box;
  }
  #bookingForm input,
  #bookingForm select,
  #bookingForm textarea {
    background:rgba(255,255,255,0.08);
    border:1px solid #c9a96e;
    color:#000;
    padding:12px 14px;
    border-radius:6px;
    font-family:'Montserrat',sans-serif;
    font-size:0.95rem;
    outline:none;
    width:100%;
    box-sizing:border-box;
  }
  #bookingForm button {
    background:#c9a96e;
    color:#111;
    border:none;
    padding:14px;
    font-weight:700;
    font-size:1rem;
    border-radius:6px;
    cursor:pointer;
    transition:background 0.3s, transform 0.2s;
    margin-top:10px;
    letter-spacing:0.5px;
    width:100%;
    box-sizing:border-box;
  }
  #bookingForm button:hover { background:#dbb87c; transform:translateY(-1px); }
  #formMessage {
    display:none; color:#c9a96e; margin-top:8px; font-size:0.9rem; text-align:center;
  }

  /* Футер */
  .footer-bottom {
    text-align:center;
    padding:20px 0 0;       /* убрали нижний отступ, который создавал пустоту */
    color:#8b6e7a;
    font-size:0.9rem;
    background:#fff;
  }

  /* Брендинг */
  .beauty-branding {
    text-align:center;
    padding:12px 0 8px;    /* компактно, без лишнего пространства */
    background:#fdf2f4;
    border-top:1px solid #f2d9e0;
    font-size:0.9rem;
    color:#b07a8c;
  }
  .beauty-branding a { color:#b07a8c; font-weight:600; text-decoration:underline; }

  /* Адаптивность для телефонов (вплоть до 320px) */
  @media (max-width:768px) {
    .hero-main-title { font-size:1.9rem; }
    .services-carousel { justify-content:flex-start; }
    .service-card { flex:0 0 220px; }
    .contacts-wrapper { flex-direction:column; align-items:center; padding:0 10px; }
    .contacts-info { text-align:center; }
    .contacts-action-card {
      min-width:0;          /* убираем жёсткий минимум */
      padding:20px 15px;    /* уменьшаем отступы, чтобы влезть в 320px */
      width:100%;
    }
    #bookingForm input,
    #bookingForm select,
    #bookingForm button {
      font-size:0.9rem;
      padding:10px 12px;
    }
  }
  /* Совсем маленькие экраны (320–480px) – на всякий случай */
  @media (max-width:480px) {
    .hero-main-title { font-size:1.7rem; }
    .hero-visual-side { width:130px; height:130px; }
    .contacts-action-card { padding:15px 10px; }
  }
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

    // ─── Определяем тариф пользователя ─────────────────
    let isPro = false;
    let userPlan = "FREE";
    let userLimit = 1;

    if (payload.userId) {
      const user = await prisma.user.findUnique({
        where: { firebaseUid: payload.userId },
        select: { plan: true, sitesLimit: true },
      });

      if (user) {
        userPlan = user.plan;
        userLimit = user.sitesLimit ?? 1;
      }

      // Временная заглушка для тестирования тарифов
      const testPlan = request.headers.get("x-test-plan");
      if (testPlan === "pro") {
        isPro = true;
      } else if (testPlan === "free") {
        isPro = false;
      } else {
        isPro = user?.plan === "PRO";
      }
    }

    // ─── Проверка лимита сайтов ────────────────────────
    const siteCount = await prisma.site.count({
      where: { userId: payload.userId },
    });

    // Для заглушки: если тестовый PRO, лимит не применяем
    const effectiveLimit = isPro ? 999 : userLimit;
    if (siteCount >= effectiveLimit) {
      return NextResponse.json(
        {
          error:
            "Лимит сайтов исчерпан. Перейдите на PRO, чтобы создавать больше.",
        },
        { status: 403 },
      );
    }

    // Выбираем стиль: если PRO — premium, иначе free
    const styleKey = isPro ? "premium" : "free";
    const customStyles = STYLES[styleKey] || STYLES.free;

    // ─── Услуги ─────────────────────────────────────────
    const servicesRaw = (payload.skills || "")
      .split("\n")
      .filter((line: string) => line.trim());
    let services = servicesRaw.map((line: string) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        name: parts[0] || "",
        price: parts[1] || "",
        image: parts[2] || "",
        desc: parts[3] || "",
      };
    });

    if (!isPro) {
      services = services.slice(0, 3);
    }

    // ─── Отзывы ─────────────────────────────────────────
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

    // ─── HTML-сборка ────────────────────────────────────
    const heroBackgroundImage = isPro
      ? ""
      : `background-image:url('${escapeHtml(payload.logo || "")}');`;

    const brandingHtml = !isPro
      ? `<div class="beauty-branding">
           Создано в <a href="https://beautyconstructor.ru" target="_blank">Beauty Constructor</a>
         </div>`
      : "";

    const heroHtml = isPro
      ? `
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
          <h1 class="hero-main-title">${escapeHtml(payload.name)}</h1>
          <p class="hero-description">${escapeHtml(payload.phrase || "")}</p>
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
    </header>`
      : `
    <header class="hero-premium">
      <div class="hero-container">
        <div class="hero-visual-side">
          <div class="photo-frame frame-main">
            <div class="photo-slide slide-img-1" style="${heroBackgroundImage}"></div>
          </div>
        </div>
        <div class="hero-text-side">
          <div class="hero-tag-badge">Beauty Studio</div>
          <h1 class="hero-main-title">${escapeHtml(payload.name)}</h1>
          <p class="hero-description">${escapeHtml(payload.phrase || "")}</p>
          <div class="hero-actions">
            <a href="#contacts" class="hero-primary-btn">Записаться</a>
            <a href="#services" class="hero-secondary-btn">Услуги</a>
          </div>
        </div>
      </div>
    </header>`;

    const servicesHtml = `
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
    </section>`;

    const reviewsHtml = isPro
      ? `
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
    </section>`
      : `
    <section class="reviews" id="reviews">
      <div class="container">
        <div class="reviews-header">
          <span class="reviews-subtitle">Отзывы клиентов</span>
          <h2 class="reviews-title">Что говорят о нас</h2>
          <div class="reviews-decor-line"></div>
        </div>
        <div class="slider-wrapper">
          ${reviews
            .map(
              (r: { text: string; author: string }) => `
            <div class="review-slide">
              <div class="review-stars-box">${"★".repeat(5)}</div>
              <p class="review-text">«${escapeHtml(r.text)}»</p>
              <span class="review-author">${escapeHtml(r.author)}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>`;

    const contactsHtml = `
    <footer class="contacts fade-in-up" id="contacts">
      <div class="container">
        <div class="contacts-wrapper">
          <div class="contacts-info">
            <span class="contacts-subtitle">Ждем вас</span>
            <h2 class="contacts-title">Контакты</h2>
            <div class="contacts-decor-line"></div>
            <div class="contacts-list">
              ${payload.address ? `<div class="contacts-item"><span class="item-label">Адрес:</span><p class="item-value">${escapeHtml(payload.address)}</p></div>` : ""}
              <div class="contacts-item"><span class="item-label">Режим работы:</span><p class="item-value">Ежедневно с 10:00 до 21:00</p></div>
              ${payload.phone ? `<div class="contacts-item"><span class="item-label">Телефон:</span><a href="tel:${payload.phone}" class="item-value phone-link">${escapeHtml(payload.phone)}</a></div>` : ""}
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
          <p>&copy; 2026 ${escapeHtml(payload.name)}. Все права защищены.</p>
          ${brandingHtml}
        </div>
      </div>
    </footer>`;

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(payload.name)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap" rel="stylesheet">
  <style>
    ${customStyles}
    .slide-img-1 { background-image:url('${escapeHtml(payload.logo || "")}'); }
    ${
      isPro
        ? `
    .slide-img-2 { background-image:url('${escapeHtml(galleryImages[0] || "")}'); }
    .slide-img-3 { background-image:url('${escapeHtml(galleryImages[1] || "")}'); }
    .slide-img-4 { background-image:url('${escapeHtml(galleryImages[2] || "")}'); }
    `
        : ""
    }
  </style>
</head>
<body>
  ${heroHtml}
  ${servicesHtml}
  ${reviewsHtml}
  ${contactsHtml}
  <script>
    document.getElementById('bookingDate').min = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('bookingForm').addEventListener('submit', function(){setTimeout(function(){document.getElementById('formMessage').style.display='block'},500)});
  </script>
  ${
    isPro
      ? `
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
  </script>`
      : ""
  }
</body>
</html>`;

    // ─── Сохранение в БД ────────────────────────────────
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
          html,
          userId: payload.userId,
          slug,
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
            html,
            userId: payload.userId,
            slug,
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
