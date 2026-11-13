import { NextResponse } from "next/server";
import { requireAdmin } from "../_auth";
import { listEvents, listUsers } from "@/lib/store";
import { netRevenue } from "@/lib/analytics";

/**
 * 漏斗汇总(PRD §17:先看哪一步掉得最多,只优化那一步)
 * 口径:只算真实访客(排除 isBot/isTest),按去重访客数
 * 收入一律扣手续费(30 美分固定费对 $6.99 是 4%,不扣会高估低价)
 */

const FUNNEL_STEPS = [
  "page_load",
  "upload_photos",
  "click_generate",
  "view_paywall",
  "click_buy",
  "checkout_started",
  "purchase",
  "download",
];

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const days = Math.max(1, Math.min(120, Number(url.searchParams.get("days") ?? 14)));
  const by = url.searchParams.get("by"); // device | source | 不传=整体
  const sinceIso = new Date(Date.now() - days * 86400_000).toISOString();

  const events = await listEvents(undefined, sinceIso);
  const real = events.filter((e) => !e.isBot && !e.isTest);

  // 归因:visitorId → {source, device}(首触)
  const users = await listUsers();
  const infoOf = new Map<string, { source: string; device: string }>();
  for (const u of users) {
    infoOf.set(u.id, {
      source: u.attribution?.source ?? "direct",
      device: u.device ?? "unknown",
    });
  }

  const funnel = FUNNEL_STEPS.map((step) => {
    const visitors = new Set(real.filter((e) => e.name === step).map((e) => e.visitorId));
    return { step, visitors: visitors.size };
  });

  const purchases = real.filter((e) => e.name === "purchase");
  const gross = purchases.reduce((s, e) => s + (e.revenue ?? 0), 0);
  const revenueNet = purchases.reduce(
    (sum, e) =>
      sum +
      netRevenue(e.revenue ?? 0, (e.currency ?? "USD") as string, (e.props?.country as string) ?? "US"),
    0,
  );
  const payingVisitors = new Set(purchases.map((e) => e.visitorId)).size;

  let splits: Record<string, { step: string; visitors: number }[]> | undefined;
  if (by === "device" || by === "source") {
    const groups = new Map<string, Map<string, Set<string>>>();
    for (const step of FUNNEL_STEPS) {
      for (const e of real.filter((x) => x.name === step)) {
        const info = infoOf.get(e.visitorId) ?? { source: "direct", device: "unknown" };
        const key = by === "device" ? info.device : info.source;
        if (!groups.has(key)) groups.set(key, new Map());
        const g = groups.get(key)!;
        if (!g.has(step)) g.set(step, new Set());
        g.get(step)!.add(e.visitorId);
      }
    }
    splits = Object.fromEntries(
      [...groups.entries()].map(([k, m]) => [
        k,
        FUNNEL_STEPS.map((step) => ({ step, visitors: m.get(step)?.size ?? 0 })),
      ]),
    );
  }

  return NextResponse.json({
    ok: true,
    days,
    funnel,
    revenue: { gross, net: Math.round(revenueNet * 100) / 100, payingVisitors },
    splits,
  });
}
