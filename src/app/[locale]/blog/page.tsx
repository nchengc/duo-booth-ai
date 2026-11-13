import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES } from "@/lib/i18n";
// 博客为英文长尾:仅渲染 en/zh(zh canonical 回英文)
import { BlogIndex } from "@/components/blog";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return ["en", "zh"].map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const base = siteUrl();
  return {
    title: { absolute: "AI Rap Video Tools — Guides & Comparisons" },
    description:
      "Honest breakdowns of AI rap and trend video tools: what each family outputs, real prices, and a 10-second picker for every use case.",
    alternates: {
      // 英文长尾:canonical 固定英文
      canonical: `${base}/blog`,
      languages: { en: `${base}/blog` },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(["en", "zh"] as readonly string[]).includes(locale)) notFound();
  return <BlogIndex />;
}
