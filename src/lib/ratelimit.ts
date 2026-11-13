/**
 * 限流防刷(PRD §12 风险对策的落地层)
 *
 * 匿名 cookie 成本极低 —— 免费首条渲染可被批量薅(每 cookie 一次),
 * 这是比"渲染失败"更现实的生产成本漏洞。本层按 IP 滑窗限流:
 *   renders:10 次/小时   checkout:20 次/小时   support:5 次/小时   track:120 次/小时
 *
 * 局限(诚实说明):进程内存 Map,在 Cloudflare Workers 多实例下每 isolate 独立,
 * 只作劝阻层;硬防刷上生产后用 Cloudflare Rate Limiting 规则(见 DEPLOY.md)。
 */

const windows = new Map<string, number[]>();

/** 清理过期桶(每次调用顺手做,避免内存膨胀) */
function sweep(now: number, windowMs: number): void {
  if (windows.size < 5000) return;
  for (const [k, times] of windows) {
    const alive = times.filter((t) => now - t < windowMs);
    if (alive.length === 0) windows.delete(k);
    else windows.set(k, alive);
  }
}

/** 滑动窗口判定:true = 放行,false = 超限 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now, windowMs);
  const times = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= limit) {
    windows.set(key, times);
    return false;
  }
  times.push(now);
  windows.set(key, times);
  return true;
}

/** 从请求头取客户端 IP(Vercel/CF 标准头,本地回退 x-forwarded-for 或 127) */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

/** 各端点限额配置 */
export const LIMITS = {
  renders: { limit: 10, windowMs: 3600_000 },
  checkout: { limit: 20, windowMs: 3600_000 },
  support: { limit: 5, windowMs: 3600_000 },
  track: { limit: 120, windowMs: 3600_000 },
} as const;

/** 便捷:检查并返回是否放行(自动按 IP + scope 组键) */
export function checkRate(req: Request, scope: keyof typeof LIMITS): boolean {
  const { limit, windowMs } = LIMITS[scope];
  return rateLimit(`${scope}:${clientIp(req)}`, limit, windowMs);
}
