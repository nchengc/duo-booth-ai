import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, DEFAULT_LOCALE, CORE_EXTRA_LOCALES, getDict, type Locale } from "@/lib/i18n";
import { TOOLS, getTool, resolveToolCopy } from "@/lib/tools";
import { MODELS, RESOLUTIONS } from "@/lib/credits";
import { PACKS, PLANS } from "@/lib/skus";
import BuyButton from "@/components/BuyButton";
import Generator from "@/components/Generator";
import NameGenerator from "@/components/NameGenerator";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/schema";


/** 静态页全量:2 工具页 + pricing + 法务三件套(PRD §5.1/§5.2) */
const STATIC_SLUGS = ["pricing", "privacy-policy", "terms-of-service", "refund-policy"];

const LEGAL_KEY = {
  "privacy-policy": "privacy",
  "terms-of-service": "terms",
  "refund-policy": "refund",
} as const;
type LegalKey = keyof typeof LEGAL_KEY;

/** 核心页 = en/zh 全量 + it/es/pt/fr 仅核心 slug(PRD §5.4) */
const CORE_ONLY_SLUGS = ["hotel-lobby-ai", "migos-ai", ...STATIC_SLUGS];

export function generateStaticParams() {
  const all = [...TOOLS.map((t) => t.slug), ...STATIC_SLUGS];
  const out: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    const list = CORE_EXTRA_LOCALES.includes(locale as (typeof CORE_EXTRA_LOCALES)[number])
      ? CORE_ONLY_SLUGS
      : all;
    for (const slug of list) out.push({ locale, slug });
  }
  return out;
}

