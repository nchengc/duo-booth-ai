import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { EVT, looksLikeBot, parseDevice, isTestRequest, trackServer } from "@/lib/analytics";
import { updateAttribution } from "@/lib/store";

/**
 * 到达/页面加载上报(客户端 Analytics 组件每次页面挂载调用一次)
 * 首触归因:referrer/utm/gclid/落地页,只记第一次,永不覆盖(PRD §15)
 */
export async function POST(req: Request) {
  const visitorId = await currentUserId();
  const ua = req.headers.get("user-agent");
  const isBot = looksLikeBot(ua);
  const isTest = isTestRequest(req.headers);
  const device = parseDevice(ua);

  const body = (await req.json().catch(() => null)) as
    | {
        path?: string;
        referrer?: string;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        gclid?: string;
      }
    | null;

  const landingPath = (body?.path ?? "/").slice(0, 200);
  let source = body?.utm_source || "direct";
  if (body?.gclid) source = body.utm_source || "google_ads";
  else if (!body?.utm_source && body?.referrer) {
    try {
      const host = new URL(body.referrer).hostname;
      // 常见 AI 助手来源单列(对标:ChatGPT 来源转化率最高)
      source = /chat\.openai\.com|chatgpt\.com|perplexity\.ai|gemini\.google\.com|claude\.ai/i.test(host)
        ? "ai_assistant"
        : host || "direct";
    } catch {
      source = "direct";
    }
  }

  const attribution = {
    source,
    medium: body?.utm_medium,
    campaign: body?.utm_campaign,
    gclid: body?.gclid,
    landingPath,
  };

  const { created } = await updateAttribution(visitorId, attribution, device, isBot, isTest);

  await trackServer({
    name: EVT.pageLoad,
    visitorId,
    props: { path: landingPath, device, source },
    isBot,
    isTest,
  });
  if (created) {
    await trackServer({
      name: EVT.arrive,
      visitorId,
      props: { landing: landingPath, device, source, utm_campaign: body?.utm_campaign ?? "" },
      isBot,
      isTest,
    });
  }

  return NextResponse.json({ ok: true });
}
