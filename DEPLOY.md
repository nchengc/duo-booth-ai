# 部署手册(双平台)

> 上线纪律(PRD §19 / 对标复盘 §9):测试 + 类型检查 + 构建 + 安全扫描 → 部署 → **验证 /api/version** → 测试账号真实走一遍 → 新页提交 IndexNow。

## 部署前检查清单

```bash
npm run build            # 类型检查 + 构建
python -I scripts/security_scan.py   # 密钥/鉴权扫描(7 项全 PASS)
```

## 环境变量(见 .env.example)

必须: `NEXT_PUBLIC_SITE_URL`、`ADMIN_API_KEY`(强随机)
收益即开: `VIDEO_PROVIDER=volcengine` + `ARK_API_KEY`(Seedance 一手渠道,通常最便宜)或 `VIDEO_PROVIDER=fal` + `VIDEO_API_KEY`
支付: `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`(Webhook 端点填 `{域名}/api/stripe/webhook`)
统计: `PVUV_SITE` + `PVUV_INGEST_TOKEN`
报警: `ALERT_WEBHOOK_URL`(企业微信机器人)

## 路线 A:Vercel(最快)

1. `vercel` CLI 或 GitHub 导入,框架自动识别 Next.js
2. 环境变量面板配置上表;Build Command 默认
3. **生产存储(已实现)**:JSON 文件(.data)在 Vercel/Workers 无持久盘 → SQL Editor 执行 `supabase/schema.sql` → 设 `STORE_BACKEND=supabase` + `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`,store.ts 调度器自动切换(接口不变,零代码改动)。零单验证期可先用 JSON 后端 + 定期导出
4. 部署后验证:
   - `curl https://域名/api/version` → commit 与本次一致
   - 测试账号真实走一遍:上传 → 预览 → 解锁 → 下载(无头浏览器截图)
   - GSC 提交 sitemap;`python -I scripts/indexnow.py ping https://域名 /hotel-lobby-ai /migos-ai`

## 路线 B:Cloudflare(@opennextjs/cloudflare)

1. `npx @opennextjs/cloudflare` 适配 → `wrangler deploy`
2. 持久化:R2 绑定(媒体)+ D1/Supabase(数据库)——Workers 无本地盘,同上需切真数据库
3. 其余同路线 A 第 2、4 步

## 部署后运营(对标复盘节奏)

- snapshot 报警挂 30 分钟定时(企微 Webhook 配 `ALERT_WEBHOOK_URL`)
- AI 每日检查:漏斗/PVUV 速度/实验曝光对账/工单/渲染失败(提示词见运营复盘模板 4)
- 每个决定记 `docs/decisions.md`;实验按"扣费后每人收入"判定
- 新趋势页上线 7 天节奏:监控 → prompt 样片 → 页面 + sitemap + IndexNow → 一周后看付款
