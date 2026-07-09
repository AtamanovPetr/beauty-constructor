"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProModal from "@/components/ProModal";
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
  const handleProSubmit = async (email: string) => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf2f4, #f9f3f5, #f5f0f7)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
            style={{
              position: "absolute",
              left: p.left,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
              width: p.width,
              height: p.height,
              background: "rgba(184, 120, 140, 0.12)",
              borderRadius: "50%",
              animation: `float ${p.animationDuration} linear infinite`,
              bottom: "-20px",
            }}
          />
        ))}
      </div>

      {/* Кнопка назад */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "900px",
          margin: "0 auto 20px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            fontSize: "0.95rem",
            fontWeight: 500,
            borderRadius: "50px",
            textDecoration: "none",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(184,149,162,0.3)",
            color: "#5c4b56",
            transition: "all 0.3s ease",
          }}
        >
          ← На главную
        </Link>
      </div>

      {/* Заголовок */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <h1
          className={`fade-in-up ${visible ? "visible" : ""}`}
          style={{
            fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
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
            fontSize: "1.1rem",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Выберите подходящий план и начните создавать сайты для своего бизнеса
        </p>
      </div>

      {/* Карточки тарифов */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* FREE */}
        <div
          className={`fade-in-up ${visible ? "visible" : ""}`}
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "40px 30px",
            width: "320px",
            boxShadow: "0 8px 30px rgba(160,120,135,0.1)",
            border: "1px solid rgba(184,149,162,0.2)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <div>
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
                fontSize: "1.5rem",
              }}
            >
              FREE
            </h2>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#4a3f47",
                margin: "20px 0",
              }}
            >
              0₽
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
              <li style={{ padding: "8px 0" }}>✓ 1 сайт</li>
              <li style={{ padding: "8px 0" }}>✓ Форма онлайн-записи</li>
              <li style={{ padding: "8px 0" }}>
                ✓ Брендинг конструктора в футере
              </li>
              <li style={{ padding: "8px 0" }}>✓ Базовая поддержка</li>
            </ul>
          </div>
          <Link
            href="/"
            style={{
              marginTop: "20px",
              width: "100%",
              background: "transparent",
              border: "2px solid #b07a8c",
              color: "#b07a8c",
              fontWeight: 600,
              padding: "14px",
              borderRadius: "50px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Попробовать бесплатно
          </Link>
        </div>

        {/* PRO */}
        <div
          className={`fade-in-up ${visible ? "visible" : ""}`}
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "40px 30px",
            width: "320px",
            boxShadow: "0 16px 40px rgba(160,120,135,0.2)",
            border: "2px solid #c9a96e",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: "scale(1.03)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <div>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
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
                fontSize: "1.5rem",
              }}
            >
              PRO
            </h2>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#4a3f47",
                margin: "20px 0",
              }}
            >
              500₽/мес
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
              <li style={{ padding: "8px 0" }}>✓ До 5 сайтов</li>
              <li style={{ padding: "8px 0" }}>✓ Свой домен (CNAME)</li>
              <li style={{ padding: "8px 0" }}>✓ Без брендинга конструктора</li>
              <li style={{ padding: "8px 0" }}>✓ Приоритетная поддержка</li>
            </ul>
          </div>
          <button
            style={{
              marginTop: "20px",
              width: "100%",
              background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
              color: "#4a2e38",
              fontWeight: 700,
              padding: "14px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onClick={() => setShowProModal(true)}
          >
            Оформить PRO
          </button>
        </div>
      </div>

      {/* FAQ с аккордеоном */}
      <div
        style={{
          marginTop: "80px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h3
          style={{ color: "#5c4b56", marginBottom: "20px", fontSize: "1.3rem" }}
        >
          Часто задаваемые вопросы
        </h3>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "white",
            borderRadius: "20px",
            padding: "20px 30px",
            boxShadow: "0 4px 16px rgba(160,120,135,0.08)",
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
              a: "В настройках сайта введите ваш домен, а на стороне регистратора настройте CNAME-запись на наш сервер. Мы поможем с инструкцией.",
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
              a: "Пока мы работаем через ручную оплату: после отправки заявки мы свяжемся с вами для выставления счёта. Скоро добавим автоматические платежи.",
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
                  fontWeight: 500,
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

      {/* Анимации */}
      <style jsx global>{`
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
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.8s ease,
            transform 0.8s ease;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <ProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        onSubmit={handleProSubmit}
      />
    </main>
  );
}
