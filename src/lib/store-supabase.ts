/**
 * 存储层 Supabase 实现(PRD §8 生产切换;经 PostgREST,无需额外 SDK)
 * 依赖 env:SUPABASE_URL + SUPABASE_SERVICE_KEY(仅服务端使用,绕过 RLS)
 * 表结构见 supabase/schema.sql;接口与 store-json.ts 完全一致(store.ts 调度器选择)
 */

import { MEDIA_DIR as JSON_MEDIA_DIR } from "./store-json";
import type {
  User, CreditLedgerEntry, Render, Order, SupportTicket, TrackEvent,
  Exposure, LayerConfig, CreditReason,
} from "./store-json";

export const MEDIA_DIR = JSON_MEDIA_DIR;

const URL_ = process.env.SUPABASE_URL ?? "";
const KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

export const supaActive = process.env.STORE_BACKEND === "supabase" && Boolean(URL_) && Boolean(KEY);

if (process.env.STORE_BACKEND === "supabase" && !supaActive) {
  console.warn("[store] STORE_BACKEND=supabase 但 SUPABASE_URL/SUPABASE_SERVICE_KEY 未配置,将无法读写");
}

/* ============ PostgREST 薄封装 ============ */

const REST_HEADERS = {
  apikey: KEY,
  authorization: `Bearer ${KEY}`,
  "content-type": "application/json",
};

