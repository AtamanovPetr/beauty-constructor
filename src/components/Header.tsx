"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { loginWithGoogle } from "@/firebase";

export default function Header() {
  const { userId } = useAuth();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
        background: "rgba(255, 245, 250, 0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(184,149,162,0.2)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #b07a8c, #c9a96e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        Beauty Constructor
      </Link>

      <nav
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#5c4b56",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          Главная
        </Link>
        <Link
          href="/pricing"
          style={{
            color: "#5c4b56",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          Тарифы
        </Link>
        {userId ? (
          <Link
            href="/dashboard"
            style={{
              padding: "8px 20px",
              background: "linear-gradient(135deg, #b07a8c, #c9a96e)",
              color: "white",
              borderRadius: "30px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Мои сайты
          </Link>
        ) : (
          <button
            onClick={loginWithGoogle}
            style={{
              padding: "8px 20px",
              background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
              border: "none",
              borderRadius: "30px",
              fontWeight: 600,
              color: "#4a2e38",
              cursor: "pointer",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Войти
          </button>
        )}
      </nav>
    </header>
  );
}
