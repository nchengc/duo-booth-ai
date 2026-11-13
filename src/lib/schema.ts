/**
 * JSON-LD schema 构造(PRD §6.1:FAQ schema —— 对标 answer-box 组件)
 */

export type SchemaFaq = { q: string; a: string };

/** FAQPage schema —— 抢 FAQ 精选摘要 */
export function faqPageSchema(faq: SchemaFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** WebSite + SearchAction —— 站点级 schema */
export function webSiteSchema(name: string, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: siteUrl,
  };
}

/** SoftwareApplication —— 产品型站点(对标工具站性质) */
export function softwareAppSchema(opts: {
  name: string;
  description: string;
  siteUrl: string;
  priceLow: number;
  priceHigh: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: opts.siteUrl,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: opts.priceLow,
      highPrice: opts.priceHigh,
      offerCount: 9,
    },
  };
}
