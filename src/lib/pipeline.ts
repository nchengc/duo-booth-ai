/**
 * 渲染流水线(PRD §8)
 *
 * 上传照片 → 创建 render(queued)
 *   → 调供应商(image-to-video, native audio)
 *   → 低清短样片(preview,免费首条)
 *   → 用户看片后解锁:扣积分 → 交付 HD 无水印 MP4
 *   → 失败/超时/安全拦截:自动退积分(refund_free)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { getProvider, type SubmitInput } from "./provider";
import {
  addCredit,
  createRender,
  creditBalance,
  getOrCreateUser,
  getRender,
  updateRender,
  MEDIA_DIR,
  type Render,
} from "./store";
import { creditsFor, type Aspect, type ModelId, type Resolution } from "./credits";
import { EVT, trackServer } from "./analytics";
import { toMediaUrl } from "./provider";

export type CreateRenderInput = {
  userId: string;
  photo1Path: string;
  photo2Path: string;
  stage: string;
  model: ModelId;
  resolution: Resolution;
  aspect: Aspect;
  lengthS: number;
  topic: string | null;
  genre?: string | null;
};

export type CreateRenderResult =
  | { ok: true; render: Render; balance: number; free: boolean }
  | { ok: false; code: string; message: string; balance?: number };

/** 创建渲染任务:校验积分 → 扣积分 → 入队 */
export async function createRenderTask(input: CreateRenderInput): Promise<CreateRenderResult> {
  const user = await getOrCreateUser(input.userId);

  // 首条免费(PRD §3 步骤 6):已用过免费额度则按正常扣费
  const free = !user.freeRenderUsed;

  // 免费预览强制降档(PRD §3 "短时、低分辨率样片" —— 对标同款):
  // 攻击者可用新 cookie + IP 反复白嫖,免费档位锁死在 mini/480p/5s,把单条免费成本压到最低
  const effModel: ModelId = free ? "seedance-2-0-mini" : input.model;
  const effResolution: Resolution = free ? "480p" : input.resolution;
  const effLength = free ? Math.min(input.lengthS, 5) : input.lengthS;

  const credits = creditsFor(effModel, effResolution, effLength);
  if (credits === null) {
    return { ok: false, code: "unsupported_option", message: "该模型不支持所选分辨率" };
  }

  if (!free) {
    const balance = await creditBalance(input.userId);
    if (balance < credits) {
      return {
        ok: false,
        code: "insufficient_credits",
        message: "积分不足,请先购买积分包",
        balance,
      };
    }
  }

  // 扣积分(免费首条记 0 消耗;正常渲染扣费)
  const charged = free ? 0 : credits;
  if (charged > 0) {
    await addCredit(input.userId, -charged, "render", null);
  }

  const render = await createRender({
    userId: input.userId,
    stage: input.stage,
    model: effModel,
    resolution: effResolution,
    aspect: input.aspect,
    lengthS: effLength,
    topic: input.topic,
    genre: input.genre ?? null,
    photo1Url: input.photo1Path,
    photo2Url: input.photo2Path,
    status: "queued",
    previewUrl: null,
    finalUrl: null,
    providerJobId: null,
    errorCode: null,
    creditsCharged: charged,
    freePreview: free,
  });

  if (free) {
    await getOrCreateUser(input.userId); // 确保存在
    const { updateUser } = await import("./store");
    await updateUser(input.userId, { freeRenderUsed: true });
  }

  // 提交给供应商
  try {
    const provider = getProvider();
    const submitInput: SubmitInput = {
      photo1Path: input.photo1Path,
      photo2Path: input.photo2Path,
      stage: input.stage,
      model: effModel,
      resolution: effResolution,
      aspect: input.aspect,
      lengthS: effLength,
      topic: input.topic,
      genre: input.genre ?? undefined,
      outBase: path.join(MEDIA_DIR, `${render.id}_preview`),
      watermark: true,
    };
    const { jobId } = await provider.submit(submitInput);
    const updated = await updateRender(render.id, {
      status: "rendering",
      providerJobId: jobId,
    });
    return { ok: true, render: updated ?? render, balance: await creditBalance(input.userId), free };
  } catch (err) {
    // 提交失败也要退积分(失败永不扣费)
    await failRender(render.id, "submit_failed");
    const balance = await creditBalance(input.userId);
    return {
      ok: false,
      code: "submit_failed",
      message: err instanceof Error ? err.message : "提交失败",
      balance,
    };
  }
}

/** 轮询渲染状态 */
export async function pollRender(renderId: string): Promise<Render | undefined> {
  const render = await getRender(renderId);
  if (!render) return undefined;

  if (render.status === "queued" || render.status === "rendering") {
    if (!render.providerJobId) return render;
    const provider = getProvider();
    const result = await provider.poll(render.providerJobId);

    if (result.status === "running" || result.status === "queued") {
      return (await updateRender(render.id, { status: "rendering" })) ?? render;
    }
    if (result.status === "failed") {
      return (await failRender(render.id, result.errorCode ?? "provider_failed")) ?? render;
    }
    // succeeded → 预览就绪
    const previewUrl = toMediaUrl(result.outputPath);
    return (
      (await updateRender(render.id, {
        status: "preview_ready",
        previewUrl,
      })) ?? render
    );
  }

  return render;
}

