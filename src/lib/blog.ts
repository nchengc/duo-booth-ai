/**
 * 博客数据层(PRD §5.3:对比类 3 篇先行;§5.4 博客为英文长尾,zh 路径 canonical 回英文)
 *
 * 写法套路全部来自对标 S7 实测:
 * 标题关键词+Compared+(2026) / TL;DR 抢精选摘要 / 分类法定义规则(自己归入有利类目排第一)
 * 对比表格抢表格摘要 / FAQ 式小标题 / What's new 更新日志 / checked-on 数据核查声明(E-E-A-T)
 * 诚实承认免费替代方案 / 给竞品外链(标注来源) / CTA 贯穿 / 结尾十秒选择指南
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "h2" | "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "table"; headers: string[]; rows: string[][] }
  | { t: "note"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  checkedOn: string;
  tldr: string;
  blocks: Block[];
  whatsNew: string[];
  faq: { q: string; a: string }[];
};

/** 行内链接语法:[[文字|地址]] → <a href> */
export function parseInline(text: string): { text: string; href?: string }[] {
  const out: { text: string; href?: string }[] = [];
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

const BASE_POSTS: BlogPost[] = [
  /* ============ 1. 竞品工具对比(对标 /blog/hotel-lobby-ai-apps 同位) ============ */
  {
    slug: "hotel-lobby-ai-apps",
    title: "Hotel Lobby AI Apps Compared: Which One to Use (2026)",
    description:
      "Every way to make the Hotel Lobby AI trend, compared: swap apps, template edits and two-photo studios — with prices, photos needed and which one to pick in 10 seconds.",
    publishedAt: "2026-11-13",
    updatedAt: "2026-11-13",
    checkedOn: "November 13, 2026",
    tldr:
      "There are two families of Hotel Lobby AI tools. Swap apps paste your face onto the original Quavo & Takeoff clip — fast, free-ish, but one fixed video and a copyright-risky song. Studios like Rap Duo AI generate a brand-new performance from two photos, with an original song that platforms won't mute. If you want the real song, use a swap tool. If you want your own video you can post safely, use a studio.",
    blocks: [
      { t: "h2", text: "The two families of Hotel Lobby AI tools" },
      {
        t: "p",
        text: "Every tool people call a \"Hotel Lobby AI app\" does one of two things. Swap tools take one photo and paste your face onto the original COLORS clip — the real song, the real camera moves, someone else's performance. Studio tools take your photos and generate a brand-new performance: new camera, new vocals, an original song. Both make a video that looks like the trend. Only one family gives you a video you own.",
      },
      {
        t: "table",
        headers: ["Tool", "Type", "Photos", "Song", "Price"],
        rows: [
          ["Rap Duo AI", "Studio", "2 (one per person)", "Original AI rap", "$9.99 per song, packs from $29"],
          ["Summrs", "Swap", "1", "The original track", "Free credits, then subscription (check their site)"],
          ["Mitte Character Swap", "Swap", "1", "The original track", "Subscription plan (check their site)"],
          ["LightX", "Studio-style", "1-2", "Generated audio", "Free trial + paid tiers (check their site)"],
          ["CapCut template", "Swap (manual)", "1", "The original track", "Free"],
        ],
      },
      { t: "note", text: "Prices and features change quickly in this space — every non-Rap-Duo row links to or summarizes the vendor's own page, checked on November 13, 2026." },
      { t: "h2", text: "Studio: [[Rap Duo AI|/hotel-lobby-ai]] and the two-photo approach" },
      {
        t: "p",
        text: "Studio tools generate a new performance instead of editing one. You add one photo of each person, pick a stage, and AI writes an original rap, generates vocals and beat, and renders both of you performing it, lip-synced. Because the song is original, platforms don't mute or take the video down. Renders cost credits; a failed render is never charged.",
      },
      {
        t: "p",
        text: "The trade-off: it's paid per song, and the track isn't the famous one. If the trend for you is \"the real audio\", a studio won't scratch that itch.",
      },
      { t: "h2", text: "Swap: Summrs, Mitte and the CapCut template" },
      {
        t: "p",
        text: "Swap apps are the fastest way to see yourself in the actual clip: one photo, seconds of work. Summrs leads this family (free credits to try, subscription after). Mitte's Character Swap swaps both original performers. The free route is the CapCut template, which does the same swap manually on one fixed clip.",
      },
      {
        t: "p",
        text: "The trade-off: it's the same video everyone else posted, and uploads using the original copyrighted track get muted or taken down on TikTok and Instagram. Swap output is also limited to whoever is already in the clip — two friends can't both get in unless the app supports two swaps.",
      },
      { t: "h2", text: "Is there a free Hotel Lobby AI?" },
      {
        t: "p",
        text: "Yes: the CapCut template is free and genuinely works, and some swap apps give free credits. Free studio options are rare because rendering costs real GPU money — [[Rap Duo AI|/pricing]] gives new visitors a free low-resolution preview of the first song instead.",
      },
      { t: "h3", text: "Do you need an app?" },
      {
        t: "p",
        text: "No. Every tool in the table runs in a browser on a phone. CapCut is the exception people download — as an editor with the template inside.",
      },
      { t: "h3", text: "What if you only have one photo of both of you?" },
      {
        t: "p",
        text: "Swap tools: perfect — they need one photo anyway. Studios: most want one photo per person, but the two photos can be from different years and different cities; a group photo usually works if both faces are clear.",
      },
      { t: "h3", text: "Is the original song a problem?" },
      {
        t: "p",
        text: "For personal watching, no. For posting, often yes — platforms match the audio and mute or remove it. Studios avoid this by generating an original track in the same style.",
      },
      { t: "h2", text: "The 10-second choice" },
      { t: "ul", items: [
        "Want the real song and the real clip? Use a swap tool — Summrs or the free CapCut template.",
        "Want a video you own, with two people who were never in the clip? Use a studio — [[Rap Duo AI|/hotel-lobby-ai]].",
        "Want to experiment with prompts on a general platform? Higgsfield does it with more setup — see our [[Higgsfield Hotel Lobby guide|/blog/higgsfield-hotel-lobby]].",
        "Just browsing? The trend window is short — pick one today, the audio reference dies quietly in a few weeks.",
      ] },
    ],
    whatsNew: [
      "Nov 13, 2026 — First published with the Swap vs Studio comparison.",
    ],
    faq: [
      { q: "Which Hotel Lobby AI app is free?", a: "The CapCut template is free; Summrs gives free credits. Free studio renders are rare — Rap Duo AI offers a free low-res preview of the first song." },
      { q: "Which one works for two people?", a: "Studios work best: they're built for two faces. Most swap apps paste one face at a time onto fixed performers." },
      { q: "Will the original song get my video muted?", a: "Swap output uses the copyrighted track, so posting often triggers a mute or takedown. Studio tools generate an original song instead." },
      { q: "Which app looks most like the trend?", a: "Swaps look exactly like the original clip. Studios look like a new session in the same booth — close, but not frame-identical." },
    ],
  },

  /* ============ 2. Best AI rap generators(榜单位) ============ */
  {
    slug: "best-ai-rap-generator",
    title: "Best AI Rap Generators (2026): Lyrics, Tracks and Actual Videos",
    description:
      "AI rap generators compared by what they actually output: lyric writers, beat and track makers, and video studios that film you performing — with honest picks per use case.",
    publishedAt: "2026-11-13",
    updatedAt: "2026-11-13",
    checkedOn: "November 13, 2026",
    tldr:
      "\"AI rap generator\" means three different products. Lyric writers give you text for free. Track makers give you audio you still have to visuals for. Video studios generate lyrics, vocals, beat and a filmed performance in one pass. If you want something to post today with your own face in it, you need the third kind — that's what [[Rap Duo AI|/ai-rap-generator]] does.",
    blocks: [
      { t: "h2", text: "The three families of AI rap generators" },
      {
        t: "table",
        headers: ["Family", "You get", "Still missing", "Typical price"],
        rows: [
          ["Lyric writers", "Bars on a page", "Vocals, beat, video", "Free (Canva, QuillBot and similar have rap text tools)"],
          ["Track makers", "Audio with vocals", "The visual", "Subscription per month"],
          ["Video studios", "A finished music video", "Nothing — post it", "Per song, from $9.99"],
        ],
      },
      { t: "h2", text: "Best for posting today with your own face: a video studio" },
      {
        t: "p",
        text: "Lyric tools are great brainstorming partners and track makers are great beat suppliers — but both hand you homework. A video studio closes the gap: two photos, one topic line, and it writes the bars around your subject, performs them with original AI voices, and films you and a friend trading verses, lip-synced, in about 3 minutes.",
      },
      {
        t: "p",
        text: "What to check before paying any studio: Is the song original (so platforms won't mute it)? Is the lip-sync generated with the audio (not pasted after)? Is there a free preview? What happens when a render fails — are you charged? [[Rap Duo AI|/ai-rap-generator]] answers yes/free/never-charged on all three.",
      },
      { t: "h2", text: "Best free brainstorm: lyric writers" },
      {
        t: "p",
        text: "If you only need bars to rap yourself, general-purpose writing tools (QuillBot, Canva's rap text helpers and similar) generate them free. You get text — the performance, audio and video remain your homework.",
      },
      { t: "h2", text: "Best for beat shopping: track makers" },
      {
        t: "p",
        text: "If you rap yourself and need a beat with hooks, AI track makers output real audio. Budget the real cost: audio alone still leaves filming, editing and lip-syncing to you — the parts that take weeks, not minutes.",
      },
      { t: "h2", text: "How we'd pick, honestly" },
      { t: "ul", items: [
        "Want to post a video with your face in it, today? Video studio — start with [[Rap Duo AI|/ai-rap-generator]].",
        "Want to write your own bars and perform them yourself? Free lyric writers, then a mic.",
        "Already have vocals and just need a beat? Track makers — then budget the video work.",
        "Want a video of two pets or two friends who've never met? Same studio — it needs one photo per person, taken anywhere.",
      ] },
      { t: "note", text: "We operate a studio tool, and this page is transparent about that: the comparison above is structural (what each family outputs), not a vibes ranking. Prices checked on November 13, 2026." },
    ],
    whatsNew: [
      "Nov 13, 2026 — First published with the three-family breakdown.",
    ],
    faq: [
      { q: "What is the best AI rap generator?", a: "Depends on the output you want: free lyric writers for text, track makers for audio, and video studios like Rap Duo AI for a finished, postable music video with your own face in it." },
      { q: "Are AI rap generators free?", a: "Lyric generators usually are. Video studios charge per song because rendering costs GPU money — typically $9.99 per song or less on packs." },
      { q: "Can an AI rap generator use my voice?", a: "Most generate original voices. Voice cloning of real people is rarely offered, for good legal reasons." },
      { q: "How long does a generated rap video take?", a: "About 2-3 minutes for a 12-second vertical clip with vocals, beat and lip-sync." },
    ],
  },

  /* ============ 3. Higgsfield 截流文 ============ */
  {
    slug: "higgsfield-hotel-lobby",
    title: "Higgsfield Hotel Lobby: What It Does, and a Faster Way to Make the Trend",
    description:
      "How the Hotel Lobby trend works on Higgsfield — prompts, setup and subscription — and when a two-photo studio like Rap Duo AI is the faster route to the same video.",
    publishedAt: "2026-11-13",
    updatedAt: "2026-11-13",
    checkedOn: "November 13, 2026",
    tldr:
      "Higgsfield is a general AI video platform that can recreate the Hotel Lobby trend — but you write prompts, pick or upload references, and work inside its subscription. It's powerful and flexible. If you just want the trend video with your two faces and an original song, a purpose-built studio does it in one tap for about $9.99 — no prompts.",
    blocks: [
      { t: "h2", text: "What Higgsfield actually is" },
      {
        t: "p",
        text: "Higgsfield ([[higgsfield.ai|https://higgsfield.ai]]) is a general-purpose AI video platform: camera-motion presets, effect presets and a prompt box. The Hotel Lobby look isn't a button you press — you assemble it from a template or effect, feed it your reference photos, and steer it with text. General platforms trade convenience for range: anything is possible, nothing is one tap.",
      },
      { t: "h2", text: "How the trend looks inside Higgsfield" },
      { t: "ul", items: [
        "Find the Hotel Lobby-style preset or write the scene from scratch (orange booth, two mics, two performers).",
        "Upload reference photos for each performer.",
        "Tune the prompt: camera moves, lighting, performance energy.",
        "Generate, review, regenerate — the loop is the cost.",
        "Add music separately; check the track's licensing before posting.",
      ] },
      { t: "note", text: "Steps summarized from Higgsfield's public pages, checked on November 13, 2026. Their product changes fast — trust their docs over this snapshot." },
      { t: "h2", text: "Who Higgsfield is actually great for" },
      {
        t: "p",
        text: "Creators who want control: custom camera language, mixed scenes, a style that no preset has. If you'll use the platform for ten different effects this month, its subscription makes sense and the Hotel Lobby trend is just one output among many.",
      },
      { t: "h2", text: "When a purpose-built studio is the faster route" },
      {
        t: "p",
        text: "If the goal is one video — you and a friend in the orange booth, rapping an original song, lip-synced, sized for TikTok — the purpose-built path skips the entire prompt layer. [[Rap Duo AI|/hotel-lobby-ai]] is one page: two photos, optional topic, render. The song is generated with the video (so lips match and nothing gets muted), and a failed render is never charged.",
      },
      {
        t: "table",
        headers: ["", "Higgsfield", "Rap Duo AI"],
        rows: [
          ["Setup", "Prompts + presets + references", "Two photos, optional topic"],
          ["Learning curve", "Real — it's a platform", "None — one button"],
          ["Music", "Add your own (watch licensing)", "Original song generated with the video"],
          ["Range", "Dozens of effects and styles", "One trend, done well, plus themed pages"],
          ["Pricing", "Subscription", "Per song from $9.99, packs never expire"],
        ],
      },
      { t: "h2", text: "FAQ" },
      { t: "h3", text: "Is Higgsfield free?" },
      {
        t: "p",
        text: "It has had free trials and limited free generations, but the Hotel Lobby-style work realistically sits inside its subscription. Check [[higgsfield.ai|https://higgsfield.ai]] for current terms.",
      },
      { t: "h3", text: "Does Higgsfield have a Hotel Lobby template?" },
      {
        t: "p",
        text: "It has had trend presets in this style; availability rotates as trends rotate. Either way you'll be steering with prompts and references rather than filling a form.",
      },
      { t: "h3", text: "What's the fastest way to make the Hotel Lobby trend?" },
      {
        t: "p",
        text: "A purpose-built studio. Two photos, one tap, about 3 minutes, original song included — [[start here|/hotel-lobby-ai]].",
      },
    ],
    whatsNew: [
      "Nov 13, 2026 — First published.",
    ],
    faq: [
      { q: "Is Higgsfield good for the Hotel Lobby trend?", a: "It can do it with prompts and presets, inside a subscription. If you only want this one video with two faces and an original song, a dedicated studio is faster and cheaper." },
      { q: "Do I need prompts on Rap Duo AI?", a: "No — stages are pre-set and the topic is optional. That's the trade: range (Higgsfield) vs one-tap (studio)." },
      { q: "Which is cheaper for one video?", a: "A single studio song is $9.99 (less on packs). Higgsfield's subscription makes sense at volume across many effects, not for one trend video." },
      { q: "Will the song get muted?", a: "On studio renders, no — the song is generated with the video. On platforms where you add your own track, licensing is your homework." },
    ],
  },
];

import { MORE_POSTS } from "./blog-more";

/** 全部文章:首批 3 篇 + 批次 2 的 12 篇(对标 §5.3 选题全量) */
export const POSTS: BlogPost[] = [...BASE_POSTS, ...MORE_POSTS];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
