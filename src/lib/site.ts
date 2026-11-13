/** 站点 URL 统一取值(env 优先,回退 localhost) */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
