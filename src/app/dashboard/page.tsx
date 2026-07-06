"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";

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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
      <div style={{ display: "flex", gap: "16px", marginBottom: "30px" }}>
        <Link
          href="/"
          className="submit-btn"
          style={{ padding: "8px 20px", fontSize: "0.9rem" }}
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
