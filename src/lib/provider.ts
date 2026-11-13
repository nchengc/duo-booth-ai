/**
 * 视频供应商抽象层(PRD §9:Seedance 2.0 Mini/Fast/Pro + 2.5)
 *
 * 对标模型档位(credits.ts 的 MODELS)对应到具体 API 模型名。
 * 生产环境通过 VIDEO_PROVIDER 环境变量切换:
 *   mock(默认,本地 ffmpeg 合成样片) | fal | replicate | volcengine
 *
 * 真实接入时只需实现 VideoProvider 接口,流水线的其余部分不动。
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { MEDIA_DIR } from "./store";

const exec = promisify(execFile);

export type ProviderJobStatus = "queued" | "running" | "succeeded" | "failed";

export type SubmitInput = {
  photo1Path: string;
  photo2Path: string;
  stage: string;
  model: string;
  resolution: string;
  aspect: string;
  lengthS: number;
  topic: string | null;
  /** 曲风/场景提示(工具页 genreHint,拼进 prompt) */
  genre?: string;
  /** 输出路径(不含扩展名) */
  outBase: string;
  /** 是否加预览水印 */
  watermark: boolean;
};

export type PollResult = {
  status: ProviderJobStatus;
  outputPath?: string;
  errorCode?: string;
};

export interface VideoProvider {
  name: string;
  submit(input: SubmitInput): Promise<{ jobId: string }>;
  poll(jobId: string): Promise<PollResult>;
}

/** 组装最终 prompt:舞台模板 + 曲风 + 主题 + 安全约束(PRD §3/§11) */
export function buildPrompt(input: Pick<SubmitInput, "stage" | "topic" | "genre">): string {
  const parts = [STAGE_PROMPTS[input.stage] ?? STAGE_PROMPTS["hotel-lobby"]];
  if (input.genre) parts.push(input.genre);
  if (input.topic) parts.push(`the rap is about: ${input.topic}`);
  parts.push("no brand logos, no text overlays");
  return parts.join(", ");
}

/** 输出路径 → 前端可访问的 URL:本地文件走 /api/media;远程 URL 原样 */
export function toMediaUrl(outputPath: string | undefined | null): string | null {
  if (!outputPath) return null;
  if (outputPath.startsWith("http://") || outputPath.startsWith("https://")) return outputPath;
  return `/api/media/${path.basename(outputPath)}`;
}

/* ============ 舞台 prompt 模板 ============ */
export const STAGE_PROMPTS: Record<string, string> = {
  "hotel-lobby":
    "two people rapping together in a bright orange studio booth, two microphones, hip-hop performance, cinematic lighting, vertical video, native audio rap with beat",
  "luxury-lobby":
    "two people rapping together in a luxury hotel lobby, marble floor, golden hour light, elegant interior, cinematic, vertical video, native audio rap with beat",
  "studio-booth":
    "two people rapping together in a clean live-session recording studio, soft box lighting, band equipment in background, cinematic, vertical video, native audio rap with beat",
  "street-cypher":
    "two people rapping together on a neon-lit street at night, cypher crowd, handheld camera feel, cinematic, vertical video, native audio rap with beat",
};

/* ============ Mock 供应商(本地 ffmpeg 合成样片) ============ */

/** mock 任务的内存状态 */
type MockJob = {
  input: SubmitInput;
  startedAt: number;
  /** 模拟渲染耗时(毫秒) */
  durationMs: number;
};

const mockJobs = new Map<string, MockJob>();

