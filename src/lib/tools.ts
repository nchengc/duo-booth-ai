/**
 * 工具页配置(PRD §5.2:每页 = 预设生成器 + 关键词文案 + FAQ + CTA)
 * MVP 先上 2 页(hotel-lobby-ai / migos-ai),后续趋势 = 在 TOOLS 数组加一份配置
 * 文案为原创撰写,仅复刻对标的信息结构
 */

import type { Locale } from "./i18n";
export type { Locale };
import { MORE_TOOLS } from "./tools-catalog";
import { CORE_EURO_COPY } from "./tools-core-euro";
import { PERSONALIZED_TOOLS } from "./tools-catalog2";
import { EFFECTS_TOOLS } from "./tools-effects";

export type FaqItem = { q: string; a: string };
export type Step = { t: string; d: string };

export type ToolCopy = {
  /** SEO title */
  title: string;
  /** meta description */
  description: string;
  h1: string;
  subtitle: string;
  shortAnswer: string;
  stages: string[];
  howSteps: Step[];
  why: Step[];
  faq: FaqItem[];
};

export type ToolConfig = {
  slug: string;
  /** 趋势标签词(用于 OG 图) */
  trendTag: string;
  /** 曲风/场景提示(真实供应商接入后拼进 prompt;默认 rap) */
  genreHint?: string;
  copy: { en: ToolCopy; zh: ToolCopy } & Partial<Record<Locale, ToolCopy>>;
};

export const STAGES = [
  { id: "hotel-lobby", label: "Hotel Lobby", note: "The classic orange booth" },
  { id: "luxury-lobby", label: "Luxury Lobby", note: "Marble & golden hour" },
  { id: "studio-booth", label: "Studio Booth", note: "Clean live-session look" },
  { id: "street-cypher", label: "Street Cypher", note: "Night cypher, neon streets" },
] as const;

