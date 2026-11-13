/**
 * SKU 表(PRD §4.2/§4.3:与对标定价逐格一致)
 *
 * 8 个 SKU:5 个一次性积分包 + 3 个月付订阅
 * 真实 Stripe 集成时:订阅需在 Stripe Dashboard 建 Price,把 priceId 填入
 */

export type SkuKind = "pack" | "plan";

export type Sku = {
  id: string;
  kind: SkuKind;
  name: string;
  credits: number;
  amountUsd: number;
  /** 每首约合单价(展示用) */
  perSong: string;
  /** 折扣标注(展示用) */
  save?: string;
  /** 真实 Stripe Price ID(订阅档接入后填) */
  stripePriceId?: string;
};

export const PACKS: Sku[] = [
  { id: "pack_single", kind: "pack", name: "Single", credits: 10, amountUsd: 9.99, perSong: "$9.99 / song" },
  { id: "pack_duo", kind: "pack", name: "Duo Pack", credits: 50, amountUsd: 29, perSong: "$5.80 / song", save: "-42%" },
  { id: "pack_crew", kind: "pack", name: "Crew Pack", credits: 350, amountUsd: 99, perSong: "$2.83 / song", save: "-72%" },
  { id: "pack_studio", kind: "pack", name: "Studio Pack", credits: 900, amountUsd: 199, perSong: "$2.21 / song", save: "-78%" },
  { id: "pack_label", kind: "pack", name: "Label Pack", credits: 3000, amountUsd: 499, perSong: "$1.66 / song", save: "-83%" },
];

export const PLANS: Sku[] = [
  { id: "plan_basic", kind: "plan", name: "Basic", credits: 100, amountUsd: 29.9, perSong: "$2.99 / song" },
  { id: "plan_pro", kind: "plan", name: "Pro", credits: 300, amountUsd: 49.9, perSong: "$1.66 / song", save: "-44%" },
  { id: "plan_studio", kind: "plan", name: "Studio", credits: 800, amountUsd: 99.9, perSong: "$1.25 / song", save: "Best value" },
];

export const ALL_SKUS: Sku[] = [...PACKS, ...PLANS];

export function getSku(id: string): Sku | undefined {
  return ALL_SKUS.find((s) => s.id === id);
}
