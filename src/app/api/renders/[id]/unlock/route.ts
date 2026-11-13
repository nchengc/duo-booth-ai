import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { unlockRender } from "@/lib/pipeline";

/** 解锁高清无水印版(扣积分) */
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await currentUserId();
  const result = await unlockRender(id, userId);

  if (!result.ok) {
    const status = result.code === "insufficient_credits" ? 402 : result.code === "not_found" ? 404 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json({
    ok: true,
    status: result.render.status,
    finalUrl: result.render.finalUrl,
    balance: result.balance,
  });
}
