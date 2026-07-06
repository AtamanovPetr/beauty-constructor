import ClientLayout from "@/components/ClientLayout";
import "./globals.css";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#4a3f47",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(160, 120, 135, 0.2)",
              padding: "12px 24px",
              fontSize: "1rem",
            },
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
