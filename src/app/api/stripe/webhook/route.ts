import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { addCredit, getOrder, updateOrder } from "@/lib/store";
import { EVT, trackServer } from "@/lib/analytics";

/**
 * Stripe Webhook(PRD §4.4)
 * 处理 checkout.session.completed:标记订单已支付 + 积分入账(幂等)
 *
 * 安全:配置了 STRIPE_WEBHOOK_SECRET 时强制验签(timingSafeEqual)
 */

type StripeSession = {
  id: string;
  client_reference_id?: string | null;
  metadata?: { order_id?: string } | null;
};

/** Stripe 签名验证:header 格式 t=timestamp,v1=sig1,sig2 */
function verifySignature(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string]),
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  // 拒绝 5 分钟以外的时间戳(防重放)
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const a = Buffer.from(expected, "utf-8");
  const b = Buffer.from(v1, "utf-8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const payload = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (secret) {
    if (!verifySignature(payload, req.headers.get("stripe-signature"), secret)) {
      return NextResponse.json({ ok: false, message: "签名验证失败" }, { status: 400 });
    }
  } else if (process.env.STRIPE_SECRET_KEY) {
    // 生产模式(有 Stripe key)但未配 webhook secret:拒绝,防止伪造入账
    return NextResponse.json(
      { ok: false, message: "STRIPE_WEBHOOK_SECRET 未配置" },
      { status: 500 },
    );
  }
  // 纯 mock 模式(两者都没配):允许,供本地联调

  let event: { type?: string; data?: { object?: StripeSession } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ ok: false, message: "无效 JSON" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: event.type ?? "unknown" });
  }

  const session = event.data?.object;
  const orderId = session?.metadata?.order_id ?? session?.client_reference_id;
  if (!session || !orderId) {
    return NextResponse.json({ ok: false, message: "缺少 order_id" }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ ok: false, message: "订单不存在" }, { status: 404 });
  }

  // 幂等:只有 pending 才入账
  if (order.status === "pending") {
    await updateOrder(order.id, {
      status: "paid",
      stripeSessionId: session.id ?? order.stripeSessionId,
    });
    await addCredit(order.userId, order.credits, "purchase", order.id);
    // 服务器埋点:付款成功(漏斗第 9 步;订单号做事件 ID,重发只算一次;
    // 用户付完关掉标签页也不丢 —— 付款必须由服务器上报,对标 §1)
    await trackServer({
      name: EVT.purchase,
      visitorId: order.userId,
      userId: order.userId,
      dedupId: `purchase-${order.id}`,
      revenue: order.amountUsd,
      currency: "USD",
      props: { sku: order.sku, credits: order.credits, source: "webhook" },
    });
  }

  return NextResponse.json({ ok: true, orderId, credits: order.credits });
}