type SiteUrl = string;
function siteUrl(): SiteUrl {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** hreflang:核心 slug 6 语互链,其余 en+zh(PRD §6.1) */
function buildLanguages(base: string, slug: string): Record<string, string> {
  const langs: Record<string, string> = { en: `${base}/${slug}`, zh: `${base}/zh/${slug}` };
  if (CORE_ONLY_SLUGS.includes(slug)) {
    for (const l of CORE_EXTRA_LOCALES) langs[l] = `${base}/${l}/${slug}`;
  }
  return langs;
}

/** hreflang(en 根路径,zh 前缀)—— PRD §6.1 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = ((LOCALES as readonly string[]).includes(raw) ? raw : DEFAULT_LOCALE) as Locale;
  const tool = getTool(slug);
  const base = siteUrl();

  const dAll = getDict(locale);
  const rawTitle =
    slug === "pricing"
      ? `${dAll.pricing.h1} — Credit Packs & Plans`
      : tool ? resolveToolCopy(tool, locale).title : dAll.legal[LEGAL_KEY[slug as LegalKey]]?.h1 ?? slug;
  const rawDescription =
    slug === "pricing"
      ? dAll.pricing.sub
      : tool
      ? resolveToolCopy(tool, locale).description
      : dAll.legal[LEGAL_KEY[slug as LegalKey]]?.body.slice(0, 150) ?? dAll.pricing.sub;
  // SEO:title ≤ 60 字符——超长时绕过品牌后缀模板并按词边界截断
  const title = rawTitle.length > 55
    ? { absolute: rawTitle.slice(0, 60).replace(/\s+\S*$/, "").trimEnd() + "…" }
    : rawTitle;
  const description = rawDescription.length > 160
    ? rawDescription.slice(0, 158).trimEnd() + "…"
    : rawDescription;

  return {
    title,
    description,
    alternates: {
      canonical: locale === "en" ? `${base}/${slug}` : `${base}/${locale}/${slug}`,
      languages: buildLanguages(base, slug),
    },
    openGraph: { title, description, images: [`/og/${locale}/${slug}`] },
  };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!(LOCALES as readonly string[]).includes(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  // 五语扩展只覆盖核心 slug(PRD §5.4)
  if (CORE_EXTRA_LOCALES.includes(locale as (typeof CORE_EXTRA_LOCALES)[number]) &&
      !CORE_ONLY_SLUGS.includes(slug)) notFound();
  const tool = getTool(slug);

  /* ---------- 工具页(对标 S2 内容块顺序) ---------- */
  if (tool) {
    const c = resolveToolCopy(tool, locale);
    return (
      <div className="mx-auto max-w-4xl px-5 py-12">
        <JsonLd data={faqPageSchema(c.faq)} />
        <h1 className="font-display text-3xl md:text-4xl">{c.h1}</h1>
        <p className="mt-3 max-w-3xl text-muted">{c.subtitle}</p>

        {/* 免费起名工具(仅 name 页,PRD §5.2 承诺功能) */}
        {slug === "rap-duo-name-generator" ? (
          <div className="mt-10">
            <NameGenerator title={d.gen.nameTitle} tap={d.gen.nameTap} hint={d.gen.nameHint} />
          </div>
        ) : null}

        {/* 生成器 */}
        <div className="mt-10">
          <Generator locale={locale} defaultStage="hotel-lobby" defaultGenre={tool.genreHint} />
        </div>

        {/* The short answer */}
        <section className="mt-14">
          <h2 className="section-title">The short answer</h2>
          <p className="text-muted">{c.shortAnswer}</p>
        </section>

        {/* How to(4 步) */}
        <section className="mt-12">
          <h2 className="section-title">{d.home.howTitle}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {c.howSteps.map((s, i) => (
              <div key={s.t} className="card p-6">
                <div className="mb-2 font-display text-2xl text-accent">{i + 1}</div>
                <h3 className="mb-1 font-bold">{s.t}</h3>
                <p className="text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why here(4 卖点) */}
        <section className="mt-12">
          <h2 className="section-title">{d.home.whyTitle}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {c.why.map((w) => (
              <div key={w.t} className="card p-6">
                <h3 className="mb-1 font-bold">{w.t}</h3>
                <p className="text-sm text-muted">{w.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ + JSON-LD 由 Step 5 统一注入;此处先渲染可见列表 */}
        <section className="mt-12">
          <h2 className="section-title">{d.home.faqTitle}</h2>
          <div className="space-y-3">
            {c.faq.map((f) => (
              <details key={f.q} className="card p-5">
                <summary className="cursor-pointer font-semibold">{f.q}</summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 尾部 CTA */}
        <section className="mt-14 text-center">
          <h2 className="font-display text-2xl">{d.home.ctaTitle}</h2>
          <div className="mt-5">
            <Link href="#create" className="btn-primary">
              {d.home.heroCta}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- Pricing 页 ---------- */
  if (slug === "pricing") {
    return (
      <div className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="font-display text-3xl">{d.pricing.h1}</h1>
        <p className="mt-2 text-muted">{d.pricing.sub}</p>

        <h2 className="sub">{d.pricing.packsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {d.pricing.packs.map((p, i) => (
            <div key={p.name} className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{p.name}</h3>
                {p.save && <span className="chip !text-mint">{p.save}</span>}
              </div>
              <div className="mt-2 text-2xl font-bold">{p.price}</div>
              <div className="text-sm text-muted">{p.credits}</div>
              <div className="text-xs text-muted">{p.per}</div>
              <BuyButton sku={PACKS[i].id} label={d.pricing.buyPack} planLabel={d.pricing.buyPlan} locale={locale} />
            </div>
          ))}
        </div>

        <h2 className="sub">{d.pricing.plansTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {d.pricing.plans.map((p, i) => (
            <div key={p.name} className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{p.name}</h3>
                {p.save && <span className="chip !text-mint">{p.save}</span>}
              </div>
              <div className="mt-2 text-2xl font-bold">{p.price}</div>
              <div className="text-sm text-muted">{p.credits}</div>
              <div className="text-xs text-muted">{p.per}</div>
              <BuyButton sku={PLANS[i].id} label={d.pricing.buyPack} planLabel={d.pricing.buyPlan} locale={locale} />
            </div>
          ))}
        </div>

        <h3 className="sub">{d.home.creditsTitle}</h3>
        <p className="mb-3 text-sm text-muted">{d.home.creditsSub}</p>
        <table className="data">
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

        <ul className="mt-8 list-disc space-y-1 pl-6 text-sm text-muted">
          {d.pricing.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    );
  }

  /* ---------- 法务页 ---------- */
  const legal = d.legal[LEGAL_KEY[slug as LegalKey]];
  if (legal) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-3xl">{legal.h1}</h1>
        <p className="mt-4 text-muted">{legal.body}</p>
      </div>
    );
  }

  notFound();
}
