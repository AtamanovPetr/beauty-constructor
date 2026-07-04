"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface Site {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/sites?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        // Проверяем, что пришёл массив, иначе ставим пустой массив
        if (Array.isArray(data)) {
          setSites(data);
        } else {
          console.error("API returned non-array:", data);
          setSites([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSites([]);
        setLoading(false);
      });
  }, [userId]);

  const handlePublish = async (siteId: string) => {
    const res = await fetch("/api/sites/publish", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, userId }),
    });
    if (res.ok) {
      setSites((prev) =>
        prev.map((s) => (s.id === siteId ? { ...s, published: true } : s)),
      );
    }
  };

  const handleDelete = async (siteId: string) => {
    if (!confirm("Удалить сайт?")) return;
    await fetch(`/api/sites/${siteId}?userId=${userId}`, { method: "DELETE" });
    setSites((prev) => prev.filter((s) => s.id !== siteId));
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
    <div className="container">
      <h1 className="title">Мои сайты</h1>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 30,
          textDecoration: "none",
        }}
      >
        <span className="submit-btn">+ Создать новый</span>
      </Link>
      {sites.length === 0 ? (
        <p>У вас пока нет сайтов.</p>
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
                      Копировать ссылку
                    </button>
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
                  onClick={() => handleDelete(site.id)}
                  className="btn btn-delete"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
