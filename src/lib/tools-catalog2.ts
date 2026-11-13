/**
 * 工具页目录批次 2:个性化歌曲类(4 页,PRD §5.2)
 * 曲风走唱(非 rap),genreHint 供真实供应商接入时拼 prompt
 */

import type { ToolConfig } from "./tools";

const enStages = ["Hotel Lobby", "Luxury Lobby", "Studio Booth", "Street Cypher"];
const zhStages = ["橙色录音棚", "豪华大堂", "录音棚", "街头 Cypher"];

export const PERSONALIZED_TOOLS: ToolConfig[] = [
  /* ---------------- personalized-anniversary-song ---------------- */
  {
    slug: "personalized-anniversary-song",
    trendTag: "Personalized Anniversary Song",
    genreHint: "heartfelt anniversary ballad",
    copy: {
      en: {
        title: "Personalized Anniversary Song — Your Years, Your Names, Your Video",
        description:
          "Make a personalized anniversary song with AI: add a photo of you two, write your names, the years and one memory, and get a sung love song video in minutes.",
        h1: "Anniversary song — built from your story",
        subtitle:
          "Add one photo of you two, write your names and one memory from the years, and AI performs an original anniversary song with you both in the video.",
        shortAnswer:
          "Generic anniversary songs don't mention the road trip that went wrong or the kitchen that took three months. Type your names, the number of years and one memory — the lyrics use them, and you two star in the video, ready in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add a photo of you two", d: "A couple photo works — or one photo each." },
          { t: "Write your story", d: "Names, years married, one memory. Real details make the song yours." },
          { t: "Pick the mood", d: "Studio booth for the classic look; street cypher for the fun one." },
          { t: "Play it at dinner", d: "Unlock HD and put it on the TV before dessert." },
        ],
        why: [
          { t: "Real details in the lyrics", d: "Names and memories — not a stock love song." },
          { t: "You two on screen", d: "The anniversary couple is the cast, not a stock couple." },
          { t: "Original song", d: "No licensing worry, no muted uploads." },
          { t: "Minutes, not weeks", d: "The last anniversary gift you can actually finish on time." },
        ],
        faq: [
          { q: "Will it say our names?", a: "Yes — put them in the topic. \"Dan and Mia, 12 years\" becomes part of the song." },
          { q: "Can it be a surprise?", a: "Render it alone, unlock it, and play it when the moment is right." },
          { q: "Paper anniversary or golden one?", a: "Any year — the lyrics follow what you type." },
          { q: "What photo works best?", a: "One clear photo of you two, or one photo per person." },
          { q: "Is it a ballad or a rap?", a: "An original song in the style of the page — heartfelt, not generic radio pop." },
          { q: "What does it cost?", a: "10 credits standard, from $9.99 — cheaper than flowers." },
        ],
      },
      zh: {
        title: "个性化周年纪念歌 —— 你们的名字、你们的年份、你们的视频",
        description:
          "用 AI 做一首个性化周年纪念歌:上传你们俩的照片,写下名字、年数和一段回忆,几分钟得到一支纪念歌视频。",
        h1: "周年纪念歌 —— 从你们的故事里长出来",
        subtitle:
          "上传一张你们的合照,写下名字和一段这些年的回忆,AI 演唱一首原创纪念歌,你们俩都在视频里。",
        shortAnswer:
          "通用纪念歌不会提到那次出岔子的旅行,也不会提到装了三个月的厨房。写下名字、年数和一段回忆——歌词会用上它们,你们俩主演,约 3 分钟出片。",
        stages: zhStages,
        howSteps: [
          { t: "上传你们的照片", d: "合照就行——或每人一张。" },
          { t: "写下你们的故事", d: "名字、几年、一段回忆。真实细节让歌属于你们。" },
          { t: "选氛围", d: "经典选录音棚;欢乐选街头。" },
          { t: "晚餐时播放", d: "解锁高清,甜点前放上电视。" },
        ],
        why: [
          { t: "歌词里有真细节", d: "名字和回忆——不是模板情歌。" },
          { t: "主角就是你们", d: "纪念的两位是主演,不是素材库情侣。" },
          { t: "原创歌曲", d: "没有版权顾虑,不会被静音。" },
          { t: "几分钟不是几周", d: "唯一能按时完成的纪念日礼物。" },
        ],
        faq: [
          { q: "会唱到我们的名字吗?", a: "会——写进主题。\"阿凯和小雨,12 年\" 会进到歌里。" },
          { q: "能做惊喜吗?", a: "自己先渲染解锁,在对的时刻播放。" },
          { q: "纸婚还是金婚都行?", a: "任何年数——歌词跟着你写的走。" },
          { q: "什么照片最好?", a: "一张清晰的合照,或每人一张。" },
          { q: "是情歌还是说唱?", a: "是本页风格的原创歌——走心,不是电台套路。" },
          { q: "多少钱?", a: "标准 10 积分,$9.99 起——比花便宜。" },
        ],
      },
    },
  },

  /* ---------------- personalized-birthday-song ---------------- */
  {
    slug: "personalized-birthday-song",
    trendTag: "Personalized Birthday Song",
    genreHint: "warm sung birthday song",
    copy: {
      en: {
        title: "Personalized Birthday Song — Sung for Them, With Their Name",
        description:
          "Make a personalized birthday song with AI: add their photo and yours, write their name and one memory, and get a sung birthday song video of you two in minutes.",
        h1: "Birthday song — sung for them, not for everyone",
        subtitle:
          "Add their photo and yours, write their name and one memory, and AI performs an original birthday song with you both in the video.",
        shortAnswer:
          "Happy birthday songs from the store don't know the person. This one does: their name, their age, the one thing everyone teases them about — written into the lyrics, with you next to them in the video, about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add their photo and yours", d: "One face each — the star and the singer." },
          { t: "Write name + memory", d: "\"Nina, 25, still scared of the blender\" — the lyrics use it." },
          { t: "Pick the mood", d: "Warm stage for family, street for the party crowd." },
          { t: "Send at midnight", d: "Unlock HD and be the first birthday message they see." },
        ],
        why: [
          { t: "Their name in the hook", d: "One real detail turns a generic song into their song." },
          { t: "You're in the video", d: "Singing next to them, not just sending a link." },
          { t: "Family-friendly by default", d: "You control the topic; keep it warm." },
          { t: "Last-minute hero", d: "Render at 11pm, still make midnight." },
        ],
        faq: [
          { q: "Sung or rapped?", a: "This page is the sung version; the birthday rap page raps it." },
          { q: "Can kids get one?", a: "Yes, with a guardian's consent for photos. Keep the memory wholesome." },
          { q: "Do both people need photos?", a: "The star needs one; you need one to appear singing beside them." },
          { q: "Can it be from all of us?", a: "Write \"from the whole team\" in the topic — duo rendering means two faces appear." },
          { q: "Which languages?", a: "Write the topic in your language — the song follows it." },
          { q: "Price?", a: "10 credits standard, from $9.99 — packs make the whole family cheap." },
        ],
      },
      zh: {
        title: "个性化生日歌 —— 为 TA 而唱,唱 TA 的名字",
        description:
          "用 AI 做个性化生日歌:上传 TA 和你的照片,写下名字和一段回忆,几分钟得到你们俩的生日歌视频。",
        h1: "生日歌 —— 为 TA 唱,不是为所有人唱",
        subtitle:
          "上传 TA 和你的照片,写下名字和一段回忆,AI 演唱一首原创生日歌,你们俩都在视频里。",
        shortAnswer:
          "商店里的生日歌不认识寿星。这首认识:TA 的名字、年龄、大家总拿 TA 开的那个玩笑——都写进歌词,你就站在 TA 旁边的视频里,约 3 分钟。",
        stages: zhStages,
        howSteps: [
          { t: "上传 TA 和你的照片", d: "每人一张——寿星和唱歌的人。" },
          { t: "写名字 + 回忆", d: "\"小娜,25 岁,还是怕料理机\"——歌词会用上。" },
          { t: "选氛围", d: "家人看选温暖舞台;派对群众选街头。" },
          { t: "零点发送", d: "解锁高清,做 TA 收到的第一条生日祝福。" },
        ],
        why: [
          { t: "hook 里有 TA 的名字", d: "一个真实细节,让通用歌变成 TA 的歌。" },
          { t: "你在视频里", d: "站在 TA 旁边唱,不是甩一个链接。" },
          { t: "默认合家欢", d: "主题由你控制;保持温暖。" },
          { t: "赶时间救星", d: "晚上 11 点渲染,照样赶上零点。" },
        ],
        faq: [
          { q: "是唱的还是说唱?", a: "本页是唱的;生日说唱页是 rap 的。" },
          { q: "小朋友能做吗?", a: "可以,照片需监护人同意。回忆保持温馨。" },
          { q: "两个人都要照片吗?", a: "寿星要一张;你要一张才能站在旁边唱。" },
          { q: "能代表所有人送吗?", a: "主题里写\"代表全体同事\"——双人渲染是两张脸出镜。" },
          { q: "支持什么语言?", a: "主题用什么语言写,歌就用什么语言。" },
          { q: "价格?", a: "标准 10 积分,$9.99 起——积分包让全家都做得起。" },
        ],
      },
    },
  },

  /* ---------------- personalized-christmas-song ---------------- */
  {
    slug: "personalized-christmas-song",
    trendTag: "Personalized Christmas Song",
    genreHint: "cozy sung christmas song",
    copy: {
      en: {
        title: "Personalized Christmas Song — Your Names by the Tree",
        description:
          "Make a personalized Christmas song with AI: add two photos, write the names and one family memory, and get a sung Christmas song video by the tree in minutes.",
        h1: "Christmas song — your family, your year, your video",
        subtitle:
          "Add two photos and one family memory, and AI performs an original Christmas song with you both in it — the group chat's Christmas morning link.",
        shortAnswer:
          "Every family replays the same three carols. This one is yours: names, the year's headline memory, and you two in the video — original song, tree-side mood, rendered in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add two photos", d: "Couples, siblings, cousins — any duo of the family." },
          { t: "Write the memory", d: "\"Grandma's stuffing, Dad's parking\" — the lyrics lean in." },
          { t: "Pick the mood", d: "Warm stage by default; keep it cozy." },
          { t: "Schedule the send", d: "Render early December, unlock HD, send Christmas morning." },
        ],
        why: [
          { t: "Your year in the lyrics", d: "The memory you type becomes the middle eight." },
          { t: "Original, not a carol cover", d: "No licensing, no mute, no dated MP3." },
          { t: "The link grandma presses", d: "Short, vertical, personalized — it gets watched." },
          { t: "Cheap at family scale", d: "Packs make one video per branch of the tree affordable." },
        ],
        faq: [
          { q: "Is it religious?", a: "Festive, not liturgical — write your preference into the topic." },
          { q: "Can it include the kids?", a: "Yes, with guardian consent for photos, and a wholesome memory." },
          { q: "When should we render?", a: "Early December — demand spikes near the 24th." },
          { q: "Can it mention gifts?", a: "Write anything family-safe; the lyrics follow your topic." },
          { q: "Sung or rapped?", a: "Sung — the Christmas rap page is the rapped version." },
          { q: "Price?", a: "10 credits standard, from $9.99." },
        ],
      },
      zh: {
        title: "个性化圣诞歌 —— 树旁唱你们的名字",
        description:
          "用 AI 做个性化圣诞歌:上传两张照片,写下名字和一段家庭回忆,几分钟得到树旁的圣诞歌视频。",
        h1: "圣诞歌 —— 你们家,你们这一年,你们的视频",
        subtitle:
          "上传两张照片和一段家庭回忆,AI 演唱一首有你们俩的原创圣诞歌——家庭群聊圣诞早晨的那个链接。",
        shortAnswer:
          "每家都重放同样三首颂歌。这首是你们自己的:名字、这一年的头条回忆,你们俩在视频里——原创歌曲、树旁氛围,约 3 分钟出片。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "情侣、兄妹、表亲——家里任何一组二人档。" },
          { t: "写下回忆", d: "\"姥姥的秘制填料、老爸的停车技术\"——歌词会顺着写。" },
          { t: "选氛围", d: "默认温暖舞台;保持温馨。" },
          { t: "定好发送", d: "12 月初渲染,解锁高清,圣诞早晨发送。" },
        ],
        why: [
          { t: "你们这一年进歌词", d: "你写的回忆会成为间奏独白。" },
          { t: "原创,不是翻唱颂歌", d: "没有授权问题,不会被静音,不再是过期 MP3。" },
          { t: "姥姥会点开的链接", d: "短、竖屏、个性化——就会被看。" },
          { t: "家庭规模下更便宜", d: "积分包让每房亲戚一条也做得起。" },
        ],
        faq: [
          { q: "是宗教向的吗?", a: "节日向,不是宗教向——偏好写进主题。" },
          { q: "能有小朋友吗?", a: "能,照片需监护人同意,回忆保持合家欢。" },
          { q: "什么时候渲染?", a: "12 月初——临近 24 号需求暴涨。" },
          { q: "能提到礼物吗?", a: "写任何合家欢的内容;歌词跟主题走。" },
          { q: "唱的还是说唱的?", a: "唱的——圣诞说唱页是 rap 版。" },
          { q: "价格?", a: "标准 10 积分,$9.99 起。" },
        ],
      },
    },
  },

  /* ---------------- personalized-love-song ---------------- */
  {
    slug: "personalized-love-song",
    trendTag: "Personalized Love Song",
    genreHint: "heartfelt love ballad",
    copy: {
      en: {
        title: "Personalized Love Song — Your Story, Sung Back to You",
        description:
          "Make a personalized love song with AI for Valentine's Day or any day: add your photos, write their name and your story, get a sung love song video.",
        h1: "Love song — your story, sung back to you",
        subtitle:
          "Add your photos, write their name and how you met, and AI performs an original love song with you two in the video.",
        shortAnswer:
          "The best love songs are specific. Type their name, the place you met, the tiny habit — and AI sings your story back with you two starring in the video. Valentine's Day, an anniversary, or a Tuesday.",
        stages: enStages,
        howSteps: [
          { t: "Add your photos", d: "One couple photo or one photo each." },
          { t: "Write the story", d: "Their name, where you met, the tiny habit you love." },
          { t: "Pick the mood", d: "Studio booth for classic; street cypher for a surprise serenade." },
          { t: "Send it", d: "Unlock HD and send it with three words, not a paragraph." },
        ],
        why: [
          { t: "Specific beats expensive", d: "The name and the place land harder than a big budget." },
          { t: "You two, on screen", d: "Not a lyric video — a performance with your faces." },
          { t: "Any day works", d: "Valentine's, anniversary, or an apology." },
          { t: "Three minutes", d: "Faster than writing a card you'll delete twice." },
        ],
        faq: [
          { q: "Is it good for Valentine's Day?", a: "It's built for it — but it works on any day you want to land something real." },
          { q: "How personal can the lyrics get?", a: "As personal as what you type: names, places, habits, promises." },
          { q: "Can it be long-distance?", a: "Perfect use case — two photos from two cities, one stage." },
          { q: "Is it private?", a: "Photos are used only for your render and never published — request deletion anytime." },
          { q: "Sung or rapped?", a: "Sung — for rapped confessions, use the rap generator with a love topic." },
          { q: "Price?", a: "10 credits standard, from $9.99." },
        ],
      },
      zh: {
        title: "个性化情歌 —— 把你们的故事唱回来",
        description:
          "情人节或任何一天:上传你们的照片,写 TA 的名字和你们的故事,得到一支唱出来的情歌视频。",
        h1: "情歌 —— 你们的故事,唱回给你们",
        subtitle:
          "上传你们的照片,写 TA 的名字和相遇的地方,AI 演唱一首原创情歌,你们俩都在视频里。",
        shortAnswer:
          "最好的情歌都是具体的。写下 TA 的名字、相遇的地方、那个小小习惯——AI 把你们的故事唱回来,你们俩主演。情人节、纪念日,或者随便某个周二。",
        stages: zhStages,
        howSteps: [
          { t: "上传你们的照片", d: "一张合照或每人一张。" },
          { t: "写下故事", d: "TA 的名字、相遇的地方、你喜欢的小习惯。" },
          { t: "选氛围", d: "经典选录音棚;突然的小夜曲选街头。" },
          { t: "发送", d: "解锁高清,配三个字一起发,不用写长文。" },
        ],
        why: [
          { t: "具体胜过昂贵", d: "名字和地点比大制作更打动人。" },
          { t: "你们俩出镜", d: "不是歌词视频——是有你们脸的表演。" },
          { t: "哪天都行", d: "情人节、纪念日,或者道歉。" },
          { t: "三分钟", d: "比写一张你要删两次的卡片还快。" },
        ],
        faq: [
          { q: "适合情人节吗?", a: "就是为它做的——但任何想认真表达的日子都行。" },
          { q: "歌词能多私人?", a: "取决于你写的:名字、地点、习惯、承诺。" },
          { q: "异地恋能用吗?", a: "绝佳场景——两个城市的两张照片,同一个舞台。" },
          { q: "私密吗?", a: "照片只用于你的渲染,绝不公开——可随时要求删除。" },
          { q: "唱的还是说唱?", a: "唱的——要 rap 式告白,用说唱生成器填情歌主题。" },
          { q: "价格?", a: "标准 10 积分,$9.99 起。" },
        ],
      },
    },
  },
];
