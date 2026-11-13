import Link from "next/link";
import { getDict, type Locale } from "@/lib/i18n";

/** 404 页(暗色主题,与全站一致;默认白色页与品牌割裂) */
export default function NotFound() {
  let locale: Locale = "en";
  if (typeof window !== "undefined") {
    const seg = window.location.pathname.split("/")[1];
    if (["en", "zh", "it", "es", "pt", "fr"].includes(seg)) locale = seg as Locale;
  }
  const copy: Record<Locale, { title: string; body: string; back: string }> = {
    en: { title: "404", body: "This page doesn't exist — but your rap duo video is 3 minutes away.", back: "← Back to home" },
    zh: { title: "404", body: "页面不存在——但你们的说唱视频 3 分钟就好。", back: "← 回首页" },
    it: { title: "404", body: "Pagina inesistente — ma il vostro video rap è a 3 minuti.", back: "← Torna alla home" },
    es: { title: "404", body: "Esta página no existe — pero tu video de rap está a 3 minutos.", back: "← Volver al inicio" },
    pt: { title: "404", body: "Página inexistente — mas o vídeo de rap de vocês fica pronto em 3 minutos.", back: "← Voltar ao início" },
    fr: { title: "404", body: "Page introuvable — mais votre vidéo de rap est à 3 minutes.", back: "← Retour à l'accueil" },
  };
  const c = copy[locale];
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center">
      <div className="font-display text-7xl text-accent">{c.title}</div>
      <p className="mt-4 max-w-md text-muted">{c.body}</p>
      <Link href="/" className="btn-primary mt-8">
        {c.back}
      </Link>
    </div>
  );
}
