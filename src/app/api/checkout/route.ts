import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { createOrder, getOrCreateUser } from "@/lib/store";
import { getSku } from "@/lib/skus";
import { checkRate } from "@/lib/ratelimit";
import { resolvePrice } from "@/lib/experiments";
import { EVT, trackServer, looksLikeBot, isTestRequest } from "@/lib/analytics";

/**
 * 创建结账(PRD §4.4:Stripe 结算)
 *
 * 有 STRIPE_SECRET_KEY → 创建真实 Stripe Checkout Session
 * 无密钥(开发/mock 模式) → 返回 mock 完成页 URL,模拟支付回跳
 */

export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!checkRate(req, "checkout")) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", message: "请求过于频繁,请稍后再试" },
      { status: 429, headers: { "retry-after": "600" } },
    );
  }
  // 确保用户记录存在(订单归属的用户必须在 users 表中)
  await getOrCreateUser(userId);
  const body = (await req.json().catch(() => null)) as { sku?: string; locale?: string } | null;
  const sku = getSku(body?.sku ?? "");
  if (!sku) {
    return NextResponse.json({ ok: false, code: "invalid_sku", message: "无效的 SKU" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // 服务器定价强制(PRD §16:价格由服务器定,付款时按访客的实验版本再核一遍
  // —— 对标踩坑:低价只在页面上控制,任何人都能直接请求低价商品)
  const finalPrice = await resolvePrice(sku.id, sku.amountUsd, userId);

  const order = await createOrder({
    userId,
    stripeSessionId: null,
    sku: sku.id,
    credits: sku.credits,
    amountUsd: finalPrice,
    status: "pending",
  });

  // 服务器埋点:开始付款(漏斗第 8 步)
  await trackServer({
    name: EVT.checkoutStarted,
    visitorId: userId,
    props: {
      sku: sku.id,
      kind: sku.kind,
      priceUsd: finalPrice,
      basePrice: sku.amountUsd,
      mode: stripeKey ? "stripe" : "mock",
    },
    isBot: looksLikeBot(req.headers.get("user-agent")),
    isTest: isTestRequest(req.headers),
  });

  /* ---------- 真实 Stripe 路径 ---------- */
  if (stripeKey) {
    // 积分包:one-time;订阅档:需在 Dashboard 建 Price 后改用 price 参数
    const form = new URLSearchParams();
    form.set("mode", sku.kind === "pack" ? "payment" : "subscription");
    form.set("success_url", `${base}/account/orders?purchase=success`);
    form.set("cancel_url", `${base}/pricing?purchase=cancelled`);
    form.set("client_reference_id", order.id);
    form.set("metadata[order_id]", order.id);
    if (sku.kind === "pack") {
      form.set("line_items[0][quantity]", "1");
      form.set("line_items[0][price_data][currency]", "usd");
      form.set("line_items[0][price_data][unit_amount]", String(Math.round(sku.amountUsd * 100)));
      form.set("line_items[0][price_data][product_data][name]", `${sku.name} — ${sku.credits} credits`);
    } else {
      if (!sku.stripePriceId) {
        return NextResponse.json(
          { ok: false, code: "price_not_configured", message: "订阅档需先在 Stripe 配置 Price" },
          { status: 500 },
        );
      }
      form.set("line_items[0][price]", sku.stripePriceId);
      form.set("line_items[0][quantity]", "1");
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${stripeKey}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    const data = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
    if (!res.ok || !data.url) {
      return NextResponse.json(
        { ok: false, code: "stripe_error", message: data.error?.message ?? "Stripe 会话创建失败" },
        { status: 502 },
      );
    }
    const { updateOrder } = await import("@/lib/store");
    await updateOrder(order.id, { stripeSessionId: data.id });
    return NextResponse.json({ ok: true, mode: "stripe", url: data.url });
  }

  /* ---------- Mock 路径(无密钥) ---------- */
  const prefix = body?.locale === "zh" ? "/zh" : "";
  return NextResponse.json({
    ok: true,
    mode: "mock",
    orderId: order.id,
    priceUsd: finalPrice,
    url: `/api/checkout/mock/${order.id}?prefix=${prefix}`,
  });
}
