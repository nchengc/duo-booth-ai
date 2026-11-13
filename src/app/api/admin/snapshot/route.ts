import { NextResponse } from "next/server";
import { requireAdmin } from "../_auth";
import { listEvents, listRenders, creditBalance } from "@/lib/store";

/**
 * 运营快照 + 付款报警(PRD §18 —— 对标 §6:每 30 分钟同时段对比 + 泊松概率)
 *
 * 报警规则(对标实证):
 * - 最近 6 小时付款数,对比过去 7 天同样 6 小时的平均
 * - 按泊松分布算"这么少的概率";平时同时段至少 4 单、且概率 < 2% 才报警
 * - 触发时 POST 到 ALERT_WEBHOOK_URL(若配置);AI 按手册排查:漏斗哪一步丢人 → 对改动 → 测试账号走付款
 */

/** 泊松分布 P(X <= k | λ) */
function poissonCdf(k: number, lambda: number): number {
  if (lambda <= 0) return k >= 0 ? 1 : 0;
  let term = Math.exp(-lambda);
  let sum = term;
  for (let i = 1; i <= k; i++) {
    term *= lambda / i;
    sum += term;
  }
  return Math.min(1, Math.max(0, sum));
}

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const now = Date.now();
  const windowMs = 6 * 3600_000;
  const since6h = new Date(now - windowMs).toISOString();

  const allPurchases = await listEvents("purchase");
  const real = allPurchases.filter((e) => !e.isBot && !e.isTest);

  // 最近 6 小时付款
  const recent = real.filter((e) => e.createdAt >= since6h);

  // 过去 7 天同时段平均(对齐小时规律:美国白天多半夜少 —— 对标 §6)
  const dayStartUtc = new Date(since6h).getUTCHours();
  const samePeriod = real.filter((e) => {
    const t = new Date(e.createdAt);
    if (t.getTime() >= now - windowMs) return false;
    const daysAgo = Math.floor((now - t.getTime()) / 86400_000);
    if (daysAgo < 1 || daysAgo > 7) return false;
    const h = t.getUTCHours();
    // 同样的 6 小时窗口(按 UTC 小时对齐)
    const hStart = new Date(since6h).getUTCHours();
    return h >= hStart && h < hStart + 6;
  });
  const avgSamePeriod = samePeriod.length / 7;

  // 泊松判定
  const minOrders = 4;
  const pValue = poissonCdf(recent.length, Math.max(avgSamePeriod, 0.1));
  const shouldAlert = avgSamePeriod >= minOrders && pValue < 0.02;

  // 渲染失败(最近 24h)
  const failed = (await listEvents("render_failed")).filter(
    (e) => !e.isBot && !e.isTest && e.createdAt >= new Date(now - 86400_000).toISOString(),
  );

  // 供应商状态(Stub:真实接入后查 fal/火山余额)
  const provider = {
    name: process.env.VIDEO_PROVIDER ?? "mock",
    apiKeyConfigured: Boolean(process.env.VIDEO_API_KEY),
  };

  // 注意:此路由为管理视图,只读 —— 不调用 getOrCreateUser(否则每次快照都会铸造赠送用户)

  // 报警推送(若配置)
  let alertSent = false;
  if (shouldAlert && process.env.ALERT_WEBHOOK_URL) {
    try {
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: `付款报警:最近6小时 ${recent.length} 单,7天同时段均 ${avgSamePeriod.toFixed(1)} 单,P(X<=k)=${pValue.toFixed(4)}`,
        }),
        signal: AbortSignal.timeout(3000),
      });
      alertSent = true;
    } catch {
      alertSent = false;
    }
  }

  return NextResponse.json({
    ok: true,
    payments: {
      last6h: recent.length,
      revenue6h: Math.round(recent.reduce((s, e) => s + (e.revenue ?? 0), 0) * 100) / 100,
      avgSamePeriod7d: Math.round(avgSamePeriod * 100) / 100,
      poissonP: Math.round(pValue * 10000) / 10000,
      minOrders,
    },
    alert: { shouldAlert, pThreshold: 0.02, sent: alertSent },
    rendersFailed24h: failed.length,
    provider,
    checkedAt: new Date().toISOString(),
  });
}