/** 用 ffmpeg 把两张照片合成到舞台背景上,生成一段样片 */
async function composeMockVideo(input: SubmitInput): Promise<string> {
  const out = `${input.outBase}.mp4`;
  await fs.mkdir(MEDIA_DIR, { recursive: true });

  const [w, h] =
    input.aspect === "1:1" ? [720, 720] : input.aspect === "16:9" ? [1280, 720] : [720, 1280];

  // 舞台背景色(按舞台区分)
  const bg: Record<string, string> = {
    "hotel-lobby": "#e2621f",
    "luxury-lobby": "#2a2118",
    "studio-booth": "#1c1c22",
    "street-cypher": "#0d1226",
  };
  const bgColor = bg[input.stage] ?? "#1c1c22";

  const half = Math.floor(w / 2);
  // 输入索引:[0]=photo1, [1]=photo2, [2]=lavfi 背景
  // 两张照片裁成左右两半的竖幅人像,再 hstack 拼成"双人同框",叠到背景上
  const filter = [
    `[0:v]scale=${half}:${h}:force_original_aspect_ratio=increase,crop=${half}:${h},setsar=1[p1]`,
    `[1:v]scale=${half}:${h}:force_original_aspect_ratio=increase,crop=${half}:${h},setsar=1[p2]`,
    `[p1][p2]hstack=inputs=2[pair]`,
    `[pair]scale=${w}:${h},setsar=1[pairfull]`,
    `[2:v]scale=${w}:${h},setsar=1[bg]`,
    `[bg][pairfull]overlay=0:0:shortest=1:format=auto[out]`,
  ].join(";");

  const args = [
    "-y",
    "-loop", "1", "-t", String(input.lengthS), "-i", input.photo1Path,
    "-loop", "1", "-t", String(input.lengthS), "-i", input.photo2Path,
    "-f", "lavfi", "-i", `color=c=${bgColor}:s=${w}x${h}:r=24:d=${input.lengthS}`,
    "-filter_complex", filter,
    "-map", "[out]",
    "-t", String(input.lengthS),
    "-r", "24",
    "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    out,
  ];

  try {
    await exec("ffmpeg", args, { timeout: 120_000 });
  } catch {
    // ffmpeg 不可用或失败:退化为纯色样片,保证流程可跑通
    await exec(
      "ffmpeg",
      [
        "-y", "-f", "lavfi", "-i",
        `color=c=${bgColor}:s=${w}x${h}:d=${input.lengthS}`,
        "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", out,
      ],
      { timeout: 120_000 },
    ).catch(() => {
      throw new Error("ffmpeg_failed");
    });
  }
  return out;
}

const mockProvider: VideoProvider = {
  name: "mock",
  async submit(input) {
    const jobId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    mockJobs.set(jobId, {
      input,
      startedAt: Date.now(),
      // mock 渲染耗时:可用 MOCK_RENDER_MS 调整(默认 25s,便于测试等待)
      durationMs: Number(process.env.MOCK_RENDER_MS ?? 25_000),
    });
    return { jobId };
  },
  async poll(jobId) {
    const job = mockJobs.get(jobId);
    if (!job) return { status: "failed", errorCode: "job_not_found" };
    const elapsed = Date.now() - job.startedAt;
    if (elapsed < job.durationMs) return { status: "running" };
    if (elapsed < job.durationMs + 5_000) return { status: "running" };

    try {
      const outputPath = await composeMockVideo(job.input);
      return { status: "succeeded", outputPath };
    } catch {
      return { status: "failed", errorCode: "compose_failed" };
    }
  },
};

/* ============ fal.ai 生产适配器(队列 API 完整实现) ============ */

/**
 * 模型映射:内部档位 → fal 模型端点(接入时以 fal 后台实际 ID 为准,可用 env 覆盖)
 * fal 队列协议:POST submit → {request_id};GET status_url → {status: IN_QUEUE|IN_PROGRESS|COMPLETED};
 * COMPLETED 后 GET request_base 取产物 {video: {url}}
 * 本地照片转 base64 data URI 提交;产物 URL 下载回本地媒体目录(统一由 /api/media 提供)
 */
const FAL_MODEL_MAP: Record<string, string> = {
  "seedance-2-0-mini": process.env.FAL_MODEL_MINI ?? "fal-ai/bytedance/seedance/v1/mini/image-to-video",
  "seedance-2-0-fast": process.env.FAL_MODEL_FAST ?? "fal-ai/bytedance/seedance/v1/fast/image-to-video",
  "seedance-2-0": process.env.FAL_MODEL_PRO ?? "fal-ai/bytedance/seedance/v1/pro/image-to-video",
  "seedance-2-5": process.env.FAL_MODEL_ULTRA ?? "fal-ai/bytedance/seedance/v1/ultra/image-to-video",
};

