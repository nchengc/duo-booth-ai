"""把系统 Noto Sans SC 子集化为仅含 OG 图所需字符的 woff,避免打包 8MB 字体。

用法:python -I scripts/subset_fonts.py
输出:public/fonts/og-cjk.woff(约 20-40KB) 与 og-cjk-bold.woff(标题用粗体)
"""

from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC_REGULAR = Path(r"C:\Windows\Fonts\Noto Sans SC (TrueType).otf")
SRC_BOLD = Path(r"C:\Windows\Fonts\Noto Sans SC Bold (TrueType).otf")
OUT_REGULAR = ROOT / "public" / "fonts" / "og-cjk.woff"
OUT_BOLD = ROOT / "public" / "fonts" / "og-cjk-bold.woff"

# OG 图会出现的字符:ASCII + 常用中文 + 标点
CHARS = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "　、。！？：；，·「」『』（）《》【】—…“”‘’"
    + "上传照片生成视频说唱双人出积分价格订阅失败扣费免费首条高清无水印下载发布"
    + "分钟就绪舞台主题模型清晰度比例时长所有页面常见问题为什么选我们照片隐私"
    + "原创歌曲伴奏口型同步录音棚橙色录音室套房大堂街头赛博朋克朋友情侣生日惊喜"
    + "群聊整蛊宠物复活老照片未来宝宝年代地球拉远僵尸换装拥抱克隆跳舞复古"
    + "两秒倍赞更更三千万百千万亿其中一二三四五六七八九十零"
    + "制作生成器视频的两张照片趋势爆款应用比较哪个使用指南教程技巧"
    + "年最新最好工具推荐榜单排行评测测评实测评测教程上手指南"
    + "从到与和或及的了在是有为以于将把被就都也很更最不没要会能可想"
    + "①②③④⑤⑥⑦⑧⑨⑩零一二三四五六七八九十百千万"
    + "·—－_+=~`!@#$%^&*()[]{}|\\:;\"'<>?,./"
)


def build(src: Path, out: Path) -> None:
    font = TTFont(str(src))
    options = subset.Options()
    options.flavor = "woff"
    options.desubroutinize = True
    options.layout_features = ["*"]
    options.notdef_outline = True
    options.recalc_bounds = True
    options.drop_tables = ["DSIG"]

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=CHARS)
    subsetter.subset(font)

    out.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff"
    font.save(str(out))
    font.close()

    size_kb = out.stat().st_size / 1024
    print(f"OK: {out.relative_to(ROOT)} ({size_kb:.1f} KB)")


def main() -> None:
    if not SRC_REGULAR.exists():
        raise SystemExit(f"源字体不存在: {SRC_REGULAR}")
    build(SRC_REGULAR, OUT_REGULAR)
    if SRC_BOLD.exists():
        build(SRC_BOLD, OUT_BOLD)
    else:
        print(f"跳过粗体(源不存在): {SRC_BOLD}")


if __name__ == "__main__":
    main()
