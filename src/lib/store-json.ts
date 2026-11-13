/**
 * 存储层 JSON 实现(开发期默认;由 store.ts 调度器按 STORE_BACKEND 选择)
 * 文件:.data/db.json + 本地媒体目录
 * 表结构对齐 PRD §8 / supabase/schema.sql
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type RenderStatus =
  | "queued"
  | "rendering"
  | "preview_ready"
  | "unlocked"
  | "failed";

export type CreditReason = "signup_bonus" | "purchase" | "render" | "refund_free" | "adjust";

export type User = {
  id: string;
  email: string | null;
  createdAt: string;
  /** 首条免费渲染是否已用掉(PRD §3 步骤 6) */
  freeRenderUsed: boolean;
  /** 首触归因(PRD §15:第一次到达时记录,之后永不覆盖) */
  attribution?: {
    source: string; // referrer 主机 / utm_source / "direct"
    medium?: string; // utm_medium
    campaign?: string; // utm_campaign
    gclid?: string; // 广告点击 ID
    landingPath: string; // 落地页
    country?: string; // 预留
  } | null;
  /** 设备分类(iPhone/Android/Mac/Windows) */
  device?: string;
  /** 机器人/测试标记:不进漏斗分母(PRD §15) */
  isBot?: boolean;
  isTest?: boolean;
};

export type CreditLedgerEntry = {
  id: string;
  userId: string;
  delta: number;
  reason: CreditReason;
  refId: string | null;
  createdAt: string;
};

export type Render = {
  id: string;
  userId: string;
  stage: string;
  model: string;
  resolution: string;
  aspect: string;
  lengthS: number;
  topic: string | null;
  /** 曲风提示(工具页 genreHint,渲染时拼进 prompt) */
  genre: string | null;
  photo1Url: string;
  photo2Url: string;
  status: RenderStatus;
  previewUrl: string | null;
  finalUrl: string | null;
  providerJobId: string | null;
  errorCode: string | null;
  /** 本次渲染消耗的积分(失败时退还) */
  creditsCharged: number;
  /** 是否为免费首条 */
  freePreview: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string;
  stripeSessionId: string | null;
  sku: string;
  credits: number;
  amountUsd: number;
  status: "pending" | "paid" | "refunded";
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  body: string;
  status: "open" | "closed";
  reply?: string;
  createdAt: string;
};

/** 埋点事件(PRD §15:漏斗每步一个事件,服务器上报付款,dedupId 幂等) */
export type TrackEvent = {
  id: string;
  name: string;
  visitorId: string;
  userId?: string;
  revenue?: number;
  currency?: string;
  props?: Record<string, string | number | boolean>;
  isBot: boolean;
  isTest: boolean;
  createdAt: string;
};

/** 实验曝光(每人每天每层每版本一条 —— 去重键见 addExposureUnique) */
export type Exposure = {
  id: string;
  visitorId: string;
  layer: string;
  arm: string;
  createdAt: string;
};

/** 实验层配置(PRD §16) */
export type LayerConfig = {
  key: string;
  title: string;
  /** 归因窗口:曝光后 N 小时内的付款算该版本的钱 */
  windowHours: number;
  /** 判定前最少曝光人数(到齐前严格平分流量) */
  minExposures: number;
  /** 够人数后是否自动调流量(Thompson 采样) */
  autoTune: boolean;
  /** 原版/对照最低流量占比 */
  floor: number;
  arms: { key: string; content: Record<string, unknown> }[];
  createdAt: string;
};

export type DbShape = {
  users: User[];
  creditLedger: CreditLedgerEntry[];
  renders: Render[];
  orders: Order[];
  supportTickets: SupportTicket[];
  events: TrackEvent[];
  exposures: Exposure[];
  /** 实验层配置,键为 layer key */
  config: Record<string, LayerConfig>;
};

/* ============ 路径 ============ */
const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const MEDIA_DIR = path.join(DATA_DIR, "media");

/* ============ 内存缓存(写操作后同步更新,避免频繁读盘) ============ */
let cache: DbShape | null = null;
let writeQueue: Promise<unknown> = Promise.resolve();

function emptyDb(): DbShape {
  return {
    users: [],
    creditLedger: [],
    renders: [],
    orders: [],
    supportTickets: [],
    events: [],
    exposures: [],
    config: {},
  };
}

async function load(): Promise<DbShape> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    cache = { ...emptyDb(), ...(JSON.parse(raw) as DbShape) };
  } catch {
    cache = emptyDb();
  }
  return cache;
}

/** 串行化写盘,避免并发写坏文件 */
async function persist(): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    if (!cache) return;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(cache, null, 2), "utf-8");
  });
  await writeQueue;
}

/* ============ 用户 ============ */
export async function getUser(userId: string): Promise<User | undefined> {
  const db = await load();
  return db.users.find((u) => u.id === userId);
}

export async function getOrCreateUser(userId: string, email: string | null = null): Promise<User> {
  const db = await load();
  const existing = db.users.find((u) => u.id === userId);
  if (existing) return existing;
  const user: User = {
    id: userId,
    email,
    createdAt: new Date().toISOString(),
    freeRenderUsed: false,
  };
  db.users.push(user);
  // 注册赠送 10 积分(够跑 1 首标准歌曲,便于立即体验)
  db.creditLedger.push({
    id: randomUUID(),
    userId,
    delta: 10,
    reason: "signup_bonus",
    refId: null,
    createdAt: new Date().toISOString(),
  });
  await persist();
  userCreatedHook?.(userId); // signup 事件(注册埋点)
  return user;
}

export async function updateUser(userId: string, patch: Partial<User>): Promise<User | undefined> {
  const db = await load();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return undefined;
  Object.assign(user, patch);
  await persist();
  return user;
}

