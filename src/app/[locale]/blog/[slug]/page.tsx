import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES } from "@/lib/i18n";
// 博客为英文长尾:仅渲染 en/zh(zh canonical 回英文)
import { POSTS } from "@/lib/blog";
import { BlogPostPage } from "@/components/blog";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return ["en", "zh"].flatMap((locale) => POSTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  const base = siteUrl();
  // SEO:title ≤ 60——超长绕过品牌后缀模板
  const t = post.title.length > 55
    ? { absolute: post.title.slice(0, 60).replace(/\s+\S*$/, "").trimEnd() + "…" }
    : post.title;
  return {
    title: t,
    description: post.description,
    alternates: {
      // 英文长尾:canonical 固定英文路径,zh 路径不输出 alternate
      canonical: `${base}/blog/${slug}`,
      languages: { en: `${base}/blog/${slug}` },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [`/og/en/${slug}`],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  if (!(["en", "zh"] as readonly string[]).includes(locale)) notFound();
  return BlogPostPage({ params });
}
