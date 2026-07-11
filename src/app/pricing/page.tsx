"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProModal from "@/components/ProModal";
import Header from "@/components/Header";

export default function PricingPage() {
  const [visible, setVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
  const [showProModal, setShowProModal] = useState(false);

  const handleProSubmit = async (data: { name: string; email: string }) => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
    } else {
      alert(
        "Ошибка отправки. Пожалуйста, свяжитесь с нами через Telegram: @твой_ник",
      );
    }
  };

  useEffect(() => {
    setVisible(true);
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 12}s`,
      width: `${4 + Math.random() * 6}px`,
      height: `${4 + Math.random() * 6}px`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
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

      {/* Контент */}
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "80px",
          maxWidth: "1000px",
          margin: "0 auto",
          paddingLeft: "20px",
          paddingRight: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Заголовок */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1
            className={`fade-in-up ${visible ? "visible" : ""}`}
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.8rem)",
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #6d4c5e, #b07a8c, #c9a96e, #b07a8c, #6d4c5e)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "16px",
              animation: "textGradient 3s linear infinite",
            }}
          >
            Тарифы
          </h1>
          <p
            className={`fade-in-up ${visible ? "visible" : ""}`}
            style={{
              color: "#8b6e7a",
              fontSize: "1.15rem",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Выберите план, который подходит вашему бизнесу
          </p>
        </div>

        {/* Карточки тарифов */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          {/* FREE */}
          <div
            className={`fade-in-up glass-card ${visible ? "visible" : ""}`}
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "40px 30px",
              width: "320px",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(160,120,135,0.1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition:
                "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              willChange: "transform, box-shadow",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 20px 50px rgba(160, 120, 135, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(160,120,135,0.1)";
            }}
          >
            <div>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  background: "linear-gradient(135deg, #f8c3d3, #e4b5c6)",
                  borderRadius: "50%",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  color: "#4a2e38",
                  fontWeight: 700,
                }}
              >
                🌱
              </div>
              <h2
                style={{
                  color: "#b07a8c",
                  marginBottom: "10px",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                }}
              >
                FREE
              </h2>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#4a3f47",
                  margin: "20px 0",
                }}
              >
                0₽
              </p>
              <p
                style={{
                  color: "#8b6e7a",
                  marginBottom: "24px",
                  fontSize: "0.9rem",
                }}
              >
                Для старта и знакомства
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  textAlign: "left",
                  color: "#5c4b56",
                  marginBottom: "30px",
                }}
              >
                <li style={{ padding: "8px 0" }}>✨ 1 сайт-визитка</li>
                <li style={{ padding: "8px 0" }}>📋 До 3 услуг в каталоге</li>
                <li style={{ padding: "8px 0" }}>
                  🎨 Базовая тема (без анимаций)
                </li>
                <li style={{ padding: "8px 0" }}>
                  📩 Заявки с сайта на вашу почту
                </li>
                <li style={{ padding: "8px 0" }}>🚫 Нет галереи работ</li>
                <li style={{ padding: "8px 0" }}>🖼️ Нет слайдера в шапке</li>
                <li style={{ padding: "8px 0" }}>
                  🔗 Водяной знак «Создано в Beauty Constructor»
                </li>
                <li style={{ padding: "8px 0" }}>🌐 Домен вида /s/ваш-адрес</li>
                <li style={{ padding: "8px 0" }}>
                  ⏳ Срок 30 дней (можно продлить)
                </li>
                <li style={{ padding: "8px 0" }}>📚 Базовая поддержка (FAQ)</li>
              </ul>
            </div>
            <Link
              href="/"
              className="glass-button"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                border: "2px solid #b07a8c",
                color: "#b07a8c",
                fontWeight: 600,
                padding: "14px",
                borderRadius: "50px",
                textDecoration: "none",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              Попробовать бесплатно
            </Link>
          </div>

          {/* PRO */}
          <div
            className={`fade-in-up glass-card ${visible ? "visible" : ""}`}
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(25px)",
              borderRadius: "24px",
              padding: "40px 30px",
              width: "340px",
              border: "2px solid #c9a96e",
              boxShadow: "0 16px 40px rgba(160,120,135,0.2)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transform: "scale(1.03)",
              transition:
                "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              willChange: "transform, box-shadow",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05) translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 30px 60px rgba(201, 169, 110, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1.03) translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 16px 40px rgba(160,120,135,0.2)";
            }}
          >
            {/* Шильдик */}
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                color: "#4a2e38",
                fontWeight: 700,
                fontSize: "0.8rem",
                padding: "6px 20px",
                borderRadius: "20px",
                boxShadow: "0 4px 10px rgba(201,169,110,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              Выбор мастеров
            </div>
            <div>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                  borderRadius: "50%",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  color: "#4a2e38",
                  fontWeight: 700,
                }}
              >
                ⭐
              </div>
              <h2
                style={{
                  color: "#c9a96e",
                  marginBottom: "10px",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                }}
              >
                PRO
              </h2>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#4a3f47",
                  margin: "20px 0",
                }}
              >
                500₽/мес
              </p>
              <p
                style={{
                  color: "#8b6e7a",
                  marginBottom: "24px",
                  fontSize: "0.9rem",
                }}
              >
                Для профессионалов и студий
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  textAlign: "left",
                  color: "#5c4b56",
                  marginBottom: "30px",
                }}
              >
                <li style={{ padding: "8px 0" }}>✨ До 5 сайтов</li>
                <li style={{ padding: "8px 0" }}>📋 Неограниченно услуг</li>
                <li style={{ padding: "8px 0" }}>
                  🎨 Премиум-тема с анимациями
                </li>
                <li style={{ padding: "8px 0" }}>
                  📩 Заявки с сайта на вашу почту
                </li>
                <li style={{ padding: "8px 0" }}>🖼️ Галерея «Наши работы»</li>
                <li style={{ padding: "8px 0" }}>
                  📸 Hero-слайдер (до 3 фото)
                </li>
                <li style={{ padding: "8px 0" }}>🚫 Без водяного знака</li>
                <li style={{ padding: "8px 0" }}>🌐 Свой домен (CNAME)</li>
                <li style={{ padding: "8px 0" }}>⏳ Сайт активен всегда</li>
                <li style={{ padding: "8px 0" }}>💎 Приоритетная поддержка</li>
              </ul>
            </div>
            <button
              onClick={() => setShowProModal(true)}
              className="pulse-button"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                color: "#4a2e38",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(201,169,110,0.4)",
              }}
            >
              Оформить PRO
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "80px", textAlign: "center" }}>
          <h3
            style={{
              color: "#5c4b56",
              marginBottom: "24px",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Часто задаваемые вопросы
          </h3>
          <div
            className="glass-card"
            style={{
              maxWidth: "650px",
              margin: "0 auto",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(15px)",
              borderRadius: "20px",
              padding: "24px 30px",
              boxShadow: "0 8px 30px rgba(160,120,135,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              textAlign: "left",
              color: "#5c4b56",
            }}
          >
            {[
              {
                q: "Можно ли сменить тариф?",
                a: "Да, в любой момент вы можете перейти с FREE на PRO или обратно. Все ваши сайты сохранятся.",
              },
              {
                q: "Как привязать свой домен?",
                a: "В настройках сайта (доступно на PRO) введите ваш домен и следуйте инструкции по настройке CNAME-записи.",
              },
              {
                q: "Есть ли скидки?",
                a: "При оплате за год вы получаете скидку 20%. Также действуют сезонные акции.",
              },
              {
                q: "Можно ли удалить сайт?",
                a: "Да, в любой момент. Все данные будут безвозвратно удалены.",
              },
              {
                q: "Как происходит оплата?",
                a: "Сейчас оплата ручная: после заявки мы свяжемся с вами для выставления счёта. Скоро добавим автоматические платежи.",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  borderBottom: "1px solid rgba(184,149,162,0.2)",
                  cursor: "pointer",
                }}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    fontWeight: 600,
                    color: "#5c4b56",
                    transition: "color 0.2s",
                    userSelect: "none",
                  }}
                >
                  {item.q}
                  <span
                    style={{
                      transform:
                        openFaq === index ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      fontSize: "0.8rem",
                      color: "#b07a8c",
                    }}
                  >
                    ▼
                  </span>
                </div>
                <div
                  style={{
                    maxHeight: openFaq === index ? "200px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      padding: "0 0 16px",
                      color: "#8b6e7a",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        onSubmit={handleProSubmit}
      />

      {/* Анимации */}
      <style jsx global>{`
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
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: opacity, transform;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
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
      `}</style>
    </main>
  );
}