async function restSelect(table: string, search: string): Promise<Record<string, unknown>[]> {
  const res = await fetch(`${URL_}/rest/v1/${table}?${search}`, {
    headers: { ...REST_HEADERS, accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`supabase_select_${res.status}_${table}`);
  return (await res.json()) as Record<string, unknown>[];
}

async function restInsert(table: string, body: unknown, upsert = false): Promise<void> {
  const res = await fetch(`${URL_}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...REST_HEADERS,
      prefer: upsert ? "resolution=merge-duplicates,return=minimal" : "return=minimal",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok && !(upsert && res.status === 409)) {
    throw new Error(`supabase_insert_${res.status}_${table}`);
  }
}

async function restUpdate(table: string, search: string, body: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${URL_}/rest/v1/${table}?${search}`, {
    method: "PATCH",
    headers: { ...REST_HEADERS, prefer: "return=minimal" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`supabase_update_${res.status}_${table}`);
}

const now = () => new Date().toISOString();

/* ============ 行映射(users 的归因字段在表中拍平) ============ */

type UserRow = Record<string, unknown>;

function toUser(row: UserRow): User {
  return {
    id: row.id as string,
    email: (row.email as string | null) ?? null,
    createdAt: row.created_at as string,
    freeRenderUsed: Boolean(row.free_render_used),
    attribution: row.attribution_source
      ? {
          source: row.attribution_source as string,
          medium: (row.attribution_medium as string) ?? undefined,
          campaign: (row.attribution_campaign as string) ?? undefined,
          gclid: (row.attribution_gclid as string) ?? undefined,
          landingPath: (row.attribution_landing as string) ?? "/",
        }
      : null,
    device: (row.device as string) ?? undefined,
    isBot: Boolean(row.is_bot),
    isTest: Boolean(row.is_test),
  };
}

function fromUserPatch(patch: Partial<User>): UserRow {
  const row: UserRow = {};
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.freeRenderUsed !== undefined) row.free_render_used = patch.freeRenderUsed;
  if (patch.attribution !== undefined) {
    row.attribution_source = patch.attribution?.source ?? null;
    row.attribution_medium = patch.attribution?.medium ?? null;
    row.attribution_campaign = patch.attribution?.campaign ?? null;
    row.attribution_gclid = patch.attribution?.gclid ?? null;
    row.attribution_landing = patch.attribution?.landingPath ?? null;
  }
  if (patch.device !== undefined) row.device = patch.device;
  if (patch.isBot !== undefined) row.is_bot = patch.isBot;
  if (patch.isTest !== undefined) row.is_test = patch.isTest;
  return row;
}

/* ============ 用户 ============ */

let userCreatedHook: ((userId: string) => void) | null = null;
export function onUserCreated(fn: (userId: string) => void): void {
  userCreatedHook = fn;
}

export async function getUser(userId: string): Promise<User | undefined> {
  const rows = await restSelect("users", `id=eq.${userId}&limit=1`);
  return rows.length ? toUser(rows[0]) : undefined;
}

export async function getOrCreateUser(userId: string, email: string | null = null): Promise<User> {
  const existing = await getUser(userId);
  if (existing) return existing;
  const user: User = {
    id: userId,
    email,
    createdAt: now(),
    freeRenderUsed: false,
  };
  await restInsert("users", { ...fromUserPatch(user), id: userId, created_at: user.createdAt });
  // 注册赠送 10 积分
  await restInsert("credit_ledger", {
    id: crypto.randomUUID(), user_id: userId, delta: 10,
    reason: "signup_bonus", created_at: now(),
  });
  userCreatedHook?.(userId);
  return user;
}

export async function updateUser(userId: string, patch: Partial<User>): Promise<User | undefined> {
  await restUpdate("users", `id=eq.${userId}`, fromUserPatch(patch));
  return getUser(userId);
}

export async function listUsers(): Promise<User[]> {
  const rows = await restSelect("users", "select=*&order=created_at.desc&limit=10000");
  return rows.map(toUser);
}

export async function updateAttribution(
  userId: string,
  attribution: NonNullable<User["attribution"]>,
  device: string,
  isBot: boolean,
  isTest: boolean,
): Promise<{ created: boolean }> {
  const existing = await getUser(userId);
  if (!existing) {
    await getOrCreateUser(userId); // 统一创建路径:赠送 + signup 事件
    await restUpdate("users", `id=eq.${userId}`, fromUserPatch({ attribution, device, isBot, isTest }));
    return { created: true };
  }
  if (!existing.attribution) {
    await restUpdate("users", `id=eq.${userId}`, fromUserPatch({ attribution, device, isBot, isTest }));
  }
  return { created: false };
}

/* ============ 积分 ============ */

export async function creditBalance(userId: string): Promise<number> {
  const rows = await restSelect("credit_ledger", `user_id=eq.${userId}&select=delta`);
  return rows.reduce((sum, r) => sum + (r.delta as number), 0);
}

export async function addCredit(userId: string, delta: number, reason: CreditReason, refId: string | null = null): Promise<CreditLedgerEntry> {
  const entry: CreditLedgerEntry = {
    id: crypto.randomUUID(), userId, delta, reason, refId, createdAt: now(),
  };
  await restInsert("credit_ledger", {
    id: entry.id, user_id: userId, delta, reason, ref_id: refId, created_at: entry.createdAt,
  });
  return entry;
}

/* ============ 渲染 ============ */

function toRender(row: Record<string, unknown>): Render {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    stage: row.stage as string,
    model: row.model as string,
    resolution: row.resolution as string,
    aspect: row.aspect as string,
    lengthS: row.length_s as number,
    topic: (row.topic as string | null) ?? null,
    genre: (row.genre as string | null) ?? null,
    photo1Url: row.photo1_url as string,
    photo2Url: row.photo2_url as string,
    status: row.status as Render["status"],
    previewUrl: (row.preview_url as string | null) ?? null,
    finalUrl: (row.final_url as string | null) ?? null,
    providerJobId: (row.provider_job_id as string | null) ?? null,
    errorCode: (row.error_code as string | null) ?? null,
    creditsCharged: row.credits_charged as number,
    freePreview: Boolean(row.free_preview),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function createRender(r: Omit<Render, "id" | "createdAt" | "updatedAt">): Promise<Render> {
  const nowIso = now();
  const id = crypto.randomUUID();
  const row = {
    id,
    user_id: r.userId, stage: r.stage, model: r.model, resolution: r.resolution,
    aspect: r.aspect, length_s: r.lengthS, topic: r.topic, genre: r.genre,
    photo1_url: r.photo1Url, photo2_url: r.photo2Url, status: r.status,
    preview_url: null, final_url: null, provider_job_id: null, error_code: null,
    credits_charged: r.creditsCharged, free_preview: r.freePreview,
    created_at: nowIso, updated_at: nowIso,
  };
  await restInsert("renders", row);
  return { ...r, id, createdAt: nowIso, updatedAt: nowIso } as Render;
}

export async function getRender(id: string): Promise<Render | undefined> {
  const rows = await restSelect("renders", `id=eq.${id}&limit=1`);
  return rows.length ? toRender(rows[0]) : undefined;
}

export async function updateRender(id: string, patch: Partial<Render>): Promise<Render | undefined> {
  const row: Record<string, unknown> = { updated_at: now() };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.previewUrl !== undefined) row.preview_url = patch.previewUrl;
  if (patch.finalUrl !== undefined) row.final_url = patch.finalUrl;
  if (patch.providerJobId !== undefined) row.provider_job_id = patch.providerJobId;
  if (patch.errorCode !== undefined) row.error_code = patch.errorCode;
  if (patch.creditsCharged !== undefined) row.credits_charged = patch.creditsCharged;
  await restUpdate("renders", `id=eq.${id}`, row);
  return getRender(id);
}

export async function listRenders(userId: string, limit = 50): Promise<Render[]> {
  const rows = await restSelect("renders", `user_id=eq.${userId}&order=created_at.desc&limit=${limit}`);
  return rows.map(toRender);
}

/* ============ 订单 ============ */

function toOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    stripeSessionId: (row.stripe_session_id as string | null) ?? null,
    sku: row.sku as string,
    credits: row.credits as number,
    amountUsd: Number(row.amount_usd),
    status: row.status as Order["status"],
    createdAt: row.created_at as string,
  };
}

export async function createOrder(o: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const id = crypto.randomUUID();
  const createdAt = now();
  await restInsert("orders", {
    id, user_id: o.userId, stripe_session_id: o.stripeSessionId, sku: o.sku,
    credits: o.credits, amount_usd: o.amountUsd, status: o.status, created_at: createdAt,
  });
  return { ...o, id, createdAt };
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const rows = await restSelect("orders", `id=eq.${id}&limit=1`);
  return rows.length ? toOrder(rows[0]) : undefined;
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.stripeSessionId !== undefined) row.stripe_session_id = patch.stripeSessionId;
  await restUpdate("orders", `id=eq.${id}`, row);
  return getOrder(id);
}

