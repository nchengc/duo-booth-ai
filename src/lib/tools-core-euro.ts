/**
 * 核心页五语元数据(PRD §5.4 D45):hotel-lobby-ai + migos-ai 的 SEO 字段本地化
 * 正文(howSteps/why/faq)回退英文 —— 合并逻辑见 tools.ts 的 resolveToolCopy
 */

import type { Locale, ToolCopy } from "./tools";

/** 核心页元数据本地化字段(正文 howSteps/why/faq 回退 EN) */
type PartialCopy = Pick<ToolCopy, "title" | "description" | "h1" | "subtitle" | "shortAnswer">;

/** 核心页元数据本地化字段(正文回退 EN) */

export const CORE_EURO_COPY: Record<string, Partial<Record<Locale, PartialCopy>>> = {
  "hotel-lobby-ai": {
    it: {
      title: "Hotel Lobby AI Video Generator — Due foto per il trend virale",
      description:
        "Hotel Lobby AI video generator: carica due foto e ottieni il trend virale della cabina arancione con i tuoi volti. Canzone AI originale, senza app, circa 3 minuti.",
      h1: "Video Hotel Lobby AI, direttamente da due foto",
      subtitle:
        "Carica una tua foto e una di un amico — l'AI vi mette entrambi nella cabina arancione, mentre rappate una canzone originale. Senza app, senza template, circa 3 minuti.",
      shortAnswer:
        "Questo è il modo più semplice per creare il video Hotel Lobby AI con i vostri volti. Ogni persona aggiunge una foto chiara, si mantiene la cabina arancione, e in circa 3 minuti ottieni un clip HD verticale dei due di voi che vi alternate — con il lip-sync e una canzone originale che nessuna piattaforma blocca.",
    },
    es: {
      title: "Generador de video Hotel Lobby AI — Dos fotos para la tendencia viral",
      description:
        "Generador de video Hotel Lobby AI: sube dos fotos y obtén la tendencia viral de la cabina naranja con sus rostros. Canción AI original, sin app, unos 3 minutos.",
      h1: "Video Hotel Lobby AI, directo desde dos fotos",
      subtitle:
        "Sube una foto tuya y una de un amigo — la IA los pone a ambos en la cabina naranja, rapeando una canción original. Sin app, sin plantilla, unos 3 minutos.",
      shortAnswer:
        "Esta es la forma más simple de hacer el video Hotel Lobby AI con sus propios rostros. Cada persona agrega una foto clara, mantienes la cabina naranja, y en unos 3 minutos obtienes un clip HD vertical de los dos turnándose — con lip-sync y una canción original que ninguna plataforma silencia.",
    },
    pt: {
      title: "Gerador de vídeo Hotel Lobby AI — Duas fotos para a trend viral",
      description:
        "Gerador de vídeo Hotel Lobby AI: envie duas fotos e obtenha a trend viral da cabine laranja com os rostos de vocês. Música AI original, sem app, cerca de 3 minutos.",
      h1: "Vídeo Hotel Lobby AI, direto de duas fotos",
      subtitle:
        "Envie uma foto sua e uma de um amigo — a IA coloca vocês dois na cabine laranja, rapeando uma música original. Sem app, sem template, cerca de 3 minutos.",
      shortAnswer:
        "Esta é a forma mais simples de fazer o vídeo Hotel Lobby AI com os rostos de vocês. Cada pessoa envia uma foto clara, mantém a cabine laranja, e em cerca de 3 minutos você tem um clipe HD vertical dos dois se alternando — com lip-sync e uma música original que nenhuma plataforma silencia.",
    },
    fr: {
      title: "Générateur de vidéo Hotel Lobby AI — Deux photos pour la tendance virale",
      description:
        "Générateur de vidéo Hotel Lobby AI : ajoutez deux photos et obtenez la tendance virale de la cabine orange avec vos visages. Chanson AI originale, sans app, environ 3 minutes.",
      h1: "Vidéo Hotel Lobby AI, directement depuis deux photos",
      subtitle:
        "Ajoutez une photo de vous et une d'un ami — l'IA vous met tous les deux dans la cabine orange, en train de rapper un titre original. Sans app, sans template, environ 3 minutes.",
      shortAnswer:
        "C'est la façon la plus simple de créer la vidéo Hotel Lobby AI avec vos propres visages. Chaque personne ajoute une photo nette, vous gardez la cabine orange, et en environ 3 minutes vous obtenez un clip HD vertical des deux de vous qui se relaient — avec lip-sync et une chanson originale qu'aucune plateforme ne mute.",
    },
  },
  "migos-ai": {
    it: {
      title: "Migos AI Song & Video Maker — Due foto, un duo rap",
      description:
        "Migos AI song and video maker: due foto dentro, e tu e un amico rappate una canzone originale in stile Migos. Senza clonazione vocale, senza app, circa 3 minuti.",
      h1: "Stile Migos AI — il vostro duo, una canzone originale",
      subtitle:
        "Il trend si chiama anche Migos AI. Due foto dentro, un video rap di duo fuori: testi originali, voci e beat generati, i vostri volti sul palco.",
      shortAnswer:
        "\"Migos AI\" è un altro nome per lo stesso trend del rap duo. Questa pagina è lo stesso studio con il testo adeguato: due foto, un tema opzionale, e un rap originale eseguito da te e un amico — nessuna voce di celebrità viene clonata, il risultato è sicuro e tuo.",
    },
    es: {
      title: "Migos AI Song & Video Maker — Dos fotos, un dúo de rap",
      description:
        "Migos AI song and video maker: dos fotos dentro, y tú y un amigo rapean una canción original al estilo Migos. Sin clonación de voz, sin app, unos 3 minutos.",
      h1: "Estilo Migos AI — su dúo, una canción original",
      subtitle:
        "La tendencia también se llama Migos AI. Dos fotos dentro, un video de rap en dúo fuera: letras originales, voces y beat generados, sus rostros en el escenario.",
      shortAnswer:
        "\"Migos AI\" es otro nombre de la misma tendencia de rap en dúo. Esta página es el mismo estudio con la redacción ajustada: dos fotos, un tema opcional, y un rap original interpretado por ti y un amigo — no se clona ninguna voz de celebridad, el resultado es seguro y tuyo.",
    },
    pt: {
      title: "Migos AI Song & Video Maker — Duas fotos, uma dupla de rap",
      description:
        "Migos AI song and video maker: duas fotos dentro, e você e um amigo rapeiam uma música original no estilo Migos. Sem clonagem de voz, sem app, cerca de 3 minutos.",
      h1: "Estilo Migos AI — a dupla de vocês, uma música original",
      subtitle:
        "A trend também se chama Migos AI. Duas fotos dentro, um vídeo de rap em dupla fora: letras originais, vozes e beat gerados, os rostos de vocês no palco.",
      shortAnswer:
        "\"Migos AI\" é outro nome para a mesma trend de rap em dupla. Esta página é o mesmo estúdio com a redação ajustada: duas fotos, um tema opcional, e um rap original interpretado por você e um amigo — nenhuma voz de celebridade é clonada, o resultado é seguro e seu.",
    },
    fr: {
      title: "Migos AI Song & Video Maker — Deux photos, un duo de rap",
      description:
        "Migos AI song and video maker : deux photos dedans, et vous et un ami rappez une chanson originale dans le style Migos. Sans clonage de voix, sans app, environ 3 minutes.",
      h1: "Style Migos AI — votre duo, un titre original",
      subtitle:
        "La tendance s'appelle aussi Migos AI. Deux photos dedans, une vidéo de rap en duo dehors : paroles originales, voix et beat générés, vos visages sur scène.",
      shortAnswer:
        "\"Migos AI\" est un autre nom de la même tendance de rap en duo. Cette page est le même studio avec la formulation ajustée : deux photos, un thème optionnel, et un rap original interprété par vous et un ami — aucune voix de célébrité n'est clonée, le résultat est sûr et vous appartient.",
    },
  },
};
