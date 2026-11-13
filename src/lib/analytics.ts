/**
 * 埋点层(PRD §15 —— 学习对标站运营文章后落地)
 *
 * 设计要点(全部来自对标实证):
 * - 漏斗:到达 → 页面加载 → 传照片 → 点生成 → 注册 → 看到付款框 → 点购买 → 开始付款 → 付款成功 → 下载
 * - 付款/退款由服务器上报,不靠浏览器(用户付完关掉标签页也不丢)
 * - dedupId 幂等:purchase-<订单号> 重发只算一次
 * - 首触归因:第一次到达时记录来源,之后永不覆盖
 * - 机器人/自家测试不进漏斗分母(对标实测:2810 次到达只有 686 次真加载)
 * - 双写:自家数据库(做决定) + PVUV.ai(页面/速度/真人机分类/漏斗),曝光两边都记,可互相核对
 * - 上报失败绝不影响用户请求(异步 + 3 秒超时 + 吞异常)
 */

import { randomUUID } from "node:crypto";
import { addEvent, addEventUnique, onUserCreated, getUser } from "./store";
import type { TrackEvent } from "./store";

/* ============ 事件名常量(漏斗步骤 + 服务器事件) ============ */
export const EVT = {
  arrive: "arrive",
  pageLoad: "page_load",
  uploadPhotos: "upload_photos",
  clickGenerate: "click_generate",
  signup: "signup",
  viewPaywall: "view_paywall",
  clickBuy: "click_buy",
  checkoutStarted: "checkout_started",
  purchase: "purchase",
  renderCreated: "render_created",
  renderUnlocked: "render_unlocked",
  renderFailed: "render_failed",
  download: "download",
  exposure: "exposure",
  creditAdjusted: "credit_adjusted",
} as const;

/* ============ 机器人识别(不进漏斗分母) ============ */
const BOT_RE =
  /bot|crawler|spider|headless|curl|wget|python-urllib|python-requests|axios|node-fetch|postman|scanner|semrush|ahrefs|monitoring/i;

export function looksLikeBot(ua: string | null | undefined): boolean {
  if (!ua || ua.length < 10) return true; // 无 UA / 空 UA
  return BOT_RE.test(ua);
}

/** 设备分类(PRD §17:按设备拆转化,对标发现手机 3% 电脑 0%) */
export function parseDevice(ua: string | null | undefined): string {
  if (!ua) return "unknown";
  if (/iphone/i.test(ua)) return "iPhone";
  if (/ipad/i.test(ua)) return "iPad";
  if (/android/i.test(ua)) return "Android";
  if (/macintosh|mac os x/i.test(ua)) return "Mac";
  if (/windows/i.test(ua)) return "Windows";
  return "other";
}

/** 自家/测试过滤:测试请求带 x-e2e-test 头 */
export function isTestRequest(headers: Headers): boolean {
  return headers.get("x-e2e-test") === "1";
}

/* ============ 服务器上报(PVUV.ai 双写) ============ */

type ServerEventInput = {
  name: string;
  visitorId: string;
  userId?: string;
  revenue?: number;
  currency?: string;
  props?: Record<string, string | number | boolean>;
  /** 幂等去重键:如 purchase-<orderId>;缺省则每次都记 */
  dedupId?: string;
  isBot?: boolean;
  isTest?: boolean;
};

/** PVUV.ai 上报,失败不影响业务(no-op:未配置 token 时跳过) */
async function pvuvReport(event: {
  name: string;
  id?: string;
  user_id?: string;
  visitor_id?: string;
  revenue?: number;
  currency?: string;
  props?: Record<string, string | number | boolean>;
}): Promise<void> {
  const site = process.env.PVUV_SITE;
  const token = process.env.PVUV_INGEST_TOKEN;
  if (!site || !token) return; // 未配置:仅落自家库
  try {
    await fetch(`https://api.pvuv.ai/v1/sites/${site}/events`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ events: [event] }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // 吞掉:统计失败不能影响用户请求(对标原文)
  }
}

/** 记录服务器事件:先写自家库(做决定的数据),再异步双写 PVUV */
export async function trackServer(input: ServerEventInput): Promise<void> {
  // 标志继承:服务器事件(如 purchase 由 webhook 发出)未显式传时,
  // 从访客记录继承 isBot/isTest —— 否则测试/机器人流量会漏进漏斗
  const user = await getUser(input.visitorId);
  const event: TrackEvent = {
    id: input.dedupId ?? randomUUID(),
    name: input.name,
    visitorId: input.visitorId,
    userId: input.userId,
    revenue: input.revenue,
    currency: input.currency,
    props: input.props,
    isBot: input.isBot ?? user?.isBot ?? false,
    isTest: input.isTest ?? user?.isTest ?? false,
    createdAt: new Date().toISOString(),
  };
  if (input.dedupId) {
    await addEventUnique(event); // 重发只算一次
  } else {
    await addEvent(event);
  }
  await pvuvReport({
    name: event.name,
    id: event.id,
    user_id: event.userId,
    visitor_id: event.visitorId,
    revenue: event.revenue,
    currency: event.currency,
    props: event.props,
  });
}

/** 注册事件:getOrCreateUser 创建新访客时触发(绑定访客与账号天然完成) */
onUserCreated((userId) => {
  void trackServer({ name: EVT.signup, visitorId: userId, userId });
});

/* ============ 手续费口径(PRD §17:收入一律扣手续费再算) ============ */

/**
 * Stripe 估算:2.9% + $0.30;美国以外卡片 +1.5%;非美元收款再 +1%
 * country 缺省按 US 处理(保守),currency 非 USD 直接按国际卡
 */
export function netRevenue(amountUsd: number, currency = "USD", country = "US"): number {
  let feeRate = 0.029;
  const feeFixed = 0.3;
  if (country !== "US") feeRate += 0.015;
  if (currency !== "USD") feeRate += 0.01;
  return Math.max(0, amountUsd - amountUsd * feeRate - feeFixed);
}
