import { NextResponse } from "next/server";
import { requireAdmin } from "../../_auth";
import { updateTicket, addCredit, getUser } from "@/lib/store";

/**
 * 工单回复/关闭(PRD §18:AI 按政策自主处理,授权表"工单 AI 自己处理")
 * PATCH /api/admin/tickets/[id]  { status?: "closed", reply?: string }
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as
    | { status?: "open" | "closed"; reply?: string }
    | null;
  if (!body || (!body.status && !body.reply)) {
    return NextResponse.json({ ok: false, code: "nothing_to_update" }, { status: 400 });
  }

  const patch: { status?: "open" | "closed"; reply?: string } = {};
  if (body.reply) patch.reply = body.reply.slice(0, 2000);
  if (body.status) patch.status = body.status;

  const ticket = await updateTicket(id, patch);
  if (!ticket) {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, ticket });
}
