"use client";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function ProModal({ isOpen, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email);
      setEmail("");
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          animation: "slideUp 0.3s ease",
        }}
      >
        <h3
          style={{
            margin: "0 0 12px",
            color: "#4a3f47",
            fontSize: "1.4rem",
            fontWeight: 700,
          }}
        >
          Оформление PRO
        </h3>
        <p
          style={{
            color: "#8b6e7a",
            marginBottom: "24px",
            fontSize: "0.95rem",
          }}
        >
          Оставьте ваш email, и мы вышлем инструкцию по оплате и настройке.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(184,149,162,0.4)",
              marginBottom: "20px",
              fontSize: "1rem",
              outline: "none",
              background: "rgba(255,240,244,0.3)",
            }}
          />
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="submit-btn"
              style={{
                background: "transparent",
                border: "1px solid #b07a8c",
                color: "#b07a8c",
                fontWeight: 500,
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="submit-btn"
              style={{ background: "#b07a8c", color: "white" }}
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
