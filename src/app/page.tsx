"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loginWithGoogle, logout } from "@/firebase";
import Link from "next/link";
import SiteForm from "@/components/SiteForm";
import toast from "react-hot-toast";

export default function HomePage() {
  const { userId } = useAuth();
  const [visible, setVisible] = useState(false);
  const [html, setHtml] = useState<string>("");
  const [lastSlug, setLastSlug] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGenerate = (newHtml: string, slug: string) => {
    setHtml(newHtml);
    setLastSlug(slug);
    setSuccess(true);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/s/${lastSlug}`;
    navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована! Отправьте её клиенту.");
  };

  return (
    <main
      style={{
        height: "100vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Плавающие частицы */}
      <div className="particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      {/* Секция 1: Приветствие */}
      <div
        className={`fade-in-up ${visible ? "visible" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "0 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          className="title"
          style={{ fontSize: "3rem", marginBottom: "20px" }}
        >
          Создай сайт-визитку для своего салона
        </h1>
        <p
          className="subtitle"
          style={{ maxWidth: "600px", marginBottom: "40px" }}
        >
          Красивый лендинг с услугами, ценами, фото и онлайн-записью — за 2 дня.
          Управляйте им в любое время.
        </p>

        {userId ? (
          <button
            onClick={() => scrollTo(formRef)}
            className="submit-btn pulse-animation"
            style={{ fontSize: "1.2rem", padding: "16px 40px" }}
          >
            Перейти к форме
          </button>
        ) : (
          <button
            onClick={() => scrollTo(authRef)}
            className="submit-btn pulse-animation"
            style={{ fontSize: "1.2rem", padding: "16px 40px" }}
          >
            Начать создавать
          </button>
        )}

        {/* Стрелка вниз */}
        <div
          onClick={() => (userId ? scrollTo(formRef) : scrollTo(authRef))}
          className="scroll-arrow"
          style={{ zIndex: 2 }}
        >
          <svg
            width="28"
            height="28"
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
      </div>

      {/* Секция 2: Авторизация */}
      {!userId && (
        <div
          ref={authRef}
          className={`fade-in-up ${visible ? "visible" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "0 20px",
            zIndex: 1,
          }}
        >
          <h2 className="section-title">Войдите, чтобы создать сайт</h2>
          <p style={{ color: "#8b6e7a", marginBottom: "30px" }}>
            Используйте аккаунт Google для входа
          </p>
          <button
            onClick={loginWithGoogle}
            className="submit-btn pulse-animation"
            style={{ fontSize: "1.2rem", padding: "16px 40px" }}
          >
            Войти через Google
          </button>
        </div>
      )}

      {/* Секция 3: Форма */}
      {userId && (
        <div
          ref={formRef}
          className={`fade-in-up ${visible ? "visible" : ""}`}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: "40px 20px",
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <Link
              href="/dashboard"
              className="submit-btn"
              style={{ padding: "8px 20px", fontSize: "0.9rem" }}
            >
              Мои сайты
            </Link>
            <button
              onClick={logout}
              className="submit-btn"
              style={{
                padding: "8px 20px",
                fontSize: "0.9rem",
                background: "transparent",
                border: "1px solid #b07a8c",
                color: "#b07a8c",
              }}
            >
              Выйти
            </button>
          </div>
          <h1 className="title">Создай сайт-визитку</h1>
          <SiteForm userId={userId} onGenerate={handleGenerate} />

          {/* Уведомление об успешном создании */}
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
                Ваш сайт-визитка готов. Чтобы он стал доступен по ссылке,
                опубликуйте его в Моих сайтах.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
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
                {lastSlug && (
                  <button
                    onClick={copyLink}
                    className="submit-btn"
                    style={{
                      padding: "14px 32px",
                      fontSize: "1rem",
                      background: "transparent",
                      border: "1px solid #b07a8c",
                      color: "#b07a8c",
                    }}
                  >
                    📋 Скопировать ссылку
                  </button>
                )}
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#a08a94",
                  marginTop: "12px",
                }}
              >
                Ссылка станет активной после публикации сайта в дашборде.
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>
    </main>
  );
}
