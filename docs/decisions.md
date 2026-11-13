# 决策记录(最新在上)

## D11 · 2026-11-13 · AI 写工具补全:工单回复/关闭 + 退还额度
- 决定:开发者,原话:"继续"
- 数据:对照复盘 §2 的 AI 写工具清单审计缺口 —— 改设置/加停实验已有,工单回复/关闭与退还额度缺失(授权表里"工单 AI 自己处理"没有工具支撑);补齐后验收 9/9:关单+回工+退额度 5 积分 → 用户余额 10→15,边界(>3000→400、不存在用户→404、无 key→401)全对
- 改动:PATCH /api/admin/tickets/[id](reply/status);POST /api/admin/credits(delta 上限 3000/次,更大走 Stripe 退款);两后端 updateTicket + schema reply 列;credit_adjusted 事件
- 之后:上线后 AI 按 AGENTS.md 授权表处理工单(每日自主全退 1 笔,用此工具);credit_adjusted 事件积累后看补偿对留存的影响

## D10 · 2026-11-13 · 快照路由铸造用户 bug + 每日检查数据通路验证
- 决定:开发者,原话:"继续"
- 数据:每日检查实跑演示暴露真 bug —— /api/admin/snapshot 调用 getOrCreateUser(无 cookie 访客),管理员每次查快照都铸造一个 +10 赠送用户(实测 users=4/预期 3);修复为只读后重跑,users=3/signup=3/page_load=3 精确一致;演示样例归档 docs/daily-check-sample.md,运营数据通路(漏斗/设备拆分/实验/报警)端到端验证可用
- 改动:snapshot 路由移除 getOrCreateUser/currentUserId/myBalance(纯只读);scripts/daily_check_demo.py(每日检查实跑器)
- 之后:上线后挂 30 分钟定时快照时确认不再产生用户增长;每日检查的漏斗 upload_photos 依赖浏览器端埋点,API 直连访客为 0 属正常

## D9 · 2026-11-13 · SEO 全站深度审计:142 页从 57 问题清到 0
- 决定:开发者,原话:"继续"
- 数据:自研 seo_audit.py 首跑 142 页 57 问题 —— title 过长 ~20 页(根因:品牌后缀模板叠加长标题,71-87 字符)、/pricing 元数据从未本地化(title 显示 "pricing"、description 缺失)、zh description 阈值误报;修复后 142 页 0 问题,审计报告归档 docs/seo-audit-*.md/.html
- 改动:[slug]/blog 元数据 title>55 绕过品牌后缀模板 + 词边界截断 + pricing 专属元数据(本地化);zh pricing.sub 加长;审计脚本按语言分组查重 + zh 描述阈值 40 + 博客单语 hreflang 豁免;name_tap 埋点(免费工具参与度)
- 之后:上线后每周跑一次 seo_audit.py 对比;若 Google 结果显示截断标题,回来精调截断点;免费起名工具的 name_tap 数据积累后,评估是否做"名字→视频"的转化实验

## D8 · 2026-11-13 · 可见品质收尾:品牌 favicon + 暗色 404/错误边界
- 决定:开发者,原话:"继续"
- 数据:终检发现 404 页是白色默认样式(与暗色品牌割裂)、favicon 是脚手架默认、无 error 边界;修复后 404 页含品牌样式/双语文案/回首页链接,状态码仍为 404+noindex
- 改动:[locale]/not-found.tsx(6 语探测)+ [locale]/error.tsx(重试边界);favicon 改走 public/ 静态 + metadata 显式声明(Turbopack 无法处理 app/favicon.ico 的 PIL ICO —— 踩坑:报 Processing image failed,改 public 方案绕过);PWA 图标同步品牌化
- 之后:上线后用浏览器各访问一次 404 与错误页确认观感;若 favicon 在某些平台显示异常,改用 realfavicongenerator 全套尺寸

## D7 · 2026-11-13 · ESLint 清零 + 运营 runbook 固化 + 照片状态重构回归
- 决定:开发者,原话:"继续"
- 数据:ESLint 首跑 7 errors + 20 warnings;清零过程中抓到 1 个静默回归 —— signup 埋点钩子的调用点(userCreatedHook?.(userId))在某次修复中丢失,注册事件一直没上报;恢复后浏览器回归确认照片重构未破坏提交→渲染→预览链路
- 改动:Generator 照片状态重构(URL 在 pick 时创建、移除 setState-in-effect)、onModelChange 事件收敛、解锁价联动实际档位;display: 解锁按钮显示降档后实际积分数;docs/ops-runbook.md(每日检查/报警手册/实验模板/趋势页 SOP);lint 0 errors
- 之后:上线后跑一次每日检查提示词验证数据通路;signup 事件在 PVUV.ai 对账(若接入)

## D6 · 2026-11-13 · OG 图博客分支 + 全站 142 URL + 126 OG 全量 smoke
- 决定:开发者,原话:"继续"
- 数据:全量 smoke 发现 sitemap 142 URL 零失败,但 OG 扫描暴露博客文章的分享图渲染的是首页内容(og 路由不认识博客 slug);修复后目检确认文章标题/描述进图,"Guides & Comparisons" 眉标 + Read the guide CTA;126 张 OG 图全量 200
- 改动:og route 博客分支(getPost 标题/描述);smoke 脚本教训 —— 派生 og 路径须按 sitemap 实际 URL(含 /fr/ 等语言前缀)逐条映射,不能按 slug 猜
- 之后:上线后用社交平台调试器(Facebook Sharing Debugger/Twitter Card Validator)验证真实抓取;新 slug 自动进 og/ sitemap/ 内链,无需手工

