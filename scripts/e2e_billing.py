"""Step 8 计费端到端验收(mock 购买流 + webhook 幂等)

用法:python -I scripts/e2e_billing.py [base_url]
"""

import hashlib
import hmac
import json
import sys
import time
import urllib.error
import urllib.request
from http.cookiejar import CookieJar

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3220"

PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}" + (f"  — {detail}" if detail else ""))


def request(opener, path, method="GET", body=None, ctype=None, headers=None):
    req = urllib.request.Request(f"{BASE}{path}", data=body, method=method)
    if ctype:
        req.add_header("Content-Type", ctype)
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with opener.open(req, timeout=30) as resp:
            raw = resp.read().decode()
            try:
                return resp.status, json.loads(raw) if raw.startswith("{") else raw, dict(resp.headers)
            except json.JSONDecodeError:
                return resp.status, raw, dict(resp.headers)
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            return e.code, json.loads(raw), dict(e.headers)
        except json.JSONDecodeError:
            return e.code, raw, dict(e.headers)


def main():
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))
    print(f"目标:{BASE}\n")

    # ---------- 1. 初始余额 ----------
    print("[1] 初始状态")
    st, d, _ = request(opener, "/api/renders")
    check("初始余额 10(注册赠送)", st == 200 and d.get("balance") == 10, f"balance={d.get('balance')}")

    # ---------- 2. 无效 SKU ----------
    print("\n[2] 参数校验")
    st, d, _ = request(opener, "/api/checkout", "POST", json.dumps({"sku": "hack"}).encode(), "application/json")
    check("无效 SKU → 400", st == 400 and d.get("code") == "invalid_sku", f"status={st} code={d.get('code')}")

    # ---------- 3. mock 购买流(Duo Pack $29 = 50 积分) ----------
    print("\n[3] mock 购买流")
    st, d, _ = request(opener, "/api/checkout", "POST", json.dumps({"sku": "pack_duo"}).encode(), "application/json")
    check("创建结账 → 200", st == 200, f"status={st} {d}")
    check("模式为 mock(无 Stripe 密钥)", d.get("mode") == "mock", str(d.get("mode")))
    check("返回 mock 完成页 URL", "/api/checkout/mock/" in (d.get("url") or ""), str(d.get("url")))
    mock_url = d.get("url")

    # 未支付前余额不变
    st, d2, _ = request(opener, "/api/renders")
    check("未支付前余额不变", d2.get("balance") == 10, f"balance={d2.get('balance')}")

    # 访问 mock 完成页 → 307 回跳订单页(用不跟随重定向的 opener 验证)
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None

    nr_opener = urllib.request.build_opener(NoRedirect, urllib.request.HTTPCookieProcessor(CookieJar()))
    st, raw, headers = request(nr_opener, mock_url)
    location = next((v for k, v in headers.items() if k.lower() == "location"), "")
    check("mock 完成页 307 回跳", st in (301, 302, 303, 307, 308) and "account/orders" in location,
          f"status={st} → {location}")

    # 支付后余额 +50
    st, d3, _ = request(opener, "/api/renders")
    check("支付后余额 60(10+50)", d3.get("balance") == 60, f"balance={d3.get('balance')}")

    # 重复访问 mock 完成页 → 幂等,不再入账
    st, raw, _ = request(opener, mock_url)
    st, d4, _ = request(opener, "/api/renders")
    check("重复回跳幂等(余额仍 60)", d4.get("balance") == 60, f"balance={d4.get('balance')}")

    # ---------- 4. webhook 入账(Label Pack 3000 积分) ----------
    print("\n[4] webhook 入账")
    st, d, _ = request(opener, "/api/checkout", "POST", json.dumps({"sku": "pack_label"}).encode(), "application/json")
    order_id = d.get("orderId")
    check("第二个订单创建", bool(order_id), str(order_id))

    # 未完成前不入账
    st, d2, _ = request(opener, "/api/renders")
    check("webhook 前余额仍 60", d2.get("balance") == 60, f"balance={d2.get('balance')}")

    # 无效 JSON → 400
    st, d, _ = request(opener, "/api/stripe/webhook", "POST", b"not-json", "application/json")
    check("无效 JSON → 400", st == 400, f"status={st}")

    # 非目标事件 → 忽略
    st, d, _ = request(opener, "/api/stripe/webhook", "POST",
                       json.dumps({"type": "invoice.paid", "data": {"object": {}}}).encode(), "application/json")
    check("非目标事件被忽略", st == 200 and d.get("ignored") == "invoice.paid", f"{d}")

    # 缺 order_id → 400
    st, d, _ = request(opener, "/api/stripe/webhook", "POST",
                       json.dumps({"type": "checkout.session.completed", "data": {"object": {"id": "cs_x"}}}).encode(),
                       "application/json")
    check("缺 order_id → 400", st == 400, f"status={st}")

    # 正常 completed 事件 → 入账 3000
    event = {
        "type": "checkout.session.completed",
        "data": {"object": {"id": "cs_test_label", "metadata": {"order_id": order_id}}},
    }
    st, d, _ = request(opener, "/api/stripe/webhook", "POST", json.dumps(event).encode(), "application/json")
    check("checkout.session.completed → ok", st == 200 and d.get("ok"), f"{d}")
    check("返回入账积分 3000", d.get("credits") == 3000, f"credits={d.get('credits')}")

    st, d2, _ = request(opener, "/api/renders")
    check("webhook 后余额 3060", d2.get("balance") == 3060, f"balance={d2.get('balance')}")

    # 重放同一事件 → 幂等
    st, d, _ = request(opener, "/api/stripe/webhook", "POST", json.dumps(event).encode(), "application/json")
    st, d2, _ = request(opener, "/api/renders")
    check("webhook 重放幂等(余额仍 3060)", d2.get("balance") == 3060, f"balance={d2.get('balance')}")

    # 不存在的订单 → 404
    st, d, _ = request(opener, "/api/stripe/webhook", "POST",
                       json.dumps({"type": "checkout.session.completed",
                                   "data": {"object": {"id": "cs_x", "metadata": {"order_id": "nope"}}}}).encode(),
                       "application/json")
    check("订单不存在 → 404", st == 404, f"status={st}")

    # ---------- 5. 大额购买后真实渲染(pro 模型 20 积分) ----------
    print("\n[5] 购买后渲染消费")
    # 余额 3060,渲染一次 pro 模型 720p 12s = 20 积分
    import io
    import uuid
    from PIL import Image, ImageDraw

    def make_photo(color, label):
        img = Image.new("RGB", (512, 512), color)
        dr = ImageDraw.Draw(img)
        dr.ellipse((156, 120, 356, 320), fill=(240, 200, 170))
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        return buf.getvalue()

    def build_multipart(fields, files):
        boundary = f"----zcode{uuid.uuid4().hex}"
        parts = []
        for k, v in fields.items():
            parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())
        for k, (fname, data) in files.items():
            parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"; filename=\"{fname}\"\r\nContent-Type: image/jpeg\r\n\r\n".encode())
            parts.append(data)
            parts.append(b"\r\n")
        parts.append(f"--{boundary}--\r\n".encode())
        return b"".join(parts)

    boundary = "----zcodetest123"
    files = {"photo1": ("p1.jpg", make_photo("#dc3c28", "P1")), "photo2": ("p2.jpg", make_photo("#283cdc", "P2"))}
    fields = {"stage": "hotel-lobby", "model": "seedance-2-0", "resolution": "720p",
              "aspect": "9:16", "lengthS": "12", "topic": "webhook后渲染", "consent": "true"}
    # 第一条:新用户免费首条(0 扣费)
    body = build_multipart_boundary(fields, files, boundary)
    st, d, _ = request(opener, "/api/renders", "POST", body, f"multipart/form-data; boundary={boundary}")
    check("购买后渲染成功", st == 200 and d.get("ok"), f"status={st} free={d.get('free')}")
    st, d2, _ = request(opener, "/api/renders")
    check("免费首条不扣费(余额仍 3060)", d2.get("balance") == 3060, f"balance={d2.get('balance')}")
    # 第二条:正常扣费(20 积分)
    body = build_multipart_boundary(fields, files, boundary)
    st, d, _ = request(opener, "/api/renders", "POST", body, f"multipart/form-data; boundary={boundary}")
    check("第二条渲染扣 20 积分", st == 200 and d.get("credits") == 20, f"status={st} credits={d.get('credits')}")
    st, d2, _ = request(opener, "/api/renders")
    check("渲染后余额 3040", d2.get("balance") == 3040, f"balance={d2.get('balance')}")

    # ---------- 汇总 ----------
    print(f"\n{'=' * 40}")
    print(f"通过 {len(PASS)} / 失败 {len(FAIL)}")
    if FAIL:
        print("失败项:", FAIL)
        sys.exit(1)


def build_multipart_boundary(fields, files, boundary):
    parts = []
    for k, v in fields.items():
        parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())
    for k, (fname, data) in files.items():
        parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"; filename=\"{fname}\"\r\nContent-Type: image/jpeg\r\n\r\n".encode())
        parts.append(data)
        parts.append(b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode())
    return b"".join(parts)


if __name__ == "__main__":
    main()
