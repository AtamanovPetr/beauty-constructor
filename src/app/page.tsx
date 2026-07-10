"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loginWithGoogle } from "@/firebase";
import Link from "next/link";
import SiteForm from "@/components/SiteForm";
import Header from "@/components/Header";
export default function HomePage() {
  const { userId } = useAuth();
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: string;
      animationDelay: string;
      animationDuration: string;
      width: string;
      height: string;
    }>
  >([]);
  const formRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>("");
  const [lastSlug, setLastSlug] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [themeSlide, setThemeSlide] = useState(0);

  const nextThemeSlide = () => setThemeSlide((prev) => (prev === 0 ? 1 : 0));
  const prevThemeSlide = () => setThemeSlide((prev) => (prev === 0 ? 1 : 0));

  useEffect(() => {
    setVisible(true);

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${15 + Math.random() * 20}s`,
      width: `${4 + Math.random() * 6}px`,
      height: `${4 + Math.random() * 6}px`,
    }));
    setParticles(newParticles);

    const sections = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 },
    );
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleGenerate = (html: string, slug: string) => {
    setHtml(html);
    setLastSlug(slug);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main style={{ position: "relative" }}>
      {/* Плавающие частицы */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
              width: p.width,
              height: p.height,
            }}
          />
        ))}
      </div>
      <Header />
      {/* ─────── Hero с волнами ─────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 20px 80px",
          position: "relative",
          zIndex: 1,
          background:
            "linear-gradient(135deg, #fdf2f4, #f9f3f5, #f5f0f7, #fdf2f4)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100px" }}
          >
            <path
              fill="rgba(255,255,255,0.3)"
              d="M0,128L48,117.3C96,107,192,85,288,74.7C384,64,480,64,576,85.3C672,107,768,149,864,149.3C960,149,1056,107,1152,90.7C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 8vw, 5rem)",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #6d4c5e, #b07a8c, #c9a96e, #b07a8c, #6d4c5e)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
            lineHeight: 1.2,
            animation: "textGradient 3s linear infinite",
          }}
        >
          Сайт для салона красоты
          <br /> за 5 минут
        </h1>
        <p
          style={{
            fontSize: "clamp(0.9rem, 3vw, 1.3rem)",
            color: "#8b6e7a",
            maxWidth: "600px",
            marginBottom: "32px",
            lineHeight: 1.6,
            padding: "0 10px",
          }}
        >
          Конструктор визиток с онлайн-записью, адаптивным дизайном и бесплатным
          тарифом.
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/pricing"
            className="pulse-button"
            style={{
              padding: "16px 32px",
              fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
              fontWeight: 700,
              background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
              color: "#4a2e38",
              borderRadius: "50px",
              boxShadow: "0 8px 24px rgba(201,169,110,0.4)",
              textDecoration: "none",
            }}
          >
            Смотреть тарифы
          </Link>
          {userId ? (
            <button
              onClick={scrollToForm}
              className="glass-button"
              style={{
                padding: "16px 32px",
                fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
                fontWeight: 700,
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                border: "2px solid #b07a8c",
                color: "#b07a8c",
                borderRadius: "50px",
                cursor: "pointer",
              }}
            >
              Создать сайт
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="glass-button"
              style={{
                padding: "16px 32px",
                fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
                fontWeight: 700,
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                border: "2px solid #b07a8c",
                color: "#b07a8c",
                borderRadius: "50px",
                cursor: "pointer",
              }}
            >
              Попробовать бесплатно
            </button>
          )}
        </div>
        <div
          onClick={scrollToForm}
          className="bounce-arrow"
          style={{
            position: "absolute",
            bottom: "30px",
            cursor: "pointer",
            width: "48px",
            height: "48px",
            background: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b07a8c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ─────── Примеры тем (видео-слайдер) ─────── */}
      <div
        className="reveal-on-scroll"
        style={{
          padding: "60px 20px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <h2 className="section-title" style={{ marginBottom: "20px" }}>
          Посмотрите, как работают сайты
        </h2>
        <p
          style={{
            color: "#8b6e7a",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px",
          }}
        >
          Короткие видео: слева — бесплатная версия, справа — PRO с анимациями и
          галереей.
        </p>

        <div
          style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}
        >
          {/* Стрелка влево */}
          <button
            onClick={prevThemeSlide}
            style={{
              position: "absolute",
              left: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "white",
              border: "1px solid rgba(184,149,162,0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              zIndex: 5,
              fontSize: "1.5rem",
              color: "#b07a8c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>

          {/* Слайды с видео */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              background: "#000", // чёрный фон на случай, если видео не загрузилось
            }}
          >
            <div
              style={{
                display: "flex",
                transition: "transform 0.5s ease",
                transform: `translateX(-${themeSlide * 100}%)`,
              }}
            >
              {/* FREE видео */}
              <div style={{ flex: "0 0 100%", position: "relative" }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "auto", display: "block" }}
                >
                  <source src="/videos/free-demo.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    background: "rgba(176,122,140,0.9)",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    backdropFilter: "blur(5px)",
                  }}
                >
                  FREE
                </div>
              </div>

              {/* PRO видео */}
              <div style={{ flex: "0 0 100%", position: "relative" }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "auto", display: "block" }}
                >
                  <source src="/videos/pro-demo.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                    color: "#4a2e38",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 10px rgba(201,169,110,0.5)",
                  }}
                >
                  PRO
                </div>
              </div>
            </div>
          </div>

          {/* Стрелка вправо */}
          <button
            onClick={nextThemeSlide}
            style={{
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "white",
              border: "1px solid rgba(184,149,162,0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              zIndex: 5,
              fontSize: "1.5rem",
              color: "#b07a8c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>

        {/* Индикаторы */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <div
            onClick={() => setThemeSlide(0)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background:
                themeSlide === 0 ? "#b07a8c" : "rgba(184,149,162,0.3)",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          />
          <div
            onClick={() => setThemeSlide(1)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background:
                themeSlide === 1 ? "#c9a96e" : "rgba(184,149,162,0.3)",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          />
        </div>
      </div>

      {/* Как это работает */}
      <div
        className="reveal-on-scroll"
        style={{
          padding: "60px 20px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          background: "rgba(255,240,244,0.2)",
        }}
      >
        <h2 className="section-title" style={{ marginBottom: "40px" }}>
          Как это работает
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {["Заполните поля", "Загрузите фото", "Опубликуйте"].map(
            (step, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  width: "280px",
                  padding: "30px 20px",
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(160,120,135,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    background: "linear-gradient(135deg, #f8c3d3, #e4b5c6)",
                    borderRadius: "50%",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#4a2e38",
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontWeight: 600,
                    color: "#5c4b56",
                    marginBottom: "8px",
                  }}
                >
                  {step}
                </h3>
                <p
                  style={{
                    color: "#8b6e7a",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  {i === 0
                    ? "Название, услуги, контакты – всё просто и быстро."
                    : i === 1
                      ? "Логотип и фото работ – drag & drop или загрузка с телефона."
                      : "Сайт сразу доступен по ссылке. Можно привязать свой домен."}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Возможности */}
      <div
        className="reveal-on-scroll"
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background: "white",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2 className="section-title" style={{ marginBottom: "40px" }}>
          Возможности
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {[
            "Конструктор услуг",
            "Онлайн-запись",
            "Адаптивный дизайн",
            "Загрузка фото",
          ].map((feat, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                width: "250px",
                padding: "30px 20px",
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 16px rgba(160,120,135,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
                {["🎨", "📅", "📱", "🖼️"][i]}
              </div>
              <h3
                style={{
                  color: "#5c4b56",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                {feat}
              </h3>
              <p
                style={{
                  color: "#8b6e7a",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                {i === 0
                  ? "Добавляйте, редактируйте и удаляйте услуги с фото и ценами."
                  : i === 1
                    ? "Форма с выбором даты и времени, отправка заявок на email."
                    : i === 2
                      ? "Отлично выглядит на телефоне, планшете и компьютере."
                      : "Загружайте изображения для услуг, галереи и логотипа."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Отзывы (горизонтальная карусель) */}
      <div
        className="reveal-on-scroll"
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background: "rgba(255,240,244,0.2)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2 className="section-title" style={{ marginBottom: "40px" }}>
          Отзывы
        </h2>
        <div
          style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}
        >
          <div
            className="reviews-slider"
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              paddingBottom: "20px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {[
              {
                name: "Анна",
                text: "Сделала сайт за 10 минут! Клиенты сами записываются.",
              },
              {
                name: "Мария",
                text: "Давно искала простой конструктор. Теперь у меня красивая визитка.",
              },
              {
                name: "Ирина",
                text: "Поддержка отличная, помогли с доменом. Рекомендую!",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  flex: "0 0 300px",
                  scrollSnapAlign: "start",
                  padding: "30px 24px",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 24px rgba(160,120,135,0.08)",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#5c4b56",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                >
                  «{review.text}»
                </p>
                <p style={{ fontWeight: 600, color: "#b07a8c" }}>
                  {review.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Призыв к регистрации */}
      {!userId && (
        <div
          className="reveal-on-scroll"
          style={{
            padding: "60px 20px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            background: "linear-gradient(135deg, #f9eef2, #fdf2f4)",
          }}
        >
          <h2 className="section-title" style={{ marginBottom: "20px" }}>
            Начните прямо сейчас
          </h2>
          <p
            style={{
              color: "#8b6e7a",
              marginBottom: "32px",
              fontSize: "1.1rem",
            }}
          >
            Войдите через Google, чтобы создать свой первый сайт за 5 минут.
          </p>
          <button
            onClick={loginWithGoogle}
            className="pulse-button"
            style={{
              padding: "18px 48px",
              fontSize: "1.2rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
              color: "#4a2e38",
              borderRadius: "50px",
              boxShadow: "0 8px 24px rgba(201,169,110,0.4)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Войти через Google и создать сайт
          </button>
        </div>
      )}

      {/* Форма (только для залогиненных) */}
      {userId && (
        <div
          ref={formRef}
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "60px 20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            className="title"
            style={{ textAlign: "center", marginBottom: "30px" }}
          >
            Создай сайт-визитку
          </h1>
          <SiteForm userId={userId} onGenerate={handleGenerate} />
          {success && (
            <div
              className="fade-in-up visible"
              style={{
                marginTop: "40px",
                background: "rgba(255, 250, 252, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(184, 149, 162, 0.4)",
                borderRadius: "24px",
                padding: "32px 24px",
                textAlign: "center",
                boxShadow: "0 12px 32px rgba(160, 120, 135, 0.15)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>✅</div>
              <h2
                style={{
                  color: "#5c4b56",
                  marginBottom: "8px",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Сайт создан!
              </h2>
              <p style={{ color: "#8b6e7a", marginBottom: "24px" }}>
                Ваш сайт-визитка готов. Вы можете опубликовать его и поделиться
                ссылкой.
              </p>
              <Link
                href="/dashboard"
                className="submit-btn"
                style={{
                  padding: "14px 32px",
                  fontSize: "1rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Перейти в Мои сайты →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Глобальные стили анимаций */}
      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(12px);
          }
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes textGradient {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }

        .particle {
          position: absolute;
          background: rgba(184, 120, 140, 0.12);
          border-radius: 50%;
          animation: float linear infinite;
          bottom: -20px;
        }

        .glass-card {
          transition:
            transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
        }
        .glass-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(160, 120, 135, 0.25);
        }

        .feature-card {
          transition:
            transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(160, 120, 135, 0.2);
        }

        .pulse-button {
          transition:
            transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
        }
        .pulse-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(201, 169, 110, 0.6);
        }

        .glass-button {
          transition:
            transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
        }
        .glass-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(176, 122, 140, 0.4);
        }

        .bounce-arrow {
          animation: bounce 2s infinite;
        }

        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: opacity, transform;
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .reviews-slider::-webkit-scrollbar {
          display: none;
        }
        .reviews-slider {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .reveal-on-scroll {
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }
          .glass-card,
          .feature-card {
            width: 100% !important;
          }
          header {
            padding: 8px 16px !important;
          }
          nav {
            gap: 8px !important;
          }
          .title {
            font-size: 1.8rem !important;
          }
        }

        @media (max-width: 480px) {
          header {
            flex-direction: column;
            gap: 8px;
          }
          nav {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
