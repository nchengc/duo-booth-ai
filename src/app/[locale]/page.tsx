import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, DEFAULT_LOCALE, getDict, type Locale } from "@/lib/i18n";
import { TOOLS, resolveToolCopy } from "@/lib/tools";
import { MODELS, RESOLUTIONS } from "@/lib/credits";
import Generator from "@/components/Generator";
import { POSTS } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema, webSiteSchema, softwareAppSchema } from "@/lib/schema";


export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!(LOCALES as readonly string[]).includes(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const fmtHref = (path: string) => (locale === "en" ? path : `/${locale}${path}`);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="mx-auto max-w-6xl px-5">
      <JsonLd
        data={[
          faqPageSchema(d.home.faq),
          webSiteSchema(d.brand, base),
          softwareAppSchema({
            name: d.brand,
            description: d.home.heroSub,
            siteUrl: base,
            priceLow: 1.66,
            priceHigh: 9.99,
          }),
        ]}
      />

      {/* 1. Hero */}
      <section className="py-16 text-center">
        <div className="mb-3 text-sm font-medium text-gold">{d.home.heroEyebrow}</div>
        <h1 className="font-display mx-auto max-w-3xl text-4xl leading-tight md:text-5xl">
          {d.home.heroH1}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted">{d.home.heroSub}</p>
        <div className="mt-8">
          <Link href="#create" className="btn-primary">
            {d.home.heroCta}
          </Link>
        </div>
        <div className="mt-4 text-xs text-muted">{d.home.trust}</div>
      </section>

      {/* #create 生成器(Step 7 接入真实表单) */}
      <section className="pb-16">
        <Generator locale={locale} />
      </section>

      {/* 2. What is */}
      <section className="py-10">
        <h2 className="section-title">{d.home.whatTitle}</h2>
        <p className="max-w-3xl text-muted">{d.home.whatBody}</p>
      </section>

      {/* 3. How it works */}
      <section className="py-10">
        <h2 className="section-title">{d.home.howTitle}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {d.home.how.map((s, i) => (
            <div key={s.t} className="card p-6">
              <div className="mb-2 font-display text-3xl text-accent">{i + 1}</div>
              <h3 className="mb-1 font-bold">{s.t}</h3>
              <p className="text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Ideas */}
      <section className="py-10">
        <h2 className="section-title">{d.home.ideasTitle}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.home.ideas.map((s) => (
            <div key={s.t} className="card p-6">
              <h3 className="mb-1 font-bold">{s.t}</h3>
              <p className="text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 全部页面网格 */}
      <section className="py-10">
        <h2 className="section-title">{d.home.pagesTitle}</h2>
        <p className="mb-5 text-sm text-muted">{d.home.pagesSub}</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.slug} href={fmtHref(`/${t.slug}`)} className="card block p-6 hover:border-accent">
              <h3 className="mb-1 font-bold">{t.trendTag}</h3>
              <p className="mb-3 text-sm text-muted">{resolveToolCopy(t, locale).subtitle}</p>
              <span className="text-sm font-semibold text-gold">{d.home.makeThis}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Guides 网格(对比文,内链策略核心) */}
      <section className="py-10">
        <h2 className="section-title">Guides</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={fmtHref(`/blog/${post.slug}`)}
              className="card block p-6 hover:border-accent"
            >
              <h3 className="mb-1 font-bold">{post.title}</h3>
              <p className="mb-3 text-sm text-muted">{post.description}</p>
              <span className="text-sm font-semibold text-gold">{d.home.guideRead}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Pricing + 积分表 */}
      <section id="pricing" className="py-10">
        <h2 className="section-title">{d.home.pricingTitle}</h2>
        <p className="mb-6 max-w-3xl text-muted">{d.home.pricingSub}</p>
        <div className="grid gap-5 sm:grid-cols-3">
          {d.pricing.plans.map((p) => (
            <div key={p.name} className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{p.name}</h3>
                {p.save && <span className="chip !text-mint">{p.save}</span>}
              </div>
              <div className="mt-2 text-2xl font-bold">{p.price}</div>
              <div className="text-sm text-muted">{p.credits}</div>
              <div className="mt-1 text-xs text-muted">{p.per}</div>
            </div>
          ))}
        </div>
        <Link href={fmtHref("/pricing")} className="mt-4 inline-block text-sm font-semibold text-gold">
          {d.nav.pricing} →
        </Link>

        <h3 className="sub mt-10">{d.home.creditsTitle}</h3>
        <p className="mb-3 text-sm text-muted">{d.home.creditsSub}</p>
        <table className="data max-w-2xl">
          <thead>
            <tr>
              <th></th>
              {RESOLUTIONS.map((r) => (
                <th key={r}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODELS.map((m, idx) => (
              <tr key={m.id}>
                <td>
                  {d.home.models[idx]} · {m.apiName}
                </td>
                {RESOLUTIONS.map((r) => (
                  <td key={r}>{m.credits[r] === null ? "—" : `${m.credits[r]} credits`}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 8. Why us */}
      <section className="py-10">
        <h2 className="section-title">{d.home.whyTitle}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {d.home.why.map((w) => (
            <div key={w.t} className="card p-6">
              <h3 className="mb-1 font-bold">{w.t}</h3>
              <p className="text-sm text-muted">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ(14 条,id=faq) */}
      <section id="faq" className="py-10">
        <h2 className="section-title">{d.home.faqTitle}</h2>
        <div className="space-y-3">
          {d.home.faq.map((f) => (
            <details key={f.q} className="card p-5">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 10. 尾部 CTA */}
      <section className="py-16 text-center">
        <h2 className="font-display text-3xl">{d.home.ctaTitle}</h2>
        <p className="mt-2 text-muted">{d.home.ctaBody}</p>
        <div className="mt-6">
          <Link href="#create" className="btn-primary">
            {d.home.heroCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