const hotelLobby: ToolConfig = {
  slug: "hotel-lobby-ai",
  trendTag: "Hotel Lobby AI",
  copy: {
    en: {
      title: "Hotel Lobby AI Video Generator — Two Photos to the Viral Trend",
      description:
        "Hotel Lobby AI video generator: upload two photos and get the viral orange-booth rap trend with your faces. Original AI song, no app, about 3 minutes.",
      h1: "Hotel Lobby AI video, straight from two photos",
      subtitle:
        "Add one photo of you and one of a friend — AI puts you both in the orange booth, rapping an original song. No app, no template, about 3 minutes.",
      shortAnswer:
        "This is the simplest way to make the Hotel Lobby AI video with your own faces. Each person adds one clear photo, you keep the orange booth, and in about 3 minutes you get a vertical HD clip of the two of you trading verses — lip-synced, with an original song that no platform will flag.",
      stages: STAGES.map((s) => s.label),
      howSteps: [
        { t: "Add two face photos", d: "One clear, front-facing selfie per person. They don't need to be taken together." },
        { t: "Keep the orange stage", d: "The classic Hotel Lobby booth is pre-selected. Add a topic if you want the lyrics about something specific." },
        { t: "Pick quality & length", d: "Standard 720p is 10 credits; go Pro or Ultra for sharper renders or longer clips." },
        { t: "Watch it, unlock it, post it", d: "About 2-3 minutes to render. Unlock the watermark-free HD video and post it with the trend hashtag." },
      ],
      why: [
        { t: "An original song, safe to post", d: "The AI writes an original rap in the trend's style — no copyrighted track for platforms to mute." },
        { t: "No app, no template", d: "Runs in any phone browser. The look is built in — nothing to hunt for." },
        { t: "Friends anywhere", d: "The two photos can come from different cities and different years." },
        { t: "Pay per song", d: "Credits from $9.99 per song, and a render that fails is never charged." },
      ],
      faq: [
        { q: "What is the Hotel Lobby AI trend?", a: "A viral short-video format where two people rap together in an orange studio booth, popularized by an AI wave in late 2026. This page makes your own version from two photos." },
        { q: "Is there a free way to make it?", a: "Your first song renders free as a short, low-resolution preview so you can watch before paying. Template apps also exist, but they only swap faces onto one fixed clip." },
        { q: "Do I need an app?", a: "No. It runs in the browser on iPhone, Android and desktop." },
        { q: "Will the original song get my video muted?", a: "No — the vocals and beat here are generated from scratch as an original song, so there is no copyrighted track to flag." },
        { q: "Can we be in different places?", a: "Yes. Each person just needs one clear photo; they can be taken years apart and in different countries." },
        { q: "How long is the video?", a: "5 to 15 seconds by default (up to 30 on the Ultra model), in 9:16, 1:1 or 16:9. The standard is 12 seconds vertical." },
        { q: "Is this a face swap?", a: "No. A face swap pastes your face onto one existing clip. Here the AI builds a new performance from your photos, so it works for any two people." },
        { q: "What about people who didn't agree?", a: "Only use photos of yourself and of people who agreed to appear. Don't use minors without a guardian's consent or public figures." },
      ],
    },
    zh: {
      title: "Hotel Lobby AI 视频生成器 —— 两张照片做爆火橙色录音棚趋势",
      description:
        "Hotel Lobby AI 视频生成器：上传两张照片，把爆火的橙色录音棚说唱趋势换成你们的脸。AI 原创歌曲、无需 App、约 3 分钟出片。",
      h1: "Hotel Lobby AI 视频，两张照片直接做",
      subtitle:
        "上传一张你的照片和一张朋友的照片——AI 把你们俩放进橙色录音棚，对唱一首原创歌曲。无需 App、无需模板，约 3 分钟。",
      shortAnswer:
        "这是用你们自己的脸做 Hotel Lobby AI 视频最简单的方法。每人一张清晰照片，保留橙色舞台，约 3 分钟得到一段竖屏高清视频——你们俩轮流对唱，口型同步，歌曲为 AI 原创，不会被平台静音。",
      stages: ["橙色录音棚", "豪华大堂", "录音棚", "街头 Cypher"],
      howSteps: [
        { t: "添加两张正脸照片", d: "每人一张清晰正脸自拍，不必是合照。" },
        { t: "保留橙色舞台", d: "经典 Hotel Lobby 录音棚已预选。想让歌词围绕某件事就填主题。" },
        { t: "选画质与时长", d: "标准 720p 为 10 积分;要更清晰或更长可选专业或旗舰档。" },
        { t: "观看、解锁、发布", d: "约 2-3 分钟出片。解锁无水印高清版，带上趋势标签发布。" },
      ],
      why: [
        { t: "原创歌曲，发布无忧", d: "AI 以该趋势风格创作原创说唱——没有会被平台静音的原曲。" },
        { t: "无需 App,无需模板", d: "任何手机浏览器都能用，造型内置，不用找模板。" },
        { t: "异地也同台", d: "两张照片可以来自不同城市、不同年代。" },
        { t: "按首付费", d: "积分制 $9.99 一首起，生成失败不扣费。" },
      ],
      faq: [
        { q: "Hotel Lobby AI 趋势是什么?", a: "一个爆款短视频形式：两个人在橙色录音棚里一起说唱，2026 年下半年随 AI 浪潮走红。本页用两张照片做你自己的版本。" },
        { q: "有免费的做吗?", a: "你的第一首会免费渲染成短时低清预览，看完再决定是否付费。模板类 App 也有，但只是把脸换到固定的一段原片上。" },
        { q: "需要下载 App 吗?", a: "不需要。iPhone、Android 和桌面浏览器都能直接用。" },
        { q: "用原曲会被静音吗?", a: "不会——这里的人声和伴奏是从零生成的原创歌曲，没有版权音轨可被标记。" },
        { q: "两个人不在同地可以吗?", a: "可以。每人一张清晰照片即可，摄于不同年份、不同国家都行。" },
        { q: "视频多长?", a: "默认 5-15 秒(旗舰档最长 30 秒),支持 9:16、1:1、16:9。标准为 12 秒竖屏。" },
        { q: "这是换脸吗?", a: "不是。换脸是把你的脸贴到某一段既有视频上;这里是 AI 用你的照片生成全新的表演，任何两个人都适用。" },
        { q: "没同意出镜的人怎么处理?", a: "只使用本人和已同意出镜者的照片。未经监护人同意不用未成年人照片，不用公众人物照片。" },
      ],
    },
  },
};

