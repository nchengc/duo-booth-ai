# Duo Booth AI

> Two photos in — a rap duo video out. Original AI song, no app, about 3 minutes.

对标 [rapduo.ai](https://rapduo.ai) 的完整复刻:**44 个趋势关键词落地页 · 6 语言 · 15 篇对比文 · 完整积分与支付 · AI 运营体系(埋点/实验/报警)**。

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)

---

## 功能

| 模块 | 说明 |
|---|---|
| **生成器** | 两张照片 → 免费降档预览(mini/480p/5s)→ 按降档价解锁 HD → 下载。4 舞台 × 4 模型(Seedance 2.0 Mini/Fast/Pro + 2.5)× 3 分辨率 × 3 比例 × 5-30 秒,主题定制歌词 |
| **积分经济** | 5 个一次性积分包 + 3 个月付档;失败不扣费;7 天退款;**实验定价由服务器强制**(`resolvePrice`) |
| **SEO 引擎** | 44 个工具页(config 驱动,一份配置自动获得 sitemap/hreflang/OG/FAQ schema/内链)+ 15 篇博客 + `llms.txt` + IndexNow |
| **多语言** | en/zh 全量 · it/es/pt/fr 核心页,hreflang 完整互链 |
| **AI 运营体系** | 12 个漏斗事件双写(自家库 + PVUV.ai)· 首触归因 · 机器人过滤 · 实验系统(Thompson + 对照保底)· 泊松付款报警 · 管理 API · 授权表 + 决策记录 |
| **生产就绪** | 三供应商适配器(fal / 火山引擎 Ark / Replicate)· 双存储后端(JSON / Supabase)· Stripe 桩与真实路径 · IP 限流 · PWA |

## 快速开始

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
```

无需任何 API key 即可跑通全流程(默认 mock 供应商用 ffmpeg 合成样片)。

## 测试

12 个脚本,145+ 断言,全部可重复运行:

```bash
MOCK_RENDER_MS=8000 npx next start -p 3210 &
python -I scripts/e2e_pipeline.py    http://localhost:3210   # 渲染流水线 30 项
python -I scripts/e2e_billing.py     http://localhost:3210   # 计费 23 项
python -I scripts/e2e_analytics.py   http://localhost:3210   # 埋点与实验 26 项
python -I scripts/e2e_webhook_sig.py http://localhost:3210   # webhook 签名 7 项
python -I scripts/contract_stats.py  http://localhost:3210   # 统计口径契约 20 项
python -I scripts/security_scan.py                             # 安全扫描 7 项
python -I scripts/seo_audit.py        http://localhost:3210   # 全站 142 页 SEO 审计
python -I scripts/daily_check_demo.py http://localhost:3210   # 每日检查实跑演示
```

需要 `ADMIN_API_KEY` 的脚本请以 `ADMIN_API_KEY=xxx` 启动服务器。

## 部署

见 [DEPLOY.md](./DEPLOY.md):Vercel / Cloudflare 双路线、环境变量清单、上线纪律清单(版本验证 → 测试账号真走 → GSC/IndexNow → 报警定时任务)。
生产存储:`supabase/schema.sql` → 设 `STORE_BACKEND=supabase`。

## 文档

| 文件 | 内容 |
|---|---|
| [AGENTS.md](./AGENTS.md) | 运营规则 + AI 授权表 + 埋点位置对照 |
| [docs/ops-runbook.md](./docs/ops-runbook.md) | 每日检查 / 报警排查 / 实验模板 / 趋势页 SOP |
| [docs/decisions.md](./docs/decisions.md) | 决策记录 D1-D11(最新在上) |
| [DEPLOY.md](./DEPLOY.md) | 部署手册与上线纪律 |
| [.env.example](./.env.example) | 环境变量全量说明 |

## 架构

```
前端      Next.js 16 (App Router) + React 19 + Tailwind 4 · 212 静态页 · 6 语言
部署      Cloudflare / Vercel
存储      .data JSON(开发) / Supabase PostgREST(生产)—— store.ts 调度器切换
视频      Seedance 2.0 系: fal 队列 / 火山引擎 Ark / Replicate / mock(ffmpeg)
支付      Stripe Checkout + webhook(签名验证 + 防重放);无密钥自动 mock
埋点      12 事件双写 · 首触归因 · 机器人/测试过滤
实验      分层 · 确定性分组 · Thompson 调流量 · 服务器定价强制
报警      泊松概率 + 7 天同时段对比(30 分钟定时任务)
```

## 说明

本仓库为独立实现,文案与代码原创;商标与音乐版权归各自权利人所有。发布前请按当地法规处理 AI 生成内容披露与肖像授权(产品内已有权限勾选与工单政策)。

## License

MIT
