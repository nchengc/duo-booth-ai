/**
 * 存储层调度器(应用统一从这里 import)
 * STORE_BACKEND=json(默认,开发)| supabase(生产;需 SUPABASE_URL + SUPABASE_SERVICE_KEY)
 * 两个后端接口完全一致 —— DEPLOY.md 的生产切换只动环境变量
 */

import * as jsonImpl from "./store-json";
import * as supaImpl from "./store-supabase";

const supaActive =
  process.env.STORE_BACKEND === "supabase" &&
  Boolean(process.env.SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_KEY);

const impl: typeof jsonImpl = supaActive ? (supaImpl as unknown as typeof jsonImpl) : jsonImpl;

if (typeof window === "undefined") {
  console.log(`[store] backend = ${supaActive ? "supabase" : "json"}`);
}

/* ============ 类型再导出(应用侧 import 路径不变) ============ */
export type {
  User,
  CreditLedgerEntry,
  Render,
  Order,
  SupportTicket,
  TrackEvent,
  Exposure,
  LayerConfig,
  DbShape,
  RenderStatus,
  CreditReason,
} from "./store-json";

export const MEDIA_DIR = jsonImpl.MEDIA_DIR;

/* ============ 函数绑定到当前后端 ============ */
export const getUser = impl.getUser;
export const getOrCreateUser = impl.getOrCreateUser;
export const updateUser = impl.updateUser;
export const listUsers = impl.listUsers;
export const updateAttribution = impl.updateAttribution;
export const creditBalance = impl.creditBalance;
export const addCredit = impl.addCredit;
export const addEvent = impl.addEvent;
export const addEventUnique = impl.addEventUnique;
export const listEvents = impl.listEvents;
export const addExposureUnique = impl.addExposureUnique;
export const listExposures = impl.listExposures;
export const getConfig = impl.getConfig;
export const setConfig = impl.setConfig;
export const createRender = impl.createRender;
export const getRender = impl.getRender;
export const updateRender = impl.updateRender;
export const listRenders = impl.listRenders;
export const createOrder = impl.createOrder;
export const getOrder = impl.getOrder;
export const updateOrder = impl.updateOrder;
export const listOrders = impl.listOrders;
export const createTicket = impl.createTicket;
export const updateTicket = impl.updateTicket;
export const listTickets = impl.listTickets;

/** 注册 signup 钩子:两个后端都注册(analytics 的 signup 事件在任一后端创建用户时触发) */
export function onUserCreated(fn: (userId: string) => void): void {
  jsonImpl.onUserCreated(fn);
  supaImpl.onUserCreated?.(fn);
}

/** 测试辅助:仅 JSON 后端支持 */
export async function resetDb(): Promise<void> {
  return impl.resetDb();
}
