"""契约测试:用黄金值锁住统计口径(PRD §15/§17 —— 学习对标"用单元测试锁住统计代码")

对线上端点的响应做黄金值断言:
  - creditsFor:积分表逐格 + 时长缩放向上取整 + 不支持组合报错
  - netRevenue:Stripe 手续费口径(2.9%+$0.30,国际卡 +1.5%)
  - 机器人过滤:到达计入事件但不进漏斗分母
  - 泊松报警:低单量不误报

前置:全新数据的服务器(rm -rf .data 后启动)
用法:python -I scripts/contract_stats.py [base_url]
"""

import json
import sys
import urllib.error
import urllib.request
import uuid
from http.cookiejar import CookieJar

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3252"
PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}" + (f"  — {detail}" if detail else ""))


def make_opener(ua="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)", e2e=True):
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))
    op.addheaders = [("User-Agent", ua), ("x-e2e-test", "1" if e2e else "")]
    return op


def req(opener, path, method="GET", body=None, ctype=None):
    r = urllib.request.Request(BASE + path, data=body, method=method)
    if ctype:
        r.add_header("Content-Type", ctype)
    try:
        with opener.open(r, timeout=30) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw.strip().startswith("{") else raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, raw


def admin(path):
    op = urllib.request.build_opener()
    r = urllib.request.Request(BASE + path)
    r.add_header("x-admin-key", "test-admin-key")
    with op.open(r, timeout=30) as resp:
        return json.loads(resp.read().decode())


def funnel_visitors(days=1, step="page_load"):
    d = admin(f"/api/admin/funnel?days={days}")
    for s in d["funnel"]:
        if s["step"] == step:
            return s["visitors"]
    return 0


