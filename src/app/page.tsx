"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loginWithGoogle, logout } from "@/firebase";
import Link from "next/link";
import SiteForm from "@/components/SiteForm";

export default function HomePage() {
  const { userId } = useAuth();
  const [visible, setVisible] = useState(false);
  const [html, setHtml] = useState<string>("");
  const authRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
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
          animationDelay: "0.2s",
        }}
      >
        <h1
          className="title"
          style={{
            fontSize: "3rem",
            marginBottom: "20px",
            animationDelay: "0.3s",
          }}
        >
          Создай сайт-визитку для своего салона
        </h1>
        <p
          className="subtitle"
          style={{
            maxWidth: "600px",
            marginBottom: "40px",
            animationDelay: "0.4s",
          }}
        >
          Красивый лендинг с услугами, ценами, фото и онлайн-записью — за 2 дня.
          Управляйте им в любое время.
        </p>

        {userId ? (
          <button
            onClick={() => scrollTo(formRef)}
            className="submit-btn pulse-animation"
            style={{
              fontSize: "1.2rem",
              padding: "16px 40px",
              animationDelay: "0.5s",
            }}
          >
            Перейти к форме
          </button>
        ) : (
          <button
            onClick={() => scrollTo(authRef)}
            className="submit-btn pulse-animation"
            style={{
              fontSize: "1.2rem",
              padding: "16px 40px",
              animationDelay: "0.5s",
            }}
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

      {/* Секция 2: Авторизация (только если не вошёл) */}
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
            animationDelay: "0.2s",
          }}
        >
          <h2 className="section-title" style={{ animationDelay: "0.3s" }}>
            Войдите, чтобы создать сайт
          </h2>
          <p
            style={{
              color: "#8b6e7a",
              marginBottom: "30px",
              animationDelay: "0.4s",
            }}
          >
            Используйте аккаунт Google для входа
          </p>
          <button
            onClick={loginWithGoogle}
            className="submit-btn pulse-animation"
            style={{
              fontSize: "1.2rem",
              padding: "16px 40px",
              animationDelay: "0.5s",
            }}
          >
            Войти через Google
          </button>
        </div>
      )}

      {/* Секция 3: Форма (только если вошёл) */}
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
            animationDelay: "0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              marginBottom: "20px",
              animationDelay: "0.3s",
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
          <h1 className="title" style={{ animationDelay: "0.4s" }}>
            Создай сайт-визитку
          </h1>
          <SiteForm userId={userId} onGenerate={setHtml} />
        </div>
      )}

      {/* Предпросмотр на всю ширину */}
      {html && (
        <div
          style={{ padding: "20px 0", background: "inherit", zIndex: 1 }}
          className="fade-in-up visible"
        >
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Результат
          </h2>
          <iframe
            srcDoc={html}
            style={{
              width: "100%",
              height: "85vh",
              border: "1px solid rgba(184, 149, 162, 0.3)",
              display: "block",
            }}
            title="Предпросмотр сайта"
          />
        </div>
      )}
    </main>
  );
}