async function bearerRequest(url: string, apiKey: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(url, {
    ...init,
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json", ...(init?.headers ?? {}) },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`fal_http_${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

async function downloadToMedia(url: string, outBase: string): Promise<string> {
  const out = `${outBase}.mp4`;
  await fs.mkdir(path.dirname(out), { recursive: true });
  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`download_failed_${res.status}`);
  await fs.writeFile(out, Buffer.from(await res.arrayBuffer()));
  return out;
}

const falProvider: VideoProvider = {
  name: "fal",
  async submit(input) {
    const apiKey = process.env.VIDEO_API_KEY;
    if (!apiKey) throw new Error("VIDEO_API_KEY_not_configured");
    const endpoint = FAL_MODEL_MAP[input.model];
    if (!endpoint) throw new Error(`unknown_model_${input.model}`);

    const toDataUri = async (p: string) => {
      const buf = await fs.readFile(p);
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    };
    const [img1, img2] = await Promise.all([toDataUri(input.photo1Path), toDataUri(input.photo2Path)]);

    const data = await bearerRequest(`https://queue.fal.run/${endpoint}`, apiKey, {
      method: "POST",
      body: JSON.stringify({
        prompt: buildPrompt(input),
        image_url: img1,
        image_url_end: img2, // 首尾帧双人演进(字段名以 fal 文档为准,接入时核对)
        duration: String(input.lengthS),
        aspect_ratio: input.aspect,
        audio: true,
      }),
    });
    const requestId = (data.request_id ?? data.id ?? "") as string;
    if (!requestId) throw new Error("submit_no_job_id");
    // jobId 编码 endpoint 路径,poll 时无需再查映射
    const modelPath = endpoint.replace("https://queue.fal.run/", "");
    return { jobId: `${modelPath}|${requestId}` };
  },
  async poll(jobId) {
    const apiKey = process.env.VIDEO_API_KEY;
    if (!apiKey) return { status: "failed", errorCode: "no_key" };
    const sep = jobId.indexOf("|");
    if (sep === -1) return { status: "failed", errorCode: "bad_job_id" };
    const modelPath = jobId.slice(0, sep);
    const requestId = jobId.slice(sep + 1);
    const base = `https://queue.fal.run/${modelPath}/requests/${requestId}`;

    const data = await bearerRequest(`${base}/status`, apiKey);
    const status = String(data.status ?? "").toUpperCase();
    if (status === "IN_QUEUE" || status === "IN_PROGRESS") return { status: "running" };
    if (status !== "COMPLETED") return { status: "failed", errorCode: `fal_status_${status}` };

    const payload = await bearerRequest(base, apiKey);
    const videoUrl =
      (payload.video as { url?: string } | undefined)?.url ??
      (payload.videos as { url?: string }[] | undefined)?.[0]?.url;
    if (!videoUrl) return { status: "failed", errorCode: "no_output_video" };
    return { status: "succeeded", outputPath: videoUrl };
  },
};


/* ============ 火山引擎 Ark 官方适配器(Seedance 一手渠道,通常最便宜) ============ */

/**
 * Ark API(以火山引擎控制台接入点为准,env 可覆写):
 *   POST {ARK_BASE}/contents/generations/tasks
 *   body: { model, content: [{type:"text",text:prompt},{type:"image_url",image_url:{url}}...] }
 *   → {id}
 *   GET {ARK_BASE}/contents/generations/tasks/{id} → {status, content:{video_url}}
 * 状态:queued/running/succeeded/failed
 */
const ARK_BASE = process.env.ARK_BASE ?? "https://ark.cn-beijing.volces.com/api/v3";
const ARK_MODEL_MAP: Record<string, string> = {
  "seedance-2-0-mini": process.env.ARK_MODEL_MINI ?? "doubao-seedance-1-0-lite-t2v-250428",
  "seedance-2-0-fast": process.env.ARK_MODEL_FAST ?? "doubao-seedance-1-0-lite-t2v-250428",
  "seedance-2-0": process.env.ARK_MODEL_PRO ?? "doubao-seedance-1-0-pro-250528",
  "seedance-2-5": process.env.ARK_MODEL_ULTRA ?? "doubao-seedance-2-0",
};

const arkProvider: VideoProvider = {
  name: "volcengine",
  async submit(input) {
    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) throw new Error("ARK_API_KEY_not_configured");
    const model = ARK_MODEL_MAP[input.model];
    if (!model) throw new Error(`unknown_model_${input.model}`);

    const toDataUri = async (p: string) => {
      const buf = await fs.readFile(p);
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    };
    const [img1, img2] = await Promise.all([toDataUri(input.photo1Path), toDataUri(input.photo2Path)]);

    const data = await bearerRequest(`${ARK_BASE}/contents/generations/tasks`, apiKey, {
      method: "POST",
      body: JSON.stringify({
        model,
        content: [
          { type: "text", text: buildPrompt(input) },
          { type: "image_url", image_url: { url: img1 } },
          { type: "image_url", image_url: { url: img2 } },
        ],
        // 时长/比例/分辨率等参数以 Ark 文档字段为准,接入时核对
      }),
    });
    const taskId = (data.id ?? "") as string;
    if (!taskId) throw new Error("submit_no_task_id");
    return { jobId: taskId };
  },
  async poll(jobId) {
    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) return { status: "failed", errorCode: "no_key" };
    const data = await bearerRequest(`${ARK_BASE}/contents/generations/tasks/${jobId}`, apiKey);
    const status = String(data.status ?? "").toLowerCase();
    if (status === "queued" || status === "running") return { status: "running" };
    if (status !== "succeeded") return { status: "failed", errorCode: `ark_status_${status}` };
    const content = data.content as { video_url?: string } | undefined;
    const videoUrl = content?.video_url;
    if (!videoUrl) return { status: "failed", errorCode: "no_output_video" };
    // 产物落本地媒体目录(统一由 /api/media 提供)
    const local = await downloadToMedia(videoUrl, `${process.cwd()}/.data/media/ark_${jobId}`);
    return { status: "succeeded", outputPath: local };
  },
};


