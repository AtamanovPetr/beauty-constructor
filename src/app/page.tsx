"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { FormData } from "./types";
import { loginWithGoogle, logout, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
export default function Home() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phrase: "",
    skills: "",
    logo: "",
    inst: "",
    phone: "",
  });
  const [html, setHtml] = useState<string>("");
  const { userId } = useAuth();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...form, userId };
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setHtml(data.html);
  }

  return (
    <main className="container">
      <div className="auth-block">
        {userId ? (
          <>
            <span>Привет!</span>
            <a href="/dashboard" className="submit-btn">
              Мои сайты
            </a>
            <button
              onClick={async () => {
                await logout();
              }}
              className="submit-btn"
            >
              Выйти
            </button>
          </>
        ) : (
          <button
            onClick={async () => {
              await loginWithGoogle();
            }}
            className="submit-btn"
          >
            Войти через Google
          </button>
        )}
      </div>
      <h1 className="title">Создай сайт-визитку</h1>
      <form className="constructor-form" onSubmit={handleSubmit}>
        {/* Секция 1: Основная информация */}
        <fieldset className="form-section">
          <legend className="section-title">Основная информация</legend>
          <div className="form-group">
            <label htmlFor="name">Название салона</label>
            <input
              type="text"
              id="name"
              placeholder="Например: Beauty Studio"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="slogan">Слоган</label>
            <input
              type="text"
              id="slogan"
              placeholder="Краткое описание"
              value={form.phrase}
              onChange={(e) => setForm({ ...form, phrase: e.target.value })}
            />
          </div>
        </fieldset>

        {/* Секция 2: Услуги и цены */}
        <fieldset className="form-section">
          <legend className="section-title">Услуги и цены</legend>
          <div className="form-group">
            <label htmlFor="services">Список услуг</label>
            <textarea
              id="services"
              rows={5}
              placeholder="Каждая услуга с новой строки, например:&#10;Стрижка женская - 500 руб&#10;Маникюр - 400 руб"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>
        </fieldset>

        {/* Секция 3: Фотографии */}
        <fieldset className="form-section">
          <legend className="section-title">Фотографии</legend>
          <div className="form-group">
            <label htmlFor="logo">Ссылка на логотип</label>
            <input
              type="url"
              id="logo"
              placeholder="https://example.com/logo.jpg"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="photos">Ссылки на фото (через запятую)</label>
            <textarea
              id="photos"
              rows={3}
              placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
            />
          </div>
        </fieldset>

        {/* Секция 4: Соцсети и контакты */}
        <fieldset className="form-section">
          <legend className="section-title">Соцсети и контакты</legend>
          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>
            <input
              type="url"
              id="instagram"
              placeholder="https://instagram.com/..."
              value={form.inst}
              onChange={(e) => setForm({ ...form, inst: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              placeholder="+7 (999) 123-45-67"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </fieldset>

        <button type="submit" className="submit-btn">
          Создать сайт
        </button>
      </form>
      {html && (
        <div
          style={{
            background: "#1a1a2e",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <p>
            ✅ Сайт сохранён!{" "}
            <a href="/dashboard" style={{ color: "#c9a96e" }}>
              Перейти в Мои сайты
            </a>
            , чтобы опубликовать его.
          </p>
        </div>
      )}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </main>
  );
}
