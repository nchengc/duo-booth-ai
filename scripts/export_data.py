"""数据备份(DEPLOY.md "零单验证期可先用 JSON 后端 + 定期导出")

用法:python -I scripts/export_data.py
输出:backups/db-YYYYMMDD-HHMMSS.json + 媒体文件清单
建议:部署期每天跑一次(定时任务),或上线切 Supabase 后由数据库托管备份
"""

import json
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / ".data" / "db.json"
MEDIA = ROOT / ".data" / "media"
BACKUPS = ROOT / "backups"


def main() -> None:
    if not DATA.exists():
        raise SystemExit("没有可备份的 .data/db.json")
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    out_dir = BACKUPS / f"db-{ts}"
    out_dir.mkdir(parents=True, exist_ok=True)

    # 数据
    db = json.loads(DATA.read_text(encoding="utf-8"))
    counts = {k: len(v) if isinstance(v, list) else "-" for k, v in db.items()}
    (out_dir / "db.json").write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")

    # 媒体清单(视频文件体积大,只记录清单不复制)
    media_files = [str(p.relative_to(MEDIA)) for p in MEDIA.rglob("*") if p.is_file()] if MEDIA.exists() else []
    (out_dir / "media-manifest.json").write_text(
        json.dumps({"count": len(media_files), "files": media_files}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"备份完成:backups/db-{ts}/")
    print(f"  数据量:{counts}")
    print(f"  媒体文件:{len(media_files)} 个(仅清单;视频本体请用对象存储托管)")


if __name__ == "__main__":
    main()
