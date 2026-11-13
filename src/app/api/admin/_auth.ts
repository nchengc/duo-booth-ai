import { NextResponse } from "next/server";

/** 管理 API 鉴权:ADMIN_API_KEY 环境变量(对标 §2:Key 放环境变量,不进代码) */
export function requireAdmin(req: Request): NextResponse | null {
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, code: "admin_not_configured" }, { status: 503 });
  }
  if (req.headers.get("x-admin-key") !== key) {
    return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  }
  return null;
}
