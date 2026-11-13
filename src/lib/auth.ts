/**
 * 匿名设备身份(PRD §8 的实现决策:开发期用 cookie 代替正式 Auth)
 * 生产期替换为 Supabase Auth,接口不变
 */

import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const COOKIE_NAME = "db_uid";
const MAX_AGE = 60 * 60 * 24 * 365;

/** 读取或创建当前设备的用户 ID */
export async function currentUserId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return id;
}
