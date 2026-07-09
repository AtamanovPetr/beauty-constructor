"use client";
import { useEffect, useState } from "react";
import type { FormData, ServiceItem } from "@/app/types";
import toast from "react-hot-toast";

interface Props {
  userId: string;
  onGenerate: (html: string, slug: string) => void;
}

const STORAGE_KEY = "siteFormDraft";

function servicesToString(services: ServiceItem[]): string {
  return services
    .map((s) => `${s.name}|${s.price}|${s.image}|${s.desc}`)
    .join("\n");
}

const DEFAULT_FORM: FormData = {
  name: "Beauty Star",
  phrase:
    "Пространство, где создаются умные стрижки, безупречные сложные окрашивания и глубокий молекулярный уход.",
  skills: "",
  services: [
    {
      name: "Умная стрижка",
      price: "2 500 ₽",
      image: "https://i.ibb.co/9mLzKm8R/service1.webp",
      desc: "Стрижка по форме роста волос, не требующая долгой укладки.",
    },
    {
      name: "Сложное окрашивание",
      price: "8 500 ₽",
      image: "https://i.ibb.co/hxJXKdHS/service2.webp",
      desc: "Airtouch, Shatush, Balayage. Плавные переходы.",
    },
    {
      name: "Тонирование & Уход",
      price: "4 000 ₽",
      image: "https://i.ibb.co/HfpJxpPk/service3.webp",
      desc: "Обновление цвета, придание блеска.",
    },
    {
      name: "Вечерняя укладка",
      price: "3 000 ₽",
      image: "https://i.ibb.co/5xkCmK40/service5.webp",
      desc: "Элегантные локоны для особого вечера.",
    },
    {
      name: "Премиальный уход Absolute",
      price: "3 500 ₽",
      image: "https://i.ibb.co/xt17YjrG/photo2.webp",
      desc: "Интенсивное восстановление на молекулярном уровне.",
    },
    {
      name: "Экспресс-укладка",
      price: "1 800 ₽",
      image: "https://i.ibb.co/1w60YPY/photo1.webp",
      desc: "Быстрая сушка на брашинг.",
    },
  ],
  logo: "https://i.ibb.co/1w60YPY/photo1.webp",
  inst: "https://www.instagram.com/beauty.star",
  phone: "+7 (999) 123-45-67",
  style: "premium",
  reviews:
    "Анна С.|Посетила салон по рекомендации подруги. Мастер внимательно выслушала пожелания, предложила несколько вариантов окрашивания. В итоге я выбрала сложное Airtouch — цвет получился невероятно глубоким, волосы заблестели! Теперь я постоянный клиент и всем рекомендую.\n" +
    "Мария К.|Хожу на стрижку уже полгода. Забыла, что такое укладка по утрам — волосы после мытья сами ложатся идеально. Атмосфера в студии уютная, всегда предложат чай или кофе. Отдельное спасибо администратору за вежливость и заботу.\n" +
    "Ольга П.|Делала процедуру Absolute после долгого осветления. Волосы буквально ожили, стали мягкими и послушными. Мастер дала подробные рекомендации по домашнему уходу, и теперь я знаю, как сохранить результат надолго. Очень довольна!",
  address: "г. Москва, ул. Большая Спасская, д. 12",
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
      toast.success(
        "Сайт создан! 👉 Проверьте в «Мои сайты», чтобы открыть или опубликовать.",
      );
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
                  placeholder="Умная стрижка"
                />
              </div>
              <div className="form-group">
                <label>Цена</label>
                <input
                  value={service.price}
                  onChange={(e) => updateService(idx, "price", e.target.value)}
                  placeholder="2 500 ₽"
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

        {/* Стиль скрыт */}
        <input type="hidden" value={form.style} />

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
