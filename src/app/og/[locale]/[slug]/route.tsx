import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LOCALES, DEFAULT_LOCALE, getDict, type Locale } from "@/lib/i18n";
import { TOOLS, getTool, resolveToolCopy } from "@/lib/tools";
import { getPost } from "@/lib/blog";

/**
 * OG 图生成路由(PRD §6.1:每页 × 每语言单独生成 1200×630)
 * 路径:/og/[locale]/[slug]
 */

const SIZE = { width: 1200, height: 630 };

/** 字体缓存(模块级,避免每次请求重复读盘) */
type FontCache = {
  anton: Buffer;
  cjk: Buffer;
  cjkBold: Buffer;
  grotesk: Buffer;
};
let fontCache: FontCache | null = null;

async function loadFonts(): Promise<FontCache> {
  if (fontCache) return fontCache;
  const root = process.cwd();
  const [anton, cjk, cjkBold, grotesk] = await Promise.all([
    readFile(path.join(root, "node_modules/@fontsource/anton/files/anton-latin-400-normal.woff")),
    readFile(path.join(root, "public/fonts/og-cjk.woff")),
    readFile(path.join(root, "public/fonts/og-cjk-bold.woff")),
    readFile(
      path.join(root, "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff"),
    ),
  ]);
  fontCache = { anton, cjk, cjkBold, grotesk };
  return fontCache;
}

/** 按显示宽度截断:中文按 1、拉丁按 0.55 计入宽度,避免溢出 */
function clip(text: string, maxWidth: number): string {
  let w = 0;
  let out = "";
  for (const ch of text) {
    const cw = /[一-鿿　-〿＀-￯]/.test(ch) ? 1 : 0.55;
    if (w + cw > maxWidth) return `${out}…`;
    w += cw;
    out += ch;
  }
  return out;
}

/** 拉丁文按字符数截断(1 字符 ≈ 0.55 宽度单位) */
function clipLatin(text: string, maxChars: number): string {
  return text.length <= maxChars ? text : `${text.slice(0, maxChars - 1).trimEnd()}…`;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale: raw, slug } = await ctx.params;
  const locale = ((LOCALES as readonly string[]).includes(raw) ? raw : DEFAULT_LOCALE) as Locale;
  const d = getDict(locale);
  const tool = getTool(slug);
  const post = getPost(slug); // 博客文章 slug → 文章标题进图
  const fonts = await loadFonts();

  const isZh = locale === "zh";
  const eyebrow = tool ? tool.trendTag : post ? "Guides & Comparisons" : d.home.heroEyebrow;
  const copy = tool ? resolveToolCopy(tool, locale) : null;
  const headlineRaw = copy?.h1 ?? post?.title ?? d.home.heroH1;
  const subRaw = copy?.subtitle ?? post?.description ?? d.home.heroSub;
  const ctaText = post ? "Read the guide" : d.home.heroCta;

  // 中文标题整体用粗体 CJK;英文用 Anton(Anton 无 CJK 字形)
  const headline = clip(headlineRaw, isZh ? 21 : post ? 34 : 30);
  const headlineFont = isZh ? "CJKBold" : "Anton";
  const headlineSize = isZh ? 74 : 78;
  const sub = clip(subRaw, isZh ? 46 : 78);
  const bodyFont = isZh ? "CJK" : "Grotesk";
  // 信任行放在按钮右侧,需按剩余宽度裁剪(按钮约 380px + 间距)
  const trust = isZh ? clip(d.home.trust, 20) : clipLatin(d.home.trust, 46);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1a0f2e 0%, #0b0a10 55%, #1e0d05 100%)",
          padding: "64px 72px",
          color: "#e8e6ef",
        }}
      >
        {/* 顶部:品牌 + 趋势标签 */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 40,
              color: "#ffb020",
              letterSpacing: "0.02em",
              fontFamily: "Anton",
            }}
          >
            {d.brand}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#ff6a2b",
              border: "2px solid #ff6a2b",
              borderRadius: 999,
              padding: "10px 26px",
              fontFamily: "Anton",
            }}
          >
            {eyebrow}
          </div>
        </div>

        {/* 中部:主标题 + 副标题 */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div
            style={{
              display: "flex",
              fontSize: headlineSize,
              fontFamily: headlineFont,
              lineHeight: 1.12,
              color: "#ffffff",
              letterSpacing: "0.01em",
              maxWidth: 1060,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 27,
              lineHeight: 1.5,
              color: "#a49fb5",
              fontFamily: bodyFont,
              maxWidth: 980,
            }}
          >
            {sub}
          </div>
        </div>

        {/* 底部:CTA 按钮 + 信任行(横向,单行不换行) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              background: "linear-gradient(90deg, #ffb020, #ff6a2b)",
              color: "#17110a",
              fontWeight: 700,
              fontSize: 26,
              fontFamily: bodyFont,
              borderRadius: 999,
              padding: "14px 34px",
              whiteSpace: "nowrap",
            }}
          >
            {d.home.heroCta}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#a49fb5",
              fontFamily: bodyFont,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {trust}
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Anton", data: fonts.anton, style: "normal", weight: 400 },
        { name: "CJK", data: fonts.cjk, style: "normal", weight: 400 },
        { name: "CJKBold", data: fonts.cjkBold, style: "normal", weight: 700 },
        { name: "Grotesk", data: fonts.grotesk, style: "normal", weight: 400 },
      ],
    },
  );
}