/** 渲染失败:自动退还已扣积分(PRD §4.4) */
export async function failRender(renderId: string, errorCode: string): Promise<Render | undefined> {
  const render = await getRender(renderId);
  if (!render) return undefined;
  if (render.status === "failed" || render.status === "unlocked") return render;

  if (render.creditsCharged > 0) {
    await addCredit(render.userId, render.creditsCharged, "refund_free", render.id);
  }
  // 服务器埋点:渲染失败(失败自动退积分 + 记录错误码,供失败率监控)
  await trackServer({
    name: EVT.renderFailed,
    visitorId: render.userId,
    dedupId: `render-failed-${render.id}`,
    props: { errorCode, model: render.model, stage: render.stage },
  });
  return updateRender(renderId, {
    status: "failed",
    errorCode,
    creditsCharged: 0,
  });
}

/** 解锁高清无水印版(付费路径) */
export type UnlockResult =
  | { ok: true; render: Render; balance: number }
  | { ok: false; code: string; message: string; balance: number };

export async function unlockRender(renderId: string, userId: string): Promise<UnlockResult> {
  const render = await getRender(renderId);
  if (!render) {
    return { ok: false, code: "not_found", message: "任务不存在", balance: await creditBalance(userId) };
  }
  if (render.userId !== userId) {
    return { ok: false, code: "forbidden", message: "无权访问该任务", balance: await creditBalance(userId) };
  }
  if (render.status === "unlocked") {
    return { ok: true, render, balance: await creditBalance(userId) };
  }
  if (render.status !== "preview_ready") {
    return {
      ok: false,
      code: "not_ready",
      message: "样片尚未生成完成",
      balance: await creditBalance(userId),
    };
  }

  const credits = creditsFor(render.model as ModelId, render.resolution as Resolution, render.lengthS);
  if (credits === null) {
    return { ok: false, code: "unsupported_option", message: "无效的渲染配置", balance: 0 };
  }

  // 免费首条已包含解锁额度,不重复扣费
  if (!render.freePreview) {
    const balance = await creditBalance(userId);
    if (balance < credits) {
      return {
        ok: false,
        code: "insufficient_credits",
        message: "积分不足,请先购买积分包",
        balance,
      };
    }
    await addCredit(userId, -credits, "render", render.id);
  }

  // 生成 HD 无水印版本
  const provider = getProvider();
  const { jobId } = await provider.submit({
    photo1Path: render.photo1Url,
    photo2Path: render.photo2Url,
    stage: render.stage,
    model: render.model,
    resolution: render.resolution,
    aspect: render.aspect,
    lengthS: render.lengthS,
    topic: render.topic,
    genre: render.genre ?? undefined,
    outBase: path.join(MEDIA_DIR, `${render.id}_final`),
    watermark: false,
  });

  // 轮询直到完成
  let status: "succeeded" | "failed" = "failed";
  let outputPath: string | undefined;
  for (let i = 0; i < 60; i++) {
    const result = await provider.poll(jobId);
    if (result.status === "succeeded") {
      status = "succeeded";
      outputPath = result.outputPath;
      break;
    }
    if (result.status === "failed") break;
    await new Promise((r) => setTimeout(r, 2_000));
  }

  if (status === "failed") {
    // 解锁失败 → 退还本次扣的积分
    if (!render.freePreview) {
      await addCredit(userId, credits, "refund_free", render.id);
    }
    await failRender(render.id, "unlock_failed");
    return {
      ok: false,
      code: "unlock_failed",
      message: "高清版本生成失败,积分已退回",
      balance: await creditBalance(userId),
    };
  }

  const updated = await updateRender(render.id, {
    status: "unlocked",
    finalUrl: toMediaUrl(outputPath),
  });

  // 服务器埋点:解锁成功(漏斗"下载"前置步骤)
  await trackServer({
    name: EVT.renderUnlocked,
    visitorId: userId,
    dedupId: `render-unlocked-${render.id}`,
    props: { model: render.model, stage: render.stage, free: render.freePreview },
  });

  return { ok: true, render: updated ?? render, balance: await creditBalance(userId) };
}

/** 保存上传的照片 */
export async function saveUpload(userId: string, filename: string, data: Buffer): Promise<string> {
  const dir = path.join(MEDIA_DIR, "uploads", userId);
  await fs.mkdir(dir, { recursive: true });
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const full = path.join(dir, `${Date.now()}_${safe}`);
  await fs.writeFile(full, data);
  return full;
}
