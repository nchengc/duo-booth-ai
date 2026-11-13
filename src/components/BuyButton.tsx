"use client";

import { useCallback, useState } from "react";
import { trackClient } from "@/components/Analytics";

/**
 * 购买按钮:POST /api/checkout → 跳转 Stripe(或 mock 完成页)
 */
export default function BuyButton({
  sku,
  label,
  planLabel,
  locale,
}: {
  sku: string;
  label: string;
  planLabel: string;
  locale: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = useCallback(async () => {
    setLoading(true);
    setError(null);
    // 埋点:点购买(PRD §15 漏斗第 7 步)
    trackClient("click_buy", { sku, locale });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sku, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.message ?? "checkout_failed");
        setLoading(false);
        return;
      }
      // 真实 Stripe:跳外部 URL;mock:站内完成页再回跳订单页
      window.location.href = data.url;
    } catch {
      setError("network_error");
      setLoading(false);
    }
  }, [sku]);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="btn-primary w-full !py-2.5 text-sm disabled:opacity-50"
      >
        {loading ? "…" : sku.startsWith("plan_") ? planLabel : label}
      </button>
      {error ? <p className="mt-1 text-center text-xs text-accent">{error}</p> : null}
    </div>
  );
}
