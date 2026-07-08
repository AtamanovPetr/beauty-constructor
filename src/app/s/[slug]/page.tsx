import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const site = await prisma.site.findFirst({
    where: { slug, published: true },
    select: { metaTitle: true, metaDescription: true, title: true },
  });

  if (!site) return { title: "Страница не найдена" };

  return {
    title: site.metaTitle || site.title || "Сайт-визитка",
    description:
      site.metaDescription ||
      "Сайт-визитка салона красоты — услуги, цены, онлайн-запись", // ← эта строка должна быть
  };
}
export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const site = await prisma.site.findFirst({
    where: {
      slug,
      published: true,
    },
  });

  if (!site) {
    notFound();
  }

  return (
    <iframe
      srcDoc={site.html}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
      title={site.title}
    />
  );
}
