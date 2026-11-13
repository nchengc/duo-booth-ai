import { NextResponse } from "next/server";
import { requireAdmin } from "../_auth";
import { getConfig, setConfig, listExposures } from "@/lib/store";
import { getLayer, getLayerStats, DEFAULT_PRICING_LAYER, assignArm } from "@/lib/experiments";
import { netRevenue, trackServer } from "@/lib/analytics";
import { listEvents } from "@/lib/store";

/**
 * 实验管理(PRD §16 —— AI 自助工具,对标 §2)
 * GET:所有层的分组结果(曝光人数 / 扣费后每人收入 / 胜出概率)
 * POST:新增或修改层配置( thin wrapper,不开放裸 SQL)
 */

/** 胜出概率:Gamma 采样蒙特卡洛(样本小时会反复,不是"确定赢了") */
function winProbability(stats: { revenueNet: number; exposures: number }[], draws = 1000): number[] {
  const samples = stats.map(() => ({ wins: 0 }));
  for (let d = 0; d < draws; d++) {
    const rates = stats.map((s) => {
      // Gamma(revNet+1, exp+1) 的均值估计
      const shape = s.revenueNet + 1;
      const rate = s.exposures + 1;
      // 简化:用均值 + 噪声近似 Gamma 采样
      const mean = shape / rate;
      const noise = Math.sqrt(Math.max(shape, 1)) / rate;
      return Math.max(0, mean + noise * (Math.random() * 2 - 1) * 2);
    });
    const best = rates.indexOf(Math.max(...rates));
    samples[best].wins++;
  }
  return samples.map((s) => Math.round((s.wins / draws) * 1000) / 1000);
}

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const layer = await getLayer("pricing_single");
  if (!layer) return NextResponse.json({ ok: true, layers: [] });

  const stats = await getLayerStats(layer);
  const winProb = winProbability(stats);

  // 判定进度:统计窗口从实验开始算,最多 120 天(PRD §16)
  const ageDays = Math.floor((Date.now() - new Date(layer.createdAt).getTime()) / 86400_000);
  const exposures = await listExposures(layer.key);

  return NextResponse.json({
    ok: true,
    layers: [
      {
        key: layer.key,
        title: layer.title,
        windowHours: layer.windowHours,
        minExposures: layer.minExposures,
        autoTune: layer.autoTune,
        floor: layer.floor,
        ageDays,
        ready: stats.reduce((a, s) => a + s.exposures, 0) >= layer.minExposures,
        arms: stats.map((s, i) => ({
          key: s.key,
          exposures: s.exposures,
          revenueNet: Math.round(s.revenueNet * 100) / 100,
          revenuePerVisitor: s.exposures > 0 ? Math.round((s.revenueNet / s.exposures) * 1000) / 1000 : 0,
          winProbability: winProb[i],
        })),
        exposureEventCount: exposures.length,
      },
    ],
  });
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as
    | { key?: string; title?: string; windowHours?: number; minExposures?: number; autoTune?: boolean; floor?: number; arms?: { key: string; content: Record<string, unknown> }[] }
    | null;

  if (!body?.key || !Array.isArray(body.arms) || body.arms.length < 2) {
    return NextResponse.json({ ok: false, code: "invalid_layer" }, { status: 400 });
  }
  const existing = await getConfig(body.key);
  const layer = {
    key: body.key,
    title: body.title ?? existing?.title ?? body.key,
    windowHours: body.windowHours ?? existing?.windowHours ?? 48,
    minExposures: body.minExposures ?? existing?.minExposures ?? 200,
    autoTune: body.autoTune ?? existing?.autoTune ?? false,
    floor: body.floor ?? existing?.floor ?? 0.1,
    arms: body.arms,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await setConfig(body.key, layer);

  await trackServer({
    name: "experiment_updated",
    visitorId: "admin",
    props: { layer: body.key, arms: body.arms.map((a) => a.key).join(",") },
    isTest: true,
  });

  return NextResponse.json({ ok: true, layer });
}
