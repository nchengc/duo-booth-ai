import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { pollRender } from "@/lib/pipeline";
import { creditBalance, getRender } from "@/lib/store";
import { creditsFor, type ModelId, type Resolution } from "@/lib/credits";

/** 查询渲染状态(前端轮询) */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = await currentUserId();

  const existing = await getRender(id);
  if (!existing) {
    return NextResponse.json({ ok: false, code: "not_found", message: "任务不存在" }, { status: 404 });
  }
  if (existing.userId !== userId) {
    return NextResponse.json({ ok: false, code: "forbidden", message: "无权访问" }, { status: 403 });
  }

  const render = await pollRender(id);
  const balance = await creditBalance(userId);

  return NextResponse.json({
    ok: true,
    status: render?.status ?? "failed",
    previewUrl: render?.previewUrl ?? null,
    finalUrl: render?.finalUrl ?? null,
    errorCode: render?.errorCode ?? null,
    creditsCharged: render?.creditsCharged ?? 0,
    free: render?.freePreview ?? false,
    unlockCredits: render
      ? creditsFor(render.model as ModelId, render.resolution as Resolution, render.lengthS)
      : null,
    balance,
  });
}
