"use client";

import { useEffect } from "react";

/**
 * 埋点客户端组件(PRD §15)
 * 挂在根 layout:每次页面挂载上报 page_load,首访时记录首触归因
 * 到达(服务器收到请求)与页面加载(真浏览器渲染)分开,机器人进不了分母
 */
export default function Analytics() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = {
      path: window.location.pathname,
      referrer: document.referrer || "",
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      gclid: params.get("gclid") ?? "",
    };
    fetch("/api/track/arrival", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}

/** 客户端漏斗埋点(中间步骤):发后即忘,失败不影响 UI */
export function trackClient(name: string, props?: Record<string, string | number | boolean>) {
  fetch("/api/track/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, props }),
    keepalive: true,
  }).catch(() => {});
}