export async function listOrders(userId: string): Promise<Order[]> {
  const rows = await restSelect("orders", `user_id=eq.${userId}&order=created_at.desc`);
  return rows.map(toOrder);
}

/* ============ 工单 ============ */

export async function createTicket(t: Omit<SupportTicket, "id" | "createdAt" | "status">): Promise<SupportTicket> {
  const id = crypto.randomUUID();
  const createdAt = now();
  await restInsert("support_tickets", {
    id, user_id: t.userId, subject: t.subject, body: t.body, status: "open", created_at: createdAt,
  });
  return { ...t, id, status: "open", createdAt };
}

export async function updateTicket(id: string, patch: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.reply !== undefined) row.reply = patch.reply;
  await restUpdate("support_tickets", `id=eq.${id}`, row);
  const rows = await restSelect("support_tickets", `id=eq.${id}&limit=1`);
  return rows.length
    ? { ...(rows[0] as unknown as SupportTicket), id: rows[0].id as string }
    : undefined;
}

export async function listTickets(userId: string): Promise<SupportTicket[]> {
  const rows = await restSelect("support_tickets", `user_id=eq.${userId}&order=created_at.desc`);
  return rows.map((row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    subject: row.subject as string,
    body: row.body as string,
    status: row.status as SupportTicket["status"],
    createdAt: row.created_at as string,
  }));
}

/* ============ 埋点(幂等靠主键 id;冲突即忽略) ============ */

export async function addEvent(event: TrackEvent): Promise<void> {
  await restInsert("events", {
    id: event.id, name: event.name, visitor_id: event.visitorId, user_id: event.userId,
    revenue: event.revenue, currency: event.currency, props: event.props ?? {},
    is_bot: event.isBot, is_test: event.isTest, created_at: event.createdAt,
  });
}

export async function addEventUnique(event: TrackEvent): Promise<boolean> {
  try {
    await restInsert("events", {
      id: event.id, name: event.name, visitor_id: event.visitorId, user_id: event.userId,
      revenue: event.revenue, currency: event.currency, props: event.props ?? {},
      is_bot: event.isBot, is_test: event.isTest, created_at: event.createdAt,
    });
    return true;
  } catch (e) {
    if (String(e).includes("supabase_insert_409")) return false; // 主键冲突 = 重复事件
    throw e;
  }
}

export async function listEvents(name?: string, sinceIso?: string): Promise<TrackEvent[]> {
  const q = new URLSearchParams({ order: "created_at.desc", limit: "10000" });
  if (name) q.set("name", `eq.${name}`);
  if (sinceIso) q.set("created_at", `gte.${sinceIso}`);
  const rows = await restSelect("events", q.toString());
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    visitorId: row.visitor_id as string,
    userId: (row.user_id as string | null) ?? undefined,
    revenue: (row.revenue as number | null) ?? undefined,
    currency: (row.currency as string | null) ?? undefined,
    props: (row.props as TrackEvent["props"]) ?? undefined,
    isBot: Boolean(row.is_bot),
    isTest: Boolean(row.is_test),
    createdAt: row.created_at as string,
  }));
}

export async function addExposureUnique(visitorId: string, layer: string, arm: string): Promise<boolean> {
  const day = now().slice(0, 10);
  const id = `${visitorId}|${layer}|${arm}|${day}`;
  try {
    await restInsert("exposures", { id, visitor_id: visitorId, layer, arm, created_at: now() });
    return true;
  } catch (e) {
    if (String(e).includes("supabase_insert_409")) return false;
    throw e;
  }
}

export async function listExposures(layer?: string): Promise<Exposure[]> {
  const q = new URLSearchParams(layer ? { layer: `eq.${layer}`, limit: "10000" } : { limit: "10000" });
  const rows = await restSelect("exposures", q.toString());
  return rows.map((row) => ({
    id: row.id as string,
    visitorId: row.visitor_id as string,
    layer: row.layer as string,
    arm: row.arm as string,
    createdAt: row.created_at as string,
  }));
}

/* ============ 实验配置 ============ */

export async function getConfig(key: string): Promise<LayerConfig | undefined> {
  const rows = await restSelect("experiment_config", `key=eq.${key}&limit=1`);
  return rows.length ? (rows[0].config as LayerConfig) : undefined;
}

export async function setConfig(key: string, layer: LayerConfig): Promise<void> {
  await restInsert("experiment_config", { key, config: layer, updated_at: now() }, true);
}

/* ============ 不适用于 Supabase 后端的开发辅助 ============ */

export async function resetDb(): Promise<void> {
  console.warn("[store] resetDb 仅支持 JSON 后端,Supabase 后端已忽略");
}
