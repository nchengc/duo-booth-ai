import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { createRenderTask, saveUpload } from "@/lib/pipeline";
import { creditBalance, getOrCreateUser } from "@/lib/store";
import { EVT, trackServer, looksLikeBot, isTestRequest } from "@/lib/analytics";
import { checkRate } from "@/lib/ratelimit";
import { ASPECTS, MODELS, RESOLUTIONS, creditsFor, maxSeconds, type Aspect, type ModelId, type Resolution } from "@/lib/credits";

/** 创建渲染任务(上传两张照片 → 扣积分 → 入队) */
export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!checkRate(req, "renders")) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", message: "请求过于频繁,请稍后再试" },
      { status: 429, headers: { "retry-after": "600" } },
    );
  }
  await getOrCreateUser(userId);

  const form = await req.formData();
  const file1 = form.get("photo1");
  const file2 = form.get("photo2");
  const stage = String(form.get("stage") ?? "hotel-lobby");
  const model = String(form.get("model") ?? "seedance-2-0-mini") as ModelId;
  const resolution = String(form.get("resolution") ?? "720p") as Resolution;
  const aspect = String(form.get("aspect") ?? "9:16") as Aspect;
  const lengthS = Math.max(5, Math.min(maxSeconds(model), Number(form.get("lengthS") ?? 12)));
  const topic = (form.get("topic") as string | null)?.trim() || null;
  const genre = (form.get("genre") as string | null)?.trim() || null;
  const consent = form.get("consent") === "true";

  if (!(file1 instanceof File) || !(file2 instanceof File)) {
    return NextResponse.json({ ok: false, code: "missing_photos", message: "请上传两张照片" }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { ok: false, code: "consent_required", message: "请确认你拥有这两张照片的使用权" },
      { status: 400 },
    );
  }
  if (!MODELS.some((m) => m.id === model) || !RESOLUTIONS.includes(resolution) || !ASPECTS.includes(aspect)) {
    return NextResponse.json({ ok: false, code: "invalid_options", message: "参数无效" }, { status: 400 });
  }
  if (creditsFor(model, resolution, lengthS) === null) {
    return NextResponse.json(
      { ok: false, code: "unsupported_option", message: "该模型不支持所选分辨率" },
      { status: 400 },
    );
  }
  // 照片大小上限 8MB
  for (const f of [file1, file2]) {
    if (f.size > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, code: "file_too_large", message: "单张照片不超过 8MB" }, { status: 400 });
    }
  }

  const p1 = await saveUpload(userId, file1.name, Buffer.from(await file1.arrayBuffer()));
  const p2 = await saveUpload(userId, file2.name, Buffer.from(await file2.arrayBuffer()));

  const result = await createRenderTask({
    userId,
    photo1Path: p1,
    photo2Path: p2,
    stage,
    model,
    resolution,
    aspect,
    lengthS,
    topic,
    genre,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.code === "insufficient_credits" ? 402 : 500 });
  }

  // 服务器埋点:渲染任务创建成功(照片已上传并进入队列)
  await trackServer({
    name: EVT.renderCreated,
    visitorId: userId,
    props: {
      model,
      stage,
      resolution,
      aspect,
      lengthS,
      free: result.free,
      credits: creditsFor(model, resolution, lengthS) ?? 0,
    },
    isBot: looksLikeBot(req.headers.get("user-agent")),
    isTest: isTestRequest(req.headers),
  });

  return NextResponse.json({
    ok: true,
    renderId: result.render.id,
    status: result.render.status,
    balance: result.balance,
    free: result.free,
    credits: creditsFor(result.render.model as ModelId, result.render.resolution as Resolution, result.render.lengthS),
  });
}

/** 查询积分余额 */
export async function GET() {
  const userId = await currentUserId();
  const user = await getOrCreateUser(userId);
  const balance = await creditBalance(userId);
  return NextResponse.json({ ok: true, balance, freeRenderUsed: user.freeRenderUsed });
}
