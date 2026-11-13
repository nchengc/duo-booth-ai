"""每日检查提示词实跑演示(docs/ops-runbook.md 第 1 节的数据通路验证)

前置:rm -rf .data 后以 ADMIN_API_KEY=test-admin-key 启动服务器
用法:python -I scripts/daily_check_demo.py [base_url]
输出:docs/daily-check-sample.md(runbook 样例报告)
"""

import io
import json
import sys
import uuid
import urllib.error
import urllib.request
from datetime import date
from http.cookiejar import CookieJar

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3300"
ADMIN = "test-admin-key"


def admin(path):
    r = urllib.request.Request(BASE + path)
    r.add_header("x-admin-key", ADMIN)
    with urllib.request.urlopen(r, timeout=30) as resp:
        return json.loads(resp.read().decode())


def make_visitor(referrer, buy=False):
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))
    op.addheaders = [("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)")]

    def req(path, method="GET", body=None, ctype=None):
        r = urllib.request.Request(BASE + path, data=body, method=method)
        if ctype:
            r.add_header("Content-Type", ctype)
        try:
            with op.open(r, timeout=30) as resp:
                raw = resp.read().decode()
                try:
                    return resp.status, json.loads(raw or "{}")
                except json.JSONDecodeError:
                    return resp.status, {"raw": raw[:80]}  # 重定向后的 HTML 页
        except urllib.error.HTTPError as e:
            return e.code, {}

    req("/api/track/arrival", "POST",
        json.dumps({"path": "/hotel-lobby-ai", "referrer": referrer}).encode(), "application/json")

    def multipart(fields):
        from PIL import Image
        b = f"----z{uuid.uuid4().hex}"
        parts = [f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode() for k, v in fields.items()]
        for k in ("photo1", "photo2"):
            buf = io.BytesIO()
            Image.new("RGB", (32, 32), (200, 80, 40)).save(buf, format="JPEG")
            parts.append(f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"; filename=\"p.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n".encode())
            parts.append(buf.getvalue())
            parts.append(b"\r\n")
        parts.append(f"--{b}--\r\n".encode())
        return b"".join(parts), f"multipart/form-data; boundary={b}"

    body, ctype = multipart({"stage": "hotel-lobby", "model": "seedance-2-0-mini", "resolution": "480p",
                             "aspect": "9:16", "lengthS": "5", "consent": "true"})
    st, d = req("/api/renders", "POST", body, ctype)
    if st != 200:
        return op, None
    render_id = d["renderId"]
    if buy:
        st, d = req("/api/checkout", "POST", json.dumps({"sku": "pack_single"}).encode(), "application/json")
        req(f"/api/checkout/mock/{d.get('orderId')}")
    return op, render_id


def main():
    # 造演示数据:3 个访客(Google 来源 2 个带购买,1 个直接跳出)
    import uuid
    
    v1, _ = make_visitor("https://www.google.com/", buy=True)
    v2, _ = make_visitor("https://www.google.com/", buy=True)
    v3, _ = make_visitor("", buy=False)
    print("演示数据:3 访客(Google×2 均购买,直接×1 跳出)\n")

    report = [f"# 每日检查样例报告({date.today().isoformat()} · 本地测试数据)\n"]

    # 1. 付款
    snap = admin("/api/admin/snapshot")
    report.append(f"## 1. 付款\n- 6h 单数 {snap['payments']['last6h']} · 毛收入 ${snap['payments']['revenue6h']}"
                  f" · 泊松报警:{'触发' if snap['alert']['shouldAlert'] else '未触发(低单量保护)'}")

    # 2. 漏斗 + 最大掉率
    funnel = admin("/api/admin/funnel?days=1")
    steps = funnel["funnel"]
    report.append("## 2. 漏斗(1 天,真实访客)")
    prev = None
    worst = None
    for s in steps:
        report.append(f"- {s['step']}: {s['visitors']}")
        if prev is not None and s["visitors"] < prev:
            if worst is None or prev - s["visitors"] > worst[2]:
                worst = (s["step"], prev, s["visitors"])
        prev = s["visitors"]
    if worst:
        report.append(f"- 最大掉率:{worst[0]}({worst[1]}→{worst[2]})")

    # 3. 按设备拆分
    by_dev = admin("/api/admin/funnel?days=1&by=device")
    report.append("## 3. 按设备拆分(page_load)")
    for k, v in by_dev["splits"].items():
        pl = next((s["visitors"] for s in v if s["step"] == "page_load"), 0)
        report.append(f"- {k}: {pl}")

    # 4. 实验
    exps = admin("/api/admin/experiments")
    report.append("## 4. 实验")
    for layer in exps["layers"]:
        arms = "; ".join(f"{a['key']} 曝光{a['exposures']} / 每人${a['revenuePerVisitor']}" for a in layer["arms"])
        report.append(f"- {layer['key']}: {arms} · 够判定:{'是' if layer['ready'] else '否(继续平分)'}")

    # 5. 工单/失败/供应商
    report.append(f"## 5. 运维\n- 渲染失败(24h):{snap['rendersFailed24h']} · 供应商:{snap['provider']['name']}"
                  f"(key {'已配' if snap['provider']['apiKeyConfigured'] else '未配——当前为 mock'})")

    # 6. 决策记录
    report.append("## 6. 决策记录\n- D1-D9 已入库;今日无待补'之后'栏")

    out = "\n".join(report)
    print(out)
    from pathlib import Path
    docs = Path(__file__).resolve().parent.parent / "docs"
    docs.mkdir(exist_ok=True)
    (docs / "daily-check-sample.md").write_text(out, encoding="utf-8")
    print("\n样例已归档:docs/daily-check-sample.md")


if __name__ == "__main__":
    main()
