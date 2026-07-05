import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
