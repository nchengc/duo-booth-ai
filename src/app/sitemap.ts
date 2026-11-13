import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { POSTS } from "@/lib/blog";

/**
 * sitemap.xml(PRD §5.4 六语策略):
 * - en/zh:全量页面
 * - it/es/pt/fr:仅核心页(home、hotel-lobby-ai、migos-ai、pricing、法务)
 * - 博客:英文单语
 */
const STATIC_SLUGS = ["pricing", "privacy-policy", "terms-of-service", "refund-policy"];
const CORE_ONLY_SLUGS = ["hotel-lobby-ai", "migos-ai", ...STATIC_SLUGS];
const CORE_EXTRA_LOCALES = ["it", "es", "pt", "fr"];

type Entry = {
  path: string;
  alternates: Record<string, string>;
  priority: number;
  change: "daily" | "weekly";
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date("2026-11-13T00:00:00Z");

  const toolSlugs = TOOLS.map((t) => t.slug);
  const pageSlugs = ["", ...toolSlugs, ...STATIC_SLUGS];

  const entries: Entry[] = [];

  for (const slug of pageSlugs) {
    const path = slug ? `/${slug}` : "";
    const langs: Record<string, string> = {};
    for (const l of ["en", "zh"]) langs[l] = l === "en" ? `${base}${path}` : `${base}/zh${path}`;
    if (slug === "" || CORE_ONLY_SLUGS.includes(slug)) {
      for (const l of CORE_EXTRA_LOCALES) langs[l] = `${base}/${l}${path}`;
    }
    entries.push({
      path,
      alternates: langs,
      priority: slug ? 0.8 : 1.0,
      change: slug ? "weekly" : "daily",
    });
  }

  // 博客:英文单语
  const out: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    for (const [lang, url] of Object.entries(e.alternates)) {
      out.push({
        url,
        lastModified: now,
        changeFrequency: e.change,
        priority: e.priority,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(e.alternates).map(([l, u]) => [l, u]),
          ),
        },
      });
    }
  }
  for (const p of [{ path: "/blog" }, ...POSTS.map((post) => ({ path: `/blog/${post.slug}` }))]) {
    out.push({
      url: `${base}${p.path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: { en: `${base}${p.path}` } },
    });
  }
  return out;
}
