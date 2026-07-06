"use client";
import { useEffect } from "react";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

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
          padding: "32px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          animation: "slideUp 0.3s ease",
        }}
      >
        <p
          style={{ fontSize: "1.1rem", marginBottom: "24px", color: "#4a3f47" }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            className="submit-btn"
            style={{
              background: "transparent",
              border: "1px solid #b07a8c",
              color: "#b07a8c",
            }}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="submit-btn"
            style={{ background: "#ef4444", color: "white" }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
