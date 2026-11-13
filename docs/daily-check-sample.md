# 每日检查样例报告(2026-11-13 · 本地测试数据)

## 1. 付款
- 6h 单数 2 · 毛收入 $18.98 · 泊松报警:未触发(低单量保护)
## 2. 漏斗(1 天,真实访客)
- page_load: 3
- upload_photos: 0
- click_generate: 0
- view_paywall: 0
- click_buy: 0
- checkout_started: 2
- purchase: 2
- download: 0
- 最大掉率:download(2→0)
## 3. 按设备拆分(page_load)
- iPhone: 3
## 4. 实验
- pricing_single: baseline 曝光0 / 每人$0; p699 曝光0 / 每人$0; p799 曝光0 / 每人$0; p899 曝光0 / 每人$0 · 够判定:否(继续平分)
## 5. 运维
- 渲染失败(24h):0 · 供应商:mock(key 未配——当前为 mock)
## 6. 决策记录
- D1-D9 已入库;今日无待补'之后'栏