/* ============ Replicate 骨架(接入时补全) ============ */

function createRemoteProvider(
  name: string,
  endpoints: { submit: string; status: string },
): VideoProvider {
  return {
    name,
    async submit(input) {
      const apiKey = process.env.VIDEO_API_KEY;
      if (!apiKey) throw new Error("VIDEO_API_KEY_not_configured");
      const res = await fetch(endpoints.submit, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: input.model,
          prompt: buildPrompt(input),
          image_urls: [input.photo1Path, input.photo2Path],
          duration: input.lengthS,
          resolution: input.resolution,
          aspect_ratio: input.aspect,
          audio: true,
        }),
      });
      if (!res.ok) throw new Error(`submit_failed_${res.status}`);
      const data = (await res.json()) as { id?: string; request_id?: string };
      return { jobId: data.id ?? data.request_id ?? "" };
    },
    async poll(jobId) {
      const apiKey = process.env.VIDEO_API_KEY;
      if (!apiKey) return { status: "failed", errorCode: "no_key" };
      const res = await fetch(endpoints.status.replace("{id}", jobId), {
        headers: { authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) return { status: "failed", errorCode: `poll_failed_${res.status}` };
      const data = (await res.json()) as { status?: string; output?: { url?: string } };
      const status = data.status?.toLowerCase();
      if (status === "succeeded" || status === "completed") {
        return { status: "succeeded", outputPath: data.output?.url };
      }
      if (status === "failed" || status === "error") {
        return { status: "failed", errorCode: "provider_failed" };
      }
      return { status: "running" };
    },
  };
}

const providers: Record<string, VideoProvider> = {
  mock: mockProvider,
  fal: falProvider,
  volcengine: arkProvider,
  replicate: createRemoteProvider("replicate", {
    submit: "https://api.replicate.com/v1/predictions",
    status: "https://api.replicate.com/v1/predictions/{id}",
  }),
};

export function getProvider(): VideoProvider {
  const name = process.env.VIDEO_PROVIDER ?? "mock";
  return providers[name] ?? mockProvider;
}

export { path };
