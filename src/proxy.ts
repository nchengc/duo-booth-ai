import { NextResponse, type NextRequest } from "next/server";

/**
 * 默认语言重写(PRD §5.4 URL 结构与对标一致):
 *   /hotel-lobby-ai        → /en/hotel-lobby-ai(en 不带前缀展示,canonical 为根路径)
 *   /zh/hotel-lobby-ai     → 直通
 *   /                      → /en
 */
const LOCALES = ["en", "zh", "it", "es", "pt", "fr"];
const DEFAULT_LOCALE = "en";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];

  if (LOCALES.includes(seg)) return; // 已带语言前缀
  const target = new URL(`/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`, req.url);
  if (req.nextUrl.search) target.search = req.nextUrl.search;
  return NextResponse.rewrite(target);
}

export const config = {
  // 跳过 API/OG 图/静态资源/带扩展名的文件
  matcher: ["/((?!api|og|_next|.*\\..*).*)"],
};
