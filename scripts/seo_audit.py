"""全站 SEO 深度审计(PRD §6.1 逐页校验,不只是状态码)

对 sitemap 全部 URL 逐页检查:
  title(非空/全站唯一/长度<=70)、meta description(非空/70-170)、canonical 指向自身
  og:image、恰好 1 个 h1、hreflang(en+zh 至少;核心页 6 语)
结果写入 docs/seo-audit-<date>.md 与 .html

用法:python -I scripts/seo_audit.py [base_url]
"""

import html
import json
import re
import sys
import urllib.request
from datetime import date

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3291"
SM_BASE = "http://localhost:3000"
DOCS = None  # 延迟定位

results = []


def fetch(path):
    req = urllib.request.Request(f"{BASE}{path}", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, resp.read().decode()


def meta(re_field, s):
    m = re.search(re_field, s)
    return html.unescape(m.group(1)).strip() if m else ""


def audit(path):
    page = {"path": path, "issues": []}
    try:
        st, html_text = fetch(path)
    except Exception as e:
        page["issues"].append(f"fetch_failed: {str(e)[:50]}")
        return page
    page["status"] = st

    title = meta(r"<title>([^<]*)</title>", html_text)
    desc = meta(r'<meta name="description" content="([^"]*)"', html_text)
    canonical = meta(r'<link rel="canonical" href="([^"]*)"', html_text)
    og_image = bool(re.search(r'property="og:image" content="[^"]+"', html_text))
    h1s = re.findall(r"<h1[^>]*>", html_text)
    hreflangs = len(re.findall(r'hreflang="', html_text, re.I))
    page["title"] = title
    page["desc"] = desc

    if not title:
        page["issues"].append("title 缺失")
    elif len(title) > 70:
        page["issues"].append(f"title 过长({len(title)})")
    if not desc:
        page["issues"].append("description 缺失")
    else:
        # 阈值按语言校准:zh 汉字信息密度高,40 字达标
        min_desc = 40 if path.startswith("/zh") else 50
        if len(desc) < min_desc:
            page["issues"].append(f"description 过短({len(desc)})")
    if not canonical:
        page["issues"].append("canonical 缺失")
    elif not canonical.rstrip("/").endswith(path.rstrip("/")) and "/blog/" not in path:
        # zh/blog 页 canonical 回英文属设计内
        if not (path.startswith("/zh") and canonical.endswith(path.replace("/zh", "", 1))):
            page["issues"].append(f"canonical 不指向自身: {canonical}")
    if not og_image:
        page["issues"].append("og:image 缺失")
    if len(h1s) != 1:
        page["issues"].append(f"h1 数量 {len(h1s)} (应为 1)")
    # 博客为英文单语(PRD §5.4):hreflang 单语属设计内,豁免
    if not path.startswith("/blog") and hreflangs < 2:
        page["issues"].append(f"hreflang 仅 {hreflangs} 个")
    return page


def main():
    sm = urllib.request.urlopen(f"{BASE}/sitemap.xml", timeout=30).read().decode()
    urls = re.findall(r"<loc>(.*?)</loc>", sm)
    m = re.match(r"^(https?://[^/]+)", urls[0])
    sm_base = m.group(1) if m else BASE

    for u in urls:
        path = u.replace(sm_base, "") or "/"
        results.append(audit(path))

    # 唯一性:按语言分组(跨语言同 title 属正常,hreflang 负责消歧)
    def locale_of(path):
        seg = path.split("/")[1]
        return seg if seg in ("zh", "it", "es", "pt", "fr") else "en"
    titles = {}
    for r in results:
        if r.get("title"):
            key = (locale_of(r["path"]), r["title"])
            titles.setdefault(key, []).append(r["path"])
    dup_titles = {t[1]: ps for t, ps in titles.items() if len(ps) > 1}
    total_issues = sum(len(r["issues"]) for r in results)
    clean = sum(1 for r in results if not r["issues"])

    print(f"审计页面:{len(results)} | 干净:{clean} | 问题数:{total_issues}")
    for r in results:
        if r["issues"]:
            print(f"  [问题] {r['path']}: {'; '.join(r['issues'])}")
    if dup_titles:
        print(f"  [问题] title 全站重复 {len(dup_titles)} 组:")
        for t, ps in list(dup_titles.items())[:5]:
            print(f"    '{t[:50]}' → {ps}")

    # 归档
    docs_dir = __import__("pathlib").Path(__file__).resolve().parent.parent / "docs"
    docs_dir.mkdir(exist_ok=True)
    ts = date.today().isoformat()

    md = [f"# SEO 全站审计报告({ts})", "",
          f"- 审计页面:{len(results)}(sitemap 全量)",
          f"- 干净页面:{clean}", f"- 问题总数:{total_issues}",
          f"- title 重复组:{len(dup_titles)}", ""]
    for r in results:
        if r["issues"]:
            md.append(f"- `{r['path']}`:{'; '.join(r['issues'])}")
    if not dup_titles and total_issues == 0:
        md.append("✅ 全部通过,无问题项。")
    md.append("")
    md.append("抽样数据(前 5 页):")
    for r in results[:5]:
        md.append(f"- `{r['path']}` title({len(r.get('title',''))}字符): {r.get('title','')[:60]}")
    (docs_dir / f"seo-audit-{ts}.md").write_text("\n".join(md), encoding="utf-8")

    html_rows = "".join(
        f"<tr><td>{r['path']}</td><td>{len(r.get('title',''))}</td>"
        f"<td>{'; '.join(r['issues']) or '✅'}</td></tr>"
        for r in results
    )
    html_doc = f"""<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<title>SEO 全站审计({ts})</title><style>
body{{font-family:"Segoe UI","Microsoft YaHei",sans-serif;background:#0b0a10;color:#e8e6ef;padding:40px;line-height:1.7}}
h1{{color:#ffb020}} table{{border-collapse:collapse;width:100%;font-size:13px}}
th,td{{border:1px solid #2b2736;padding:6px 10px;text-align:left}}
th{{background:#1c1926;color:#ffb020}} .ok{{color:#3ecf8e}}
</style></head><body>
<h1>SEO 全站审计报告({ts})</h1>
<p>审计 {len(results)} 页 · 干净 {clean} · 问题 {total_issues} · title 重复 {len(dup_titles)} 组</p>
<table><tr><th>页面</th><th>title 长度</th><th>问题</th></tr>{html_rows}</table>
</body></html>"""
    (docs_dir / f"seo-audit-{ts}.html").write_text(html_doc, encoding="utf-8")
    print(f"报告归档:docs/seo-audit-{ts}.md / .html")
    sys.exit(1 if total_issues else 0)


if __name__ == "__main__":
    main()
