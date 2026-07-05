"use client";
import { useState } from "react";
import { FormData } from "@/app/types";

interface Props {
  userId: string;
  onGenerate: (html: string) => void;
}

export default function SiteForm({ userId, onGenerate }: Props) {
  const [form, setForm] = useState<FormData>({
    name: "Beauty Star",
    phrase: "Сияйте каждый день",
    skills:
      "Стрижка женская|от 500₽|https://i.ibb.co/9mLzKm8R/service1.webp|Современная стрижка любой сложности\n" +
      "Окрашивание|от 1200₽|https://i.ibb.co/hxJXKdHS/service2.webp|Стойкое окрашивание премиум-красками\n" +
      "Маникюр|от 400₽|https://i.ibb.co/HfpJxpPk/service3.webp|Классический и аппаратный маникюр\n" +
      "Укладка|от 300₽|https://i.ibb.co/5xkCmK40/service5.webp|Праздничная и повседневная укладка\n" +
      "SPA-уход|от 800₽|https://i.ibb.co/xt17YjrG/photo2.webp|Расслабляющие процедуры для лица",
    logo: "https://i.ibb.co/1w60YPY/photo1.webp",
    inst: "https://www.instagram.com/beauty.star",
    phone: "+7 (999) 123-45-67",
    style: "rose",
    reviews:
      "Анна|Потрясающий сервис! Стрижка именно такая, как я хотела.\n" +
      "Мария|Очень довольна маникюром, делаю здесь уже полгода.\n" +
      "Ирина|Вежливый персонал и уютная атмосфера.",
    address: "Москва, ул. Арбат, 12",
    gallery:
      "https://i.ibb.co/1w60YPY/photo1.webp|" +
      "https://i.ibb.co/xt17YjrG/photo2.webp|" +
      "https://i.ibb.co/JWg4Dm1X/photo3.webp|" +
      "https://i.ibb.co/chQGX64X/photo4.webp",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { ...form, userId };
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    onGenerate(data.html);
  }

  return (
    <div>
      <form className="constructor-form" onSubmit={handleSubmit}>
        <fieldset className="form-section">
          <legend className="section-title">Основная информация</legend>
          <div className="form-group">
            <label>Название салона</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Слоган</label>
            <input
              value={form.phrase}
              onChange={(e) => setForm({ ...form, phrase: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Логотип (URL)</label>
            <input
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend className="section-title">Стиль</legend>
          <div className="form-group">
            <select
              value={form.style}
              onChange={(e) => setForm({ ...form, style: e.target.value })}
            >
              <option value="rose">Розовый</option>
              <option value="lavender">Лавандовый</option>
              <option value="mint">Мятный</option>
            </select>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend className="section-title">Услуги</legend>
          <div className="form-group">
            <label>Список услуг (Название|Цена|URL|Описание)</label>
            <textarea
              rows={5}
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend className="section-title">Наши работы</legend>
          <div className="form-group">
            <label>Ссылки на фото (разделитель |)</label>
            <textarea
              rows={3}
              value={form.gallery}
              onChange={(e) => setForm({ ...form, gallery: e.target.value })}
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend className="section-title">Отзывы</legend>
          <div className="form-group">
            <label>Имя|Текст (каждая строка — новый отзыв)</label>
            <textarea
              rows={3}
              value={form.reviews}
              onChange={(e) => setForm({ ...form, reviews: e.target.value })}
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend className="section-title">Адрес</legend>
          <div className="form-group">
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="г. Москва, ул. Тверская, 1"
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend className="section-title">Контакты</legend>
          <div className="form-group">
            <label>Instagram</label>
            <input
              value={form.inst}
              onChange={(e) => setForm({ ...form, inst: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </fieldset>

        <button type="submit" className="submit-btn">
          Создать сайт
        </button>
      </form>
    </div>
  );
}
