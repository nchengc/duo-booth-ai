"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, localeNames, type Locale } from "@/lib/i18n";

type NavDict = { make: string; hotelLobby: string; migos: string; pricing: string; faq: string };

/** 语言切换:替换路径首段语言前缀 */
export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";

  function hrefFor(target: Locale): string {
    if (locale === target) return pathname;
    const segs = pathname.split("/");
    const cur = segs[1];
    // 已有语言前缀 → 替换;否则插入
    if (cur === "en" || cur === "zh") segs[1] = target;
    else segs.splice(1, 0, target);
    const joined = segs.join("/").replace(/\/+$/, "") || "/";
    // 英文为默认语言:物理路径 /en/* 可访问,但展示用根路径
    if (target === "en") return joined.replace(/^\/en/, "") || "/";
    return joined;
  }

  return (
    <span className="flex gap-1 text-sm">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={hrefFor(l)}
          className={`rounded-full px-2 py-1 text-xs ${
            l === locale ? "bg-card2 text-gold border border-line" : "text-muted hover:text-ink"
          }`}
        >
          {localeNames[l]}
        </Link>
      ))}
    </span>
  );
}

export default function Header({
  locale,
  brand,
  nav,
}: {
  locale: Locale;
  brand: string;
  nav: NavDict;
}) {
  // 英文为默认语言不带前缀,其余语言带前缀(与对标 URL 结构一致)
  const href = (path: string) => (locale === "en" ? path : `/${locale}${path}`);
  const links = [
    { href: href("/hotel-lobby-ai"), label: nav.hotelLobby },
    { href: href("/migos-ai"), label: nav.migos },
    { href: href("/pricing"), label: nav.pricing },
    { href: href("/#faq"), label: nav.faq },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <Link href={href("/")} className="font-display text-xl text-gold">
          {brand}
        </Link>
        <nav className="hidden flex-1 gap-5 text-sm text-muted md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <LangSwitch locale={locale} />
          <Link href={href("/#create")} className="btn-primary !px-5 !py-2 text-sm">
            {nav.make}
          </Link>
        </div>
      </div>
    </header>
  );
}
