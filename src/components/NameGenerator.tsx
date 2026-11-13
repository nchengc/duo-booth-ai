"use client";

import { useCallback, useState } from "react";
import { trackClient } from "@/components/Analytics";

/**
 * 免费说唱组合起名器(PRD §5.2 rap-duo-name-generator 页的承诺功能)
 * 语言中立:名字本身即输出,标题走词典
 */

const PREFIXES = ["Young", "Lil", "Big", "$", "King", "MC", "DJ", "2", "Slim", "Yung"];
const SUFFIXES = ["Boi", "Gang", "Squad", "Wave", "Cartel", "Empire", "Clique", "World"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cap(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
}

function generateEight(a: string, b: string): string[] {
  const A = cap(a.trim() || pick(["Ace", "Kash", "Rex", "Nova", "Zay"]));
  const B = cap(b.trim() || pick(["Rio", "Kilo", "Mars", "Jett", "Cruz"]));
  const templates = [
    () => `${A} x ${B}`,
    () => `Young ${B}`,
    () => `Lil ${A}`,
    () => `${A}${B}`,
    () => `${pick(PREFIXES)} ${A} & ${pick(PREFIXES)} ${B}`,
    () => `The ${A} ${pick(SUFFIXES)}`,
    () => `$${B}`,
    () => `DJ ${A} ${pick(SUFFIXES)}`,
    () => `${A} ${pick(SUFFIXES)}`,
    () => `${pick(PREFIXES)} ${B}`,
    () => `${A} Boyz`,
    () => `${B} & ${A}`,
  ];
  // 洗牌取前 8,保证一次点击 8 个不重复
  const shuffled = templates.sort(() => Math.random() - 0.5).slice(0, 8);
  return shuffled.map((fn) => fn());
}

export default function NameGenerator({ title, tap, hint }: { title: string; tap: string; hint: string }) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [taps, setTaps] = useState(0);

  const onTap = useCallback(() => {
    setNames(generateEight(name1, name2));
    setTaps((t) => t + 1);
    // 埋点:免费工具参与度(漏斗最顶部的信号)
    trackClient("name_tap", { hasName1: Boolean(name1.trim()), hasName2: Boolean(name2.trim()) });
  }, [name1, name2]);

  return (
    <section className="card mb-8 p-6 md:p-8">
      <h2 className="font-display text-xl text-gold">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          maxLength={20}
          placeholder={hint}
          className="w-full rounded-lg border border-line bg-card2 px-4 py-3 text-sm"
        />
        <input
          type="text"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          maxLength={20}
          placeholder={hint}
          className="w-full rounded-lg border border-line bg-card2 px-4 py-3 text-sm"
        />
      </div>
      <button type="button" onClick={onTap} className="btn-primary mt-4 w-full sm:w-auto">
        {tap}
      </button>
      {names.length > 0 ? (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {names.map((n) => (
            <li key={n} className="rounded-lg border border-line bg-card2 px-4 py-2.5 text-sm font-semibold">
              {n}
            </li>
          ))}
        </ul>
      ) : null}
      {taps > 0 ? <p className="mt-3 text-xs text-muted">×{taps}</p> : null}
    </section>
  );
}
