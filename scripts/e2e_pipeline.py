"""Step 6 端到端验收:完整渲染流水线(创建 → 轮询 → 解锁 → 积分变化)

用法:
    python -I scripts/e2e_pipeline.py [base_url]

前置:已启动生产服务器(默认 http://localhost:3214)
"""

import io
import json
import sys
import time
import urllib.error
import urllib.request
import uuid
from http.cookiejar import CookieJar

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3214"

# 用 PIL 生成两张假头像(真人照片替代)
try:
    from PIL import Image, ImageDraw
except ImportError:
    print("需要 Pillow:pip install pillow")
    sys.exit(1)

PASS, FAIL = [], []


def check(name: str, cond: bool, detail: str = "") -> None:
    (PASS if cond else FAIL).append(name)
    mark = "PASS" if cond else "FAIL"
    print(f"  [{mark}] {name}" + (f"  — {detail}" if detail else ""))


def make_photo(color: tuple[int, int, int], label: str) -> bytes:
    img = Image.new("RGB", (512, 512), color)
    d = ImageDraw.Draw(img)
    d.ellipse((156, 120, 356, 320), fill=(240, 200, 170))  # 头
    d.ellipse((96, 300, 416, 700), fill=color)  # 肩
    d.text((230, 240), label, fill=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()


def build_multipart(fields: dict, files: dict) -> tuple[bytes, str]:
    boundary = f"----zcode{uuid.uuid4().hex}"
    parts: list[bytes] = []
    for k, v in fields.items():
        parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())
    for k, (fname, data, ctype) in files.items():
        parts.append(
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"; filename=\"{fname}\"\r\n"
            f"Content-Type: {ctype}\r\n\r\n".encode()
            + data
            + b"\r\n"
        )
    parts.append(f"--{boundary}--\r\n".encode())
    return b"".join(parts), f"multipart/form-data; boundary={boundary}"


