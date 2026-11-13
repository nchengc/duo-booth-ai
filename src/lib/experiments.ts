/**
 * 实验系统(PRD §16 —— 对标最值钱的一步)
 *
 * 核心规则(全部来自对标实证):
 * - 分组用访客 ID 的哈希,同一个人每次来看到同一版本
 * - 分组在服务器上做;价格等浏览器可伪造的东西,付款时按访客的版本再核一遍
 * - 判定指标用钱:曝光后 windowHours 内该访客付了多少钱(扣手续费) ÷ 曝光人数
 * - 每组凑够 minExposures 前严格平分流量;够了之后 Thompson 采样自动调
 * - 原版永远留 floor(10%) 对照,不会被收掉
 * - 统计窗口从实验开始算,最多 120 天
 */

import { getConfig, listExposures, listEvents, setConfig } from "./store";
import type { LayerConfig } from "./store";
import { netRevenue } from "./analytics";

/** FNV-1a 哈希 → 0..9999 确定性桶 */
function bucket(visitorId: string, layerKey: string): number {
  const str = `${layerKey}:${visitorId}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % 10000;
}

/* ============ Gamma 采样(Marsaglia-Tsang),Thompson 用 ============ */
function sampleGamma(shape: number): number {
  if (shape < 1) {
    return sampleGamma(shape + 1) * Math.random() ** (1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (let i = 0; i < 200; i++) {
    let x: number, v: number;
    do {
      const u1 = Math.random();
      const u2 = Math.random();
      x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      v = (1 + c * x) ** 3;
    } while (v <= 0);
    const u = Math.random();
    if (u < 1 - 0.0331 * x ** 4) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
  return d;
}

export type ArmStat = {
  key: string;
  exposures: number; // 去重后曝光人数
  revenueNet: number; // 窗口内扣费后收入
};

/** 默认实验层种子:对标正在跑的单首四档价(各 25%,固定不自动调) */
export const DEFAULT_PRICING_LAYER: LayerConfig = {
  key: "pricing_single",
  title: "单首四档价 $6.99 / $7.99 / $8.99 / $9.99(对标 10-29 实验)",
  windowHours: 48,
  minExposures: 200,
  autoTune: false, // 对标:固定不自动调,每组满 200 人后定价
  floor: 0.25,
  arms: [
    { key: "baseline", content: {} }, // $9.99(价格表价,原版)
    { key: "p699", content: { priceUsd: 6.99 } },
    { key: "p799", content: { priceUsd: 7.99 } },
    { key: "p899", content: { priceUsd: 8.99 } },
  ],
  createdAt: new Date().toISOString(),
};

/** 取层配置(首次访问自动种默认层) */
export async function getLayer(key: string): Promise<LayerConfig | undefined> {
  let layer = await getConfig(key);
  if (!layer && key === "pricing_single") {
    layer = DEFAULT_PRICING_LAYER;
    await setConfig(key, layer);
  }
  return layer;
}

/** Thompson 权重:每个版本按 Gamma(revNet+1, exp+1) 采样;对照组保底 floor */
function thompsonWeights(layer: LayerConfig, stats: ArmStat[]): number[] {
  const samples = stats.map((s) => sampleGamma(s.revenueNet + 1) / (s.exposures + 1));
  const baselineIdx = stats.findIndex((s) => s.key === "baseline");
  let weights = samples.map((v) => Math.max(v, 1e-6));
  const total = weights.reduce((a, b) => a + b, 0);
  const bi = baselineIdx >= 0 ? baselineIdx : 0;
  const floorShare = layer.floor;
  if (weights[bi] / total < floorShare) {
    // 对照组保底:压缩其他版本,给对照组补足 floor
    const deficit = floorShare * total - weights[bi];
    const othersTotal = total - weights[bi];
    if (othersTotal > 0) {
      weights = weights.map((w, i) => (i === bi ? w + deficit : w * (1 - deficit / othersTotal)));
    }
  }
  return weights;
}

/** 给访客分配版本:哈希桶 → 累计权重映射(同访客稳定;autoTune 时权重 6h 级别漂移) */
export async function assignArm(
  layer: LayerConfig,
  visitorId: string,
): Promise<{ key: string; content: Record<string, unknown> }> {
  const stats = await getLayerStats(layer);
  const totalExposures = stats.reduce((a, s) => a + s.exposures, 0);
  let weights: number[];
  if (layer.autoTune && totalExposures >= layer.minExposures) {
    weights = thompsonWeights(layer, stats);
  } else {
    // 凑够最少人数前严格平分(对标:每组先凑 150-400 人)
    weights = stats.map(() => 1);
  }
  const b = bucket(visitorId, layer.key);
  const total = weights.reduce((a, w) => a + w, 0);
  let acc = 0;
  const point = (b / 10000) * total;
  for (let i = 0; i < stats.length; i++) {
    acc += weights[i];
    if (point < acc) return { key: stats[i].key, content: layer.arms.find((a) => a.key === stats[i].key)?.content ?? {} };
  }
  const last = layer.arms[layer.arms.length - 1];
  return { key: last.key, content: last.content };
}

/** 层统计:每版本去重曝光人数 + 窗口内扣费后收入 */
export async function getLayerStats(layer: LayerConfig): Promise<ArmStat[]> {
  const exposures = await listExposures(layer.key);
  const purchases = await listEvents("purchase");
  const windowMs = layer.windowHours * 3600 * 1000;

  return layer.arms.map((arm) => {
    // 每个访客取该版本最早一次曝光
    const byVisitor = new Map<string, string>();
    for (const e of exposures) {
      if (e.arm !== arm.key) continue;
      const prev = byVisitor.get(e.visitorId);
      if (!prev || e.createdAt < prev) byVisitor.set(e.visitorId, e.createdAt);
    }
    let revenueNet = 0;
    for (const [visitorId, t] of byVisitor) {
      const end = new Date(new Date(t).getTime() + windowMs).toISOString();
      for (const p of purchases) {
        if (p.visitorId !== visitorId) continue;
        if (p.createdAt < t || p.createdAt > end) continue;
        const amount = p.revenue ?? 0;
        const currency = p.currency ?? "USD";
        const country = (p.props?.country as string) ?? "US";
        revenueNet += netRevenue(amount, currency, country);
      }
    }
    return { key: arm.key, exposures: byVisitor.size, revenueNet };
  });
}

/** 服务器定价(PRD §16:价格由服务器定,付款时再核一遍) */
export async function resolvePrice(skuId: string, basePrice: number, visitorId: string): Promise<number> {
  if (skuId !== "pack_single") return basePrice;
  const layer = await getLayer("pricing_single");
  if (!layer) return basePrice;
  const arm = await assignArm(layer, visitorId);
  const price = arm.content.priceUsd;
  return typeof price === "number" && price > 0 ? price : basePrice;
}
