"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

interface Site {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  domain?: string;
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [userPlan, setUserPlan] = useState("FREE");
  const [userLimit, setUserLimit] = useState(1);
  const [planLoading, setPlanLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/sites?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSites(data);
        else setSites([]);
        setLoading(false);
      })
      .catch(() => {
        setSites([]);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/user?firebaseUid=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.plan) {
          setUserPlan(data.plan);
          setUserLimit(data.sitesLimit || 1);
        }
      })
      .catch(console.error);
  }, [userId]);

  const handlePublish = async (siteId: string) => {
    await fetch("/api/sites/publish", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, userId }),
    });
    setSites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, published: true } : s)),
    );
  };

  const handleDelete = async (siteId: string) => {
    await fetch(`/api/sites/${siteId}?userId=${userId}`, { method: "DELETE" });
    setSites((prev) => prev.filter((s) => s.id !== siteId));
    setDeleteTarget(null);
  };

  const handleUpgrade = async () => {
    setPlanLoading(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseUid: userId, plan: "PRO", sitesLimit: 5 }),
    });
    if (res.ok) {
      setUserPlan("PRO");
      setUserLimit(5);
      toast.success("Тариф обновлён до PRO! (заглушка)");
    } else {
      toast.error("Не удалось обновить тариф");
    }
    setPlanLoading(false);
  };

  if (!userId)
    return (
      <div className="container">
        <p>Пожалуйста, войдите.</p>
      </div>
    );
  if (loading)
    return (
      <div className="container">
        <p>Загрузка...</p>
      </div>
    );

  return (
    <main className="container">
      <h1 className="title">Мои сайты</h1>

      {/* Блок с тарифом */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 4px 12px rgba(160,120,135,0.1)",
          border: "1px solid rgba(184,149,162,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem" }}>
              Ваш тариф:{" "}
              <span
                style={{
                  color: userPlan === "FREE" ? "#b07a8c" : "#4a9c6c",
                  background:
                    userPlan === "FREE"
                      ? "rgba(176,122,140,0.15)"
                      : "rgba(74,156,108,0.15)",
                  padding: "2px 12px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                }}
              >
                {userPlan}
              </span>
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "0.9rem",
                color: "#8b6e7a",
              }}
            >
              Использовано сайтов: {sites.length} / {userLimit}
            </p>
          </div>
          {userPlan === "FREE" && (
            <Link
              href="/pricing"
              className="submit-btn"
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                color: "#4a2e38",
                fontWeight: 600,
              }}
            >
              Перейти на PRO
            </Link>
          )}
          {userPlan === "PRO" && (
            <button
              className="submit-btn"
              style={{
                padding: "8px 20px",
                fontSize: "0.9rem",
                background: "transparent",
                border: "1px solid #b07a8c",
                color: "#b07a8c",
              }}
              onClick={async () => {
                setPlanLoading(true);
                const res = await fetch("/api/user", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    firebaseUid: userId,
                    plan: "FREE",
                    sitesLimit: 1,
                  }),
                });
                if (res.ok) {
                  setUserPlan("FREE");
                  setUserLimit(1);
                  toast.success("Тариф возвращён на FREE");
                } else {
                  toast.error("Не удалось обновить тариф");
                }
                setPlanLoading(false);
              }}
              disabled={planLoading}
            >
              {planLoading ? "Обновляем..." : "Вернуться на FREE"}
            </button>
          )}
        </div>
        <div
          style={{
            marginTop: "16px",
            background: "rgba(255,240,244,0.5)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>✨</span>
            <span style={{ color: "#5c4b56", fontWeight: 500 }}>
              Свой домен
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>📈</span>
            <span style={{ color: "#5c4b56", fontWeight: 500 }}>
              До 5 сайтов
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>🎨</span>
            <span style={{ color: "#5c4b56", fontWeight: 500 }}>
              Без брендинга
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>💬</span>
            <span style={{ color: "#5c4b56", fontWeight: 500 }}>Поддержка</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "30px" }}>
        <Link
          href="/"
          className="submit-btn"
          style={{
            padding: "8px 20px",
            fontSize: "0.9rem",
            background: "transparent",
            border: "1px solid #b07a8c",
            color: "#b07a8c",
          }}
        >
          ← На главную
        </Link>
        <Link
          href="/"
          className="submit-btn"
          style={{ padding: "8px 20px", fontSize: "0.9rem" }}
        >
          + Создать новый
        </Link>
      </div>

      {sites.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#8b6e7a", marginBottom: "16px" }}>
            У вас пока нет сайтов.
          </p>
          <Link
            href="/"
            className="submit-btn"
            style={{ padding: "10px 24px" }}
          >
            Создать первый сайт
          </Link>
        </div>
      ) : (
        <div className="sites-grid">
          {sites.map((site) => (
            <div key={site.id} className="site-card">
              <h3>{site.title}</h3>
              <p className="slug">{site.slug}</p>
              <div className="actions">
                {site.published ? (
                  <>
                    <a
                      href={`/s/${site.slug}`}
                      target="_blank"
                      className="btn btn-open"
                    >
                      Открыть
                    </a>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/s/${site.slug}`,
                        )
                      }
                      className="btn btn-copy"
                    >
                      Копировать
                    </button>
                    <Link href={`/edit/${site.id}`} className="btn btn-edit">
                      Редактировать
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/edit/${site.id}`} className="btn btn-edit">
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handlePublish(site.id)}
                      className="btn btn-publish"
                    >
                      Опубликовать
                    </button>
                  </>
                )}
                <button
                  onClick={() => setDeleteTarget(site.id)}
                  className="btn btn-delete"
                >
                  Удалить
                </button>
              </div>
              {userPlan === "PRO" && site.published && (
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(184,149,162,0.3)",
                      background: "rgba(255,255,255,0.7)",
                      fontSize: "0.9rem",
                    }}
                    placeholder="ваш-домен.ru"
                    defaultValue={site.domain || ""}
                    onBlur={async (e) => {
                      const domain = e.target.value.trim();
                      if (!domain) return;
                      const res = await fetch("/api/sites/domain", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          siteId: site.id,
                          userId,
                          domain,
                        }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        toast.success(
                          "Домен сохранён! Настройте CNAME-запись.",
                        );
                      } else {
                        toast.error(data.error || "Ошибка сохранения домена");
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message="Удалить сайт безвозвратно?"
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
