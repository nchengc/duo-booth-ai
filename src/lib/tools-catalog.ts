/**
 * 工具页目录批次 1a(PRD §5.2 说唱类,对标 slug 全量,文案原创)
 * 新页 = 往 MORE_TOOLS 加一份配置:sitemap/首页网格/footer/OG/hreflang 全自动生效
 */

import type { ToolConfig } from "./tools";

// 舞台标签(与 tools.ts 的 STAGES 保持一致;内联以避免循环导入)
const enStages = ["Hotel Lobby", "Luxury Lobby", "Studio Booth", "Street Cypher"];
const zhStages = ["橙色录音棚", "豪华大堂", "录音棚", "街头 Cypher"];

export const MORE_TOOLS: ToolConfig[] = [
  /* ---------------- ai-rap-generator ---------------- */
  {
    slug: "ai-rap-generator",
    trendTag: "AI Rap Generator",
    copy: {
      en: {
        title: "AI Rap Generator — Lyrics, Beat and a Video of You Two Performing",
        description:
          "AI rap generator that writes an original rap about your topic, makes the beat and has you and a friend perform it on video. Two photos, about 3 minutes.",
        h1: "AI rap generator — your topic, your faces, one video",
        subtitle:
          "Type what the rap should be about, add a photo of you and a friend, and AI writes the lyrics, makes the beat and renders you two performing it, lip-synced.",
        shortAnswer:
          "Most AI rap generators stop at lyrics on a page. This one goes all the way: an original rap written around your topic, performed on video by you and a friend — vocals, beat and lip-sync generated together, ready to post in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add two face photos", d: "One per person. The AI puts you both on the same stage." },
          { t: "Say what it's about", d: "A birthday, an inside joke, your friendship — the lyrics are written around it." },
          { t: "Pick the sound", d: "Model and length are your call; every format costs the same credits." },
          { t: "Watch and post", d: "About 2-3 minutes. Unlock the HD video and share it anywhere." },
        ],
        why: [
          { t: "A video, not just lyrics", d: "Lyrics tools leave the hard part to you. Here the performance is the product." },
          { t: "Real lip-sync", d: "Vocals, beat and mouth movement are generated together, on beat." },
          { t: "Original and safe", d: "Every song is written from scratch — nothing for platforms to flag." },
          { t: "Cheaper than a studio", d: "About $1 per song on the bigger plans; failed renders are never charged." },
        ],
        faq: [
          { q: "Does it write the lyrics too?", a: "Yes — lyrics, vocals and the beat are all generated. Add a topic and the lyrics are written around it." },
          { q: "Can it rap in my language?", a: "It raps in the site language by default; type the topic in your language and it follows." },
          { q: "Do both people need to be in one photo?", a: "No — one photo per person, taken anywhere, any year." },
          { q: "How long is the video?", a: "5 to 15 seconds by default (up to 30 on Ultra), in vertical, square or landscape." },
          { q: "Can I use it for TikTok?", a: "Yes — vertical HD without watermark once unlocked, and the song is original so nothing gets muted." },
          { q: "What does it cost?", a: "A standard 720p 12-second song is 10 credits. Packs start at $9.99 and never expire." },
        ],
      },
      zh: {
        title: "AI 说唱生成器 —— 歌词、伴奏,加上你们俩的表演视频",
        description:
          "AI 说唱生成器:围绕你的主题写原创说唱、做伴奏,并生成你和朋友表演它的视频。两张照片,约 3 分钟。",
        h1: "AI 说唱生成器 —— 你的主题,你们的脸,一条视频",
        subtitle:
          "说说这首歌唱什么,上传你和朋友的照片,AI 写歌词、做伴奏,并渲染你们俩对口型表演的视频。",
        shortAnswer:
          "大多数 AI 说唱工具止步于一段歌词。这个直接做到底:围绕你的主题写一首原创说唱,由你和一位朋友在视频里表演——人声、伴奏、口型一体生成,约 3 分钟就能发布。",
        stages: zhStages,
        howSteps: [
          { t: "添加两张正脸照", d: "每人一张,AI 把你们俩放上同一个舞台。" },
          { t: "说说唱什么", d: "生日、内部梗、你们的友谊——歌词围绕它写。" },
          { t: "选声音", d: "模型和时长自选;各种比例消耗相同积分。" },
          { t: "观看并发布", d: "约 2-3 分钟出片。解锁高清版,随处分享。" },
        ],
        why: [
          { t: "是一条视频,不只是歌词", d: "歌词工具把难的部分留给你;这里表演本身就是产品。" },
          { t: "真对口型", d: "人声、伴奏和嘴型一起生成,踩在节拍上。" },
          { t: "原创且安全", d: "每首歌都从零写起——没有会被平台标记的内容。" },
          { t: "比录音棚便宜", d: "大套餐约 1 美元一首;生成失败从不扣费。" },
        ],
        faq: [
          { q: "歌词也是它写的吗?", a: "是的——歌词、人声、伴奏全部生成。填主题,歌词就围绕它写。" },
          { q: "能用我的语言说唱吗?", a: "默认跟随网站语言;主题用什么语言写,它就用什么语言唱。" },
          { q: "两个人要合照吗?", a: "不用——每人一张照片,拍摄时间地点都不限。" },
          { q: "视频多长?", a: "默认 5-15 秒(旗舰档最长 30 秒),竖屏/方形/横屏都支持。" },
          { q: "能发 TikTok 吗?", a: "能——解锁后竖屏高清无水印,歌曲是原创,不会被静音。" },
          { q: "多少钱?", a: "标准 720p 12 秒一首为 10 积分。积分包 $9.99 起,永不过期。" },
        ],
      },
    },
  },

  /* ---------------- ai-rap-battle-generator ---------------- */
  {
    slug: "ai-rap-battle-generator",
    trendTag: "AI Rap Battle",
    copy: {
      en: {
        title: "AI Rap Battle Generator — You vs Your Friend, Real Faces, Real Bars",
        description:
          "AI rap battle generator with real faces: add your photo and your opponent's, say what the battle is about, and AI writes the bars and renders you trading them.",
        h1: "AI rap battle — you and your opponent, trading bars on video",
        subtitle:
          "Add your photo and theirs, type what the battle is about, and AI writes the bars and renders the two of you trading verses, lip-synced.",
        shortAnswer:
          "Rap battle generators usually give you text to read out loud yourself. This one stages the whole battle: you and your opponent, on stage, trading verses written by AI about the topic you set — two photos in, one battle video out in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add both opponents", d: "Your photo and theirs — the battle needs two faces." },
          { t: "Set the topic", d: "Who wins the argument, the game night, the last slice of pizza." },
          { t: "Keep it friendly", d: "AI writes competitive bars, not harassment — targeting real people to hurt them is blocked." },
          { t: "Post the verdict", d: "Render, unlock HD and let the group chat pick a winner." },
        ],
        why: [
          { t: "Both faces on stage", d: "Not one narrator reading two parts — two people trading verses." },
          { t: "Bars about your topic", d: "The diss is about what you type: the game, the bet, the trip." },
          { t: "Friendly by design", d: "Competitive, funny, shareable — without becoming harassment." },
          { t: "Fast payoff", d: "About 2-3 minutes from photos to a postable battle." },
        ],
        faq: [
          { q: "Can I battle a celebrity?", a: "No — battles are for people you know, with photos they agreed to share. Public figures are blocked." },
          { q: "How mean do the bars get?", a: "Competitive and funny, not cruel. Content meant to harass a real person is filtered out." },
          { q: "Who wins?", a: "The AI writes both sides strong — your group chat decides." },
          { q: "Can we do 1v1v1?", a: "Not yet — the stage is built for two." },
          { q: "Does it clone voices?", a: "No. Original AI voices perform both sides." },
          { q: "How much is a battle?", a: "Same as any song: 10 credits for the standard 720p 12-second render." },
        ],
      },
      zh: {
        title: "AI 说唱对战生成器 —— 你 vs 朋友,真人脸,真对峙",
        description:
          "带真人脸的 AI 说唱对战生成器:上传你和对手的照片,说说对战主题,AI 写词并渲染你们轮流对唱的视频。",
        h1: "AI 说唱对战 —— 你和对手,舞台上轮流开火",
        subtitle:
          "上传你和对方的照片,写下对战主题,AI 写词并渲染你们俩轮流 verse、口型同步的对战视频。",
        shortAnswer:
          "一般的说唱对战工具只给你一段文字自己念。这里把整场对战搬上舞台:你和对手同台,轮流演唱 AI 围绕你设的主题写的词——两张照片进,一条对战视频出,约 3 分钟。",
        stages: zhStages,
        howSteps: [
          { t: "上传双方照片", d: "你的和对方的——对战需要两张脸。" },
          { t: "设主题", d: "谁赢了争论、游戏之夜、最后一块披萨。" },
          { t: "保持友好", d: "AI 写的是竞技感的词,不是骚扰——针对真人伤人的内容会被拦截。" },
          { t: "发布判罚", d: "生成、解锁高清,让群聊选出赢家。" },
        ],
        why: [
          { t: "两张脸同台", d: "不是一个人念两个角色——两个人真的轮流对唱。" },
          { t: "词围绕你的主题", d: "diss 的是你写的事:比赛、赌约、那次旅行。" },
          { t: "天生友好", d: "竞技、好笑、可分享——不会变成人身攻击。" },
          { t: "回报快", d: "从照片到可发布的对战,约 2-3 分钟。" },
        ],
        faq: [
          { q: "能和名人对战吗?", a: "不能——对战只限你认识、且同意出镜的人。公众人物被屏蔽。" },
          { q: "词可以多狠?", a: "竞技且好笑,不残忍。针对真人骚扰的内容会被过滤。" },
          { q: "谁赢?", a: "AI 把两边都写得很强——让群聊来判。" },
          { q: "能三人混战吗?", a: "暂不支持——舞台为两人设计。" },
          { q: "会克隆声音吗?", a: "不会。两边都由原创 AI 声音演唱。" },
          { q: "一场对战多少钱?", a: "和普通歌一样:标准 720p 12 秒渲染为 10 积分。" },
        ],
      },
    },
  },

  /* ---------------- diss-track-generator ---------------- */
  {
    slug: "diss-track-generator",
    trendTag: "AI Diss Track",
    copy: {
      en: {
        title: "AI Diss Track Generator — a Video, Not Just Lyrics",
        description:
          "AI diss track generator that makes a video, not just lyrics: add two photos, say who gets roasted, and AI writes the diss track and renders you two rapping it.",
        h1: "AI diss track — written, performed and filmed by AI",
        subtitle:
          "Add two photos, say who gets roasted and why, and AI writes the diss track, makes the beat and renders you two performing it on video.",
        shortAnswer:
          "Diss track generators that only output lyrics leave you holding a poem. Here the AI writes the track, performs it with original voices, and films you two rapping it on stage — a finished video in about 3 minutes, safe to post because the song is original.",
        stages: enStages,
        howSteps: [
          { t: "Add two photos", d: "The roaster and the roasted — one face each." },
          { t: "Set the roast", d: "What they did: lost the fantasy league, ate your leftovers, snored through the trip." },
          { t: "Pick the stage", d: "The orange booth or the night street — wherever the roast hits harder." },
          { t: "Post it", d: "Unlock the HD video without watermark and drop it in the chat." },
        ],
        why: [
          { t: "Roast, don't harass", d: "AI keeps it comedic. Targeting real people to harm them is blocked." },
          { t: "A whole video", d: "Lyrics, beat, performance and lip-sync — not a text file." },
          { t: "Original song", d: "No copyrighted beat, so platforms won't mute it." },
          { t: "Birthday-ready", d: "Pair it with the birthday pages for a roast-and-toast combo." },
        ],
        faq: [
          { q: "Is this allowed on TikTok?", a: "Friendly roasts are. The song is an original AI track, and content meant to harass is filtered before render." },
          { q: "Can I diss my boss?", a: "Keep it playful and between friends. Anything targeting a real person to harm or deceive them is blocked." },
          { q: "Does the roasted person need to agree?", a: "Yes — you need permission to use anyone's photo. Don't render people who didn't agree." },
          { q: "How long is it?", a: "The standard render is 12 seconds — long enough for three punchlines." },
          { q: "Can I do a comeback track?", a: "Swap the photo order and change the topic. Same two friends, new battle." },
          { q: "What if the render fails?", a: "You are never charged — credits return automatically." },
        ],
      },
      zh: {
        title: "AI Diss Track 生成器 —— 做成视频,不只是歌词",
        description:
          "AI diss track 生成器,产出的是视频而不是歌词:上传两张照片,说说吐槽谁,AI 写 diss 词并渲染你们俩表演的视频。",
        h1: "AI diss track —— AI 写词、演唱、拍摄一条龙",
        subtitle:
          "上传两张照片,说说吐槽谁、为什么,AI 写 diss 词、做伴奏,并渲染你们俩在舞台上表演的视频。",
        shortAnswer:
          "只输出歌词的 diss 工具会让你拿着一首诗发呆。这里 AI 写词、用原创声音演唱,并拍下你们俩在舞台上表演的画面——约 3 分钟出成片,歌曲是原创,放心发布。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "吐槽的人和被吐槽的——每人一张。" },
          { t: "设定槽点", d: "TA 干了什么:输掉梦幻联赛、吃了你的剩饭、全程打呼。" },
          { t: "选舞台", d: "橙色录音棚或夜色街头——哪里杀伤力大选哪里。" },
          { t: "发布", d: "解锁无水印高清版,丢进群聊。" },
        ],
        why: [
          { t: "吐槽,不是骚扰", d: "AI 保持喜剧感。针对真人造成伤害的内容会被拦截。" },
          { t: "完整视频", d: "歌词、伴奏、表演、口型——不是一个文本文件。" },
          { t: "原创歌曲", d: "没有版权伴奏,平台不会静音。" },
          { t: "生日绝配", d: "和生日页组合, roast 完再 toast。" },
        ],
        faq: [
          { q: "TikTok 上能发吗?", a: "友好吐槽可以。歌曲是 AI 原创,骚扰类内容在渲染前就被过滤。" },
          { q: "能 diss 老板吗?", a: "保持玩闹、限朋友圈。任何针对真人造成伤害或欺骗的内容都会被拦截。" },
          { q: "被吐槽的人要同意吗?", a: "要——使用任何人的照片都需要本人同意。别渲染没同意的人。" },
          { q: "多长?", a: "标准渲染 12 秒——够三个包袱。" },
          { q: "能做回应曲吗?", a: "调换照片顺序、改个主题。同样的两个朋友,新一轮对战。" },
          { q: "渲染失败怎么办?", a: "绝不扣费——积分自动退回。" },
        ],
      },
    },
  },

  /* ---------------- birthday-rap-song ---------------- */
  {
    slug: "birthday-rap-song",
    trendTag: "Birthday Rap Song",
    copy: {
      en: {
        title: "Birthday Rap Song — Star the Birthday Person, Not a Generic Tune",
        description:
          "Make a birthday rap song starring the birthday person: add their photo and yours, type their name and one funny fact, and AI raps happy birthday in a video.",
        h1: "Birthday rap song — their name in the bars",
        subtitle:
          "Add a photo of the birthday person and one of you, type their name and one detail, and AI performs an original birthday rap with you both on stage.",
        shortAnswer:
          "Generic birthday e-cards are forgettable. This one puts the birthday person on stage, raps their name, their age and the detail you typed, with you next to them — a video the whole chat will replay, ready in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add their photo and yours", d: "One face each — the birthday star and the gifter." },
          { t: "Type name + one fact", d: "\"Mia turns 30 and still can't parallel park\" — the lyrics use it." },
          { t: "Pick a stage", d: "Orange booth for the classic look; street cypher for the party vibe." },
          { t: "Send it at midnight", d: "Render, unlock HD and be the first message they see." },
        ],
        why: [
          { t: "Their name in the bars", d: "One real detail makes it theirs — not a stock greeting." },
          { t: "You're on stage too", d: "A duet beats a card. You planned it, you perform it." },
          { t: "Any age, any language", d: "Type the topic in your language and the rap follows." },
          { t: "Replay value", d: "Short, vertical and loud — built for group chats." },
        ],
        faq: [
          { q: "Can I make one for a kid?", a: "Yes, with a guardian's consent for their photo. Keep the topic family-friendly." },
          { q: "Will it sing or rap?", a: "Rap — if you want a sung birthday song, the personalized birthday song page sings it." },
          { q: "Does the AI know real ages?", a: "Only what you type — name, age and one detail become the lyrics." },
          { q: "Can I make it a surprise?", a: "Render it before the day, unlock it, and post at midnight." },
          { q: "How much does it cost?", a: "10 credits for the standard song — from $9.99, cheaper per song on packs." },
          { q: "Can we make one together at the party?", a: "Yes — two phones, two photos, one stage. It works even if you're in the same room." },
        ],
      },
      zh: {
        title: "生日说唱 —— 主角是寿星,不是通用祝福",
        description:
          "做一首以寿星为主角的生日说唱:上传 TA 和你的照片,写下名字和一个好玩细节,AI 生成你们同台的生日说唱视频。",
        h1: "生日说唱 —— 歌词里有 TA 的名字",
        subtitle:
          "上传寿星和你的照片各一张,写下名字和一个细节,AI 生成你们俩同台表演的原创生日说唱。",
        shortAnswer:
          "通用生日贺卡没人记得住。这首把寿星放上舞台,唱 TA 的名字、年龄和你写的细节,你就站在旁边——一条会让整个群聊反复重放的视频,约 3 分钟就好。",
        stages: zhStages,
        howSteps: [
          { t: "上传寿星和你的照片", d: "每人一张——寿星和送礼人。" },
          { t: "写名字 + 一个细节", d: "\"小雅 30 岁了还是不会侧方停车\"——歌词会用上它。" },
          { t: "选舞台", d: "经典选橙色录音棚;派对气氛选街头 Cypher。" },
          { t: "零点准点发", d: "提前生成、解锁高清,做 TA 醒来看到的第一条。" },
        ],
        why: [
          { t: "歌词里有 TA 的名字", d: "一个真实细节让它变成 TA 的歌——不是模板祝福。" },
          { t: "你也在台上", d: "合唱胜过贺卡。你策划的,你来演。" },
          { t: "任何年龄任何语言", d: "主题用什么语言写,说唱就用什么语言。" },
          { t: "重放价值", d: "短、竖屏、够大声——为群聊而生。" },
        ],
        faq: [
          { q: "能给小朋友做吗?", a: "可以,照片需监护人同意。主题保持合家欢。" },
          { q: "它是唱还是说唱?", a: "说唱——想要唱出来的生日歌,去个性化生日歌曲页,那边是唱的。" },
          { q: "AI 知道真实年龄吗?", a: "只知道你写的——名字、年龄和一个细节会进歌词。" },
          { q: "能做惊喜吗?", a: "提前一天生成解锁,零点准时发布。" },
          { q: "多少钱?", a: "标准一首 10 积分——$9.99 起,积分包更便宜。" },
          { q: "派对上能现做吗?", a: "能——两部手机两张照片一个舞台。就在同一个房间也照样能做。" },
        ],
      },
    },
  },

  /* ---------------- funny-birthday-video ---------------- */
  {
    slug: "funny-birthday-video",
    trendTag: "Funny Birthday Video",
    copy: {
      en: {
        title: "Funny Birthday Video — a Rap Duo Roasting the Birthday Person",
        description:
          "Make a funny happy birthday video starring the birthday person: add their photo and yours, type the joke, and AI turns you both into a rap duo roasting them.",
        h1: "Funny birthday video — roast first, toast second",
        subtitle:
          "Add the birthday person's photo and yours, type the joke everyone makes about them, and AI renders a rap duo video roasting them — affectionately.",
        shortAnswer:
          "Birthday roasts work because everyone knows the joke already. Type it once and the AI builds a whole performance around it: you two on stage, trading bars about their age, their driving, their snack hoarding — then unlock and send it before the cake.",
        stages: enStages,
        howSteps: [
          { t: "Add the two faces", d: "The birthday person and the friend brave enough to roast them." },
          { t: "Type the running joke", d: "The older the joke, the harder it lands — the lyrics lean into it." },
          { t: "Render the roast", d: "About 2-3 minutes, vertical, loud, replayable." },
          { t: "Follow with the toast", d: "Pair it with the birthday rap song page for the sweet ending." },
        ],
        why: [
          { t: "The chat's inside joke, on stage", d: "You bring the joke; AI brings the performance." },
          { t: "Roast with love", d: "Comedic, not cruel — harassment content is filtered out." },
          { t: "No editing, no app", d: "Two photos and one sentence. The browser does the rest." },
          { t: "Free to try", d: "Your first song renders free — watch it before you pay." },
        ],
        faq: [
          { q: "Will they be offended?", a: "Keep the joke the kind you'd say to their face. The AI keeps it comedic; harassment is blocked." },
          { q: "What if I only have one photo?", a: "You need both faces — one photo each. Ask another friend for the second." },
          { q: "Can I do it for a work birthday?", a: "Keep it office-safe — the AI follows the tone of your topic." },
          { q: "How long is the video?", a: "12 seconds standard — three punchlines and a hook." },
          { q: "Can they roast back?", a: "Yes — swap the photos, flip the topic, render the comeback." },
          { q: "Does it cost anything to try?", a: "The first render is free as a low-res preview; unlock HD when you like it." },
        ],
      },
      zh: {
        title: "爆笑生日视频 —— 一组说唱双人组吐槽寿星",
        description:
          "做一条以寿星为主角的爆笑生日视频:上传 TA 和你的照片,写下那个梗,AI 让你们俩变成吐槽 TA 的说唱组合。",
        h1: "爆笑生日视频 —— 先 roast,再 toast",
        subtitle:
          "上传寿星和你的照片,写下大家常拿 TA 开的那个玩笑,AI 渲染一条吐槽 TA 的说唱双人组视频——充满爱意的那种。",
        shortAnswer:
          "生日吐槽之所以好笑,是因为大家都知道那个梗。把梗写一次,AI 就围绕它造一整场表演:你们俩在台上,轮流唱 TA 的年龄、TA 的车技、TA 藏零食的绝技——解锁后在切蛋糕前发出去。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张脸", d: "寿星,和那个敢吐槽 TA 的朋友。" },
          { t: "写下那个梗", d: "梗越老杀伤力越大——歌词会顺着它写。" },
          { t: "生成吐槽", d: "约 2-3 分钟,竖屏、大声、可重放。" },
          { t: "补上祝福", d: "搭配生日说唱页,给个甜蜜结尾。" },
        ],
        why: [
          { t: "群聊的梗,搬上舞台", d: "你出梗,AI 出表演。" },
          { t: "带着爱的吐槽", d: "喜剧感,不残忍——骚扰内容会被过滤。" },
          { t: "无剪辑无 App", d: "两张照片一句话,浏览器搞定其余。" },
          { t: "免费试", d: "你的第一首免费渲染——满意再付费。" },
        ],
        faq: [
          { q: "TA 会生气吗?", a: "用你敢当面对 TA 说的玩笑。AI 保持喜剧感;骚扰内容被拦截。" },
          { q: "只有一张照片怎么办?", a: "需要两张脸——每人一张。找另一位朋友要第二张。" },
          { q: "能给同事做吗?", a: "保持办公室安全——AI 跟随你主题的语气。" },
          { q: "视频多长?", a: "标准 12 秒——三个包袱加一个 hook。" },
          { q: "TA 能反击吗?", a: "能——调换照片、翻转主题,生成回应曲。" },
          { q: "试一下要钱吗?", a: "首条免费渲染为低清预览;满意再解锁高清。" },
        ],
      },
    },
  },

  /* ---------------- pet-rap-video ---------------- */
  {
    slug: "pet-rap-video",
    trendTag: "Pet Rap Video",
    copy: {
      en: {
        title: "Pet Rap Video — Your Dog and Cat Trading Verses on Stage",
        description:
          "Turn photos of your dog, cat or any pet into a rap video: two pets, or your pet and you, trading verses on stage to an original song. No app, no subscription.",
        h1: "Pet rap video — two pets, one stage, original bars",
        subtitle:
          "Add a photo of each pet — or your pet and you — and AI renders them rapping together on stage, lip-synced to an original song.",
        shortAnswer:
          "Pet content wins the internet, and a pet rap battle wins it harder. Two photos in and the AI puts your dog and your cat on the same stage trading verses — the photos can be from different years, no subscription needed, about 3 minutes per video.",
        stages: enStages,
        howSteps: [
          { t: "Add a photo of each pet", d: "Face on, well lit. Two pets — or one pet and you." },
          { t: "Set the topic", d: "\"Who ate the couch\" writes itself. Leave empty for a hype song." },
          { t: "Pick quality", d: "Standard 720p is 10 credits; Ultra for the fur close-ups." },
          { t: "Post and tag", d: "Unlock HD and let the internet pick a side." },
        ],
        why: [
          { t: "Any two animals", d: "Dog vs cat, hamster vs hamster, or you vs your parrot." },
          { t: "Original song", d: "No copyrighted beat — safe for every platform." },
          { t: "No subscription", d: "Pay once for credits that never expire." },
          { t: "Three minutes", d: "Faster than teaching a dog to sit." },
        ],
        faq: [
          { q: "Do pet photos work as well as faces?", a: "Yes — the AI handles fur, beaks and whiskers. Clear, well-lit photos work best." },
          { q: "Can it be my pet and me?", a: "Yes — one pet photo, one human photo. The duet is chaos, in a good way." },
          { q: "Do they lip-sync?", a: "The mouth movement is generated to match the vocals — as close as a beak can rap." },
          { q: "Can I use someone else's pet?", a: "With the owner's permission, sure. Same rules as human photos." },
          { q: "What if the render fails?", a: "Failed renders are never charged — credits return automatically." },
          { q: "Is there a subscription?", a: "No — buy credits once, use them whenever. Plans are optional." },
        ],
      },
      zh: {
        title: "宠物说唱视频 —— 你家狗和猫同台轮流 verse",
        description:
          "把你家狗、猫或任何宠物的照片变成说唱视频:两只宠物,或宠物和你,在舞台上对唱原创歌曲。无需 App、无需订阅。",
        h1: "宠物说唱 —— 两只宠物,一个舞台,原创的词",
        subtitle:
          "上传每只宠物一张照片——或宠物和你——AI 渲染它们同台说唱、口型对上原创歌曲的视频。",
        shortAnswer:
          "宠物内容统治互联网,宠物说唱对战统治得更彻底。两张照片进去,AI 把你家狗和猫放上同一个舞台轮流开火——照片可以隔好几年拍的,无需订阅,每条约 3 分钟。",
        stages: zhStages,
        howSteps: [
          { t: "每只宠物一张照片", d: "脸朝前、光线足。两只宠物——或一只宠物和你。" },
          { t: "设主题", d: "\"谁啃了沙发\"自己就能成词。留空则是气氛歌。" },
          { t: "选画质", d: "标准 720p 为 10 积分;拍毛发特写上旗舰档。" },
          { t: "发布带话题", d: "解锁高清,让互联网站队。" },
        ],
        why: [
          { t: "任何两种动物", d: "狗 vs 猫、仓鼠 vs 仓鼠,或者你 vs 你家鹦鹉。" },
          { t: "原创歌曲", d: "没有版权伴奏——任何平台都安全。" },
          { t: "无需订阅", d: "一次买断,积分永不过期。" },
          { t: "三分钟", d: "比教会狗坐下还快。" },
        ],
        faq: [
          { q: "宠物照片效果和真人一样吗?", a: "一样——AI 处理得动毛发、鸟喙和胡须。清晰、光线足的照片效果最好。" },
          { q: "能做宠物和我吗?", a: "能——一张宠物照一张人照。这个二重奏妙不可言。" },
          { q: "它们对口型吗?", a: "嘴型是跟随人声生成的——鸟喙说唱也就这个程度了。" },
          { q: "能用别人的宠物吗?", a: "征得主人的同意就行。规则和人脸照片一样。" },
          { q: "渲染失败怎么办?", a: "失败绝不扣费——积分自动退回。" },
          { q: "要订阅吗?", a: "不用——一次买积分,随时用。订阅是可选的。" },
        ],
      },
    },
  },

  /* ---------------- ai-music-video-generator ---------------- */
  {
    slug: "ai-music-video-generator",
    trendTag: "AI Music Video Generator",
    copy: {
      en: {
        title: "AI Music Video Generator — It Writes the Song and Shoots the Video",
        description:
          "AI music video generator that writes the song and shoots the video: add two photos, get a lip-synced rap music video with an original beat in about 3 minutes.",
        h1: "AI music video generator — song, performance, video",
        subtitle:
          "Add two photos and an optional topic. AI writes an original song, performs it with generated voices, and films you two rapping it on stage.",
        shortAnswer:
          "Most AI music video tools give you a slideshow with a soundtrack. This one stages a performance: you and a friend on stage, trading verses of an original song, mouth movement matched to the vocals — a real music video in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add two photos", d: "One face each. Different cities, different years — both fine." },
          { t: "Add a topic", d: "What should the song be about? Leave empty for a general banger." },
          { t: "Choose model & length", d: "Standard to Ultra, 5 to 15 seconds, any format." },
          { t: "Release it", d: "Unlock HD without watermark and drop it on Shorts." },
        ],
        why: [
          { t: "One tool, whole pipeline", d: "Lyrics, vocals, beat, performance and edit — in one pass." },
          { t: "You are the cast", d: "Your photos become the performers. No stock actors." },
          { t: "Native audio", d: "Vocals and beat generated with the video, so lips match words." },
          { t: "Post-ready", d: "Vertical HD, watermark-free after unlock." },
        ],
        faq: [
          { q: "Can I use my own song?", a: "Not yet — songs are generated from scratch, which is why nothing gets muted on platforms." },
          { q: "What music styles?", a: "Rap and hip-hop with different beats per stage. More genres are coming." },
          { q: "Can I make a lyric video instead?", a: "This page shoots a performance. Lyric overlays are on the roadmap." },
          { q: "How many people can be in it?", a: "Two — a duo. Pick your most theatrical friend." },
          { q: "Do I need editing skills?", a: "None. Two photos, one topic, one button." },
          { q: "What does it cost?", a: "10 credits for the standard 720p 12-second video; better models cost more." },
        ],
      },
      zh: {
        title: "AI 音乐视频生成器 —— 写歌、拍片一次完成",
        description:
          "AI 音乐视频生成器:它写歌也拍片。上传两张照片,约 3 分钟得到对口型的原创说唱 MV。",
        h1: "AI 音乐视频生成器 —— 歌、表演、成片",
        subtitle:
          "上传两张照片和可选主题。AI 写一首原创歌,用生成的声音演唱,并拍下你们俩在舞台上说唱的画面。",
        shortAnswer:
          "多数 AI 音乐视频工具给你的是配乐幻灯片。这里是一整场表演:你和朋友同台,轮流演唱原创歌曲,嘴型对上人声——约 3 分钟出一条真正的 MV。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "每人一张。异地、隔年都行。" },
          { t: "填主题", d: "歌唱什么?留空就是一首气氛歌。" },
          { t: "选模型和时长", d: "标准到旗舰,5-15 秒,比例不限。" },
          { t: "发布", d: "解锁无水印高清,发上 Shorts。" },
        ],
        why: [
          { t: "一个工具跑完整条流水线", d: "歌词、人声、伴奏、表演、剪辑——一遍完成。" },
          { t: "你是主演", d: "你的照片就是演员。不用素材库路人。" },
          { t: "原生音频", d: "人声和伴奏与视频一起生成,嘴型对得上词。" },
          { t: "发即成片", d: "竖屏高清,解锁后无水印。" },
        ],
        faq: [
          { q: "能用我自己的歌吗?", a: "暂不能——歌曲从零生成,所以平台不会静音。" },
          { q: "有哪些曲风?", a: "说唱/嘻哈,不同舞台配不同伴奏。更多曲风在路上。" },
          { q: "能做成歌词视频吗?", a: "本页拍的是表演。歌词字幕在路线图里。" },
          { q: "能上几个人?", a: "两个——双人组。挑你最会演的朋友。" },
          { q: "需要剪辑基础吗?", a: "完全不用。两张照片一个主题一个按钮。" },
          { q: "多少钱?", a: "标准 720p 12 秒为 10 积分;更好的模型消耗更多。" },
        ],
      },
    },
  },

  /* ---------------- ai-rapper ---------------- */
  {
    slug: "ai-rapper",
    trendTag: "AI Rapper",
    copy: {
      en: {
        title: "AI Rapper From Your Own Photos — You Two, One Original Track",
        description:
          "AI rapper from your own photos: add you and a friend, pick a topic, and AI writes an original rap and beat and renders you two performing it, lip-synced.",
        h1: "AI rapper — your photos become the artist",
        subtitle:
          "Upload you and a friend, pick a topic, and AI turns you two into rappers performing an original track with the beat and vocals generated around it.",
        shortAnswer:
          "\"AI rapper\" searches usually find text tools that write bars for you to read. This one makes you the artist: two photos in, and you and your friend perform an original rap on stage — written, voiced and filmed by AI in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Upload two photos", d: "You and a collaborator. Clear, front-facing, well lit." },
          { t: "Pick the persona's topic", d: "Street stories, friendship, a birthday — the bars follow it." },
          { t: "Set the quality", d: "Standard 720p for drafts, Pro for the release." },
          { t: "Drop the track", d: "Unlock HD and post it as your debut." },
        ],
        why: [
          { t: "Your face, AI's pen", d: "The bars are written around your topic, performed by you two." },
          { t: "Beat included", d: "No separate beat maker — the track comes with the video." },
          { t: "Stage presence built in", d: "Lighting, framing and camera feel are part of the render." },
          { t: "Debut in minutes", d: "From selfies to a music video in one sitting." },
        ],
        faq: [
          { q: "Does it clone famous rappers?", a: "No. Original AI voices only — nobody's identity is copied." },
          { q: "Can I write the bars myself?", a: "Not yet — you steer with a topic. Custom lyrics are on the roadmap." },
          { q: "One person solo?", a: "The studio is built for duos; solo mode is coming." },
          { q: "Which languages?", a: "English, Chinese, Italian, Spanish, Portuguese and French — or type the topic in yours." },
          { q: "How fast?", a: "About 2-3 minutes per render." },
          { q: "Is it watermark-free?", a: "After unlock, yes — HD and clean for every platform." },
        ],
      },
      zh: {
        title: "AI 说唱歌手 —— 用你自己的照片出道",
        description:
          "用你自己的照片生成 AI 说唱歌手:上传你和朋友,选个主题,AI 写原创说唱和伴奏,并渲染你们俩对口型表演的视频。",
        h1: "AI 说唱歌手 —— 你的照片就是艺人",
        subtitle:
          "上传你和一位朋友,选个主题,AI 把你们俩变成说唱歌手,表演一首围绕主题生成的原创单曲。",
        shortAnswer:
          "搜 \"AI rapper\" 多半会找到帮你写词的文字工具。这里让你直接当艺人:两张照片进,你和你的朋友在舞台上表演一首原创说唱——写词、演唱、拍摄全由 AI 完成,约 3 分钟。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "你和搭档。清晰正脸、光线充足。" },
          { t: "选人设主题", d: "街头故事、友谊、生日——词跟着主题走。" },
          { t: "定画质", d: "草稿用标准 720p,正式发布上专业档。" },
          { t: "发单曲", d: "解锁高清,作为你的出道作发布。" },
        ],
        why: [
          { t: "你的脸,AI 的笔", d: "词围绕你的主题写,由你们俩演唱。" },
          { t: "伴奏自带", d: "不用另找 beat maker——伴奏跟着视频一起来。" },
          { t: "舞台感内置", d: "灯光、构图、镜头感都是渲染的一部分。" },
          { t: "几分钟出道", d: "从自拍到 MV,一次坐完。" },
        ],
        faq: [
          { q: "会克隆著名说唱歌手吗?", a: "不会。只用原创 AI 声音,不复制任何人的身份。" },
          { q: "能自己写词吗?", a: "暂不能——用主题引导。自定义歌词在路线图上。" },
          { q: "一个人独唱呢?", a: "舞台为双人设计;独唱模式在开发中。" },
          { q: "支持哪些语言?", a: "英/中/意/西/葡/法——或直接用你的语言写主题。" },
          { q: "多快?", a: "每次渲染约 2-3 分钟。" },
          { q: "有水印吗?", a: "解锁后没有——高清干净,随处可发。" },
        ],
      },
    },
  },

  /* ---------------- rap-maker ---------------- */
  {
    slug: "rap-maker",
    trendTag: "Rap Maker",
    copy: {
      en: {
        title: "Online Rap Maker — Say What It's About, Get the Whole Video",
        description:
          "Online rap maker: say what the rap is about, add a photo of you and a friend, and AI makes the lyrics, beat, vocals and a music video of you two performing it.",
        h1: "Rap maker — one sentence in, a full video out",
        subtitle:
          "Type the subject, add two photos, and AI assembles the whole thing: lyrics, beat, vocals, stage and lip-synced performance.",
        shortAnswer:
          "An online rap maker should make the whole rap, not just type lyrics for you. Add two photos and one sentence about the subject, and AI assembles lyrics, beat, vocals and a filmed performance — about 3 minutes, no editing.",
        stages: enStages,
        howSteps: [
          { t: "Type the subject", d: "One sentence is enough. The more specific, the funnier the bars." },
          { t: "Add two photos", d: "One per performer. They don't need to be together." },
          { t: "Pick the look", d: "Four stages, four models, three formats." },
          { t: "Make it", d: "Render free as a preview, unlock HD when it lands." },
        ],
        why: [
          { t: "Whole pipeline, one input", d: "Subject in, finished video out. Nothing else to learn." },
          { t: "Works on any phone", d: "Browser-based — no app, no timeline, no export settings." },
          { t: "Try before paying", d: "First song renders free as a preview." },
          { t: "Credits never expire", d: "Buy once, make the next one whenever." },
        ],
        faq: [
          { q: "What should I type?", a: "The subject of the rap — a person, an event, an inside joke. Names and details make it yours." },
          { q: "Is there a free version?", a: "Your first render is free as a low-res preview. Template apps exist but only swap faces on one fixed clip." },
          { q: "How long can it be?", a: "5-15 seconds standard, up to 30 on the Ultra model." },
          { q: "Can I redo it?", a: "Yes — change the topic and render again. Each render costs its credits." },
          { q: "Do I need an account?", a: "You need nothing installed; a session is created automatically so your renders are saved." },
          { q: "What devices?", a: "Any modern phone or desktop browser." },
        ],
      },
      zh: {
        title: "在线说唱制作器 —— 说一句主题,出一条完整视频",
        description:
          "在线说唱制作器:说说唱什么,上传你和朋友的照片,AI 做出歌词、伴奏、人声和你们表演的 MV。",
        h1: "说唱制作器 —— 一句话进,一条完整视频出",
        subtitle:
          "写下主题,上传两张照片,AI 组装全部:歌词、伴奏、人声、舞台和口型同步的表演。",
        shortAnswer:
          "在线说唱制作器应该做整首说唱,而不是替你打字。上传两张照片、写一句主题,AI 组装歌词、伴奏、人声和拍好的表演——约 3 分钟,无需剪辑。",
        stages: zhStages,
        howSteps: [
          { t: "写下主题", d: "一句话就够。越具体,词越好笑。" },
          { t: "上传两张照片", d: "每位表演者一张。不必是合照。" },
          { t: "选造型", d: "四个舞台、四档模型、三种比例。" },
          { t: "制作", d: "免费渲染预览,满意再解锁高清。" },
        ],
        why: [
          { t: "一条输入,全链路输出", d: "主题进,成片出。没有别要学的。" },
          { t: "任何手机都能用", d: "浏览器即可——无 App、无时间轴、无导出设置。" },
          { t: "先试后付", d: "第一首免费渲染预览。" },
          { t: "积分永不过期", d: "一次买断,想做随时做。" },
        ],
        faq: [
          { q: "该写什么?", a: "说唱的主题——一个人、一件事、一个内部梗。名字和细节让它属于你。" },
          { q: "有免费版吗?", a: "首条免费渲染为低清预览。模板 App 也有,但只是把脸换到一段固定原片上。" },
          { q: "最长多长?", a: "标准 5-15 秒,旗舰档最长 30 秒。" },
          { q: "能重做吗?", a: "能——换主题再渲染。每次渲染消耗对应积分。" },
          { q: "要注册吗?", a: "什么都不用装;会自动建立会话保存你的作品。" },
          { q: "支持什么设备?", a: "任何现代手机或桌面浏览器。" },
        ],
      },
    },
  },

  /* ---------------- rap-duo-name-generator ---------------- */
  {
    slug: "rap-duo-name-generator",
    trendTag: "Rap Duo Name Generator",
    copy: {
      en: {
        title: "Free Rap Duo Name Generator — 8 Names per Tap, Then Make the Video",
        description:
          "Free rap duo name generator: add your two first names (or none) and get eight rap duo names per tap. Then make your duo's rap video from two photos.",
        h1: "Rap duo name generator — find your stage name",
        subtitle:
          "Type your two first names (or nothing at all) and tap for eight rap duo names. Found the one? Make your duo's rap video right below.",
        shortAnswer:
          "A free tool, no credits needed: eight duo names per tap, built from your first names and rap naming conventions — Duo this, Young that, $omething else. When one sticks, scroll down and make the actual video from two photos.",
        stages: enStages,
        howSteps: [
          { t: "Type your names", d: "Two first names — or leave it empty for fully random names." },
          { t: "Tap for names", d: "Eight suggestions per tap. Keep tapping until one sticks." },
          { t: "Claim it", d: "Use it as your caption, your hashtag, your group chat title." },
          { t: "Make it official", d: "Two photos below — render the duo's first video under that name." },
        ],
        why: [
          { t: "Actually free", d: "No credits, no sign-up, no watermark on names." },
          { t: "Built for duos", d: "Names are generated for two people, not solo acts." },
          { t: "One-flow", d: "Name above, video below — no switching tools." },
          { t: "Endless taps", d: "The generator never runs out; your group chat will." },
        ],
        faq: [
          { q: "Is it really free?", a: "Yes — the name generator costs nothing. Only the video render uses credits." },
          { q: "What if the names are taken?", a: "They're suggestions, not registrations — check your platform before committing." },
          { q: "Can I use one name only?", a: "Leave the second field empty and it generates from one name." },
          { q: "Do I need the video?", a: "No — take the name and go. But the video is 10 credits and makes the name official." },
          { q: "How many names per tap?", a: "Eight. Tap again for eight more, forever." },
          { q: "Any language?", a: "The generator works with Latin names best; type what you have." },
        ],
      },
      zh: {
        title: "免费说唱组合起名器 —— 每点一次出 8 个,还能直接做视频",
        description:
          "免费说唱组合起名器:输入你们俩的名字(或留空),每点一次出 8 个组合名。选好了就用两张照片做你们的说唱视频。",
        h1: "说唱组合起名器 —— 找到你们的艺名",
        subtitle:
          "输入你们俩的名字(或者什么都不填),点一次出 8 个组合名。选中了?直接在下面做你们的组合视频。",
        shortAnswer:
          "免费工具,不花积分:每次点出 8 个组合名,由你们的名字和说唱命名惯例生成——Duo、Young、$ 开头的都有。哪个顺口,往下滚动,用两张照片把视频做出来。",
        stages: zhStages,
        howSteps: [
          { t: "输入名字", d: "两个名——或者留空完全随机。" },
          { t: "点击生成", d: "每次 8 个。一直点到顺口为止。" },
          { t: "占下它", d: "用作文案、话题标签、群名。" },
          { t: "让它官方化", d: "下面两张照片——用这个名字渲染组合的第一支视频。" },
        ],
        why: [
          { t: "真免费", d: "不要积分、不要注册、起名不带水印。" },
          { t: "专为组合", d: "生成的是双人组合名,不是单干艺名。" },
          { t: "一条流程", d: "上面起名,下面出片——不用换工具。" },
          { t: "无限点击", d: "生成器不会枯竭;你们的群聊会。" },
        ],
        faq: [
          { q: "真免费吗?", a: "真免费——起名不花积分。只有视频渲染用积分。" },
          { q: "名字被占了怎么办?", a: "这只是建议不是注册——用之前去平台查一下。" },
          { q: "只有一个名能玩吗?", a: "第二格留空,它就按一个名生成。" },
          { q: "不做视频也行吗?", a: "行——拿名字走人。但视频只要 10 积分,能让名字正式出道。" },
          { q: "一次出几个?", a: "8 个。再点再来 8 个,永远点不完。" },
          { q: "支持什么语言?", a: "拉丁字母名字效果最好;有什么就填什么。" },
        ],
      },
    },
  },

  /* ---------------- ai-promo-video-for-small-business ---------------- */
  {
    slug: "ai-promo-video-for-small-business",
    trendTag: "AI Promo for Small Business",
    copy: {
      en: {
        title: "AI Promo Video for Small Business — an Original Rap Commercial",
        description:
          "Make an AI promo video for your small business: add a photo of each owner, type one line about what you sell, and get an original rap commercial in minutes.",
        h1: "AI promo video — your shop, one rap commercial",
        subtitle:
          "Add a photo of each owner, type one line about what you sell, and AI renders the two of you performing an original promo rap on stage.",
        shortAnswer:
          "Small businesses can't afford a jingle. This is the cheap one: two owner photos, one line about the shop — \"tacos until 2am\" — and AI turns it into an original rap commercial performed by you two, vertical and postable in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add both owners", d: "One photo each. Partners, siblings, the whole leadership team." },
          { t: "Type the pitch", d: "What you sell, where, and why it's good — one line is enough." },
          { t: "Pick the vibe", d: "Street cypher for food, studio booth for services." },
          { t: "Post it everywhere", d: "Unlock HD and use it on TikTok, Reels and your website." },
        ],
        why: [
          { t: "Cheaper than a jingle", d: "About $1-3 per video versus an agency quote." },
          { t: "Your actual faces", d: "Customers trust the owners they see, not stock footage." },
          { t: "Original music", d: "No licensing fees, no muted uploads." },
          { t: "Local-hero energy", d: "Rap ads get shared when generic ads get skipped." },
        ],
        faq: [
          { q: "Will it say my business name?", a: "Yes — put it in the topic. \"Taco Rapid, open till 2am\" becomes the hook." },
          { q: "Can I use it in ads?", a: "Yes — you own the render. Check local rules on disclosing AI content in advertising." },
          { q: "One owner only?", a: "The stage is for two — but a pet, a mascot or your best customer works as the duo partner." },
          { q: "What if we have three owners?", a: "Render multiple duos, or swap in different pairs per video." },
          { q: "Does it work for services?", a: "Yes — barbers, tutors, dog walkers. Type what you do." },
          { q: "How much?", a: "10 credits standard, from $9.99 per song — cheaper than any agency." },
        ],
      },
      zh: {
        title: "小商家 AI 宣传视频 —— 一条原创说唱广告",
        description:
          "为你的小店做 AI 宣传视频:上传每位老板的照片,写一句你卖什么,几分钟得到一条原创说唱广告。",
        h1: "AI 宣传视频 —— 你的店,一条说唱广告",
        subtitle:
          "上传两位老板的照片,写一句你卖什么,AI 渲染你们俩在舞台上表演原创宣传说唱的视频。",
        shortAnswer:
          "小商家请不起广告歌。这是便宜的那条路:两张老板照片、一句店的介绍——\"凌晨两点还有炸鸡\"——AI 把它变成你们俩表演的原创说唱广告,竖屏可发,约 3 分钟。",
        stages: zhStages,
        howSteps: [
          { t: "上传两位老板", d: "每人一张。合伙人、兄妹、整个管理层都行。" },
          { t: "写卖点", d: "卖什么、在哪、好在哪——一句话就够。" },
          { t: "选氛围", d: "餐饮选街头 Cypher,服务业选录音棚。" },
          { t: "到处发布", d: "解锁高清,TikTok、Reels、官网都能用。" },
        ],
        why: [
          { t: "比广告歌便宜", d: "每条约 $1-3,比报价比起 agency 便宜两个数量级。" },
          { t: "用真老板的脸", d: "顾客信任看得见的老板,不是素材库演员。" },
          { t: "原创音乐", d: "没有授权费,不会被静音下架。" },
          { t: "本地英雄气质", d: "说唱广告被转发,普通广告被划走。" },
        ],
        faq: [
          { q: "会唱到店名吗?", a: "会——写进主题。\"爆汁炸鸡,营业到凌晨\" 就是 hook。" },
          { q: "能投广告吗?", a: "能——成片归你。投放前查一下当地对 AI 内容披露的要求。" },
          { q: "只有一个老板呢?", a: "舞台是双人的——但宠物、吉祥物或你的熟客都能当搭档。" },
          { q: "三个老板怎么办?", a: "渲染多条双人组合,或每条换一对搭档。" },
          { q: "服务业能用吗?", a: "能——理发、家教、遛狗。写下你做什么。" },
          { q: "多少钱?", a: "标准 10 积分,单首 $9.99 起——比任何代理商都便宜。" },
        ],
      },
    },
  },

  /* ---------------- ai-viking-rap ---------------- */
  {
    slug: "ai-viking-rap",
    trendTag: "AI Viking Rap",
    copy: {
      en: {
        title: "AI Viking Rap — Fur Cloaks, Torches and Trap Drums",
        description:
          "Make an AI Viking rap video from two photos: you two in fur cloaks in a torch-lit longhouse, rapping an original Viking trap song with war drums. No app.",
        h1: "AI Viking rap — the longhouse session",
        subtitle:
          "Add two photos and AI dresses you both in fur cloaks, seats you in a torch-lit longhouse, and renders an original Viking trap track with war drums.",
        shortAnswer:
          "The Viking rap trend puts modern rap energy in a medieval hall: fur, fire and 808s. Two photos in and you're both on the longhouse bench trading verses — war drums in the beat, horns in the hook, about 3 minutes to render.",
        stages: enStages,
        howSteps: [
          { t: "Add two photos", d: "You and your shield-brother. Front-facing works best." },
          { t: "Name the clan", d: "Type your crew name or saga — the bars reference it." },
          { t: "Keep the longhouse", d: "The Viking stage is pre-selected — torches included." },
          { t: "Sail to social", d: "Unlock HD and post before the trend leaves the fjord." },
        ],
        why: [
          { t: "Trend-accurate set", d: "Fur cloaks, torch light, carved wood — no prompt engineering needed." },
          { t: "War-drum trap", d: "The beat mixes 808s with drums that sound like raiding." },
          { t: "Original track", d: "Safe to post — nothing for platforms to mute." },
          { t: "Winter-ready content", d: "Firelight renders look great on dark-mode feeds." },
        ],
        faq: [
          { q: "Is this a filter?", a: "No filter — it's a generated video from your photos. There's no live Viking lens." },
          { q: "Can I bring a shield?", a: "Props come from the prompt, not your photo. Bring your face; the AI brings the furs." },
          { q: "Is the song heavy metal?", a: "It's Viking trap — war drums and 808s. Skål." },
          { q: "Does it work with helmets?", a: "Avoid covering faces in photos — the AI needs to see you to make it you." },
          { q: "How long is the trend window?", a: "Trends move fast — render this week, post it now." },
          { q: "Credits?", a: "Standard 720p 12-second render: 10 credits, from $9.99." },
        ],
      },
      zh: {
        title: "AI 维京说唱 —— 毛皮斗篷、火把与陷阱鼓",
        description:
          "用两张照片做 AI 维京说唱视频:你们俩披毛皮斗篷坐在火把长屋里,表演一首带战鼓的原创维京陷阱说唱。无需 App。",
        h1: "AI 维京说唱 —— 长屋录音现场",
        subtitle:
          "上传两张照片,AI 给你们俩披上毛皮斗篷,安排进火把长屋,渲染一首带战鼓的原创维京陷阱单曲。",
        shortAnswer:
          "维京说唱潮流把现代说唱的能量搬进中世纪大厅:毛皮、火焰和 808。两张照片进去,你们俩就坐在长屋长凳上轮流 verse——鼓点里是战鼓,hook 里有号角,约 3 分钟出片。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "你和你的盾友。正脸效果最好。" },
          { t: "给部族命名", d: "写你们的团名或史诗——词里会提到。" },
          { t: "保留长屋", d: "维京舞台已预选——火把自带。" },
          { t: "出海社交", d: "解锁高清,趁趋势还没离开峡湾赶紧发。" },
        ],
        why: [
          { t: "贴合趋势的场景", d: "毛皮斗篷、火把光、雕花木——不用你写提示词。" },
          { t: "战鼓陷阱", d: "伴奏把 808 和劫掠感的鼓混在一起。" },
          { t: "原创单曲", d: "放心发——没有会被平台静音的内容。" },
          { t: "冬天限定内容", d: "火光渲染在深色模式的信息流里格外好看。" },
        ],
        faq: [
          { q: "这是个滤镜吗?", a: "不是滤镜——是用你照片生成的视频。没有实时维京镜头。" },
          { q: "能带盾牌吗?", a: "道具来自提示词,不是你的照片。带上你的脸就行,毛皮 AI 来。" },
          { q: "歌是重金属吗?", a: "是维京陷阱——战鼓加 808。Skål。" },
          { q: "戴头盔行吗?", a: "照片里别遮脸——AI 要看到你才能变成你。" },
          { q: "趋势窗口还有多久?", a: "趋势走得快——这周渲染,现在就发。" },
          { q: "积分?", a: "标准 720p 12 秒渲染:10 积分,$9.99 起。" },
        ],
      },
    },
  },

  /* ---------------- christmas-rap-video ---------------- */
  {
    slug: "christmas-rap-video",
    trendTag: "Christmas Rap Video",
    copy: {
      en: {
        title: "Christmas Rap Video — Santa Hats by the Tree, Original Bars",
        description:
          "Make a Christmas rap video with AI: add two photos, write one line, and get you two in Santa hats by the tree rapping an original Christmas rap.",
        h1: "Christmas rap video — the tree-side session",
        subtitle:
          "Add two photos and one line — \"for the family group chat\" — and AI renders you both in Santa hats by the tree, rapping an original Christmas track.",
        shortAnswer:
          "Christmas content peaks hard and fast. Two photos in, and you're both by the tree in Santa hats trading bars about the year — an original song so the family video doesn't get muted, rendered in about 3 minutes.",
        stages: enStages,
        howSteps: [
          { t: "Add two photos", d: "You and your co-host of the year. Siblings, couples, in-laws." },
          { t: "Write one line", d: "Who it's for and one highlight of the year — \"for grandma, from the cousins\"." },
          { t: "Keep the tree", d: "The Christmas stage is pre-selected — lights and snow included." },
          { t: "Send it Christmas morning", d: "Render early, unlock HD, schedule the send." },
        ],
        why: [
          { t: "Season-perfect set", d: "Tree, lights, snow, Santa hats — zero prompt work." },
          { t: "Family-safe by default", d: "You control the topic; keep it warm." },
          { t: "Original song", d: "No copyrighted Christmas track to mute your video." },
          { t: "Group-chat gold", d: "The one link grandma will actually press." },
        ],
        faq: [
          { q: "Can it be a gift?", a: "Yes — render it with the recipients' photos (with their consent) or yours dedicating the track." },
          { q: "Will it mention Christmas?", a: "The stage and song do; add specifics in the topic line." },
          { q: "When should I make it?", a: "Early December. Trend demand spikes and queues lengthen near the 24th." },
          { q: "Can we both be in Santa hats?", a: "That's the default look on this page." },
          { q: "Is the song religious?", a: "It's festive, not liturgical — type your preference into the topic." },
          { q: "Price?", a: "10 credits for the standard render; packs make the whole family cheap." },
        ],
      },
      zh: {
        title: "圣诞说唱视频 —— 圣诞帽、圣诞树,原创的词",
        description:
          "用 AI 做圣诞说唱视频:上传两张照片,写一句话,你们俩就戴着圣诞帽在树旁表演原创圣诞说唱。",
        h1: "圣诞说唱 —— 树旁录音现场",
        subtitle:
          "上传两张照片和一句话——\"给家庭群聊的\"——AI 渲染你们俩戴圣诞帽站在树旁,表演一首原创圣诞单曲。",
        shortAnswer:
          "圣诞内容爆发又快又猛。两张照片进去,你们俩就戴着圣诞帽在树旁轮流唱这一年——歌曲是原创的,家庭视频不会被静音,约 3 分钟出片。",
        stages: zhStages,
        howSteps: [
          { t: "上传两张照片", d: "你和你的年度搭档。兄妹、情侣、姻亲都行。" },
          { t: "写一句话", d: "给谁的、这一年的一件大事——\"给姥姥,来自表哥们\"。" },
          { t: "保留圣诞树", d: "圣诞舞台已预选——灯串和雪都有。" },
          { t: "圣诞早晨发送", d: "提前渲染,解锁高清,定好发送时间。" },
        ],
        why: [
          { t: "应季场景齐活", d: "圣诞树、灯串、雪、圣诞帽——零提示词工作。" },
          { t: "默认全家可看", d: "主题由你控制;保持温暖就对了。" },
          { t: "原创歌曲", d: "没有会被静音的圣诞版权曲。" },
          { t: "群聊硬通货", d: "姥姥唯一会真点开的链接。" },
        ],
        faq: [
          { q: "能当礼物吗?", a: "能——用收礼人照片(征得同意)或用你的照片献上这首歌。" },
          { q: "会提到圣诞吗?", a: "舞台和歌曲都会;具体想说的话写进主题。" },
          { q: "什么时候做?", a: "12 月初。临近 24 号需求暴涨,队列会变长。" },
          { q: "能都戴圣诞帽吗?", a: "本页默认造型就是双圣诞帽。" },
          { q: "歌是宗教向的吗?", a: "是节日向不是宗教向——偏好写进主题里。" },
          { q: "价格?", a: "标准渲染 10 积分;积分包让全家都做得起。" },
        ],
      },
    },
  },
];
