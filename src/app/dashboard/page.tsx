"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import Header from "@/components/Header";
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

  // Плавающие частицы для фона
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: string;
      animationDelay: string;
      animationDuration: string;
      width: string;
      height: string;
    }>
  >([]);

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

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${15 + Math.random() * 20}s`,
      width: `${4 + Math.random() * 6}px`,
      height: `${4 + Math.random() * 6}px`,
    }));
    setParticles(newParticles);
  }, []);

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
      toast.success("Тариф обновлён до PRO!");
    } else {
      toast.error("Не удалось обновить тариф");
    }
    setPlanLoading(false);
  };

  const handleDowngrade = async () => {
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
  };

  const limitReached = sites.length >= userLimit;

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
    <main style={{ position: "relative", minHeight: "100vh" }}>
      {/* Фоновые частицы */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
              width: p.width,
              height: p.height,
            }}
          />
        ))}
      </div>

      <Header />

      {/* Основной контент (отступ под шапку) */}
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "80px",
          maxWidth: "1100px",
          margin: "0 auto",
          paddingLeft: "20px",
          paddingRight: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #6d4c5e, #b07a8c, #c9a96e, #b07a8c, #6d4c5e)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "32px",
            animation: "textGradient 3s linear infinite",
          }}
        >
          Мои сайты
        </h1>

        {/* Блок с тарифом */}
        <div
          className="glass-card"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "32px",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 32px rgba(160,120,135,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "1.2rem" }}>
                Ваш тариф:{" "}
                <span
                  style={{
                    color: userPlan === "FREE" ? "#b07a8c" : "#4a9c6c",
                    background:
                      userPlan === "FREE"
                        ? "rgba(176,122,140,0.15)"
                        : "rgba(74,156,108,0.15)",
                    padding: "4px 16px",
                    borderRadius: "20px",
                    fontSize: "0.95rem",
                  }}
                >
                  {userPlan}
                </span>
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.95rem",
                  color: "#8b6e7a",
                }}
              >
                Использовано сайтов: {sites.length} / {userLimit}
                {limitReached && userPlan === "FREE" && (
                  <span
                    style={{
                      color: "#ef4444",
                      marginLeft: "8px",
                      fontWeight: 600,
                    }}
                  >
                    Лимит исчерпан
                  </span>
                )}
              </p>
            </div>

            {userPlan === "FREE" ? (
              <button
                onClick={handleUpgrade}
                disabled={planLoading}
                className="pulse-button"
                style={{
                  padding: "12px 28px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                  color: "#4a2e38",
                  borderRadius: "50px",
                  boxShadow: "0 8px 24px rgba(201,169,110,0.4)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {planLoading ? "Обновляем..." : "Перейти на PRO"}
              </button>
            ) : (
              <button
                onClick={handleDowngrade}
                disabled={planLoading}
                className="glass-button"
                style={{
                  padding: "12px 28px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid #b07a8c",
                  color: "#b07a8c",
                  borderRadius: "50px",
                  cursor: "pointer",
                }}
              >
                {planLoading ? "Обновляем..." : "Вернуться на FREE"}
              </button>
            )}
          </div>

          {/* Преимущества PRO */}
          <div
            style={{
              marginTop: "20px",
              background: "rgba(255,240,244,0.4)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>✨</span>
              <span style={{ color: "#5c4b56", fontWeight: 500 }}>
                Свой домен
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>📈</span>
              <span style={{ color: "#5c4b56", fontWeight: 500 }}>
                До 5 сайтов
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>🎨</span>
              <span style={{ color: "#5c4b56", fontWeight: 500 }}>
                Без брендинга
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>💬</span>
              <span style={{ color: "#5c4b56", fontWeight: 500 }}>
                Поддержка
              </span>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            className="glass-button"
            style={{
              padding: "10px 24px",
              fontSize: "0.95rem",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid #b07a8c",
              color: "#b07a8c",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ← На главную
          </Link>

          {!limitReached ? (
            <Link
              href="/"
              className="pulse-button"
              style={{
                padding: "10px 28px",
                fontSize: "0.95rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                color: "#4a2e38",
                borderRadius: "50px",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(201,169,110,0.3)",
              }}
            >
              + Создать новый
            </Link>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <button
                disabled
                style={{
                  padding: "10px 28px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(184,149,162,0.3)",
                  color: "#8b6e7a",
                  borderRadius: "50px",
                  cursor: "not-allowed",
                  opacity: 0.6,
                }}
              >
                + Создать новый (лимит исчерпан)
              </button>
              {userPlan === "FREE" && (
                <Link
                  href="/pricing"
                  style={{
                    fontSize: "0.85rem",
                    color: "#c9a96e",
                    textDecoration: "underline",
                    textAlign: "center",
                  }}
                >
                  Увеличить лимит → PRO
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Список сайтов */}
        {sites.length === 0 ? (
          <div
            className="glass-card"
            style={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(15px)",
              borderRadius: "24px",
              padding: "60px 20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 30px rgba(160,120,135,0.08)",
            }}
          >
            <p style={{ color: "#8b6e7a", marginBottom: "20px" }}>
              У вас пока нет сайтов.
            </p>
            {!limitReached && (
              <Link
                href="/"
                className="pulse-button"
                style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #c9a96e, #e0c78a)",
                  color: "#4a2e38",
                  borderRadius: "50px",
                  textDecoration: "none",
                  boxShadow: "0 8px 20px rgba(201,169,110,0.35)",
                }}
              >
                Создать первый сайт
              </Link>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {sites.map((site) => (
              <div
                key={site.id}
                className="glass-card"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 4px 20px rgba(160,120,135,0.08)",
                  transition:
                    "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  willChange: "transform, box-shadow",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(160, 120, 135, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(160,120,135,0.08)";
                }}
              >
                <h3
                  style={{
                    color: "#4a3f47",
                    marginBottom: "4px",
                    fontWeight: 700,
                  }}
                >
                  {site.title}
                </h3>
                <p
                  style={{
                    color: "#b07a8c",
                    fontSize: "0.9rem",
                    marginBottom: "16px",
                  }}
                >
                  {site.slug}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom:
                      site.published && userPlan === "PRO" ? "16px" : "0",
                  }}
                >
                  {site.published ? (
                    <>
                      <a
                        href={`/s/${site.slug}`}
                        target="_blank"
                        className="glass-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.85rem",
                          background: "rgba(255,255,255,0.7)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid #b07a8c",
                          color: "#b07a8c",
                          borderRadius: "50px",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        Открыть
                      </a>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${window.location.origin}/s/${site.slug}`,
                          )
                        }
                        className="glass-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.85rem",
                          background: "rgba(255,255,255,0.7)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid #b07a8c",
                          color: "#b07a8c",
                          borderRadius: "50px",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Копировать
                      </button>
                      <Link
                        href={`/edit/${site.id}`}
                        className="glass-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.85rem",
                          background: "rgba(255,255,255,0.7)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid #b07a8c",
                          color: "#b07a8c",
                          borderRadius: "50px",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        Редактировать
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/edit/${site.id}`}
                        className="glass-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.85rem",
                          background: "rgba(255,255,255,0.7)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid #b07a8c",
                          color: "#b07a8c",
                          borderRadius: "50px",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handlePublish(site.id)}
                        className="pulse-button"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          background:
                            "linear-gradient(135deg, #c9a96e, #e0c78a)",
                          color: "#4a2e38",
                          borderRadius: "50px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(201,169,110,0.3)",
                        }}
                      >
                        Опубликовать
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setDeleteTarget(site.id)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "0.85rem",
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#ef4444",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
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
                        padding: "8px 12px",
                        borderRadius: "12px",
                        border: "1px solid rgba(184,149,162,0.3)",
                        background: "rgba(255,255,255,0.7)",
                        fontSize: "0.9rem",
                        outline: "none",
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
      </div>

      {deleteTarget && (
        <ConfirmModal
          message="Удалить сайт безвозвратно?"
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Глобальные стили анимаций */}
      <style jsx global>{`
        @keyframes textGradient {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }

        .particle {
          position: absolute;
          background: rgba(184, 120, 140, 0.12);
          border-radius: 50%;
          animation: float linear infinite;
          bottom: -20px;
        }

        .pulse-button {
          transition:
            transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
        }
        .pulse-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(201, 169, 110, 0.6);
        }

        .glass-button {
          transition:
            transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
        }
        .glass-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(176, 122, 140, 0.4);
        }
      `}</style>
    </main>
  );
}