const migos: ToolConfig = {
  slug: "migos-ai",
  trendTag: "Migos AI",
  copy: {
    en: {
      title: "Migos AI Song & Video Maker — Two Photos, One Rap Duo",
      description:
        "Migos AI song and video maker: two photos in, and you and a friend rap an original song in the Migos style. No voice cloning, no app, about 3 minutes.",
      h1: "Migos AI style — your duo, an original song",
      subtitle:
        "The trend is also called Migos AI. Two photos in, one rap duo video out: original lyrics, generated vocals and beat, your faces on stage.",
      shortAnswer:
        "\"Migos AI\" is another name for the same rap duo trend. This page is the same studio with the wording tuned for it: two photos, an optional topic, and an original rap performed by you and a friend — no celebrity voices are cloned, so the result is safe and yours.",
      stages: STAGES.map((s) => s.label),
      howSteps: [
        { t: "Add two face photos", d: "One per person. Clear, front-facing, well lit." },
        { t: "Add a topic (optional)", d: "A birthday, a rivalry, an inside joke — the lyrics are written around it." },
        { t: "Pick quality & length", d: "Model and resolution are your call; length scales the credits." },
        { t: "Render, unlock, share", d: "About 2-3 minutes. Unlock HD without watermark and post it." },
      ],
      why: [
        { t: "No voice cloning", d: "The vocals are original AI voices — nobody's identity is copied." },
        { t: "Original beat & bars", d: "Every render gets its own song written around your topic." },
        { t: "Any two people", d: "Friends, couples, siblings, pets — if you have photos, you have a duo." },
        { t: "Fair pricing", d: "From $9.99 for one song, cheaper per song on packs; failed renders are free." },
      ],
      faq: [
        { q: "Is Migos AI the same as Hotel Lobby AI?", a: "Yes — different names for the same trend. Both point to the orange-booth rap duo format." },
        { q: "Does it clone the artists' voices?", a: "No. The rap is performed by original AI voices. Celebrity voice cloning is not supported and not allowed." },
        { q: "Can three people be in one video?", a: "Not yet — the studio is built for duos of two. Pick your two most theatrical friends." },
        { q: "Can I make a diss track?", a: "Yes — keep it friendly. There is a dedicated diss track page; content targeting real people to harass them is blocked." },
        { q: "What photos should I use?", a: "One clear front-facing photo per person, faces well lit and unobstructed." },
        { q: "How do credits work?", a: "A standard 720p 12-second song is 10 credits. Packs never expire; failed renders return credits automatically." },
        { q: "Which languages are supported?", a: "English, Chinese, Italian, Spanish, Brazilian Portuguese and French — pick the site language or type the topic in your language." },
        { q: "Can I post it commercially?", a: "Personal posting is fine. For ads or client work, render with a topic about your business and check your local rules on AI content disclosure." },
      ],
    },
    zh: {
      title: "Migos AI 歌曲与视频生成器 —— 两张照片，一个双人组合",
      description:
        "Migos AI 歌曲和视频生成器：上传两张照片，你和朋友就能以 Migos 风格对唱一首原创说唱。不克隆声音、无需 App、约 3 分钟。",
      h1: "Migos AI 风格 —— 你的组合，原创的歌",
      subtitle:
        "这个趋势也叫 Migos AI。两张照片进，一段双人说唱视频出：原创歌词、AI 人声和伴奏，你们的脸登上舞台。",
      shortAnswer:
        "\"Migos AI\" 是同一种双人说唱趋势的另一个名字。本页是同一个生成器，文案按这个叫法调整：两张照片、可选主题，你和一位朋友表演一首原创说唱——不克隆任何名人声音，结果安全且属于你。",
      stages: ["橙色录音棚", "豪华大堂", "录音棚", "街头 Cypher"],
      howSteps: [
        { t: "添加两张正脸照片", d: "每人一张，清晰正脸、光线充足。" },
        { t: "可选填主题", d: "生日、对决、内部梗——歌词围绕它来写。" },
        { t: "选画质与时长", d: "模型和分辨率自选，时长按比例消耗积分。" },
        { t: "生成、解锁、分享", d: "约 2-3 分钟。解锁无水印高清版并发布。" },
      ],
      why: [
        { t: "不克隆声音", d: "人声是原创 AI 声音，不复制任何人的身份。" },
        { t: "原创伴奏与歌词", d: "每次生成都围绕你的主题写一首新歌。" },
        { t: "任何两个人都行", d: "朋友、情侣、兄弟姐妹、宠物——有照片就能组队。" },
        { t: "定价公道", d: "单首 $9.99 起，积分包更低;失败渲染免费。" },
      ],
      faq: [
        { q: "Migos AI 和 Hotel Lobby AI 一样吗?", a: "是的——同一个趋势的不同叫法，都指橙色录音棚的双人说唱形式。" },
        { q: "会克隆艺人的声音吗?", a: "不会。说唱由原创 AI 声音表演，不支持也不允许克隆名人声音。" },
        { q: "能三个人同一条视频吗?", a: "暂不支持——生成器为双人设计。挑你最能演的两个朋友。" },
        { q: "能做 diss track 吗?", a: "可以——保持友好。有专门的 diss track 页面;针对真实人物进行骚扰的内容会被拦截。" },
        { q: "该用什么样的照片?", a: "每人一张清晰正脸照，面部光线充足、无遮挡。" },
        { q: "积分怎么算?", a: "标准 720p 12 秒一首为 10 积分。积分包永不过期;失败渲染自动退积分。" },
        { q: "支持哪些语言?", a: "英语、中文、意大利语、西班牙语、巴西葡萄牙语和法语——选网站语言或直接用你的语言填主题。" },
        { q: "可以商用发布吗?", a: "个人发布没问题。用于广告或客户项目时，请生成与你的业务相关的主题，并了解当地对 AI 内容披露的要求。" },
      ],
    },
  },
};

export const TOOLS: ToolConfig[] = [hotelLobby, migos, ...MORE_TOOLS, ...PERSONALIZED_TOOLS, ...EFFECTS_TOOLS];

// 核心页五语元数据合并(缺失字段回退 EN)
for (const t of TOOLS) {
  const extra = CORE_EURO_COPY[t.slug];
  if (extra) (t.copy as Record<string, unknown>) = { ...t.copy, ...extra };
}

export function getTool(slug: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/** 解析工具页文案:缺失语言回退 EN(PRD §5.4 长尾单语策略) */
export function resolveToolCopy(tool: ToolConfig, locale: Locale): ToolCopy {
  return { ...tool.copy.en, ...((tool.copy as Record<string, ToolCopy | undefined>)[locale] ?? {}) };
}
