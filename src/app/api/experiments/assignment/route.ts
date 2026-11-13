import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { getLayer, assignArm } from "@/lib/experiments";

/**
 * 实验分组查询(服务器做分组,页面只拿结果 —— PRD §16)
 * 价格等敏感内容在付款时由服务器再核一遍,这里的值只用于显示
 */
export async function GET() {
  const visitorId = await currentUserId();
  const layers: Record<string, { arm: string; content: Record<string, unknown> }> = {};

  const pricing = await getLayer("pricing_single");
  if (pricing) {
    const a = await assignArm(pricing, visitorId);
    layers[pricing.key] = { arm: a.key, content: a.content };
  }

  return NextResponse.json({ ok: true, visitorId, layers });
}