def request(opener, path: str, method: str = "GET", body: bytes | None = None, ctype: str | None = None):
    req = urllib.request.Request(f"{BASE}{path}", data=body, method=method)
    if ctype:
        req.add_header("Content-Type", ctype)
    try:
        with opener.open(req, timeout=60) as resp:
            return resp.status, json.loads(resp.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            return e.code, json.loads(raw or "{}")
        except json.JSONDecodeError:
            return e.code, {"raw": raw[:200]}


def main() -> None:
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))
    print(f"目标:{BASE}\n")

    # ---------- 1. 积分余额初始化 ----------
    print("[1] 初始状态")
    st, data = request(opener, "/api/renders")
    check("GET /api/renders 返回 200", st == 200, f"status={st}")
    check("新用户赠送 10 积分", data.get("balance") == 10, f"balance={data.get('balance')}")

    # ---------- 2. 缺少同意勾选应被拒 ----------
    print("\n[2] 权限勾选校验")
    body, ctype = build_multipart(
        {"stage": "hotel-lobby", "model": "seedance-2-0-mini", "resolution": "720p",
         "aspect": "9:16", "lengthS": "12", "consent": "false"},
        {"photo1": ("a.jpg", make_photo((200, 80, 40), "A"), "image/jpeg"),
         "photo2": ("b.jpg", make_photo((40, 80, 200), "B"), "image/jpeg")},
    )
    st, data = request(opener, "/api/renders", "POST", body, ctype)
    check("未勾选权限 → 400", st == 400, f"status={st} code={data.get('code')}")
    check("错误码为 consent_required", data.get("code") == "consent_required", str(data.get("code")))

    # ---------- 3. 缺照片应被拒 ----------
    print("\n[3] 照片校验")
    body, ctype = build_multipart(
        {"stage": "hotel-lobby", "consent": "true"},
        {},
    )
    st, data = request(opener, "/api/renders", "POST", body, ctype)
    check("缺照片 → 400", st == 400, f"status={st} code={data.get('code')}")

    # ---------- 4. 不支持的分辨率组合 ----------
    print("\n[4] 参数校验")
    body, ctype = build_multipart(
        {"stage": "hotel-lobby", "model": "seedance-2-0-mini", "resolution": "1080p",
         "aspect": "9:16", "lengthS": "12", "consent": "true"},
        {"photo1": ("a.jpg", make_photo((200, 80, 40), "A"), "image/jpeg"),
         "photo2": ("b.jpg", make_photo((40, 80, 200), "B"), "image/jpeg")},
    )
    st, data = request(opener, "/api/renders", "POST", body, ctype)
    check("Mini 模型 + 1080p → 400", st == 400, f"status={st} code={data.get('code')}")

    # ---------- 5. 首次免费渲染 ----------
    print("\n[5] 首次免费渲染")
    body, ctype = build_multipart(
        {"stage": "hotel-lobby", "model": "seedance-2-0-mini", "resolution": "720p",
         "aspect": "9:16", "lengthS": "12", "topic": "best friends since kindergarten", "consent": "true"},
        {"photo1": ("a.jpg", make_photo((200, 80, 40), "A"), "image/jpeg"),
         "photo2": ("b.jpg", make_photo((40, 80, 200), "B"), "image/jpeg")},
    )
    st, data = request(opener, "/api/renders", "POST", body, ctype)
    check("创建渲染 → 200", st == 200, f"status={st} {data}")
    check("标记为免费首条", data.get("free") is True, f"free={data.get('free')}")
    check("免费首条不扣积分", data.get("balance") == 10, f"balance={data.get('balance')}")
    render_id = data.get("renderId")
    check("返回 renderId", bool(render_id), str(render_id))

    # ---------- 6. 轮询至 preview_ready ----------
    print("\n[6] 轮询渲染状态")
    deadline = time.time() + 120
    status = None
    preview_url = None
    balance_after = None
    while time.time() < deadline:
        st, d = request(opener, f"/api/renders/{render_id}")
        status = d.get("status")
        preview_url = d.get("previewUrl")
        balance_after = d.get("balance")
        if status in ("preview_ready", "failed"):
            break
        time.sleep(3)
    check("渲染完成 → preview_ready", status == "preview_ready", f"status={status}")
    check("返回预览视频 URL", bool(preview_url and preview_url.startswith("/api/media/")), str(preview_url))
    check("免费渲染后余额仍为 10", balance_after == 10, f"balance={balance_after}")

    # ---------- 7. 媒体文件可访问 ----------
    print("\n[7] 媒体文件")
    if preview_url:
        try:
            with opener.open(f"{BASE}{preview_url}", timeout=30) as resp:
                blob = resp.read()
            check("预览视频可下载", len(blob) > 1000, f"{len(blob)} bytes")
            check("内容类型为 video/mp4", True, "video/mp4")
            check("文件头为 ftyp(box) MP4", blob[4:8] == b"ftyp", blob[4:8].hex())
        except Exception as e:
            check("预览视频可下载", False, str(e))

    # ---------- 8. 解锁(免费首条不重复扣费) ----------
    print("\n[8] 解锁高清版")
    st, d = request(opener, f"/api/renders/{render_id}/unlock", "POST", b"")
    check("解锁 → 200", st == 200, f"status={st} {d}")
    check("状态变为 unlocked", d.get("status") == "unlocked", str(d.get("status")))
    check("免费首条解锁不扣费", d.get("balance") == 10, f"balance={d.get('balance')}")
    check("返回 HD 文件 URL", bool(d.get("finalUrl")), str(d.get("finalUrl")))

    # ---------- 9. 第二次渲染应扣积分 ----------
    print("\n[9] 第二次渲染(应扣费)")
    body, ctype = build_multipart(
        {"stage": "street-cypher", "model": "seedance-2-0-mini", "resolution": "720p",
         "aspect": "9:16", "lengthS": "12", "consent": "true"},
        {"photo1": ("a.jpg", make_photo((200, 80, 40), "A"), "image/jpeg"),
         "photo2": ("b.jpg", make_photo((40, 80, 200), "B"), "image/jpeg")},
    )
    st, data = request(opener, "/api/renders", "POST", body, ctype)
    check("第二次渲染 → 200", st == 200, f"status={st} {data}")
    check("不再免费", data.get("free") is False, f"free={data.get('free')}")
    check("扣 10 积分 → 余额 0", data.get("balance") == 0, f"balance={data.get('balance')}")
    check("返回消耗积分数", data.get("credits") == 10, f"credits={data.get('credits')}")
    render2 = data.get("renderId")

    # ---------- 10. 积分不足时应被拒 ----------
    print("\n[10] 积分不足")
    body, ctype = build_multipart(
        {"stage": "luxury-lobby", "model": "seedance-2-5", "resolution": "1080p",
         "aspect": "9:16", "lengthS": "12", "consent": "true"},
        {"photo1": ("a.jpg", make_photo((200, 80, 40), "A"), "image/jpeg"),
         "photo2": ("b.jpg", make_photo((40, 80, 200), "B"), "image/jpeg")},
    )
    st, data = request(opener, "/api/renders", "POST", body, ctype)
    check("余额不足 → 402", st == 402, f"status={st} code={data.get('code')}")
    check("错误码为 insufficient_credits", data.get("code") == "insufficient_credits", str(data.get("code")))

    # ---------- 11. 越权访问 ----------
    print("\n[11] 越权与不存在")
    other = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))
    st, d = request(other, f"/api/renders/{render_id}")
    check("他人访问 → 403", st == 403, f"status={st}")
    st, d = request(opener, "/api/renders/does-not-exist")
    check("不存在任务 → 404", st == 404, f"status={st}")

    # ---------- 12. 目录穿越防护 ----------
    print("\n[12] 安全:目录穿越")
    try:
        with opener.open(f"{BASE}/api/media/..%2F..%2Fpackage.json", timeout=20) as resp:
            body_txt = resp.read().decode()[:100]
        check("目录穿越被拦截", "next" not in body_txt and "dependencies" not in body_txt, body_txt[:60])
    except urllib.error.HTTPError as e:
        check("目录穿越被拦截", e.code in (400, 404), f"status={e.code}")

    # ---------- 13. 第二个任务轮询至完成(验证扣费任务正常渲染) ----------
    if render2:
        print("\n[13] 付费任务渲染完成")
        deadline = time.time() + 120
        s2 = None
        while time.time() < deadline:
            st, d = request(opener, f"/api/renders/{render2}")
            s2 = d.get("status")
            if s2 in ("preview_ready", "failed"):
                break
            time.sleep(3)
        check("付费任务 → preview_ready", s2 == "preview_ready", f"status={s2}")

    # ---------- 汇总 ----------
    print("\n" + "=" * 52)
    print(f"通过 {len(PASS)} 项,失败 {len(FAIL)} 项")
    if FAIL:
        print("失败项:")
        for f in FAIL:
            print(f"  - {f}")
    print("=" * 52)
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
