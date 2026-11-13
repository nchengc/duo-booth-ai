-- ============================================================
-- Duo Booth AI 生产数据库 Schema(PRD §8,Supabase/Postgres)
-- 切换步骤:在 Supabase SQL Editor 执行本文件 → 设 STORE_BACKEND=supabase
--           + SUPABASE_URL + SUPABASE_SERVICE_KEY → store.ts 接口不变
-- 注意:events 表增长最快,建议按月分区或定期归档
-- ============================================================

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamptz not null default now(),
  free_render_used boolean not null default false,
  attribution_source text,
  attribution_medium text,
  attribution_campaign text,
  attribution_gclid text,
  attribution_landing text,
  device text,
  is_bot boolean not null default false,
  is_test boolean not null default false
);

create table if not exists credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  delta int not null,
  reason text not null check (reason in ('signup_bonus','purchase','render','refund_free','adjust')),
  ref_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists idx_ledger_user on credit_ledger(user_id, created_at);

create table if not exists renders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  stage text not null,
  model text not null,
  resolution text not null,
  aspect text not null,
  length_s int not null,
  topic text,
  genre text,
  photo1_url text not null,
  photo2_url text not null,
  status text not null check (status in ('queued','rendering','preview_ready','unlocked','failed')),
  preview_url text,
  final_url text,
  provider_job_id text,
  error_code text,
  credits_charged int not null default 0,
  free_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_renders_user on renders(user_id, created_at desc);
create index if not exists idx_renders_status on renders(status, updated_at);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  stripe_session_id text,
  sku text not null,
  credits int not null,
  amount_usd numeric(10,2) not null,
  status text not null check (status in ('pending','paid','refunded')),
  created_at timestamptz not null default now()
);
create index if not exists idx_orders_user on orders(user_id, created_at desc);
create unique index if not exists idx_orders_session on orders(stripe_session_id) where stripe_session_id is not null;

create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  subject text not null,
  body text not null,
  status text not null default 'open' check (status in ('open','closed')),
  reply text,
  created_at timestamptz not null default now()
);

-- 埋点事件(增长最快:考虑按月分区,或 90 天后归档到冷存储)
create table if not exists events (
  id text primary key,               -- dedup 键(如 purchase-<orderId>)
  name text not null,
  visitor_id uuid not null,
  user_id uuid,
  revenue numeric(10,2),
  currency text,
  props jsonb,
  is_bot boolean not null default false,
  is_test boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_events_name_time on events(name, created_at desc);
create index if not exists idx_events_visitor on events(visitor_id, created_at desc);

-- 实验曝光(每人每天每层每版本一条)
create table if not exists exposures (
  id text primary key,               -- visitor|layer|arm|YYYY-MM-DD
  visitor_id uuid not null,
  layer text not null,
  arm text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_exposures_layer on exposures(layer, arm, created_at desc);

-- 实验层配置
create table if not exists experiment_config (
  key text primary key,
  config jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS:service_key 直连可绕过;若用 anon key 需逐表启用 RLS 并定义策略
-- (生产建议:仅服务端用 service_key 访问,前端永不直连数据库)
