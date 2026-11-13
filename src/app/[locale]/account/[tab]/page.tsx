import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, getDict, type Locale } from "@/lib/i18n";
import { currentUserId } from "@/lib/auth";
import { creditBalance, listOrders, listRenders, listTickets } from "@/lib/store";
import SupportForm from "@/components/SupportForm";

/** 账户页:My songs / Orders / Support Tickets(PRD §8 表结构对应) */
const TABS = ["songs", "orders", "support"] as const;

/** 账户页读取 cookie 与用户数据,属阻塞型动态路由(Next 16 cacheComponents 要求显式声明) */
export const instant = false;
type Tab = (typeof TABS)[number];

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => TABS.map((tab) => ({ locale, tab })));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string; tab: string }>;
}) {
  const { locale: raw, tab } = await params;
  if (!(LOCALES as readonly string[]).includes(raw)) notFound();
  if (!(TABS as readonly string[]).includes(tab)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const userId = await currentUserId();

  const balance = await creditBalance(userId);
  const prefix = locale === "en" ? "" : `/${locale}`;

  const tabLabels: Record<Tab, string> = {
    songs: d.footer.mySongs,
    orders: d.footer.orders,
    support: d.footer.support,
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-3xl">{tabLabels[tab as Tab]}</h1>
      <p className="mt-2 text-sm text-muted">
        {d.gen.balance}: <strong className="text-ink">{balance}</strong>
      </p>

      {/* Tab 导航 */}
      <div className="mt-6 flex gap-2 border-b border-line pb-3">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`${prefix}/account/${t}`}
            className={`rounded-full px-4 py-1.5 text-sm ${
              t === tab ? "bg-card2 text-gold" : "text-muted hover:text-ink"
            }`}
          >
            {tabLabels[t]}
          </Link>
        ))}
      </div>

      {tab === "songs" ? <SongsTab /> : null}
      {tab === "orders" ? <OrdersTab /> : null}
      {tab === "support" ? <SupportTab locale={locale} /> : null}
    </div>
  );
}

async function SongsTab() {
  const userId = await currentUserId();
  const renders = await listRenders(userId);
  if (renders.length === 0) {
    return <p className="mt-8 text-sm text-muted">No videos yet — make your first one from the studio.</p>;
  }
  return (
    <ul className="mt-8 space-y-4">
      {renders.map((r) => (
        <li key={r.id} className="card flex flex-wrap items-center gap-4 p-4">
          {r.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.previewUrl} alt="" className="h-24 w-16 rounded object-cover" />
          ) : (
            <div className="h-24 w-16 rounded bg-card2" />
          )}
          <div className="min-w-40 flex-1">
            <div className="font-semibold">{r.stage}</div>
            <div className="text-xs text-muted">
              {r.model} · {r.resolution} · {r.aspect} · {r.lengthS}s
            </div>
            <div className="text-xs text-muted">{r.createdAt.slice(0, 19).replace("T", " ")}</div>
          </div>
          <span
            className={`chip ${
              r.status === "unlocked" ? "!text-mint" : r.status === "failed" ? "!text-accent" : ""
            }`}
          >
            {r.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

async function OrdersTab() {
  const userId = await currentUserId();
  const orders = await listOrders(userId);
  if (orders.length === 0) {
    return <p className="mt-8 text-sm text-muted">No orders yet.</p>;
  }
  return (
    <table className="data mt-8">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Credits</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.sku}</td>
            <td>{o.credits}</td>
            <td>${o.amountUsd.toFixed(2)}</td>
            <td>{o.status}</td>
            <td>{o.createdAt.slice(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function SupportTab({ locale }: { locale: Locale }) {
  const userId = await currentUserId();
  const tickets = await listTickets(userId);
  const d = getDict(locale);
  return (
    <>
      <SupportForm
        title={d.gen.supportFormTitle}
        subject={d.gen.supportSubject}
        body={d.gen.supportBody}
        send={d.gen.supportSend}
        sent={d.gen.supportSent}
      />
      {tickets.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No support tickets.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {tickets.map((t) => (
            <li key={t.id} className="card p-4">
              <div className="flex justify-between">
                <span className="font-semibold">{t.subject}</span>
                <span className="chip">{t.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{t.body}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
