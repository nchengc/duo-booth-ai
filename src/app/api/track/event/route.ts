import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { EVT, looksLikeBot, isTestRequest, trackServer } from "@/lib/analytics";
import { addExposureUnique } from "@/lib/store";

/**
 * 客户端埋点上报(漏斗中间步骤 + 实验曝光确认)
 * 允许列表:只收白名单事件名,其余丢弃
 */

const CLIENT_EVENTS = new Set<string>([
  EVT.uploadPhotos,
  EVT.clickGenerate,
  EVT.viewPaywall,
  EVT.clickBuy,
  EVT.download,
  "name_tap",
]);

export async function POST(req: Request) {
  const visitorId = await currentUserId();
  const isBot = looksLikeBot(req.headers.get("user-agent"));
  const isTest = isTestRequest(req.headers);

  const body = (await req.json().catch(() => null)) as
    | { name?: string; props?: Record<string, string | number | boolean> }
    | null;
  const name = body?.name ?? "";

  // 实验曝光确认:客户端真正看到版本时上报(双写:自家曝光表 + PVUV,按人/天/层/版本去重)
  if (name === EVT.exposure) {
    const layer = body?.props?.layer;
    const arm = body?.props?.arm;
    if (typeof layer !== "string" || typeof arm !== "string") {
      return NextResponse.json({ ok: false, code: "missing_layer" }, { status: 400 });
    }
    await addExposureUnique(visitorId, layer, arm);
    await trackServer({
      name: EVT.exposure,
      visitorId,
      dedupId: `exp-${visitorId}-${layer}-${arm}-${new Date().toISOString().slice(0, 10)}`,
      props: { experiment: layer, variant: arm },
      isBot,
      isTest,
    });
    return NextResponse.json({ ok: true });
  }

  if (!CLIENT_EVENTS.has(name)) {
    return NextResponse.json({ ok: false, code: "unknown_event" }, { status: 400 });
  }

  await trackServer({
    name,
    visitorId,
    props: body?.props,
    isBot,
    isTest,
  });

  return NextResponse.json({ ok: true });
}
