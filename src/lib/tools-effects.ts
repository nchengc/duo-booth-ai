/**
 * 工具页目录批次 3:照片特效类(24 页)+ 问答型工具页(1 页),PRD §5.2
 * 多为单图/双图特效;文案紧凑(对标 slug 全量,内容原创)
 */

import type { ToolConfig } from "./tools";

const enStages = ["Hotel Lobby", "Luxury Lobby", "Studio Booth", "Street Cypher"];
const zhStages = ["橙色录音棚", "豪华大堂", "录音棚", "街头 Cypher"];

export const EFFECTS_TOOLS: ToolConfig[] = [
  {
    slug: "ai-video-effects",
    trendTag: "AI Video Effects",
    copy: {
      en: {
        title: "AI Video Effects — Turn a Photo Into a Viral Clip",
        description:
          "Turn a photo into a viral AI video effect: Earth zoom out, money rain, clones, hugs, dances and more. Ready in minutes, no app.",
        h1: "AI video effects — one photo, endless clips",
        subtitle:
          "Pick an effect, add a photo (or two), and AI renders a short vertical clip ready for TikTok, Reels and Shorts.",
        shortAnswer:
          "AI video effects turn a still photo into a moving, shareable moment — clones of you, Earth zoom-outs, hugs, dances, outfit changes. This page is the hub: pick an effect below or on the homepage grid, add your photo, and the render takes minutes.",
        stages: enStages,
        howSteps: [
          { t: "Pick an effect", d: "Trends rotate weekly — the homepage grid is the live menu." },
          { t: "Add your photo", d: "One clear photo; some effects take two people." },
          { t: "Render", d: "Minutes, not hours. Failed renders are never charged." },
          { t: "Post it", d: "Vertical HD, no watermark after unlock." },
        ],
        why: [
          { t: "Trend speed", d: "New effects get pages within days of the trend appearing." },
          { t: "No editing", d: "The effect is pre-built — you bring the photo." },
          { t: "Cheap to try", d: "First render free as a preview." },
          { t: "Credits roll over", d: "Packs never expire." },
        ],
        faq: [
          { q: "Which effect is trending now?", a: "The homepage grid shows the current lineup — hug, clone, Earth zoom and seasonal pages are always near the top." },
          { q: "Do effects use audio?", a: "Performance effects do; pure visual effects render silent or with generated ambience." },
          { q: "One photo or two?", a: "Solo effects take one; hug, battle and duo effects take two faces." },
          { q: "How much per effect?", a: "Credits per render, 5-20 depending on model and resolution." },
        ],
      },
      zh: {
        title: "AI 视频特效 —— 一张照片变爆款短片",
        description:
          "把照片变成爆款 AI 视频特效:地球拉远、金钱雨、克隆、拥抱、跳舞等。几分钟出片,无需 App。",
        h1: "AI 视频特效 —— 一张照片,无数短片",
        subtitle:
          "选一个特效,上传照片(或两张),AI 渲染一条竖屏短片,直接可发 TikTok、Reels、Shorts。",
        shortAnswer:
          "AI 视频特效把静态照片变成会动、可分享的瞬间——你的克隆、地球拉远、拥抱、跳舞、换装。本页是入口:在下方或首页网格选特效,上传照片,几分钟渲染完成。",
        stages: zhStages,
        howSteps: [
          { t: "选特效", d: "趋势每周轮换——首页网格就是实时菜单。" },
          { t: "上传照片", d: "一张清晰照片;部分特效支持双人。" },
          { t: "渲染", d: "几分钟而非几小时。失败不扣费。" },
          { t: "发布", d: "竖屏高清,解锁后无水印。" },
        ],
        why: [
          { t: "趋势速度", d: "新趋势出现几天内就有专属页。" },
          { t: "零剪辑", d: "特效预置好——你只带照片。" },
          { t: "试错便宜", d: "首条免费渲染预览。" },
          { t: "积分不浪费", d: "积分包永不过期。" },
        ],
        faq: [
          { q: "现在哪个特效最火?", a: "首页网格就是当前阵容——拥抱、克隆、地球拉远和节日页常驻前排。" },
          { q: "特效有声音吗?", a: "表演类有;纯视觉类渲染为静音或生成环境音。" },
          { q: "一张还是两张照片?", a: "单人特效一张;拥抱、对战、双人特效两张脸。" },
          { q: "每个特效多少钱?", a: "按渲染计积分,5-20 分看模型和分辨率。" },
        ],
      },
    },
  },
  {
    slug: "ai-hug-generator",
    trendTag: "AI Hug Generator",
    genreHint: "warm gentle hug, soft light",
    copy: {
      en: {
        title: "AI Hug Generator — a Warm, Real-Looking Hug From Photos",
        description:
          "AI hug generator: add a photo of you and one of someone you miss, and get a warm, real-looking video of the two of you hugging. Ready in minutes, no app.",
        h1: "AI hug generator — two photos, one embrace",
        subtitle:
          "Add a photo of you and one of the person you miss — far away, or long gone — and AI renders a gentle, real-looking hug video.",
        shortAnswer:
          "The AI hug trend exists because distance is real: friends abroad, grandparents gone, partners on tour. Two photos in, one warm embrace out — no app, minutes per render, and you only pay for renders that succeed.",
        stages: enStages,
        howSteps: [
          { t: "Add two photos", d: "You, and the person you miss. Any year, any city." },
          { t: "Render the hug", d: "AI builds a gentle, natural embrace between the two of you." },
          { t: "Watch it once", d: "Free preview first — these get people emotional." },
          { t: "Send it privately", d: "Unlock HD and send it to them, or keep it for yourself." },
        ],
        why: [
          { t: "It feels real", d: "Slow, natural movement — not a glitchy morph." },
          { t: "Reunions on demand", d: "Distance and years don't matter to the render." },
          { t: "Private by design", d: "Photos used only for your video, never published." },
          { t: "Free to try", d: "First render previews free." },
        ],
        faq: [
          { q: "Can I hug someone who passed away?", a: "Yes — there is a dedicated page for hugging a deceased loved one, built gentler for it." },
          { q: "Do the photos need to be together?", a: "No — that's the point. Two separate photos, any distance apart." },
          { q: "Is it creepy?", a: "It's slow and soft by design. Most people cry first, then send it to family." },
          { q: "How much?", a: "Credits per render, from 5 for standard — failed renders return credits." },
        ],
      },
      zh: {
        title: "AI 拥抱生成器 —— 两张照片,一个真实的拥抱",
        description:
          "AI 拥抱生成器:上传你和想念的人的照片,几分钟得到一个温暖、真实的拥抱视频。无需 App。",
        h1: "AI 拥抱生成器 —— 两张照片,一次拥抱",
        subtitle:
          "上传你和想念的人的照片——在远方,或已经离开——AI 渲染一个温柔、真实的拥抱视频。",
        shortAnswer:
          "AI 拥抱潮流存在的原因是距离是真实的:出国的朋友、离开的亲人、巡演中的伴侣。两张照片进,一个温暖拥抱出——无需 App,几分钟一条,失败的渲染不扣费。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "你,和想念的人。任何年份、任何城市。" },
          { t: "渲染拥抱", d: "AI 生成你们之间一个温柔、自然的拥抱。" },
          { t: "先看一遍", d: "免费预览——这类视频让人情绪翻涌。" },
          { t: "私下发送", d: "解锁高清发给 TA,或留给自己。" },
        ],
        why: [
          { t: "看起来是真的", d: "缓慢、自然的动作——不是故障感变形。" },
          { t: "按需重逢", d: "距离和年份对渲染没有影响。" },
          { t: "隐私优先", d: "照片只用于你的视频,绝不公开。" },
          { t: "免费试", d: "首条渲染免费预览。" },
        ],
        faq: [
          { q: "能拥抱已故的亲人吗?", a: "能——有专门的「拥抱逝去亲人」页,做得更温柔。" },
          { q: "照片要在一起拍吗?", a: "不用——这正是意义所在。两张分开的照片,相隔多远都行。" },
          { q: "会不会瘆人?", a: "设计上缓慢而柔软。多数人先哭,再发给家人。" },
          { q: "多少钱?", a: "按渲染计积分,标准 5 分起——失败自动退分。" },
        ],
      },
    },
  },
  {
    slug: "ai-hug-deceased-loved-one",
    trendTag: "Hug a Deceased Loved One",
    genreHint: "tender memorial hug, soft window light",
    copy: {
      en: {
        title: "Hug a Deceased Loved One — AI Video From Your Photos",
        description:
          "Make an AI hug video with a deceased loved one: a photo of you and one of the parent or grandparent you miss, and a gentle, real-looking hug. No app.",
        h1: "Hug them once more — gently, from your photos",
        subtitle:
          "A photo of you and one of the parent or grandparent you miss. AI renders a slow, gentle, real-looking hug — many people tell us it's the video they cried at, then kept.",
        shortAnswer:
          "This page exists for one moment: the hug you never got to say goodbye with. One photo of you, one of them, and AI renders a slow, gentle embrace — built softer than any other effect, private by default, minutes per render.",
        stages: enStages,
        howSteps: [
          { t: "Add your photo", d: "A recent, clear photo of you." },
          { t: "Add their photo", d: "Any photo where their face is clear — old prints scan fine." },
          { t: "Render softly", d: "Slow movement, gentle light. Watch it alone first." },
          { t: "Keep it", d: "Unlock HD or keep the preview. Your choice, no pressure." },
        ],
        why: [
          { t: "Built for the moment", d: "Slower and softer than the regular hug effect." },
          { t: "Old photos work", d: "Scanned prints are fine — the face is what matters." },
          { t: "Private forever", d: "Photos used only for your render; delete anytime." },
          { t: "No pay pressure", d: "Free preview first; unlock only if it helps." },
        ],
        faq: [
          { q: "Is this respectful?", a: "It was built for exactly this use — slow, gentle, no gimmicks. Use your own judgment about sharing." },
          { q: "How old can the photo be?", a: "Decades — scanned prints work. Clarity of the face matters most." },
          { q: "Can other relatives see it?", a: "Only if you share it. Your renders are private by default." },
          { q: "What if the render feels wrong?", a: "You can re-render or stop — failed renders are never charged." },
        ],
      },
      zh: {
        title: "拥抱逝去的亲人 —— 用你们的照片做 AI 视频",
        description:
          "做一条与逝去亲人拥抱的 AI 视频:一张你的照片、一张想念的父母或祖辈的照片,一个温柔真实的拥抱。无需 App。",
        h1: "再抱一次 —— 温柔地,从你们的照片开始",
        subtitle:
          "一张你的照片,一张想念的父母或祖辈的照片。AI 渲染一个缓慢、温柔、真实的拥抱——很多人说,这是他们哭着看完又留下来的一条视频。",
        shortAnswer:
          "这个页面的存在只为一刻:那个没来得及说再见的拥抱。一张你的照片,一张 TA 的照片,AI 渲染一个缓慢温柔的拥抱——比任何特效都柔软,默认私密,几分钟一条。",
        stages: zhStages,
        howSteps: [
          { t: "上传你的照片", d: "一张近期的清晰照片。" },
          { t: "上传 TA 的照片", d: "任何脸部清晰的照片——老照片扫描件也行。" },
          { t: "温柔渲染", d: "慢动作、柔光。先独自看一遍。" },
          { t: "自己决定", d: "解锁高清或留住预览。你的选择,没有催促。" },
        ],
        why: [
          { t: "为这一刻而造", d: "比普通拥抱特效更慢、更柔。" },
          { t: "老照片可用", d: "扫描件也行——重要的是那张脸。" },
          { t: "永远私密", d: "照片只用于渲染;随时可删。" },
          { t: "没有催单", d: "先看免费预览;有帮助再解锁。" },
        ],
        faq: [
          { q: "这样合适吗?", a: "它就是为这个用途而造——缓慢、温柔、没有花活。分享与否由你自己判断。" },
          { q: "照片可以多老?", a: "几十年都行——扫描件没问题。关键是脸够清晰。" },
          { q: "其他亲人能看到吗?", a: "只有你分享才能。作品默认私密。" },
          { q: "渲染效果不对怎么办?", a: "可以重渲染或停止——失败不扣费。" },
        ],
      },
    },
  },
  {
    slug: "ai-clone-video",
    trendTag: "AI Clone Video",
    copy: {
      en: {
        title: "AI Clone Video — Copies of You Step Out One by One",
        description:
          "AI clone video from your own photo: copies of you step out one by one until a whole squad of you lines the street. Add a photo, tap once, ready in minutes.",
        h1: "AI clone video — build your squad from one photo",
        subtitle:
          "Add one photo and AI renders copies of you stepping out one by one — a whole squad of you, lined up and posed.",
        shortAnswer:
          "One photo, a whole crew. The AI clone effect duplicates you into a line of clones that step out and pose — the most shared solo effect of the season, from a single clear photo in minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "Clear, front-facing. One person only." },
          { t: "Tap once", d: "No prompt — the clone sequence is pre-built." },
          { t: "Watch the squad form", d: "Copies step out one by one until the street is full." },
          { t: "Post it", d: "Unlock HD and tag it — this one gets replies." },
        ],
        why: [
          { t: "One photo is enough", d: "The most solo-friendly effect on the site." },
          { t: "Zero prompt", d: "One tap — the sequence is fixed and proven." },
          { t: "Group-chat bait", d: "\"Which one is the real you\" never gets old." },
          { t: "Minutes", d: "Render while the kettle boils." },
        ],
        faq: [
          { q: "How many clones?", a: "A full squad — the sequence is fixed at the count that reads best on vertical video." },
          { q: "Do the clones move?", a: "They step out and pose — movement is the point of the effect." },
          { q: "Can two people be cloned together?", a: "Not on this page — one face per squad. Make two and post both." },
          { q: "Price?", a: "Credits per render, from 5 for standard 480p." },
        ],
      },
      zh: {
        title: "AI 克隆视频 —— 无数个你一个个走出来",
        description:
          "用你自己的照片做 AI 克隆视频:无数个你依次走出,直到整条街都是你的分身。上传一张照片,点一次,几分钟出片。",
        h1: "AI 克隆视频 —— 一张照片,组一支分身军团",
        subtitle:
          "上传一张照片,AI 渲染无数个你依次走出——整支分身队伍列队站好。",
        shortAnswer:
          "一张照片,一整支队伍。AI 克隆特效把复制成一个个走出来站好的分身——本季被转发最多的单人特效,一张清晰照片几分钟出片。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "清晰正脸。只能一个人。" },
          { t: "点一次", d: "不用提示词——克隆序列是预置的。" },
          { t: "看分身集结", d: "一个接一个走出,直到整条街站满。" },
          { t: "发布", d: "解锁高清加话题——这条必回评论。" },
        ],
        why: [
          { t: "一张照片就够", d: "全站最单人友好的特效。" },
          { t: "零提示词", d: "一次点击——序列固定且效果稳定。" },
          { t: "群聊诱饵", d: "\"哪个是真的你\"永不过时。" },
          { t: "几分钟", d: "烧壶水的时间。" },
        ],
        faq: [
          { q: "有几个克隆?", a: "满编——数量按竖屏观感固定。" },
          { q: "克隆会动吗?", a: "走出来站定——动起来正是特效的意义。" },
          { q: "能两个人一起克隆吗?", a: "本页不行——一支队伍一张脸。做两条一起发。" },
          { q: "价格?", a: "按渲染计积分,标准 480p 5 分起。" },
        ],
      },
    },
  },
  {
    slug: "earth-zoom-out",
    trendTag: "Earth Zoom Out",
    copy: {
      en: {
        title: "Earth Zoom Out AI — From Your Photo to the Whole Planet",
        description:
          "Earth zoom out AI from your photo: you wave up from a city plaza, and in one unbroken take the camera rises past the horizon to the whole planet. In minutes.",
        h1: "Earth zoom out — start with your face, end with the planet",
        subtitle:
          "Add one photo, and AI renders an unbroken take: from you waving, the camera rises past rooftops, clouds and the curve of the Earth.",
        shortAnswer:
          "The Earth zoom-out is the flex of the season: one photo, and the camera pulls from your smile to the whole planet in a single unbroken take. It reads as expensive; it renders in minutes from one clear photo.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "You, outdoors if possible — it blends better with the plaza start." },
          { t: "Tap once", d: "The zoom path is pre-built — no prompt." },
          { t: "Watch the climb", d: "Rooftops, skyline, clouds, the blue curve." },
          { t: "Post with a location", d: "It pairs perfectly with where you are." },
        ],
        why: [
          { t: "Cinematic by default", d: "One unbroken take — no jump cuts to hide." },
          { t: "Solo-friendly", d: "One photo, one tap, one share." },
          { t: "Wows every audience", d: "The scale jump gets reactions from anyone." },
          { t: "Cheap", d: "Standard render from 5 credits." },
        ],
        faq: [
          { q: "Does the photo need to be outdoors?", a: "Outdoors blends best with the street start, but any clear photo works." },
          { q: "Is it really one take?", a: "Yes — the zoom is continuous, which is why it looks expensive." },
          { q: "Can it start from my pet?", a: "Any subject works — pets waving up is a genre now." },
          { q: "Length?", a: "The standard clip is 12 seconds — exactly enough for the climb." },
        ],
      },
      zh: {
        title: "地球拉远 AI —— 从你的脸到整个星球",
        description:
          "用你的照片做地球拉远 AI:你从城市广场挥手,镜头一镜到底升过地平线直到整个星球。几分钟出片。",
        h1: "地球拉远 —— 从你的脸开始,到整个星球结束",
        subtitle:
          "上传一张照片,AI 渲染一镜到底:从你挥手开始,镜头升过屋顶、云层和地球的弧线。",
        shortAnswer:
          "地球拉远是本季的排面特效:一张照片,镜头从你的微笑一镜拉到整个星球。看着很贵,实际一张清晰照片几分钟就渲染出来。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "最好在户外——和广场开头融合更自然。" },
          { t: "点一次", d: "拉远路径是预置的——不用提示词。" },
          { t: "看镜头攀升", d: "屋顶、天际线、云层、蓝色弧线。" },
          { t: "带定位发布", d: "和你在的城市绝配。" },
        ],
        why: [
          { t: "天生电影感", d: "一镜到底——没有需要遮掩的跳切。" },
          { t: "单人友好", d: "一张照片、一次点击、一次分享。" },
          { t: "谁看都惊叹", d: "尺度跃迁能炸出任何人的评论。" },
          { t: "便宜", d: "标准渲染 5 积分起。" },
        ],
        faq: [
          { q: "照片必须在户外吗?", a: "户外和街道开头融合最好,但任何清晰照片都可以。" },
          { q: "真是一镜到底吗?", a: "是——拉远连续,所以显得贵。" },
          { q: "能从我家宠物开始吗?", a: "任何主体都行——宠物挥手升空已经是独立流派。" },
          { q: "多长?", a: "标准 12 秒——正好够爬升。" },
        ],
      },
    },
  },
  {
    slug: "raindance-ai-trend",
    trendTag: "Raindance AI",
    genreHint: "golden hour pier, singing softly, sun flare",
    copy: {
      en: {
        title: "Raindance AI Trend — Sing on the Pier at Golden Hour",
        description:
          "Do the Raindance AI trend from a photo: a hard cut from your snapshot to you singing on a wooden pier at golden hour, sun behind you. Ready in minutes, no app.",
        h1: "Raindance — your snapshot becomes golden hour",
        subtitle:
          "One photo in, and the AI cuts from your ordinary snapshot to you singing softly on a wooden pier, sun flaring behind you.",
        shortAnswer:
          "The Raindance trend is the gentle one: a hard cut from your everyday photo to golden-hour-on-the-pier, singing softly. It lands because the contrast does the work — one photo, minutes, no app.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "Your everyday self — the plainer, the better the cut." },
          { t: "Tap once", d: "The pier scene and sun position are pre-built." },
          { t: "Feel the cut", d: "Hard cut into golden hour, singing softly." },
          { t: "Post quietly", d: "This one performs best without hashtags." },
        ],
        why: [
          { t: "The contrast does it", d: "Ordinary photo → golden hour. Instant emotional lift." },
          { t: "Gentle audio", d: "Soft vocal, water under the pier — no loud beat." },
          { t: "Solo, one photo", d: "No second face needed." },
          { t: "Minutes", d: "Render between meetings." },
        ],
        faq: [
          { q: "Why is it called Raindance?", a: "The trend name stuck from the first viral clips — the scene is pier, sun and soft singing." },
          { q: "Will I actually sing?", a: "The AI performs it — your face, lip-synced, softly." },
          { q: "Best photo to use?", a: "Something casual — the bigger the contrast with golden hour, the better." },
          { q: "Length?", a: "Standard 12 seconds, vertical." },
        ],
      },
      zh: {
        title: "Raindance AI 趋势 —— 黄金时刻在木栈道轻唱",
        description:
          "用一张照片做 Raindance AI 趋势:从你的日常快照硬切到黄金时刻的木栈道,夕阳在你身后轻唱。几分钟出片,无需 App。",
        h1: "Raindance —— 你的快照变成黄金时刻",
        subtitle:
          "一张照片进,AI 从你平凡的快照硬切到木栈道上轻声吟唱的你,夕阳在身后炸开。",
        shortAnswer:
          "Raindance 趋势是温柔的那一支:从日常照片硬切到黄金时刻的栈道轻唱。它打动人靠的是对比——一张照片,几分钟,无需 App。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "日常的你——越普通,切换越动人。" },
          { t: "点一次", d: "栈道场景和太阳位置是预置的。" },
          { t: "感受切换", d: "硬切入黄金时刻,轻声吟唱。" },
          { t: "安静发布", d: "这条不带话题标签效果反而最好。" },
        ],
        why: [
          { t: "对比出情绪", d: "普通照片 → 黄金时刻。情绪瞬间抬升。" },
          { t: "声音温柔", d: "轻声人声、栈道下的水声——没有吵闹的鼓点。" },
          { t: "单图单人", d: "不需要第二张脸。" },
          { t: "几分钟", d: "会议间隙就能渲染。" },
        ],
        faq: [
          { q: "为什么叫 Raindance?", a: "名字从最早的爆款视频流传下来——场景是栈道、夕阳和轻唱。" },
          { q: "我真的会唱吗?", a: "AI 替你表演——你的脸,口型同步,轻声。" },
          { q: "用什么照片最好?", a: "随意日常的——和黄金时刻反差越大越好。" },
          { q: "多长?", a: "标准 12 秒,竖屏。" },
        ],
      },
    },
  },
  {
    slug: "ai-zombie-trend",
    trendTag: "AI Zombie Trend",
    genreHint: "zombie turned loved one, flare light, no gore",
    copy: {
      en: {
        title: "AI Zombie Trend — They Turned, You Can't Fire, You Hug",
        description:
          "Do the AI zombie trend from your photos: your loved one has turned, you raise a flare gun, can't fire, and pull them into a hug instead. No gore, no app.",
        h1: "AI zombie trend — the hug ending",
        subtitle:
          "Two photos: your loved one turned, you with the flare gun — you can't do it, and the clip ends in a hug. No gore, built for the feels.",
        shortAnswer:
          "The zombie trend that isn't about zombies: your loved one has turned, you raise the flare gun, you can't fire — and the clip ends in a hug. No gore, two photos, the most emotional trend of the season.",
        stages: enStages,
        howSteps: [
          { t: "Add two photos", d: "You, and the person who 'turned'." },
          { t: "Tap once", d: "The flare-hesitation-hug sequence is pre-built." },
          { t: "Watch the ending", d: "The gun lowers. The hug wins." },
          { t: "Post with care", d: "These get long comment threads — reply kindly." },
        ],
        why: [
          { t: "No gore, all feels", d: "The drama is the hesitation, not the horror." },
          { t: "Two photos, one tap", d: "The sequence is fixed — no prompt." },
          { t: "Trend-accurate", d: "Matches the clips driving the hashtag." },
          { t: "Private renders", d: "Photos never published." },
        ],
        faq: [
          { q: "Is there gore?", a: "No — the trend's power is the hug ending, not horror effects." },
          { q: "Can I use my pet?", a: "People do — a turned pet you still hug hits differently." },
          { q: "What if I can't finish watching?", a: "That's normal. The free preview lets you try gently before unlocking." },
          { q: "Length?", a: "12 seconds — the hesitation needs every one of them." },
        ],
      },
      zh: {
        title: "AI 僵尸趋势 —— TA 变了,你开不了枪,你抱住 TA",
        description:
          "用你的照片做 AI 僵尸趋势:亲人变了身,你举起信号枪却下不了手,最后把 TA 抱进怀里。无血腥,无需 App。",
        h1: "AI 僵尸趋势 —— 结局是拥抱",
        subtitle:
          "两张照片:变了身的亲人,举着信号枪的你——你下不了手,片尾是拥抱。无血腥,为情绪而生。",
        shortAnswer:
          "这个僵尸趋势重点根本不是僵尸:亲人变了身,你举起信号枪,开不了枪——片尾落在拥抱上。无血腥,两张照片,本季最催泪的趋势。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "你,和\"变了身\"的 TA。" },
          { t: "点一次", d: "举枪-犹豫-拥抱的序列是预置的。" },
          { t: "看结局", d: "枪放下。拥抱赢了。" },
          { t: "温柔发布", d: "这条的评论区会很长——好好回复。" },
        ],
        why: [
          { t: "无血腥全是情绪", d: "戏剧性在犹豫,不在恐怖。" },
          { t: "两张照片一点", d: "序列固定——不用提示词。" },
          { t: "贴合趋势", d: "和话题标签下的爆款一致。" },
          { t: "私密渲染", d: "照片绝不公开。" },
        ],
        faq: [
          { q: "有血腥画面吗?", a: "没有——这条趋势的力量在拥抱结局,不在恐怖特效。" },
          { q: "能用宠物吗?", a: "很多人用——变了身仍要抱住的宠物,杀伤力翻倍。" },
          { q: "看不下去怎么办?", a: "正常。免费预览让你先温柔地试。" },
          { q: "多长?", a: "12 秒——犹豫需要每一秒。" },
        ],
      },
    },
  },
  {
    slug: "animate-old-photos",
    trendTag: "Animate Old Photos",
    copy: {
      en: {
        title: "Animate Old Photos — Blinks, Smiles and a Look at the Camera",
        description:
          "Animate old photos with AI: the person in your old photo blinks, smiles and looks at the camera. From one photo, in a few minutes, no app.",
        h1: "Animate old photos — the album starts moving",
        subtitle:
          "One scanned photo in, and the person in it blinks, smiles and looks at the camera — a few minutes per clip, from prints decades old.",
        shortAnswer:
          "Old photos hold faces that never moved. This effect gives them one small life: a blink, a smile, a look at the camera — from one scan, minutes per person, no app.",
        stages: enStages,
        howSteps: [
          { t: "Scan or photograph the print", d: "The clearer the face, the better the motion." },
          { t: "Add it", d: "One photo, one person per clip." },
          { t: "Watch them move", d: "A blink, a smile, a slow look at the lens." },
          { t: "Send to family", d: "The group chat of cousins will go quiet." },
        ],
        why: [
          { t: "Decades-old prints work", d: "Scans, phone shots of albums — the face is what counts." },
          { t: "Gentle motion", d: "Small and natural — not a deepfake performance." },
          { t: "One person per clip", d: "Clean and focused." },
          { t: "Private", d: "Photos never published." },
        ],
        faq: [
          { q: "How old can the photo be?", a: "Anything with a clear face — 1950s prints render fine." },
          { q: "Does it add a voice?", a: "No — motion only. Combined with the hug effect for a fuller scene." },
          { q: "Group photos?", a: "One person per clip works best; crop to a single face." },
          { q: "Price?", a: "Standard credits per render; old-photo scans are a top use of the free preview." },
        ],
      },
      zh: {
        title: "让老照片动起来 —— 眨眼、微笑、看向镜头",
        description:
          "用 AI 让老照片动起来:老照片里的人会眨眼、微笑、看向镜头。一张照片几分钟一条,无需 App。",
        h1: "让老照片动起来 —— 相册开始呼吸",
        subtitle:
          "一张扫描照片进去,里面的人眨眼、微笑、看向镜头——每人几分钟,几十年前的照片也行。",
        shortAnswer:
          "老照片里的脸从来没动过。这个特效给他们一次小小的生命:一次眨眼、一个微笑、一次看向镜头——一张扫描件,几分钟一个人,无需 App。",
        stages: zhStages,
        howSteps: [
          { t: "扫描或翻拍照片", d: "脸越清晰,动作越好。" },
          { t: "上传", d: "一张照片一条视频,一次一个人。" },
          { t: "看 TA 动起来", d: "一次眨眼、一个微笑、缓缓看向镜头。" },
          { t: "发给家人", d: "表亲群会突然安静。" },
        ],
        why: [
          { t: "几十年前的照片可用", d: "扫描件、相册翻拍——关键是那张脸。" },
          { t: "动作克制", d: "小而自然——不是夸张的深伪表演。" },
          { t: "一人一条", d: "干净、聚焦。" },
          { t: "私密", d: "照片绝不公开。" },
        ],
        faq: [
          { q: "照片可以多老?", a: "只要脸清晰——五十年代的印刷照都能渲染。" },
          { q: "会有声音吗?", a: "不会——只有动作。搭配拥抱特效可以组成完整场景。" },
          { q: "合照怎么办?", a: "一人一条效果最好;裁出单张脸。" },
          { q: "价格?", a: "标准积分按渲染计;老照片是免费预览的最佳用途。" },
        ],
      },
    },
  },
  {
    slug: "gas-station-ai-trend",
    trendTag: "Gas Station AI Trend",
    genreHint: "golden hour gas station forecourt dance",
    copy: {
      en: {
        title: "Gas Station AI Trend — Golden Hour Dance on the Forecourt",
        description:
          "Do the gas station trend from a photo: a golden-hour dance on the forecourt, a selfie close-up and a step out of an everyday car. Ready in minutes, no app.",
        h1: "Gas station trend — the forecourt is the runway",
        subtitle:
          "One photo in, and the AI cuts to you dancing on a gas station forecourt at golden hour, close-up and all.",
        shortAnswer:
          "The gas station trend turns the most ordinary place into a music video set: golden hour, pumps, a step out of an everyday car, and you dancing like the forecourt is a runway. One photo, minutes, no app.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "Your everyday self — the contrast is the joke and the charm." },
          { t: "Tap once", d: "The forecourt scene and dance are pre-built." },
          { t: "Watch the transition", d: "Snapshot → golden hour → dance → close-up." },
          { t: "Post it", d: "It pairs perfectly with an everyday caption." },
        ],
        why: [
          { t: "Ordinary to iconic", d: "The most mundane setting, the most confident dance." },
          { t: "One photo", d: "Solo-friendly, no second face." },
          { t: "Pre-built sequence", d: "No prompt — one tap." },
          { t: "Minutes", d: "Render it on the way home." },
        ],
        faq: [
          { q: "Why a gas station?", a: "The trend started with clips at ordinary stations — the mundane setting is the charm." },
          { q: "Do I need to dance in real life?", a: "The AI dances for you — your face, choreographed moves." },
          { q: "Best photo?", a: "A plain everyday selfie — the bigger the glow-up, the better." },
          { q: "Length?", a: "Standard 12 seconds, vertical." },
        ],
      },
      zh: {
        title: "加油站 AI 趋势 —— 黄金时刻,加油机前起舞",
        description:
          "用一张照片做加油站趋势:黄金时刻在加油机前跳舞、自拍特写、从 everyday 小车走下。几分钟出片,无需 App。",
        h1: "加油站趋势 —— 加油站就是 T 台",
        subtitle:
          "一张照片进,AI 切到黄金时刻你在加油站前跳舞的画面,还有特写。",
        shortAnswer:
          "加油站趋势把最普通的地方变成 MV 片场:黄金时刻、加油机、从 everyday 小车里走出来、跳得像前在走红毯。一张照片,几分钟,无需 App。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "日常的你——反差既是笑点也是魅力。" },
          { t: "点一次", d: "加油站场景和舞蹈都是预置的。" },
          { t: "看转场", d: "快照 → 黄金时刻 → 舞蹈 → 特写。" },
          { t: "发布", d: "配一句日常文案效果翻倍。" },
        ],
        why: [
          { t: "平凡变经典", d: "最普通的地方,最自信的舞。" },
          { t: "一张照片", d: "单人友好,无需第二张脸。" },
          { t: "序列预置", d: "不用提示词——一次点击。" },
          { t: "几分钟", d: "回家路上就出片。" },
        ],
        faq: [
          { q: "为什么是加油站?", a: "趋势始于在普通加油站拍的爆款——平淡的场景就是魅力。" },
          { q: "我需要会跳舞吗?", a: "AI 替你跳——你的脸,编好的动作。" },
          { q: "用什么照片?", a: "普通日常自拍——反差越大越好。" },
          { q: "多长?", a: "标准 12 秒,竖屏。" },
        ],
      },
    },
  },
  {
    slug: "restore-old-photos",
    trendTag: "Restore Old Photos",
    copy: {
      en: {
        title: "Restore Old Photos Free — Scratches, Fade and Blur Fixed",
        description:
          "Restore old photos free with AI: fix scratches, fading and blur, add natural color, then make the photo move or add yours for a hug. 3 free a day.",
        h1: "Restore old photos — free, 3 a day",
        subtitle:
          "Upload an old photo and AI fixes scratches, fading and blur, adds natural color — then you can animate it or hug the person in it.",
        shortAnswer:
          "Restoration is the free foundation of every memory effect on this site: 3 free restores a day, fixing scratches, fade and blur — then animate it, or add your photo for a hug with someone you miss.",
        stages: enStages,
        howSteps: [
          { t: "Upload the old photo", d: "Scans or album photos — the clearer the better." },
          { t: "Restore free", d: "3 restores a day, no credits needed." },
          { t: "Add color if you want", d: "Natural color for black-and-white prints." },
          { t: "Continue to effects", d: "Animate it, or hug the person — the restored photo is the perfect input." },
        ],
        why: [
          { t: "Actually free", d: "3 a day, no credits — restoration is the gateway, not the upsell." },
          { t: "Natural results", d: "Fixes damage without plastic skin." },
          { t: "Feeds every other effect", d: "Restored photos render better hugs and animations." },
          { t: "Family archive speed", d: "Three a day quietly restores a whole album in a month." },
        ],
        faq: [
          { q: "Is it really free?", a: "3 restores a day, no credits. The paid part is the effects you apply after." },
          { q: "Does it colorize?", a: "Yes — natural color for black-and-white originals." },
          { q: "Can I restore a blurry face?", a: "It fixes mild blur; faces too small in the frame render weaker." },
          { q: "Then what?", a: "Animate it, hug the person, or keep the clean scan — your call." },
        ],
      },
      zh: {
        title: "免费修复老照片 —— 划痕、褪色、模糊一次搞定",
        description:
          "用 AI 免费修复老照片:修划痕、褪色、模糊,加自然色彩,然后让照片动起来,或加上你抱抱照片里的人。每天 3 张免费。",
        h1: "修复老照片 —— 免费,每天 3 张",
        subtitle:
          "上传老照片,AI 修复划痕、褪色和模糊,加自然色彩——然后可以让它动起来,或和照片里的人拥抱。",
        shortAnswer:
          "修复是全站所有回忆特效的免费地基:每天 3 张免费,修划痕、褪色、模糊——然后让它动起来,或加上你的照片和想念的人拥抱。",
        stages: zhStages,
        howSteps: [
          { t: "上传老照片", d: "扫描件或相册翻拍——越清晰越好。" },
          { t: "免费修复", d: "每天 3 张,不耗积分。" },
          { t: "可选上色", d: "黑白照片加自然色彩。" },
          { t: "继续特效", d: "让它动起来,或和 TA 拥抱——修复后的照片是最佳输入。" },
        ],
        why: [
          { t: "真免费", d: "每天 3 张不要积分——修复是入口不是套路。" },
          { t: "效果自然", d: "修损伤不出塑料脸。" },
          { t: "给其他特效供料", d: "修复后的照片渲染拥抱和动画效果更好。" },
          { t: "家庭档案速度", d: "每天三张,一个月悄悄修完整本相册。" },
        ],
        faq: [
          { q: "真的免费吗?", a: "每天 3 张不耗积分。收费的是之后叠加的特效。" },
          { q: "能上色吗?", a: "能——黑白原照加自然色彩。" },
          { q: "模糊的脸能修吗?", a: "轻度模糊可以;画面里太小的脸渲染偏弱。" },
          { q: "然后呢?", a: "让它动起来、抱抱照片里的人,或留一张干净扫描——你说了算。" },
        ],
      },
    },
  },
  {
    slug: "80s-ai-video",
    trendTag: "80s AI Video",
    genreHint: "1985 VHS camcorder home video, synth-pop",
    copy: {
      en: {
        title: "80s AI Video — Your Photos as a 1985 VHS Home Video",
        description:
          "What would you look like in the 80s? One photo, or one of you both, becomes a 1985 VHS camcorder home video: big hair, synth-pop, a sunny backyard.",
        h1: "80s AI video — your photos on a VHS tape",
        subtitle:
          "One photo in, and AI renders you two in a 1985 camcorder home video — big hair, warm colors, synth-pop on the tape.",
        shortAnswer:
          "The 80s trend answers \"what would we look like on VHS?\": big hair, sunny backyard, camcorder grain, synth-pop. One photo in — or one of you both — and the tape renders in minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add one or two photos", d: "Solo nostalgia or a duo blast from the past." },
          { t: "Tap once", d: "The 1985 look is pre-built — tape grain included." },
          { t: "Watch the decade", d: "Big hair, warm colors, synth-pop." },
          { t: "Post it", d: "It pairs perfectly with \"found this old tape\"." },
        ],
        why: [
          { t: "VHS done right", d: "Grain, tracking and colors that read as 1985, not as a filter." },
          { t: "Solo or duo", d: "One or two photos both work." },
          { t: "Synth-pop included", d: "The audio comes with the tape." },
          { t: "Family hit", d: "Parents are the target audience and they love it." },
        ],
        faq: [
          { q: "Will I get big hair?", a: "Usually — the era styling is part of the render." },
          { q: "Can I choose the scene?", a: "The default is a sunny backyard; themed scenes rotate with trends." },
          { q: "Two photos?", a: "Yes — a duo tape is the shared version." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "80 年代 AI 视频 —— 你的照片变成 1985 录像带",
        description:
          "80 年代的你会是什么样?一张照片,或你们俩的,变成 1985 年的 VHS 家庭录像:蓬松发型、合成器流行乐、阳光后院。",
        h1: "80 年代 AI 视频 —— 你的照片上录像带",
        subtitle:
          "一张照片进,AI 渲染出你们俩在 1985 年的家庭录像——蓬松发型、暖色、磁带里的合成器流行乐。",
        shortAnswer:
          "80 年代趋势回答的是\"我们在录像带上是什么样\":蓬松发型、阳光后院、摄像机颗粒感、合成器流行乐。一张照片——或你们俩的——几分钟渲染出这盘带子。",
        stages: zhStages,
        howSteps: [
          { t: "上传一两张照片", d: "单人怀旧或双人穿越。" },
          { t: "点一次", d: "1985 造型预置——磁带颗粒感自带。" },
          { t: "看那个年代", d: "蓬松发型、暖色、合成器流行乐。" },
          { t: "发布", d: "配\"翻到一盘旧带子\"效果绝佳。" },
        ],
        why: [
          { t: "VHS 味道正", d: "颗粒、跳带、色彩——读起来是 1985 而不是滤镜。" },
          { t: "单人双人都行", d: "一张或两张照片都可以。" },
          { t: "合成器流行乐自带", d: "音频跟着带子一起到。" },
          { t: "家庭爆款", d: "父母就是目标观众,而且他们爱看。" },
        ],
        faq: [
          { q: "会有蓬松发型吗?", a: "通常会有——年代造型是渲染的一部分。" },
          { q: "能选场景吗?", a: "默认阳光后院;主题场景随趋势轮换。" },
          { q: "两张照片?", a: "可以——双人带是共享版。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "ai-bald-filter",
    trendTag: "AI Bald Filter",
    copy: {
      en: {
        title: "AI Bald Filter Video — Pop, Sparkles, and the Hair Is Gone",
        description:
          "AI bald filter video from one photo: pop, sparkles, and all your hair is gone. See what you would look like bald, or prank a friend. Ready in minutes, no app.",
        h1: "AI bald filter — the reveal, on video",
        subtitle:
          "One photo in, and the AI pops your hair away with sparkles — see yourself bald, or prank a friend with their bald reveal.",
        shortAnswer:
          "The bald filter trend is the prank that works every time: pop, sparkles, hair gone — the reaction does the rest. One photo, minutes, and it's a video not a still, which is why it lands.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "Yours, or a friend's (with their sense of humor)." },
          { t: "Tap once", d: "The pop-and-sparkle reveal is pre-built." },
          { t: "Watch the reveal", d: "Sparkles pop, hair vanishes, reaction camera earns its keep." },
          { t: "Send it", d: "Unlock HD and drop it in the chat." },
        ],
        why: [
          { t: "Universal prank", d: "Works on every face, every age group." },
          { t: "Video, not still", d: "The pop animation is what makes it funny." },
          { t: "One photo, one tap", d: "No prompt, no setup." },
          { t: "Minutes", d: "Fast enough to catch them online." },
        ],
        faq: [
          { q: "Is it mean?", a: "It's the classic barber-shop joke — send it to people who can take it." },
          { q: "Will it look real?", a: "Real enough for a double-take, silly enough to laugh at." },
          { q: "Can I do myself first?", a: "Recommended — self-roast licenses the prank." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "AI 光头滤镜视频 —— 啪一下,头发没了",
        description:
          "用一张照片做 AI 光头滤镜视频:啪、闪一下,头发全没了。看看自己光头的样子,或整一下朋友。几分钟出片,无需 App。",
        h1: "AI 光头滤镜 —— 揭晓的那一瞬间",
        subtitle:
          "一张照片进,AI 啪一下让头发消失——看自己的光头,或用朋友的揭晓整 TA。",
        shortAnswer:
          "光头滤镜是每次都成功的整蛊:啪、闪光、头发没了——剩下交给反应。一张照片,几分钟,而且是视频不是静态图,所以效果好。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "你的,或朋友的(确认 TA 开得起玩笑)。" },
          { t: "点一次", d: "啪-闪-揭晓的序列是预置的。" },
          { t: "看揭晓", d: "闪光炸开、头发消失,反应镜头功不可没。" },
          { t: "发出去", d: "解锁高清,丢进群聊。" },
        ],
        why: [
          { t: "万能整蛊", d: "任何脸、任何年龄组都有效。" },
          { t: "是视频不是图", d: "啪的动画才是笑点。" },
          { t: "一张照片一次点击", d: "零提示词零设置。" },
          { t: "几分钟", d: "快到能趁 TA 在线抓现行。" },
        ],
        faq: [
          { q: "会不会过分?", a: "经典理发店玩笑——发给开得起玩笑的人。" },
          { q: "会像真的吗?", a: "真实到让人愣一下,搞笑到让人笑出声。" },
          { q: "可以先做自己的吗?", a: "强烈推荐——自黑给整蛊授权。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "ai-dance-video",
    trendTag: "AI Dance Video",
    genreHint: "neon studio dance, spin and final pose",
    copy: {
      en: {
        title: "AI Dance Video — You Dancing in a Neon Studio",
        description:
          "How to make an AI dance video from a photo: the AI dance generator makes you, or the two of you, dance in a neon studio, with a spin and a final pose.",
        h1: "AI dance video — the neon studio session",
        subtitle:
          "One photo in (two for a duet), and AI renders you dancing in a neon studio — spin included, final pose guaranteed.",
        shortAnswer:
          "The AI dance effect puts you in a neon studio with real choreography: a spin, a groove, a final pose. One photo for solo, two for a duet — minutes per render, no dancing ability required.",
        stages: enStages,
        howSteps: [
          { t: "Add your photo", d: "One for solo; two faces make it a duet." },
          { t: "Tap once", d: "The choreography is pre-built — no prompts." },
          { t: "Watch the routine", d: "Groove, spin, final pose." },
          { t: "Post it", d: "Neon studio reads great on dark-mode feeds." },
        ],
        why: [
          { t: "Real choreography", d: "Not a wobble — a routine with a beginning and an end." },
          { t: "Duet mode", d: "Two faces, synchronized moves." },
          { t: "Zero skills needed", d: "Your body type doesn't matter to the render." },
          { t: "Minutes", d: "Render before the song in your head ends." },
        ],
        faq: [
          { q: "Can I pick the dance?", a: "The routine is pre-built per trend page; more styles rotate in." },
          { q: "Two left feet?", a: "Irrelevant — the AI does the dancing, you supply the face." },
          { q: "Duets?", a: "Yes — two photos, one stage, synchronized." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "AI 舞蹈视频 —— 霓虹录音棚里起舞的你",
        description:
          "用一张照片做 AI 舞蹈视频:AI 舞蹈生成器让你(或你们俩)在霓虹录音棚跳舞,带旋转和定格 pose。",
        h1: "AI 舞蹈视频 —— 霓虹棚里的那支舞",
        subtitle:
          "一张照片进(双人上传两张),AI 渲染你在霓虹棚里跳舞——自带旋转,保证定格。",
        shortAnswer:
          "AI 舞蹈特效把你放进霓虹录音棚,跳一段真实编排:旋转、律动、定格 pose。单人一张照片,双人两张——几分钟一条,完全不需要舞蹈基础。",
        stages: zhStages,
        howSteps: [
          { t: "上传照片", d: "单人一张;两张脸就是双人舞。" },
          { t: "点一次", d: "编舞预置——不用提示词。" },
          { t: "看动作", d: "律动、旋转、定格。" },
          { t: "发布", d: "霓虹棚在深色模式信息流里格外亮眼。" },
        ],
        why: [
          { t: "真编舞", d: "不是抖动——有开头有结尾的一套动作。" },
          { t: "双人模式", d: "两张脸,同步动作。" },
          { t: "零基础", d: "体型和舞龄对渲染毫无影响。" },
          { t: "几分钟", d: "比脑内放完那首歌还快。" },
        ],
        faq: [
          { q: "能选舞种吗?", a: "每个趋势页的编排是预置的;更多舞种轮换上线。" },
          { q: "同手同脚?", a: "无所谓——AI 跳舞,你出脸。" },
          { q: "能双人吗?", a: "能——两张照片,一个舞台,同步起舞。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "ai-halloween-costume",
    trendTag: "AI Halloween Costume",
    genreHint: "halloween house party, sparkle costume reveal",
    copy: {
      en: {
        title: "AI Halloween Costume — Try the Reveal Before the Party",
        description:
          "Try the AI Halloween costume filter on your photo: a house party, a swirl of sparkles, and you (or the two of you) in costume. Ready in minutes, no app.",
        h1: "AI Halloween costume — the reveal, without the store run",
        subtitle:
          "One photo in, and AI drops you into a house party with a sparkle-swirl costume reveal — solo or as a duo.",
        shortAnswer:
          "The Halloween costume trend is the party reveal without the costume shop: sparkles swirl, and you're in costume — solo or as a couple. One photo, minutes, and you can test five costumes before buying one.",
        stages: enStages,
        howSteps: [
          { t: "Add your photo", d: "Solo or one photo each for a couple costume." },
          { t: "Tap once", d: "The party scene and reveal are pre-built." },
          { t: "Watch the swirl", d: "Sparkles, costume, party lights." },
          { t: "Pick your real costume", d: "Use the render as the fitting room." },
        ],
        why: [
          { t: "Costume fitting room", d: "Try looks before spending on fabric." },
          { t: "Couple mode", d: "Matching costumes, one render." },
          { t: "Party energy", d: "House party set with real lighting." },
          { t: "Minutes", d: "October runs on speed." },
        ],
        faq: [
          { q: "Which costumes can I get?", a: "The reveal rotates with the season — classic and pop-culture looks." },
          { q: "Can I post it as my costume?", a: "Tag it as AI — the joke lands better honest." },
          { q: "Couple costumes?", a: "Yes — two photos, one matching reveal." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "AI 万圣节服装 —— 派对前先看变装揭晓",
        description:
          "在照片上试 AI 万圣节服装滤镜:一场家庭派对、一圈闪光的变装——你(或你们俩)穿上戏服。几分钟出片,无需 App。",
        h1: "AI 万圣节服装 —— 不用跑商店的变装揭晓",
        subtitle:
          "一张照片进,AI 把你放进一场家庭派对,闪光旋转中变装揭晓——单人或双人。",
        shortAnswer:
          "万圣节服装趋势就是不用跑店的派对揭晓:闪光旋转,戏服上身——单人或情侣款。一张照片,几分钟,买布料前能试五套。",
        stages: zhStages,
        howSteps: [
          { t: "上传照片", d: "单人或情侣各一张,做情侣装。" },
          { t: "点一次", d: "派对场景和揭晓都是预置的。" },
          { t: "看旋转", d: "闪光、戏服、派对灯。" },
          { t: "选真服装", d: "把渲染当试衣间。" },
        ],
        why: [
          { t: "变装试衣间", d: "花布料钱之前先试样子。" },
          { t: "情侣模式", d: "匹配装,一次渲染。" },
          { t: "派对能量", d: "家庭派对场景配真实灯光。" },
          { t: "几分钟", d: "十月拼的就是速度。" },
        ],
        faq: [
          { q: "能得到哪些服装?", a: "揭晓款式随季节轮换——经典款和流行款都有。" },
          { q: "能当真服装发吗?", a: "标注 AI——诚实反而更好笑。" },
          { q: "情侣装?", a: "能——两张照片,一次匹配揭晓。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "ai-tribute-video",
    trendTag: "AI Tribute Video",
    copy: {
      en: {
        title: "AI Tribute Video — a Gentle Way to Remember",
        description:
          "How to make an AI tribute video from photos of someone who passed: a gentle hug, or an old portrait that blinks and smiles. No prompt, no app, a few minutes.",
        h1: "AI tribute video — gentle, private, yours",
        subtitle:
          "Combine the gentle hug and the animated old photo into a quiet tribute — no prompts, no gimmicks, just a moment that moves.",
        shortAnswer:
          "A tribute video isn't an effect for laughs — it's the hug effect and the animated portrait combined, built soft and private. Photos of someone you miss, a gentle render, minutes per clip.",
        stages: enStages,
        howSteps: [
          { t: "Choose the moment", d: "A gentle hug, or the portrait that blinks and smiles." },
          { t: "Add the photos", d: "Yours and theirs — old prints are fine." },
          { t: "Render quietly", d: "Soft movement, no gimmicks." },
          { t: "Keep or share", d: "Private by default — you decide who sees it." },
        ],
        why: [
          { t: "Built for grief, not virality", d: "Softer settings than any other effect." },
          { t: "Old photos welcome", d: "Scans render beautifully." },
          { t: "Private forever", d: "Delete your photos anytime." },
          { t: "No pressure", d: "Free preview first." },
        ],
        faq: [
          { q: "Is this the same as the hug page?", a: "It combines the hug and the animated portrait — the tribute framing is the point." },
          { q: "Will it feel respectful?", a: "The motion is deliberately slow and small. Judge with the free preview." },
          { q: "Can family collaborate?", a: "One render per pair of photos; share privately after." },
          { q: "Price?", a: "Standard credits; failed renders are never charged." },
        ],
      },
      zh: {
        title: "AI 纪念视频 —— 温柔的怀念方式",
        description:
          "用逝者的照片做 AI 纪念视频:一个温柔的拥抱,或一张会眨眼微笑的旧肖像。无需提示词,无需 App,几分钟。",
        h1: "AI 纪念视频 —— 温柔、私密、属于你",
        subtitle:
          "把温柔的拥抱和会动的老照片合成一段安静的纪念——没有提示词,没有花活,只有一个会动的瞬间。",
        shortAnswer:
          "纪念视频不是搞笑特效——它是拥抱特效和动态肖像的组合,做得更柔、更私密。想念的人的照片,温柔的渲染,几分钟一条。",
        stages: zhStages,
        howSteps: [
          { t: "选那一刻", d: "温柔的拥抱,或会眨眼微笑的肖像。" },
          { t: "上传照片", d: "你的和 TA 的——老照片扫描件也行。" },
          { t: "安静渲染", d: "柔和动作,没有花活。" },
          { t: "珍藏或分享", d: "默认私密——谁看到由你决定。" },
        ],
        why: [
          { t: "为怀念而生", d: "比任何特效都更柔的参数。" },
          { t: "老照片友好", d: "扫描件渲染效果很好。" },
          { t: "永远私密", d: "随时删除照片。" },
          { t: "没有催促", d: "先看免费预览。" },
        ],
        faq: [
          { q: "和拥抱页一样吗?", a: "它是拥抱 + 动态肖像的组合——纪念的框架是重点。" },
          { q: "会显得庄重吗?", a: "动作刻意缓慢克制。用免费预览自己判断。" },
          { q: "家人能一起做吗?", a: "一对照片一条;做完私下分享。" },
          { q: "价格?", a: "标准积分;失败绝不扣费。" },
        ],
      },
    },
  },
  {
    slug: "ai-video-of-yourself",
    trendTag: "AI Video of Yourself",
    copy: {
      en: {
        title: "AI Video of Yourself — One Photo, One Effect, One Clip",
        description:
          "How to make an AI video of yourself: add one clear photo, pick an effect like Earth Zoom Out or Money Rain, and get your clip in a few minutes. No app.",
        h1: "AI video of yourself — the solo menu",
        subtitle:
          "One photo, one effect — Earth zoom out, clones, dances, 80s tape — and your clip renders in minutes.",
        shortAnswer:
          "\"AI video of myself\" is the solo version of every trend: one clear photo, pick the effect, minutes later you have a clip of yourself in it. This page is the menu.",
        stages: enStages,
        howSteps: [
          { t: "Add one clear photo", d: "Front-facing, well lit — the solo input." },
          { t: "Pick an effect", d: "Earth zoom, clones, dance, 80s tape — the grid is the menu." },
          { t: "Render", d: "Minutes per clip." },
          { t: "Build your feed", d: "One photo can fuel a week of posts." },
        ],
        why: [
          { t: "No second person needed", d: "Every effect here takes one face." },
          { t: "One photo, many clips", d: "Re-render the same photo across effects." },
          { t: "Fast", d: "Minutes per clip." },
          { t: "Cheapest entry", d: "Solo effects start at 5 credits." },
        ],
        faq: [
          { q: "Which effects work solo?", a: "Earth zoom, clones, dance, 80s tape, bald reveal — the solo-friendly set." },
          { q: "Can I use the same photo twice?", a: "Yes — one photo across effects is the efficient way to feed a feed." },
          { q: "Group photo?", a: "Crop to one clear face — solo effects want one subject." },
          { q: "Price?", a: "From 5 credits for standard renders." },
        ],
      },
      zh: {
        title: "自己的 AI 视频 —— 一张照片一个特效一条片",
        description:
          "做自己 AI 视频的方法:上传一张清晰照片,选地球拉远或金钱雨等特效,几分钟得到你的短片。无需 App。",
        h1: "自己的 AI 视频 —— 单人菜单",
        subtitle:
          "一张照片、一个特效——地球拉远、克隆、舞蹈、80 年代录像带——几分钟渲染出你的短片。",
        shortAnswer:
          "\"做自己 AI 视频\"是所有趋势的单人版:一张清晰照片,选特效,几分钟后你就是短片主角。本页就是菜单。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张清晰照片", d: "正脸、光线足——单人输入。" },
          { t: "选特效", d: "地球拉远、克隆、舞蹈、80 年代——网格就是菜单。" },
          { t: "渲染", d: "每条几分钟。" },
          { t: "养号", d: "一张照片够喂一周的更新。" },
        ],
        why: [
          { t: "不需要第二个人", d: "这里的特效都只要一张脸。" },
          { t: "一张照片多条片", d: "同一张照片跨特效重渲染。" },
          { t: "快", d: "每条几分钟。" },
          { t: "最便宜入口", d: "单人特效 5 积分起。" },
        ],
        faq: [
          { q: "哪些特效支持单人?", a: "地球拉远、克隆、舞蹈、80 年代、光头揭晓——单人友好套装。" },
          { q: "同一张照片能用两次吗?", a: "能——一张照片跨特效是养号最高效的玩法。" },
          { q: "合照?", a: "裁出一张清晰脸——单人特效只要一个主体。" },
          { q: "价格?", a: "标准渲染 5 积分起。" },
        ],
      },
    },
  },
  {
    slug: "hug-your-younger-self",
    trendTag: "Hug Your Younger Self",
    genreHint: "polaroid frame hug, white curtains, soft light",
    copy: {
      en: {
        title: "Hug Your Younger Self — the Polaroid Trend From Two Photos",
        description:
          "Do the hug your younger self AI trend: a photo of you today and one of you as a child, hugging inside a Polaroid frame in front of white curtains. No prompt, no app.",
        h1: "Hug your younger self — the Polaroid moment",
        subtitle:
          "A photo of you today, a photo of you as a child, and AI renders the hug inside a Polaroid frame — white curtains, soft light.",
        shortAnswer:
          "The hug-your-younger-self trend works because the casting is perfect: you, playing both roles. Two photos — today and childhood — and AI renders the hug inside a Polaroid frame, curtains and all.",
        stages: enStages,
        howSteps: [
          { t: "Find your childhood photo", d: "Scans work. Face clear, eyes visible." },
          { t: "Add today's photo", d: "Recent, front-facing." },
          { t: "Render the Polaroid", d: "The hug inside the frame, curtains behind." },
          { t: "Post with one line", d: "\"I made it\" says enough." },
        ],
        why: [
          { t: "Perfect casting", d: "You were always the right person to play you." },
          { t: "Polaroid framing", d: "The trend's signature frame is built in." },
          { t: "Old scans fine", d: "Childhood photos from any decade." },
          { t: "Free preview", d: "Try it gently before unlocking." },
        ],
        faq: [
          { q: "What if I have no childhood photos?", a: "Any young photo of you works — school years count." },
          { q: "Do the ages need to look far apart?", a: "It lands best when they do, but any gap works." },
          { q: "Can I hug my pet's younger self?", a: "People do — same two-photo flow." },
          { q: "Price?", a: "Standard credits per render; failed renders are free." },
        ],
      },
      zh: {
        title: "拥抱小时候的自己 —— 两张照片的拍立得趋势",
        description:
          "做\"拥抱小时候的自己\"AI 趋势:今天的你一张、小时候的你一张,在白色窗帘前的拍立得相框里拥抱。无需提示词,无需 App。",
        h1: "拥抱小时候的自己 —— 拍立得那一刻",
        subtitle:
          "今天的你一张、小时候的你一张,AI 渲染相框里的拥抱——白色窗帘,柔光。",
        shortAnswer:
          "这个趋势成立是因为选角完美:你,一人分饰两角。两张照片——今天和童年——AI 渲染拍立得相框里的拥抱,窗帘都在。",
        stages: zhStages,
        howSteps: [
          { t: "找童年照片", d: "扫描件就行。脸清晰、眼睛可见。" },
          { t: "上传今天的照片", d: "近期正脸。" },
          { t: "渲染拍立得", d: "相框里的拥抱,窗帘作背景。" },
          { t: "配一句话发布", d: "\"我走到了\"就足够。" },
        ],
        why: [
          { t: "选角完美", d: "扮演你的最佳人选一直是你。" },
          { t: "拍立得画框", d: "趋势标志性边框内置。" },
          { t: "老扫描件可用", d: "任何年代的童年照。" },
          { t: "免费预览", d: "先温柔地试。" },
        ],
        faq: [
          { q: "没有童年照片怎么办?", a: "任何年轻的你都行——学生时代的也算。" },
          { q: "年龄差要大吗?", a: "大一点更打动人,但任何年龄差都可以。" },
          { q: "能抱小时候的宠物吗?", a: "很多人做——同样的双照片流程。" },
          { q: "价格?", a: "标准积分按渲染计;失败免费。" },
        ],
      },
    },
  },
  {
    slug: "ai-baby-generator",
    trendTag: "AI Baby Generator",
    copy: {
      en: {
        title: "AI Baby Generator — What Would Your Baby Look Like?",
        description:
          "AI baby generator from two photos: a short video of you and your partner holding a newborn with a little of each of you. Ready in minutes, no app.",
        h1: "AI baby generator — the newborn preview",
        subtitle:
          "One photo of each partner, and AI renders a short video of you two holding a newborn that looks a little like both of you.",
        shortAnswer:
          "The AI baby generator answers the question every couple asks: two partner photos in, a video of you two holding a baby that blends you both — a preview, rendered in minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add both partners", d: "One clear photo each, front-facing." },
          { t: "Tap once", d: "The newborn scene is pre-built." },
          { t: "Meet the blend", d: "A little of you, a little of them." },
          { t: "Send to the chat", d: "The family will have opinions." },
        ],
        why: [
          { t: "The couple question, answered", d: "The most fun argument-settler on the internet." },
          { t: "Video, not a still", d: "You two holding the baby, moving." },
          { t: "One photo each", d: "No couple photo needed." },
          { t: "Minutes", d: "Render before the date ends." },
        ],
        faq: [
          { q: "Is it accurate?", a: "It's entertainment — a blend that reads like both of you, not genetics." },
          { q: "Can we use old photos?", a: "Recent clear photos render best." },
          { q: "Pets?", a: "Pet-and-owner baby renders are a whole sub-genre." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "AI 宝宝生成器 —— 你们的孩子会长什么样?",
        description:
          "用两张照片做 AI 宝宝生成器:你和伴侣抱着新生儿的短视频,宝宝兼有你们俩的样子。几分钟出片,无需 App。",
        h1: "AI 宝宝生成器 —— 新生儿预览",
        subtitle:
          "双方各一张照片,AI 渲染你们俩抱着新生儿的短视频——宝宝像你一点,也像 TA 一点。",
        shortAnswer:
          "AI 宝宝生成器回答的是情侣都在问的问题:双方照片进,你们俩抱着融合了你们俩特征的宝宝的视频——一个预览,几分钟渲染。",
        stages: zhStages,
        howSteps: [
          { t: "上传双方照片", d: "每人一张清晰正脸。" },
          { t: "点一次", d: "新生儿场景预置。" },
          { t: "见面", d: "像你一点,也像 TA 一点。" },
          { t: "发家庭群", d: "长辈们会有很多意见。" },
        ],
        why: [
          { t: "情侣之问有了答案", d: "互联网上最好玩的终结争论工具。" },
          { t: "视频不是静态图", d: "你们俩抱着宝宝,还会动。" },
          { t: "一人一张", d: "不需要合照。" },
          { t: "几分钟", d: "约会结束前就能出片。" },
        ],
        faq: [
          { q: "准吗?", a: "这是娱乐——像你们俩的融合,不是遗传学。" },
          { q: "能用旧照片吗?", a: "近期清晰照片效果最好。" },
          { q: "宠物呢?", a: "宠物和主人的宝宝渲染已经是独立流派。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "car-jump-ai-video",
    trendTag: "Car Jump AI Video",
    genreHint: "desert highway, SUV slow-motion jump",
    copy: {
      en: {
        title: "Car Jump AI Video — Snap Your Fingers, an SUV Flies Over",
        description:
          "Do the viral car jump AI video from one photo: you sit cool in the desert, snap your fingers and an SUV flies over you in slow motion. No app.",
        h1: "Car jump — the action movie you star in",
        subtitle:
          "One photo in, and AI renders the desert scene: you sitting cool, a snap of the fingers, an SUV flying over in slow motion.",
        shortAnswer:
          "The car jump trend is pure action-movie energy from one still photo: desert, slow motion, an SUV over your head, triggered by a finger snap. One photo in, minutes out.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "Sitting or standing — cool is the dress code." },
          { t: "Tap once", d: "Desert, SUV and slow-mo are pre-built." },
          { t: "Snap", d: "The fingers trigger the jump." },
          { t: "Post it", d: "Action-movie posters wish they were this easy." },
        ],
        why: [
          { t: "Action scene, one photo", d: "No stunt budget required." },
          { t: "Pre-built sequence", d: "Desert, SUV, slow motion — one tap." },
          { t: "Slow-mo money shot", d: "The jump reads great on vertical." },
          { t: "Minutes", d: "Faster than the trailer." },
        ],
        faq: [
          { q: "Is it dangerous?", a: "There's no real car — it's all rendered from your photo." },
          { q: "What car is it?", a: "A generic SUV — no brands, by design." },
          { q: "Can I sit in a chair?", a: "Any cool seated pose works; the scene does the rest." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "汽车飞跃 AI 视频 —— 打个响指,SUV 从头顶飞过",
        description:
          "用一张照片做爆款汽车飞跃 AI 视频:你酷酷地坐在沙漠里,打个响指,一辆 SUV 慢动作从你头顶飞过。无需 App。",
        h1: "汽车飞跃 —— 你主演的动作片",
        subtitle:
          "一张照片进,AI 渲染沙漠场景:酷酷坐着的你,一个响指,SUV 慢动作飞过头顶。",
        shortAnswer:
          "汽车飞跃趋势把动作片能量装进一张静态照片:沙漠、慢动作、从头顶飞过的 SUV,由一个响指触发。一张照片进,几分钟出片。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "坐着站着都行——酷是着装要求。" },
          { t: "点一次", d: "沙漠、SUV、慢动作都是预置的。" },
          { t: "打响指", d: "手指触发飞跃。" },
          { t: "发布", d: "动作片预告片都羡慕这个效率。" },
        ],
        why: [
          { t: "一张照片的动作戏", d: "不用请特技预算。" },
          { t: "序列预置", d: "沙漠、SUV、慢动作——一次点击。" },
          { t: "慢动作名场面", d: "飞跃在竖屏上格外好看。" },
          { t: "几分钟", d: "比预告片还快。" },
        ],
        faq: [
          { q: "危险吗?", a: "没有真车——全部由你的照片渲染。" },
          { q: "是什么车?", a: "通用 SUV——刻意不带品牌。" },
          { q: "坐椅子行吗?", a: "任何酷的坐姿都行,场景负责其余。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "ai-family-video",
    trendTag: "AI Family Video",
    copy: {
      en: {
        title: "AI Family Video — Hugs, Dances and Grandparents Brought to Life",
        description:
          "Make an AI family video from your photos: a hug with a parent, a slow dance, grandparents brought to life, even your future baby. Ready in minutes, no app.",
        h1: "AI family video — the whole family, one page",
        subtitle:
          "The family effects in one place: hugs with parents, slow dances, animated grandparents, future babies — two photos each.",
        shortAnswer:
          "The family video page bundles the effects that matter at home: hug a parent, slow dance, animate old grandparents, meet the future baby. Two photos per scene, minutes per render.",
        stages: enStages,
        howSteps: [
          { t: "Pick the scene", d: "Hug, dance, animated portrait or future baby." },
          { t: "Add two photos", d: "You and the family member — any years apart." },
          { t: "Render", d: "Minutes per scene." },
          { t: "Send it to the family chat", d: "This is the content grandparents forward." },
        ],
        why: [
          { t: "One page, whole family", d: "No hunting through effect menus." },
          { t: "Old photos welcome", d: "Scans of grandparents work beautifully." },
          { t: "Private", d: "Family photos never published." },
          { t: "Free preview", d: "Try each scene gently." },
        ],
        faq: [
          { q: "Which scenes are included?", a: "Hug, slow dance, animated portrait and future baby — each with its own flow." },
          { q: "Grandparents' old photos?", a: "Scans work — clarity of the face is what counts." },
          { q: "Can we do a group scene?", a: "Scenes are duos; render several and post as a set." },
          { q: "Price?", a: "Standard credits per scene, from 5." },
        ],
      },
      zh: {
        title: "AI 家庭视频 —— 拥抱、慢舞、爷爷奶奶动起来",
        description:
          "用你的照片做 AI 家庭视频:和父母拥抱、慢舞、让爷爷奶奶动起来,甚至见未来的宝宝。几分钟出片,无需 App。",
        h1: "AI 家庭视频 —— 一家人,一个页面",
        subtitle:
          "家庭特效集齐一页:和父母拥抱、慢舞、老照片里的爷爷奶奶、未来的宝宝——每个场景两张照片。",
        shortAnswer:
          "家庭视频页打包了家里最需要的特效:抱抱父母、慢舞、让老照片里的爷爷奶奶动起来、见未来的宝宝。每个场景两张照片,几分钟一条。",
        stages: zhStages,
        howSteps: [
          { t: "选场景", d: "拥抱、慢舞、动态肖像或未来宝宝。" },
          { t: "上传两张照片", d: "你和那位家人——隔多少年都行。" },
          { t: "渲染", d: "每条几分钟。" },
          { t: "发到家庭群", d: "这正是长辈们会转发的内容。" },
        ],
        why: [
          { t: "一页装下一家人", d: "不用在特效菜单里翻找。" },
          { t: "老照片友好", d: "爷爷奶奶的扫描件效果极佳。" },
          { t: "私密", d: "家庭照片绝不公开。" },
          { t: "免费预览", d: "每个场景都先温柔地试。" },
        ],
        faq: [
          { q: "有哪些场景?", a: "拥抱、慢舞、动态肖像和未来宝宝——各有各的流程。" },
          { q: "爷爷奶奶的老照片?", a: "扫描件可用——脸的清晰度是关键。" },
          { q: "能全家同框吗?", a: "场景是双人的;渲染几条组合发布。" },
          { q: "价格?", a: "标准积分按场景计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "ceiling-fan-outfit-change-ai",
    trendTag: "Ceiling Fan Outfit Change",
    genreHint: "ceiling fan spinning view, outfit swap each pass",
    copy: {
      en: {
        title: "Ceiling Fan Outfit Change AI — Your Outfit Swaps Every Blade Pass",
        description:
          "Do the ceiling fan outfit change AI trend from one selfie: seen from the ceiling through a spinning fan, your outfit changes on every blade pass. No app.",
        h1: "Ceiling fan outfit change — the view from above",
        subtitle:
          "One selfie in, and AI renders the view from the ceiling: a spinning fan, and your outfit changes on every blade pass.",
        shortAnswer:
          "The ceiling fan trend shoots you from above, through a spinning fan — and your outfit changes on every blade pass. One selfie, a pre-built sequence, minutes per render.",
        stages: enStages,
        howSteps: [
          { t: "Add one selfie", d: "Looking up works best — the camera is the ceiling." },
          { t: "Tap once", d: "Fan, outfits and rhythm are pre-built." },
          { t: "Watch the passes", d: "Every blade sweep, a new outfit." },
          { t: "Post it", d: "The loop makes people rewatch." },
        ],
        why: [
          { t: "One selfie", d: "Solo-friendly, zero setup." },
          { t: "Built-in rhythm", d: "The blade timing is the edit." },
          { t: "Outfit variety", d: "Multiple styles in one clip." },
          { t: "Minutes", d: "Render between outfits in real life." },
        ],
        faq: [
          { q: "Why a ceiling fan?", a: "The trend started with fan-cam clips — the spin is the transition." },
          { q: "Can I control the outfits?", a: "The set is pre-built and rotates; keep tapping for variants." },
          { q: "Does it work lying down?", a: "A looking-up selfie is the ideal input." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "天花板风扇换装 AI —— 扇叶每扫一次,换一身穿搭",
        description:
          "用一张自拍做天花板风扇换装 AI 趋势:从天花板透过旋转的风扇看,扇叶每扫一次换一身穿搭。无需 App。",
        h1: "天花板风扇换装 —— 来自头顶的镜头",
        subtitle:
          "一张自拍进,AI 渲染天花板视角:旋转的风扇,扇叶每扫一次你就换一身穿搭。",
        shortAnswer:
          "天花板风扇趋势从头顶拍你,穿过旋转的风扇——扇叶每扫一次,换一身穿搭。一张自拍,预置序列,几分钟一条。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张自拍", d: "仰头拍最合适——镜头就是天花板。" },
          { t: "点一次", d: "风扇、穿搭、节奏都是预置的。" },
          { t: "看扫过", d: "扇叶每扫一圈,一身新穿搭。" },
          { t: "发布", d: "循环感让人反复重看。" },
        ],
        why: [
          { t: "一张自拍", d: "单人友好,零设置。" },
          { t: "节奏内置", d: "扇叶的节奏就是剪辑。" },
          { t: "穿搭多样", d: "一条片里多套风格。" },
          { t: "几分钟", d: "比现实里换装快。" },
        ],
        faq: [
          { q: "为什么是天花板风扇?", a: "趋势始于风扇镜头的爆款——旋转就是转场。" },
          { q: "能控制穿搭吗?", a: "套装预置并轮换;多点几次出变体。" },
          { q: "躺着拍行吗?", a: "仰头自拍是理想输入。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "photo-to-video-ai",
    trendTag: "Photo to Video AI",
    copy: {
      en: {
        title: "Photo to Video AI — Pick What Happens to Your Photo",
        description:
          "Photo to video AI in your browser: add a photo, pick what happens (it comes alive, a hug, a dance, Earth zoom out) and get a short MP4 in minutes. No app.",
        h1: "Photo to video AI — the everything page",
        subtitle:
          "One photo, one choice — come alive, hug, dance, Earth zoom out — and a short MP4 renders in minutes.",
        shortAnswer:
          "Photo-to-video AI is the umbrella: any photo, any effect on this site, a short MP4 out. If you don't know which effect you want yet, start here and pick.",
        stages: enStages,
        howSteps: [
          { t: "Add a photo", d: "One clear photo — solo or two people." },
          { t: "Pick what happens", d: "Alive, hug, dance, Earth zoom — the grid is the catalog." },
          { t: "Render", d: "Minutes per clip." },
          { t: "Download MP4", d: "Vertical, HD, watermark-free after unlock." },
        ],
        why: [
          { t: "The starting point", d: "When you don't know the effect name yet." },
          { t: "Everything in one place", d: "Every effect links from here." },
          { t: "Browser only", d: "No app, no export settings." },
          { t: "Credits never expire", d: "Buy once, render whenever." },
        ],
        faq: [
          { q: "Which effect should I pick?", a: "Hug for emotion, Earth zoom for scale, dance for energy — or browse the homepage grid." },
          { q: "MP4 format?", a: "Yes — vertical HD MP4, ready for every platform." },
          { q: "Two photos?", a: "For hug and duo effects; solo effects take one." },
          { q: "Price?", a: "Credits per effect, from 5 for standard renders." },
        ],
      },
      zh: {
        title: "照片转视频 AI —— 给照片选一件事发生",
        description:
          "浏览器里的照片转视频 AI:上传照片,选会发生什么(活过来、拥抱、跳舞、地球拉远),几分钟得到短片 MP4。无需 App。",
        h1: "照片转视频 AI —— 什么都有的一页",
        subtitle:
          "一张照片、一个选择——活过来、拥抱、跳舞、地球拉远——几分钟渲染出短片 MP4。",
        shortAnswer:
          "照片转视频 AI 是那把伞:任何照片、本站任何特效,输出短片 MP4。还不知道想要什么特效?从这里开始选。",
        stages: zhStages,
        howSteps: [
          { t: "上传照片", d: "一张清晰照片——单人或双人。" },
          { t: "选发生什么", d: "活过来、拥抱、跳舞、地球拉远——网格就是目录。" },
          { t: "渲染", d: "每条几分钟。" },
          { t: "下载 MP4", d: "竖屏高清,解锁后无水印。" },
        ],
        why: [
          { t: "起点页", d: "还不知道特效名字时的入口。" },
          { t: "一站式", d: "所有特效从这里链接。" },
          { t: "纯浏览器", d: "无 App、无导出设置。" },
          { t: "积分永不过期", d: "一次买断,随时渲染。" },
        ],
        faq: [
          { q: "该选什么特效?", a: "要情绪选拥抱,要排面选地球拉远,要活力选跳舞——或逛首页网格。" },
          { q: "是 MP4 吗?", a: "是——竖屏高清 MP4,任何平台都能发。" },
          { q: "要两张照片吗?", a: "拥抱和双人特效要;单人特效一张。" },
          { q: "价格?", a: "按特效计积分,标准渲染 5 分起。" },
        ],
      },
    },
  },
  {
    slug: "burning-bridges-ai",
    trendTag: "Burning Bridges AI",
    genreHint: "chandelier party, crowd parting, hand over eyes",
    copy: {
      en: {
        title: "Burning Bridges AI — Step Out of the Chandelier Crowd",
        description:
          "Do the Burning Bridges AI trend from one photo: step out of the crowd at a chandelier party, wave at the camera, do the hand-over-the-eyes look.",
        h1: "Burning Bridges — the chandelier exit",
        subtitle:
          "One photo in, and AI renders the sequence: the crowd parts at a chandelier party, you step out, wave, and give the camera the hand-over-the-eyes look.",
        shortAnswer:
          "Burning Bridges is the entrance trend: a chandelier party, a parting crowd, and you walking out of it — wave included, hand-over-the-eyes look included. One photo, pre-built sequence, minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "A clear face — the crowd comes from the scene." },
          { t: "Tap once", d: "Party, parting crowd and poses are pre-built." },
          { t: "Watch the exit", d: "Step out, wave, hand over the eyes." },
          { t: "Post it", d: "The moody lighting reads great at night." },
        ],
        why: [
          { t: "Main-character energy", d: "The crowd parts for you, literally." },
          { t: "One photo, one tap", d: "No prompt, no setup." },
          { t: "Trend-accurate poses", d: "Wave and the eye-cover, exactly as the trend runs." },
          { t: "Minutes", d: "Render it before the song ends." },
        ],
        faq: [
          { q: "Is there fire?", a: "No — the name is the song reference; the scene is a chandelier party." },
          { q: "What's the hand-over-eyes pose?", a: "The trend's signature close-up — your face, lit by chandeliers, one hand across the eyes." },
          { q: "Can two people exit together?", a: "Solo effect; render a partner version separately." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "Burning Bridges AI —— 从吊灯人群里走出来",
        description:
          "用一张照片做 Burning Bridges AI 趋势:在吊灯派对的的人群中走出,对镜头挥手,再来一个挡眼凝视。",
        h1: "Burning Bridges —— 吊灯下的出场",
        subtitle:
          "一张照片进,AI 渲染整套序列:吊灯派对人群分开,你走出来,挥手,挡眼凝视。",
        shortAnswer:
          "Burning Bridges 是出场型趋势:吊灯派对、分开的人群、你从中间走出——挥手、挡眼凝视都在。一张照片,预置序列,几分钟。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "一张清晰脸——人群由场景提供。" },
          { t: "点一次", d: "派对、分开人群和 pose 都是预置的。" },
          { t: "看出场", d: "走出、挥手、挡眼。" },
          { t: "发布", d: "情绪化灯光在夜间发布格外好看。" },
        ],
        why: [
          { t: "主角光环", d: "人群真的会为你分开。" },
          { t: "一张照片一次点击", d: "零提示词零设置。" },
          { t: "趋势同款 pose", d: "挥手和挡眼,和话题下的一致。" },
          { t: "几分钟", d: "歌还没放完就出片。" },
        ],
        faq: [
          { q: "有火吗?", a: "没有——名字是歌的梗;场景是吊灯派对。" },
          { q: "挡眼 pose 是什么?", a: "趋势的招牌特写——你的脸被吊灯照亮,一只手横过眼睛。" },
          { q: "能两个人一起出场吗?", a: "单人特效;可以分开渲染再剪一起。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "bulin-47-ai",
    trendTag: "Bulin 47 AI",
    genreHint: "red-lit restaurant street freestyle, pink shirt",
    copy: {
      en: {
        title: "Bulin 47 AI — Freestyle Outside the Red-Lit Restaurant",
        description:
          "Do the Bulin 47 AI trend from one photo: you freestyle outside a red-lit restaurant in a pink shirt and shades while a fan holds the speaker. No prompt.",
        h1: "Bulin 47 — the street freestyle",
        subtitle:
          "One photo in, and AI puts you outside the red-lit restaurant — pink shirt, shades, a fan holding the speaker, freestyle bars included.",
        shortAnswer:
          "The Bulin 47 trend is pure street energy: red-lit restaurant, pink shirt, shades, a fan holding the speaker, and you freestyling. One photo, no prompt, minutes per render.",
        stages: enStages,
        howSteps: [
          { t: "Add one photo", d: "A clear face — the outfit comes from the scene." },
          { t: "Tap once", d: "Restaurant, lighting and freestyle are pre-built." },
          { t: "Watch the bars", d: "Lip-synced freestyle, fan-cam energy." },
          { t: "Post it", d: "Red lighting pops on dark-mode feeds." },
        ],
        why: [
          { t: "Trend-accurate set", d: "Pink shirt, shades, red light — all pre-built." },
          { t: "One photo, no prompt", d: "The easiest trend page to run." },
          { t: "Freestyle included", d: "Original bars, no copyrighted audio." },
          { t: "Minutes", d: "Render while the original plays." },
        ],
        faq: [
          { q: "Who is Bulin 47?", a: "The trend name comes from the original viral freestyle clips — this page recreates the look with your face." },
          { q: "Is it the original song?", a: "No — an original freestyle in the same energy. Safer to post." },
          { q: "Why one photo only?", a: "It's a solo freestyle — one face on camera." },
          { q: "Price?", a: "Standard credits per render, from 5." },
        ],
      },
      zh: {
        title: "Bulin 47 AI —— 红灯餐厅前的 freestyle",
        description:
          "用一张照片做 Bulin 47 AI 趋势:你穿着粉衬衫戴着墨镜,在红灯餐厅门口 freestyle,还有粉丝举着音响。无需提示词。",
        h1: "Bulin 47 —— 街头 freestyle",
        subtitle:
          "一张照片进,AI 把你放到红灯餐厅门口——粉衬衫、墨镜、举音响的粉丝,freestyle 的词都自带。",
        shortAnswer:
          "Bulin 47 趋势是纯粹的街头能量:红灯餐厅、粉衬衫、墨镜、举音响的粉丝,你在 freestyle。一张照片,零提示词,几分钟一条。",
        stages: zhStages,
        howSteps: [
          { t: "上传一张照片", d: "一张清晰脸——穿搭由场景提供。" },
          { t: "点一次", d: "餐厅、灯光、freestyle 都是预置的。" },
          { t: "看表演", d: "口型同步的 freestyle,fan-cam 能量。" },
          { t: "发布", d: "红灯在深色模式信息流里特别炸。" },
        ],
        why: [
          { t: "贴合趋势的场景", d: "粉衬衫、墨镜、红灯——全部预置。" },
          { t: "一张照片零提示词", d: "全站最容易跑的趋势页。" },
          { t: "freestyle 自带", d: "原创词,无版权音频。" },
          { t: "几分钟", d: "原曲还在放就出片了。" },
        ],
        faq: [
          { q: "Bulin 47 是谁?", a: "趋势名来自最初的爆款 freestyle——本页用你的脸复刻那个场景。" },
          { q: "是原曲吗?", a: "不是——同能量的原创 freestyle。发布更安全。" },
          { q: "为什么只要一张照片?", a: "这是单人 freestyle——镜头里一张脸。" },
          { q: "价格?", a: "标准积分按渲染计,5 分起。" },
        ],
      },
    },
  },
  {
    slug: "can-chatgpt-make-videos",
    trendTag: "Can ChatGPT Make Videos",
    copy: {
      en: {
        title: "Can ChatGPT Make Videos? What It Can and Can't Do (2026)",
        description:
          "Can ChatGPT make videos? Not as of November 2026. Here is what it can do, what Gemini can, and how to turn photos of you and a friend into a video in minutes.",
        h1: "Can ChatGPT make videos? The honest answer",
        subtitle:
          "As of November 2026: ChatGPT writes scripts and shot lists, not finished videos with your face in them. Here's the line — and the shortcut.",
        shortAnswer:
          "No — as of November 2026, ChatGPT can't render a finished video of you and a friend performing a song. It writes scripts, ideas and shot lists. Gemini generates short clips from prompts. If you want a video of you two performing, that's what this site does: two photos, one topic, minutes.",
        stages: enStages,
        howSteps: [
          { t: "Ask ChatGPT for the concept", d: "Script, shot list, hook — great free brainstorm." },
          { t: "Bring the concept here", d: "Two photos and the topic line." },
          { t: "Render the video", d: "AI performs it with your faces — in minutes." },
          { t: "Post both", d: "The script as the caption, the video as the post." },
        ],
        why: [
          { t: "The line is clear", d: "Text models write; video models render. Use each for what it does." },
          { t: "The shortcut", d: "Skip the prompt engineering — the studio is pre-built." },
          { t: "Your face required", d: "ChatGPT can't put you in the clip; photos can." },
          { t: "Original audio", d: "Safe to post, unlike most AI-clip soundtracks." },
        ],
        faq: [
          { q: "Can ChatGPT make videos in 2026?", a: "It generates text — scripts, shot lists, ideas. It doesn't render finished videos starring you." },
          { q: "What about Sora and Gemini?", a: "Prompt-based video generators exist — they generate clips from text, but not a lip-synced performance of you two from two photos, without prompt work." },
          { q: "Can ChatGPT edit my photos into a video?", a: "No — photo uploads get analysis, not video rendering." },
          { q: "Fastest way to make a video of us?", a: "Two photos, one topic — [[start here|/hotel-lobby-ai]]." },
        ],
      },
      zh: {
        title: "ChatGPT 能做视频吗?它能做和不能做的(2026)",
        description:
          "ChatGPT 能做视频吗?截至 2026 年 11 月:不能。它能做什么、Gemini 能做什么,以及如何几分钟把你和朋友的照片变成视频。",
        h1: "ChatGPT 能做视频吗?诚实的答案",
        subtitle:
          "截至 2026 年 11 月:ChatGPT 写脚本和分镜,做不出有你的脸的成片。分界线在这里——捷径也在这里。",
        shortAnswer:
          "不能——截至 2026 年 11 月,ChatGPT 无法渲染你和朋友表演一首歌的成片。它写脚本、创意和分镜。Gemini 能从提示词生成短片。要你们俩表演的视频,这就是本站做的事:两张照片,一个主题,几分钟。",
        stages: zhStages,
        howSteps: [
          { t: "先问 ChatGPT 要创意", d: "脚本、分镜、hook——很好的免费头脑风暴。" },
          { t: "把创意带过来", d: "两张照片和一句主题。" },
          { t: "渲染视频", d: "AI 用你们的脸表演——几分钟。" },
          { t: "两个都发", d: "脚本当文案,视频当帖子。" },
        ],
        why: [
          { t: "分界线清晰", d: "文本模型负责写;视频模型负责渲染。各用各的长处。" },
          { t: "捷径在这里", d: "跳过提示词工程——工作室是预置的。" },
          { t: "必须有你的脸", d: "ChatGPT 放不进你的脸;照片可以。" },
          { t: "原创音频", d: "放心发——不像多数 AI 短片的配乐。" },
        ],
        faq: [
          { q: "2026 年 ChatGPT 能做视频吗?", a: "它生成文本——脚本、分镜、创意。不能渲染有你主演的成片。" },
          { q: "Sora 和 Gemini 呢?", a: "基于提示词的视频生成器存在——它们从文本生成片段,但不用提示词功夫就从两张照片做出你们俩对口型表演还做不到。" },
          { q: "ChatGPT 能把我的照片剪成视频吗?", a: "不能——照片上传只用于分析,不渲染视频。" },
          { q: "做我们的视频最快的方法?", a: "两张照片一句主题——[[从这里开始|/hotel-lobby-ai]]。" },
        ],
      },
    },
  },
];