/* ============ 积分 ============ */
export async function creditBalance(userId: string): Promise<number> {
  const db = await load();
  return db.creditLedger
    .filter((e) => e.userId === userId)
    .reduce((sum, e) => sum + e.delta, 0);
}

export async function addCredit(
  userId: string,
  delta: number,
  reason: CreditReason,
  refId: string | null = null,
): Promise<CreditLedgerEntry> {
  const db = await load();
  const entry: CreditLedgerEntry = {
    id: randomUUID(),
    userId,
    delta,
    reason,
    refId,
    createdAt: new Date().toISOString(),
  };
  db.creditLedger.push(entry);
  await persist();
  return entry;
}

/* ============ 渲染任务 ============ */
export async function createRender(r: Omit<Render, "id" | "createdAt" | "updatedAt">): Promise<Render> {
  const db = await load();
  const now = new Date().toISOString();
  const render: Render = { ...r, id: randomUUID(), createdAt: now, updatedAt: now };
  db.renders.push(render);
  await persist();
  return render;
}

export async function getRender(id: string): Promise<Render | undefined> {
  const db = await load();
  return db.renders.find((r) => r.id === id);
}

export async function updateRender(id: string, patch: Partial<Render>): Promise<Render | undefined> {
  const db = await load();
  const render = db.renders.find((r) => r.id === id);
  if (!render) return undefined;
  Object.assign(render, patch, { updatedAt: new Date().toISOString() });
  await persist();
  return render;
}

export async function listRenders(userId: string, limit = 50): Promise<Render[]> {
  const db = await load();
  return db.renders
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/* ============ 订单 ============ */
export async function createOrder(o: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const db = await load();
  const order: Order = { ...o, id: randomUUID(), createdAt: new Date().toISOString() };
  db.orders.push(order);
  await persist();
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const db = await load();
  return db.orders.find((o) => o.id === id);
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  const db = await load();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return undefined;
  Object.assign(order, patch);
  await persist();
  return order;
}

export async function listOrders(userId: string): Promise<Order[]> {
  const db = await load();
  return db.orders.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ============ 工单 ============ */
export async function createTicket(t: Omit<SupportTicket, "id" | "createdAt" | "status">): Promise<SupportTicket> {
  const db = await load();
  const ticket: SupportTicket = {
    ...t,
    id: randomUUID(),
    status: "open",
    createdAt: new Date().toISOString(),
  };
  db.supportTickets.push(ticket);
  await persist();
  return ticket;
}

export async function updateTicket(id: string, patch: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
  const db = await load();
  const ticket = db.supportTickets.find((t) => t.id === id);
  if (!ticket) return undefined;
  Object.assign(ticket, patch);
  await persist();
  return ticket;
}

export async function listTickets(userId: string): Promise<SupportTicket[]> {
  const db = await load();
  return db.supportTickets.filter((t) => t.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listUsers(): Promise<User[]> {
  const db = await load();
  return db.users;
}

/* ============ 埋点(PRD §15) ============ */

/** 用户首次创建时的钩子:analytics 层注册,用于上报 signup */
let userCreatedHook: ((userId: string) => void) | null = null;
export function onUserCreated(fn: (userId: string) => void): void {
  userCreatedHook = fn;
}

export async function updateAttribution(
  userId: string,
  attribution: NonNullable<User["attribution"]>,
  device: string,
  isBot: boolean,
  isTest: boolean,
): Promise<{ created: boolean }> {
  const db = await load();
  let user = db.users.find((u) => u.id === userId);
  let created = false;
  if (!user) {
    // 统一走 getOrCreateUser:注册赠送 + signup 事件只发一次
    // (两条创建路径会分叉 —— 到达先建用户会让 bonus 永远发不出)
    user = await getOrCreateUser(userId);
    created = true;
  }
  // 首触归因永不覆盖(PRD §15:按第一次来源算渠道功劳)
  if (!user.attribution) {
    user.attribution = attribution;
    user.device = user.device || device;
    user.isBot = user.isBot || isBot;
    user.isTest = user.isTest || isTest;
    await persist();
  }
  return { created };
}

export async function addEvent(event: TrackEvent): Promise<void> {
  const db = await load();
  db.events.push(event);
  await persist();
}

export async function addEventUnique(event: TrackEvent): Promise<boolean> {
  const db = await load();
  if (db.events.some((e) => e.id === event.id)) return false;
  db.events.push(event);
  await persist();
  return true;
}

export async function listEvents(name?: string, sinceIso?: string): Promise<TrackEvent[]> {
  const db = await load();
  return db.events.filter(
    (e) => (!name || e.name === name) && (!sinceIso || e.createdAt >= sinceIso),
  );
}

export async function addExposureUnique(
  visitorId: string,
  layer: string,
  arm: string,
): Promise<boolean> {
  const db = await load();
  const day = new Date().toISOString().slice(0, 10);
  const dedup = `${visitorId}|${layer}|${arm}|${day}`;
  if (db.exposures.some((e) => e.id === dedup)) return false;
  db.exposures.push({
    id: dedup,
    visitorId,
    layer,
    arm,
    createdAt: new Date().toISOString(),
  });
  await persist();
  return true;
}

export async function listExposures(layer?: string): Promise<Exposure[]> {
  const db = await load();
  return db.exposures.filter((e) => !layer || e.layer === layer);
}

/* ============ 实验配置(PRD §16) ============ */

export async function getConfig(key: string): Promise<LayerConfig | undefined> {
  const db = await load();
  return db.config[key];
}

export async function setConfig(key: string, layer: LayerConfig): Promise<void> {
  const db = await load();
  db.config[key] = layer;
  await persist();
}

/** 测试辅助:重置数据库 */
export async function resetDb(): Promise<void> {
  cache = emptyDb();
  await persist();
}
