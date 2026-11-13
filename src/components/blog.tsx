import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost, parseInline, type Block } from "@/lib/blog";
import { faqPageSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Generator from "@/components/Generator";
import { getDict, LOCALES, type Locale } from "@/lib/i18n";

/** 博客为英文长尾(PRD §5.4):zh 路径渲染同内容,canonical 回英文 */

/** 行内链接渲染:[[文字|地址]] */
function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((seg, i) =>
        seg.href ? (
          seg.href.startsWith("/") ? (
            <Link key={i} href={seg.href} className="text-gold hover:underline">
              {seg.text}
            </Link>
          ) : (
            <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer nofollow" className="text-gold hover:underline">
              {seg.text}
            </a>
          )
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return (
              <p key={i} className="mt-4 text-muted">
                <Inline text={b.text} />
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="section-title mt-10">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="sub mt-6">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-6 text-muted">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div key={i} className="mt-6 overflow-x-auto">
                <table className="data">
                  <thead>
                    <tr>
                      {b.headers.map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td key={k}>
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "note":
            return (
              <div key={i} className="mt-6 rounded-xl border border-line bg-card2 p-4 text-xs text-muted">
                {b.text}
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/* ============ 文章页 ============ */
export async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!(LOCALES as readonly string[]).includes(raw)) notFound();
  const locale = raw as Locale;
  const post = getPost(slug);
  if (!post) notFound();
  const d = getDict(locale);
  const base = siteUrl();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            url: `${base}/blog/${post.slug}`,
          },
          faqPageSchema(post.faq),
        ]}
      />

      <nav className="mb-6 text-xs text-muted">
        <Link href={locale === "en" ? "/blog" : `/${locale}/blog`} className="hover:text-ink">
          ← Blog
        </Link>
      </nav>

      <h1 className="font-display text-3xl leading-tight md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-xs text-muted">
        Published {post.publishedAt} · Updated {post.updatedAt} · Prices checked on {post.checkedOn}
      </p>

      {/* TL;DR —— 抢精选摘要 */}
      <div className="callout mt-6">
        <strong>The short answer:</strong> {post.tldr}
      </div>

      <Blocks blocks={post.blocks} />

      {/* What's new 更新日志(E-E-A-T) */}
      <section className="mt-12">
        <h2 className="section-title">What&apos;s new</h2>
        <ul className="space-y-2 text-sm text-muted">
          {post.whatsNew.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="section-title">FAQ</h2>
        <div className="space-y-3">
          {post.faq.map((f) => (
            <details key={f.q} className="card p-5">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12">
        <Generator locale={locale} />
      </section>

      <nav className="mt-10 text-sm">
        <Link href={locale === "en" ? "/blog" : `/${locale}/blog`} className="text-gold hover:underline">
          ← All guides
        </Link>
        <span className="mx-3 text-muted">|</span>
        <Link href={locale === "en" ? "/hotel-lobby-ai" : `/${locale}/hotel-lobby-ai`} className="text-muted hover:text-ink">
          {d.nav.hotelLobby} →
        </Link>
      </nav>
    </div>
  );
}

/* ============ 博客索引 ============ */
export async function BlogIndex() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl">Guides &amp; comparisons</h1>
      <p className="mt-2 text-muted">
        Honest breakdowns of the AI video trend space — what each tool actually outputs, and how to pick in 10 seconds.
      </p>
      <div className="mt-8 space-y-4">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card block p-6 hover:border-accent">
            <h2 className="mb-1 text-lg font-bold">{p.title}</h2>
            <p className="mb-2 text-sm text-muted">{p.description}</p>
            <p className="text-xs text-muted">
              Updated {p.updatedAt} · Prices checked on {p.checkedOn}
            </p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted">
        More guides shipping weekly — trend explainers, lyric writing and template comparisons.
      </p>
    </div>
  );
}
