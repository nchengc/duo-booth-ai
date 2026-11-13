import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { createTicket } from "@/lib/store";
import { looksLikeBot, isTestRequest } from "@/lib/analytics";
import { checkRate } from "@/lib/ratelimit";

/** 提交工单(PRD §18:AI 按政策处理,每日自主退款额度之外的入口) */
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!checkRate(req, "support")) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", message: "请求过于频繁,请稍后再试" },
      { status: 429, headers: { "retry-after": "600" } },
    );
  }
  const body = (await req.json().catch(() => null)) as
    | { subject?: string; body?: string }
    | null;

  const subject = body?.subject?.trim() ?? "";
  const text = body?.body?.trim() ?? "";
  if (!subject || !text) {
    return NextResponse.json({ ok: false, code: "missing_fields" }, { status: 400 });
  }

  const ticket = await createTicket({
    userId,
    subject: subject.slice(0, 120),
    body: text.slice(0, 2000),
  });

  void looksLikeBot;
  void isTestRequest;

  return NextResponse.json({ ok: true, ticketId: ticket.id });
}