def main():
    op = make_opener()
    print(f"目标:{BASE}\n")
    # 模拟真实浏览器:先发 arrival,建立 isTest 标记(PRD §15 事件继承链)
    st, d = req(op, "/api/track/arrival", "POST",
                json.dumps({"path": "/", "referrer": ""}).encode(), "application/json")
    check("到达上报(建立 isTest 标记)", st == 200, f"status={st}")

    # 预购 Label Pack(3000 积分),让大额渲染可计费
    st, d = req(op, "/api/checkout", "POST", json.dumps({"sku": "pack_label"}).encode(), "application/json")
    check("创建 Label Pack 订单", st == 200 and bool(d.get("orderId")), f"status={st} {d}")
    st, d = req(op, f"/api/checkout/mock/{d.get('orderId')}")
    check("Label Pack mock 支付", st in (200, 307), f"status={st}")
    st, d = req(op, "/api/renders")
    check("积分到账(3010 = 10+3000)", d.get("balance") == 3010, f"balance={d.get('balance')}")


    # ---------- 1. creditsFor 黄金值(经 /api/renders 响应的 credits 字段) ----------
    print("[1] 积分表黄金值(PRD §4.1 逐格)")
    cases = [
        # (model, resolution, lengthS, expected_credits, http)
        ("seedance-2-0-mini", "720p", 12, 3, 200),   # 免费首条强制降档(Step 16a):表单 720p/12 → 实际 480p/5
        ("seedance-2-0-mini", "480p", 6, 3, 200),      # 5 * 6/12 = 2.5 → ceil 3
        ("seedance-2-0-mini", "480p", 15, 7, 200),      # 5 * 15/12 = 6.25 → ceil 7
        ("seedance-2-0", "720p", 12, 20, 200),
        ("seedance-2-0", "1080p", 12, 50, 200),
        ("seedance-2-5", "720p", 24, 74, 200),          # 37 * 24/12 = 74
        ("seedance-2-5", "1080p", 12, 93, 200),
    ]
    import io
    import uuid
    from PIL import Image

    def photo():
        import io as _io
        buf = _io.BytesIO()
        Image.new("RGB", (64, 64), (200, 80, 40)).save(buf, format="JPEG")
        return buf.getvalue()

    def multipart(fields):
        b = f"----z{uuid.uuid4().hex}"
        parts = [f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode() for k, v in fields.items()]
        for k in ("photo1", "photo2"):
            parts.append(f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"; filename=\"p.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n".encode())
            parts.append(photo())
            parts.append(b"\r\n")
        parts.append(f"--{b}--\r\n".encode())
        return b"".join(parts), f"multipart/form-data; boundary={b}"

    for model, res, sec, want, want_http in cases:
        body, ctype = multipart({
            "stage": "hotel-lobby", "model": model, "resolution": res,
            "aspect": "9:16", "lengthS": str(sec), "consent": "true",
        })
        st, d = req(op, "/api/renders", "POST", body, ctype)
        ok = st == want_http and (want_http != 200 or d.get("credits") == want)
        check(f"{model}/{res}/{sec}s → {want}积分", ok, f"http={st} credits={d.get('credits') if isinstance(d, dict) else '?'}")

    # 不支持组合
    body, ctype = multipart({
        "stage": "hotel-lobby", "model": "seedance-2-0-mini", "resolution": "1080p",
        "aspect": "9:16", "lengthS": "12", "consent": "true",
    })
    st, d = req(op, "/api/renders", "POST", body, ctype)
    check("Mini + 1080p → 400(表中为 —)", st == 400, f"status={st}")

    # ---------- 2. netRevenue 手续费黄金值(经 funnel revenue.net) ----------
    print("\n[2] 手续费口径($9.99 → 净 $9.40)")
    # 期望:9.99 - 9.99*0.029 - 0.30 = 9.40029 → 保留两位 ≈ 9.40
    st, d = req(op, "/api/checkout", "POST", json.dumps({"sku": "pack_single"}).encode(), "application/json")
    check("创建 $9.99 订单(e2e 标记)", st == 200, f"status={st}")
    st, d = req(op, f"/api/checkout/mock/{d.get('orderId')}")
    check("mock 支付完成", st in (200, 307), f"status={st}")
    # e2e 流量必须被排除:漏斗毛收入此时应为 0(标记继承修复的回归断言)
    funnel = admin("/api/admin/funnel?days=1")
    check("e2e 测试流量被排除在漏斗外", funnel["revenue"]["gross"] == 0, f"gross={funnel['revenue']['gross']}")

    # 非测试流量验证手续费:用无 e2e 头的独立 cookie 走一遍
    real_op = make_opener(e2e=False)
    st, d = req(real_op, "/api/renders")
    check("新访客(无 e2e 标记)赠送 10 积分", d.get("balance") == 10, f"balance={d.get('balance')}")
    st, d = req(real_op, "/api/checkout", "POST", json.dumps({"sku": "pack_single"}).encode(), "application/json")
    price_charged = d.get("priceUsd") if isinstance(d, dict) else None
    check("checkout 返回服务器核定价格", price_charged in (6.99, 7.99, 8.99, 9.99), f"price={price_charged}")
    st, d = req(real_op, f"/api/checkout/mock/{d.get('orderId')}")
    # 黄金值:net = price - price*0.029 - 0.30(实验定价 arm-aware)
    expected_net = round(price_charged - price_charged * 0.029 - 0.30, 2)
    funnel = admin("/api/admin/funnel?days=1")
    check(f"漏斗净收入 = ${expected_net}(扣 Stripe 手续费,实验价 ${price_charged})",
          abs(funnel["revenue"]["net"] - expected_net) < 0.02, f"net={funnel['revenue']['net']}")

    # ---------- 3. 机器人过滤 ----------
    print("\n[3] 机器人口径")
    before = funnel_visitors(1)
    bot = make_opener(ua="python-urllib/3.11", e2e=False)
    req(bot, "/api/track/arrival", "POST", json.dumps({"path": "/"}).encode(), "application/json")
    after = funnel_visitors(1)
    check("机器人到达不进漏斗分母", after == before, f"{before} → {after}")

    # ---------- 4. 泊松报警低单量不误报 ----------
    print("\n[4] 泊松报警")
    snap = admin("/api/admin/snapshot")
    check("同时段均值 < minOrders 时不报警", snap["alert"]["shouldAlert"] is False,
          f"avg={snap['payments']['avgSamePeriod7d']} min={snap['payments']['minOrders']}")

    print(f"\n{'=' * 40}")
    print(f"通过 {len(PASS)} / 失败 {len(FAIL)}")
    if FAIL:
        print("失败项:", FAIL)
        sys.exit(1)


if __name__ == "__main__":
    main()
