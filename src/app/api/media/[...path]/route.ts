import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { MEDIA_DIR } from "@/lib/store";

/** 提供本地媒体文件(视频/图片),支持 Range 请求以便视频拖动 */
export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const rel = parts.join("/");

  // 防目录穿越
  const target = path.resolve(MEDIA_DIR, rel);
  if (!target.startsWith(path.resolve(MEDIA_DIR))) {
    return NextResponse.json({ ok: false, message: "非法路径" }, { status: 400 });
  }

  let stat;
  try {
    stat = await fs.stat(target);
  } catch {
    return NextResponse.json({ ok: false, message: "文件不存在" }, { status: 404 });
  }
  if (!stat.isFile()) {
    return NextResponse.json({ ok: false, message: "文件不存在" }, { status: 404 });
  }

  const ext = path.extname(target).toLowerCase();
  const mime: Record<string, string> = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  const contentType = mime[ext] ?? "application/octet-stream";

  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? Number(m[1]) : 0;
    const end = m && m[2] ? Number(m[2]) : stat.size - 1;
    if (start >= stat.size || end >= stat.size || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "content-range": `bytes */${stat.size}` },
      });
    }
    const chunk = await fs.readFile(target);
    return new NextResponse(chunk.subarray(start, end + 1), {
      status: 206,
      headers: {
        "content-type": contentType,
        "content-length": String(end - start + 1),
        "content-range": `bytes ${start}-${end}/${stat.size}`,
        "accept-ranges": "bytes",
      },
    });
  }

  const buf = await fs.readFile(target);
  return new NextResponse(buf, {
    headers: {
      "content-type": contentType,
      "content-length": String(stat.size),
      "accept-ranges": "bytes",
      "cache-control": "public, max-age=3600",
    },
  });
}
