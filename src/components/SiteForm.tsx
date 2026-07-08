"use client";
import { useEffect, useState } from "react";
import type { FormData, ServiceItem } from "@/app/types";
import toast from "react-hot-toast";

interface Props {
  userId: string;
  onGenerate: (html: string, slug: string) => void; // изменён пропс
}

const STORAGE_KEY = "siteFormDraft";

function servicesToString(services: ServiceItem[]): string {
  return services
    .map((s) => `${s.name}|${s.price}|${s.image}|${s.desc}`)
    .join("\n");
}

function stringToServices(str: string): ServiceItem[] {
  return str
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        name: parts[0] || "",
        price: parts[1] || "",
        image: parts[2] || "",
        desc: parts[3] || "",
      };
    });
}

const DEFAULT_FORM: FormData = {
  name: "Beauty Star",
  phrase: "Сияйте каждый день",
  skills: "",
  services: [
    {
      name: "Стрижка женская",
      price: "от 500₽",
      image: "",
      desc: "Современная стрижка любой сложности",
    },
    {
      name: "Окрашивание",
      price: "от 1200₽",
      image: "",
      desc: "Стойкое окрашивание премиум-красками",
    },
    {
      name: "Маникюр",
      price: "от 400₽",
      image: "",
      desc: "Классический и аппаратный маникюр",
    },
    {
      name: "Укладка",
      price: "от 300₽",
      image: "",
      desc: "Праздничная и повседневная укладка",
    },
    {
      name: "SPA-уход",
      price: "от 800₽",
      image: "",
      desc: "Расслабляющие процедуры для лица",
    },
  ],
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
  metaTitle: "",
  metaDescription: "",
};

function loadDraft(): FormData {
  if (typeof window === "undefined") return DEFAULT_FORM;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as FormData;
  } catch {}
  return DEFAULT_FORM;
}

export default function SiteForm({ userId, onGenerate }: Props) {
  const [form, setForm] = useState<FormData>(loadDraft);
  const [saving, setSaving] = useState(false);

  // Автосохранение в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: "", price: "", image: "", desc: "" },
      ],
    }));
  };

  const removeService = (index: number) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const updateService = (
    index: number,
    field: keyof ServiceItem,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: value } : s,
      ),
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload: any = {
      ...form,
      skills: servicesToString(form.services),
      userId,
    };
    delete payload.services;

    setSaving(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        setSaving(false);
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      setForm(DEFAULT_FORM);
      toast.success("Сайт создан!");
      onGenerate(data.html, data.slug);
    } catch (err) {
      toast.error("Ошибка сети. Попробуйте позже.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <form className="constructor-form" onSubmit={handleSubmit}>
        {/* Основная информация */}
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
            <label>Логотип</label>
            <label className="file-upload-label">
              <span>📁</span> Загрузить логотип
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("files", file);
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                  });
                  const data = await res.json();
                  if (data.urls?.length) {
                    setForm((prev) => ({ ...prev, logo: data.urls[0] }));
                  }
                }}
              />
            </label>
            {form.logo && (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginTop: "10px",
                }}
              >
                <img
                  src={form.logo}
                  alt="Логотип"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <button
                  onClick={() => setForm((prev) => ({ ...prev, logo: "" }))}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </fieldset>

        {/* Стиль */}
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

        {/* Услуги – карточки */}
        <fieldset className="form-section">
          <legend className="section-title">Услуги</legend>
          {form.services.map((service, idx) => (
            <div
              key={idx}
              className="slide-down"
              style={{
                background: "rgba(255,255,255,0.5)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid rgba(184,149,162,0.3)",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => removeService(idx)}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>

              <div className="form-group">
                <label>Название услуги</label>
                <input
                  value={service.name}
                  onChange={(e) => updateService(idx, "name", e.target.value)}
                  placeholder="Стрижка женская"
                />
              </div>
              <div className="form-group">
                <label>Цена</label>
                <input
                  value={service.price}
                  onChange={(e) => updateService(idx, "price", e.target.value)}
                  placeholder="500₽"
                />
              </div>
              <div className="form-group">
                <label>Фото услуги</label>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <label
                    className="file-upload-label"
                    style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                  >
                    <span>🖼️</span> Фото
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("files", file);
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: fd,
                        });
                        const data = await res.json();
                        if (data.urls?.length) {
                          updateService(idx, "image", data.urls[0]);
                        }
                      }}
                    />
                  </label>
                  {service.image && (
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src={service.image}
                        alt="preview"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => updateService(idx, "image", "")}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  rows={2}
                  value={service.desc}
                  onChange={(e) => updateService(idx, "desc", e.target.value)}
                  placeholder="Краткое описание услуги"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className="submit-btn"
            style={{
              marginTop: "8px",
              padding: "8px 16px",
              fontSize: "0.9rem",
            }}
          >
            + Добавить услугу
          </button>
        </fieldset>

        {/* Наши работы */}
        <fieldset className="form-section">
          <legend className="section-title">Наши работы</legend>
          <div className="form-group">
            <label>Загрузить фото</label>
            <label className="file-upload-label">
              <span>🖼️</span> Добавить фото
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files?.length) return;
                  const fd = new FormData();
                  for (let i = 0; i < files.length; i++)
                    fd.append("files", files[i]);
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                  });
                  const data = await res.json();
                  if (data.urls) {
                    const newUrls = data.urls.join("|");
                    setForm((prev) => ({
                      ...prev,
                      gallery: prev.gallery
                        ? prev.gallery + "|" + newUrls
                        : newUrls,
                    }));
                  }
                }}
              />
            </label>
          </div>
          {form.gallery && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {form.gallery
                .split("|")
                .filter(Boolean)
                .map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Работа ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <button
                      onClick={() => {
                        const urls = form.gallery.split("|").filter(Boolean);
                        urls.splice(idx, 1);
                        setForm((prev) => ({
                          ...prev,
                          gallery: urls.join("|"),
                        }));
                      }}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          )}
        </fieldset>

        {/* Отзывы */}
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

        {/* Адрес */}
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
        {/* SEO */}
        <fieldset className="form-section">
          <legend className="section-title">SEO (для поисковиков)</legend>
          <div className="form-group">
            <label>Заголовок страницы (Title)</label>
            <input
              value={form.metaTitle || ""}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              placeholder="Салон красоты Мария — стрижки и окрашивание"
            />
          </div>
          <div className="form-group">
            <label>Описание (Description)</label>
            <textarea
              rows={2}
              value={form.metaDescription || ""}
              onChange={(e) =>
                setForm({ ...form, metaDescription: e.target.value })
              }
              placeholder="Профессиональные стрижки, окрашивание Airtouch, маникюр. Удобная онлайн-запись."
            />
          </div>
        </fieldset>

        {/* Контакты */}
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

        <button type="submit" className="submit-btn" disabled={saving}>
          {saving ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="spinner" /> Сохраняем...
            </span>
          ) : (
            "Создать сайт"
          )}
        </button>
      </form>
    </div>
  );
}
