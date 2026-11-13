import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource/anton";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { LOCALES, DEFAULT_LOCALE, getDict, type Locale } from "@/lib/i18n";


export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : DEFAULT_LOCALE;
  const d = getDict(locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: `${d.brand} — ${d.home.heroH1}`,
      template: `%s | ${d.brand}`,
    },
    description: d.home.heroSub,
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      siteName: d.brand,
      type: "website",
      title: `${d.brand} — ${d.home.heroH1}`,
      description: d.home.heroSub,
      images: [{ url: `/og/${locale}/home`, width: 1200, height: 630, alt: d.home.heroH1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${d.brand} — ${d.home.heroH1}`,
      description: d.home.heroSub,
      images: [`/og/${locale}/home`],
    },
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, l === "en" ? "/" : `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!(LOCALES as readonly string[]).includes(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col bg-bg text-ink">
        <Analytics />
        <Header locale={locale} brand={d.brand} nav={d.nav} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