## D5 · 2026-11-13 · Supabase 存储实现落地(调度器架构)
- 决定:开发者,原话:"继续"
- 数据:DEPLOY.md 曾承诺 STORE_BACKEND=supabase 但代码未实现(只有 schema.sql)——部署前唯一未兑现的承诺;调度器拆分后四套件回归 30/30、23/23、26/26、20/20 全绿,证明 JSON 后端零行为变化
- 改动:store.ts → 调度器(接口不变,应用侧 import 零改动);store-json.ts(原实现);store-supabase.ts(全接口 PostgREST 实现,无 SDK,15s 超时,schema.sql 补 gen_random_uuid 默认);契约测试纳入降档黄金值(免费首条 mini/480p/5s → 3 积分)
- 之后:拿 Supabase 项目后 —— SQL Editor 执行 schema.sql → 设 STORE_BACKEND=supabase + URL + service key → 跑四套件验证 PostgREST 路径;若 PostgREST 行为与 JSON 有出入(如 numeric 精度/409 语义),回来修 supa 实现并补契约断言

## D4 · 2026-11-13 · 免费首条强制降档 + 三供应商齐备 + 交付归档
- 决定:开发者,原话:"继续"
- 数据:免费首条原按用户所选档位渲染(攻击者可新 cookie+IP 反复白嫖 Ultra 1080p/30s);降档后实测请求 ultra/1080p/30 → 实际渲染 mini/480p/5s,单条免费 API 成本从最高 ~$3 压到 ~$0.1
- 改动:pipeline.ts 免费强制降档 + 响应/unlockCredits 按实际档位;provider.ts 补齐火山引擎 Ark 官方适配器(三供应商齐备)+ buildPrompt(舞台+genre+主题+安全约束);supabase/schema.sql;项目交付总结归档(md+html)
- 之后:真实 key 接入当天用 1 条渲染核对 Ark/fal 字段名;白嫖防护观察:同 IP 新 cookie 频率;若降档预览转化差,回来实验"降档预览 vs 不送预览"(对标 10-01 已测:免费不带来付费,预览保留是因为信任设计)

## D3 · 2026-11-13 · 生产就绪层:限流防刷 + fal 生产适配器 + genre 链路
- 决定:开发者,原话:"继续"
- 数据:限流压测 —— 同 IP 11 连发渲染,前 10 个 200、第 11 个 429(精确边界);换 IP 放行;support 5+1 同构。限流还堵住一个真实成本漏洞:免费首条按 cookie 发,cookie 成本低,无 IP 限流时可被批量薅渲染额度
- 改动:ratelimit.ts(IP 滑窗,renders 10/h、checkout 20/h、support 5/h、track 120/h);provider.ts fal 生产适配器(队列协议/模型映射 env 可覆写/产物下载/genre 进 prompt);Supabase schema.sql(7 表,生产存储切换预案);DEPLOY.md 注明内存限流为劝阻层、硬防刷用 CF Rate Limiting
- 之后:接入真实 key 后 —— 用 1 条真实渲染核对 fal 字段名(image_url_end 等)与产物结构;上生产后观察限流误伤率(移动网络共享 IP 场景);Supabase 切换时跑全套回归

## D2 · 2026-11-13 · 上线纪律包落地:契约测试 + 安全扫描 + version 端点 + IndexNow
- 决定:开发者,原话:"继续,一边执行,一边测试,一边验收,直到完成"
- 数据:契约测试首跑暴露 1 个真 bug —— 服务器事件(purchase 由 webhook 发出)未继承访客的 isTest 标记,e2e 用户的 $8.99 购买被当成真实流量计入漏斗;修复(trackServer 从用户记录继承)后,契约测试 20/20,其中实验定价 arm-aware 手续费黄金值($7.99 → 净 $7.46)精确命中
- 改动:analytics.ts trackServer 标志继承;scripts/contract_stats.py(20 项);scripts/security_scan.py(7 项);scripts/indexnow.py;/api/version;/api/support + 工单表单;NameGenerator 免费起名 UI(6 语);.env.example;DEPLOY.md;README
- 之后:部署上线当天 —— /api/version 验证 commit → 测试账号真实走一遍 → IndexNow 通知 → snapshot 挂 30 分钟定时;首周看渲染失败率与漏斗 page_load→upload_photos 掉率

> 格式:每条四部分 —— 决定(谁定的,原话)/ 数据 / 改动 / 之后(什么时候看、看什么)。
> AI 没有长期记忆,这个文件 + AGENTS.md 就是它的记忆。

## D1 · 2026-11-12 · 采纳对标站(rapduo.ai)的 AI 精细化运营体系(9 步)
- 决定:开发者,原话:"学习这篇文章更新prd和技术实现,也注意各个位置的埋点"
- 数据:对标站 5 周运营复盘 —— 40 天手机 4131 人加载付款 148 单,电脑 2388 人仅 14 单;ChatGPT 来源每 100 人 3.4 单 vs Google 2.0;2810 次到达仅 686 次真加载(机器人占 75%);付款框文案改动 $1.56 vs $0.93;单首 $6.99 胜 $9.99(每人 $0.74 vs $0.62)
- 改动:实现埋点层(analytics.ts + /api/track/*)、实验系统(experiments.ts + 确定性哈希分组 + Thompson + 服务器定价 resolvePrice)、管理 API(/api/admin/funnel|experiments|snapshot)、付款报警(泊松 + 同时段对比)、AGENTS.md 授权表、本决策记录、llms.txt;PRD §15-§20 增补
- 之后:上线即开始记录漏斗;首个价格实验(单首四档价)每组满 200 人后按人群读结果;付款报警阈值(≥4 单/同时段均值)单量过小时拉长窗口
