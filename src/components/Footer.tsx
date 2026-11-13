import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { POSTS } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  // 英文为默认语言不带前缀,其余语言带前缀(与对标 URL 结构一致)
  const href = (path: string) => (locale === "en" ? path : `/${locale}${path}`);
  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: d.footer.product,
      links: [
        ...TOOLS.map((t) => ({ href: href(`/${t.slug}`), label: t.trendTag })),
        { href: href("/pricing"), label: d.nav.pricing },
      ],
    },
    {
      title: d.footer.account,
      links: [
        { href: href("/account/songs"), label: d.footer.mySongs },
        { href: href("/account/orders"), label: d.footer.orders },
        { href: href("/account/support"), label: d.footer.support },
      ],
    },
    {
      title: "Guides",
      links: POSTS.map((post) => ({ href: href(`/blog/${post.slug}`), label: post.title.split(":")[0] })),
    },
    {
      title: d.footer.legal,
      links: [
        { href: href("/privacy-policy"), label: d.footer.privacy },
        { href: href("/terms-of-service"), label: d.footer.terms },
        { href: href("/refund-policy"), label: d.footer.refund },
      ],
    },
  ];
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 lg:grid-cols-4">
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 font-bold text-gold">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © 2026 {d.brand}. {d.footer.copyright}
      </div>
    </footer>
  );
}
