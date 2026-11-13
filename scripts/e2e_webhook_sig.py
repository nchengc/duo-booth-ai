"""Step 8 补充:webhook 签名验证(需服务器以 STRIPE_WEBHOOK_SECRET=whsec_test123 启动)

用法:python -I scripts/e2e_webhook_sig.py [base_url]
"""

import hashlib
import hmac
import json
import sys
import time
import urllib.error
import urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3222"
SECRET = "whsec_test123"

PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}" + (f"  — {detail}" if detail else ""))


def post_webhook(payload: bytes, sig: str | None):
    req = urllib.request.Request(f"{BASE}/api/stripe/webhook", data=payload, method="POST")
    req.add_header("Content-Type", "application/json")
    if sig is not None:
        req.add_header("Stripe-Signature", sig)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, json.loads(resp.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or "{}")
        except json.JSONDecodeError:
            return e.code, {}


def signed_header(payload: bytes, secret: str = SECRET, ts: int | None = None) -> str:
    t = ts or int(time.time())
    sig = hmac.new(secret.encode(), f"{t}.".encode() + payload, hashlib.sha256).hexdigest()
    return f"t={t},v1={sig}"


def main():
    # 先建一个真实订单(mock checkout 在有 secret 但无 stripe key 时仍走 mock)
    import http.cookiejar
    co = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

    req = urllib.request.Request(f"{BASE}/api/checkout", method="POST",
                                 data=json.dumps({"sku": "pack_duo"}).encode())
    req.add_header("Content-Type", "application/json")
    with co.open(req, timeout=20) as resp:  # 必须 co.open:保存会话 cookie
        order = json.loads(resp.read().decode())
    order_id = order["orderId"]
    print(f"订单:{order_id[:8]}…\n")

    event = {
        "type": "checkout.session.completed",
        "data": {"object": {"id": "cs_sig_test", "metadata": {"order_id": order_id}}},
    }
    payload = json.dumps(event).encode()

    print("[1] 签名验证")
    st, d = post_webhook(payload, None)
    check("无签名 → 400", st == 400, f"status={st}")
    st, d = post_webhook(payload, "t=1,v1=bad")
    check("伪造签名 → 400", st == 400, f"status={st}")
    st, d = post_webhook(payload, signed_header(payload, "wrong_secret"))
    check("错误密钥签名 → 400", st == 400, f"status={st}")
    old_ts = int(time.time()) - 600
    st, d = post_webhook(payload, signed_header(payload, SECRET, ts=old_ts))
    check("过期时间戳(重放)→ 400", st == 400, f"status={st}")
    st, d = post_webhook(payload, signed_header(payload))
    check("正确签名 → 200 入账", st == 200 and d.get("ok"), f"{d}")

    # 幂等:重放正确签名的事件
    st, d = post_webhook(payload, signed_header(payload))
    check("签名重放幂等", st == 200, f"status={st}")

    # 验证余额:10 + 50 = 60(必须用下单时的同一 cookie)
    req = urllib.request.Request(f"{BASE}/api/renders")
    with co.open(req, timeout=20) as resp:
        bal = json.loads(resp.read().decode())["balance"]
    check("签名入账后余额 60", bal == 60, f"balance={bal}")

    print(f"\n通过 {len(PASS)} / 失败 {len(FAIL)}")
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
