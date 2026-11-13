import { NextResponse } from "next/server";
import { requireAdmin } from "../_auth";
import { addCredit, getUser } from "@/lib/store";
import { trackServer, EVT } from "@/lib/analytics";

/**
 * 退还额度/调整积分(PRD §18 授权表:"退还额度 AI 自己处理")
 * POST /api/admin/credits  { userId, delta, note }
 * 规则(AGENTS.md):退款每天最多自主 1 笔、全额;超过政策的直接婉拒
 * 此处只做额度调整(积分),真实货币退款走 Stripe Dashboard
 */
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as
    | { userId?: string; delta?: number; note?: string }
    | null;

  const userId = body?.userId ?? "";
  const delta = Number(body?.delta ?? 0);
  if (!userId || !Number.isFinite(delta) || delta === 0) {
    return NextResponse.json({ ok: false, code: "invalid_input" }, { status: 400 });
  }
  if (Math.abs(delta) > 3000) {
    return NextResponse.json(
      { ok: false, code: "too_large", message: "单次调整上限 3000 积分,更大额度走 Stripe 退款流程" },
      { status: 400 },
    );
  }

  const user = await getUser(userId);
  if (!user) {
    return NextResponse.json({ ok: false, code: "user_not_found" }, { status: 404 });
  }

  const entry = await addCredit(userId, delta, "adjust", body?.note?.slice(0, 200) ?? null);
  await trackServer({
    name: EVT.creditAdjusted,
    visitorId: userId,
    userId,
    dedupId: `adjust-${entry.id}`,
    props: { delta, note: body?.note ?? "" },
    isTest: user.isTest ?? false,
  });

  return NextResponse.json({ ok: true, delta, userId });
}
