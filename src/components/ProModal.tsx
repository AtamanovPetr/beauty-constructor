"use client";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string }) => void; // теперь передаём объект с именем
}

export default function ProModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onSubmit({ name: name.trim(), email: email.trim() });
      setName("");
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
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.4)",
          animation: "slideUp 0.3s ease",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "2rem" }}>⭐</span>
          <h3
            style={{
              margin: "12px 0 4px",
              color: "#4a3f47",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Оформление PRO
          </h3>
          <p
            style={{
              color: "#8b6e7a",
              fontSize: "0.95rem",
              lineHeight: 1.5,
            }}
          >
            Заполните форму, и я свяжусь с вами для активации тарифа. <br />
            Оплата пока производится переводом на карту (500 ₽/мес).
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(184,149,162,0.4)",
              marginBottom: "12px",
              fontSize: "1rem",
              outline: "none",
              background: "rgba(255,240,244,0.5)",
            }}
          />
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
              background: "rgba(255,240,244,0.5)",
            }}
          />
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="glass-button"
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(184,149,162,0.4)",
                color: "#5c4b56",
                fontWeight: 500,
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="pulse-button"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                border: "none",
                color: "#4a2e38",
                fontWeight: 600,
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(201,169,110,0.3)",
              }}
            >
              Отправить
            </button>
          </div>
        </form>

        <p
          style={{
            marginTop: "16px",
            fontSize: "0.8rem",
            color: "#8b6e7a",
            textAlign: "center",
          }}
        >
          Или напишите мне напрямую:{" "}
          <a
            href="https://t.me/sqwxryy"
            target="_blank"
            style={{ color: "#b07a8c", textDecoration: "underline" }}
          >
            Telegram
          </a>
          {" / "}
          <a
            href="https://vk.com/swzxryf"
            target="_blank"
            style={{ color: "#b07a8c", textDecoration: "underline" }}
          >
            ВКонтакте
          </a>
        </p>
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
