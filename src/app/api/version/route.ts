import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * 版本端点(对标运营复盘 §9 上线纪律:推送成功 ≠ 部署成功,验证版本号是唯一可靠方法)
 * 部署时注入 GIT_COMMIT_SHA 环境变量,上线后 curl 此端点确认线上跑的就是本次提交
 */
export async function GET() {
  let version = "unknown";
  try {
    const pkg = JSON.parse(
      await fs.readFile(path.join(process.cwd(), "package.json"), "utf-8"),
    ) as { version?: string };
    version = pkg.version ?? "unknown";
  } catch {
    /* 保留 unknown */
  }
  return NextResponse.json({
    ok: true,
    version,
    commit: process.env.GIT_COMMIT_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
    deployedAt: process.env.DEPLOYED_AT ?? null,
  });
}
