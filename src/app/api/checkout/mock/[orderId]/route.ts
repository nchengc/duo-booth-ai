import { NextResponse } from "next/server";
import { addCredit, getOrder, updateOrder } from "@/lib/store";
import { getSku } from "@/lib/skus";
import { EVT, trackServer } from "@/lib/analytics";

/**
 * Mock 支付完成页(仅无 STRIPE_SECRET_KEY 时可用)
 * 模拟 Stripe 回跳:标记订单已支付 + 入账 + 重定向到订单页
 */

export async function GET(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const prefix = new URL(req.url).searchParams.get("prefix") ?? "";

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ ok: false, message: "订单不存在" }, { status: 404 });
  }

  // 幂等:只有 pending 才入账
  if (order.status === "pending") {
    const sku = getSku(order.sku);
    if (!sku) {
      return NextResponse.json({ ok: false, message: "SKU 无效" }, { status: 400 });
    }
    await updateOrder(order.id, { status: "paid" });
    await addCredit(order.userId, sku.credits, "purchase", order.id);
    // 服务器埋点:付款成功(订单号做事件 ID 去重)
    await trackServer({
      name: EVT.purchase,
      visitorId: order.userId,
      userId: order.userId,
      dedupId: `purchase-${order.id}`,
      revenue: order.amountUsd,
      currency: "USD",
      props: { sku: order.sku, credits: sku.credits, source: "mock" },
    });
  }

  return NextResponse.redirect(`${base}${prefix}/account/orders?purchase=success`);
}
