"""IndexNow 通知(PRD §6.4 上新流水线:新趋势页上线后通知搜索引擎)

用法:
    1. 设置环境变量 INDEXNOW_KEY(16+ 位随机串)
    2. 把 key 文件部署到站点根:public/{key}.txt 内容为 key 本身
       python -I scripts/indexnow.py gen-key     # 生成 key 并写入 public/
    3. 新页上线后:
       python -I scripts/indexnow.py ping https://你的域名 /green-booth-freestyle-ai [/另一个页]

说明:Bing/Seznam/Yandex 共用 indexnow.org 协议;Google 不参与,走 GSC。
"""

import pathlib
import secrets
import sys
import urllib.request
import json

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"


def gen_key() -> None:
    key = secrets.token_hex(16)
    (PUBLIC / f"{key}.txt").write_text(key, encoding="utf-8")
    print(f"key 文件已生成:public/{key}.txt")
    print(f"INDEXNOW_KEY={key}")


def ping(site: str, paths: list[str]) -> None:
    key = sys.argv[2] if len(sys.argv) > 2 else __import__("os").environ.get("INDEXNOW_KEY", "")
    if not key:
        raise SystemExit("缺少 key:先 gen-key 或设 INDEXNOW_KEY")
    key_file = PUBLIC / f"{key}.txt"
    if not key_file.exists():
        key_file.write_text(key, encoding="utf-8")
        print(f"key 文件已补写:public/{key}.txt")

    host = site.replace("https://", "").replace("http://", "").rstrip("/")
    payload = {
        "host": host,
        "key": key,
        "urlList": [f"{site.rstrip('/')}/{p.lstrip('/')}" for p in paths],
    }
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=json.dumps(payload).encode(),
        headers={"content-type": "application/json; charset=utf-8"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        print("IndexNow 状态:", resp.status, "(200=已接受 202=待验证 400=key 错误 422=url 不属于 host)")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "gen-key":
        gen_key()
    elif cmd == "ping":
        ping(sys.argv[3] if len(sys.argv) > 3 else "", sys.argv[4:] if len(sys.argv) > 4 else [])
    else:
        print(__doc__)
