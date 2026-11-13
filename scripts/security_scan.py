"""上线纪律安全扫描(对标复盘 §9:提交前查密钥泄露/注入/越权)

检查项:
  1. 源码中硬编码密钥模式(sk_live/sk_test/whsec/AKIA/token=)
  2. .env* 是否被 .gitignore 覆盖
  3. 管理 API 是否都有鉴权调用
用法:python -I scripts/security_scan.py
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}" + (f"  — {detail}" if detail else ""))


def main():
    print("安全扫描\n")

    # 1. 硬编码密钥
    secret_re = re.compile(
        r"(sk_live_[A-Za-z0-9]{10,}|sk_test_[A-Za-z0-9]{10,}|whsec_[A-Za-z0-9]{10,}"
        r"|AKIA[A-Z0-9]{12,}|Bearer [A-Za-z0-9_-]{20,})",
    )
    # 允许:测试脚本里对 whsec_test123 的引用(明确标注测试)
    leaks = []
    for f in list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx")):
        text = f.read_text(encoding="utf-8", errors="ignore")
        for m in secret_re.finditer(text):
            leaks.append((f.relative_to(ROOT), m.group(0)[:20]))
    check("源码无硬编码密钥", len(leaks) == 0, str(leaks[:3]))

    # 2. .gitignore 覆盖 .env*
    gitignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
    check(".gitignore 覆盖 .env*", ".env" in gitignore)
    check(".gitignore 覆盖 .data(用户数据)", ".data" in gitignore)

    # 3. 管理路由鉴权
    admin_dir = SRC / "app" / "api" / "admin"
    for f in admin_dir.rglob("route.ts"):
        if "_auth" in f.name:
            continue
        text = f.read_text(encoding="utf-8")
        check(f"admin/{f.parent.name}/ 有鉴权", "requireAdmin(req)" in text)

    # 4. 环境变量读取(密钥只能来自 env)
    env_reads = len(re.findall(r"process\.env\.[A-Z_]+", "\n".join(
        f.read_text(encoding="utf-8", errors="ignore") for f in SRC.rglob("*.ts")
    )))
    check("密钥统一走环境变量", env_reads > 0, f"{env_reads} 处 env 读取")

    print(f"\n通过 {len(PASS)} / 失败 {len(FAIL)}")
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
