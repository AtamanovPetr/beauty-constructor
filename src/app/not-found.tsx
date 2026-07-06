import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "6rem", color: "#c9879b", marginBottom: "0" }}>
        404
      </h1>
      <p style={{ fontSize: "1.5rem", color: "#8b6e7a", marginBottom: "40px" }}>
        Страница не найдена
      </p>
      <Link
        href="/"
        className="submit-btn"
        style={{ padding: "14px 32px", fontSize: "1rem" }}
      >
        На главную
      </Link>
    </main>
  );
}
