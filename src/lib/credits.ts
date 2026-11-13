/**
 * 积分表(PRD §4.1:与对标逐格一致)
 * 每 12 秒视频所需积分;时长按比例缩放;画面比例不影响价格
 */

export type ModelId = "seedance-2-0-mini" | "seedance-2-0-fast" | "seedance-2-0" | "seedance-2-5";

export type ModelRow = {
  id: ModelId;
  /** 标签词典 key 对应 i18n.home.models 下标 */
  tierIndex: 0 | 1 | 2 | 3;
  /** API 供应商标识(Step 6 接入用) */
  apiName: string;
  credits: { "480p": number; "720p": number; "1080p": number | null };
};

export const MODELS: ModelRow[] = [
  { id: "seedance-2-0-mini", tierIndex: 0, apiName: "seedance-2.0-mini", credits: { "480p": 5, "720p": 10, "1080p": null } },
  { id: "seedance-2-0-fast", tierIndex: 1, apiName: "seedance-2.0-fast", credits: { "480p": 8, "720p": 17, "1080p": null } },
  { id: "seedance-2-0", tierIndex: 2, apiName: "seedance-2.0", credits: { "480p": 10, "720p": 20, "1080p": 50 } },
  { id: "seedance-2-5", tierIndex: 3, apiName: "seedance-2.5", credits: { "480p": 17, "720p": 37, "1080p": 93 } },
];

export const RESOLUTIONS = ["480p", "720p", "1080p"] as const;
export type Resolution = (typeof RESOLUTIONS)[number];

export const ASPECTS = ["9:16", "1:1", "16:9"] as const;
export type Aspect = (typeof ASPECTS)[number];

/** 模型支持的最长秒数(标准/快速/专业 15s,旗舰 30s —— PRD §3) */
export function maxSeconds(model: ModelId): number {
  return model === "seedance-2-5" ? 30 : 15;
}

/** 积分 = 档位基准分 × (时长 / 12),向上取整(PRD:时长按比例缩放) */
export function creditsFor(model: ModelId, resolution: Resolution, seconds: number): number | null {
  const row = MODELS.find((m) => m.id === model);
  if (!row) return null;
  const base = row.credits[resolution];
  if (base === null) return null;
  return Math.ceil((base * seconds) / 12);
}
