"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import type { FormData, ServiceItem } from "@/app/types";

// ─── Вспомогательные функции ───────────────────────────────────────
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
// ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "editSiteDraft";

export default function EditPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved) as FormData;
        } catch {}
      }
    }
    return {
      name: "",
      phrase: "",
      skills: "",
      services: [],
      logo: "",
      inst: "",
      phone: "",
      style: "rose",
      reviews: "",
      address: "",
      gallery: "",
    };
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Автосохранение в localStorage при каждом изменении формы
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  // Загрузка данных с сервера
  useEffect(() => {
    if (!userId || !id) return;
    fetch(`/api/sites/${id}?userId=${userId}`)
      .then((res) => res.json())
      .then((site) => {
        if (!site || site.error) {
          setLoading(false);
          return;
        }
        const servicesArray = stringToServices(site.skills || "");
        const freshForm = {
          name: site.title || "",
          phrase: site.phrase || "",
          skills: site.skills || "",
          services: servicesArray,
          logo: site.logo || "",
          inst: site.inst || "",
          phone: site.phone || "",
          style: site.style || "rose",
          reviews: site.reviews || "",
          address: site.address || "",
          gallery: site.gallery || "",
        };
        setForm(freshForm);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshForm));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, id]);

  // ─── Управление услугами ─────────────────────────────────────────
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
  // ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!userId || !id) return;
    setSaving(true);
    const payload: any = {
      userId,
      title: form.name,
      phrase: form.phrase,
      skills: servicesToString(form.services),
      logo: form.logo,
      inst: form.inst,
      phone: form.phone,
      style: form.style,
      reviews: form.reviews,
      address: form.address,
      gallery: form.gallery,
    };
    const res = await fetch(`/api/sites/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      localStorage.removeItem(STORAGE_KEY);
      router.push("/dashboard");
    } else {
      alert("Ошибка сохранения");
    }
    setSaving(false);
  };

  if (!userId) return <div className="container">Пожалуйста, войдите.</div>;
  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <main className="container">
      {/* Кнопка назад */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/dashboard"
          className="submit-btn"
          style={{ padding: "8px 20px", fontSize: "0.9rem" }}
        >
          ← Назад в Мои сайты
        </Link>
      </div>

      <h1 className="title">Редактировать сайт</h1>
      <div className="constructor-form">
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
                  {service.image && (
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

        <button onClick={handleSave} disabled={saving} className="submit-btn">
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </main>
  );
}
