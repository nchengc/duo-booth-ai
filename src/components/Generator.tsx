"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ASPECTS, MODELS, RESOLUTIONS, creditsFor, maxSeconds, type Aspect, type ModelId, type Resolution } from "@/lib/credits";
import { STAGES } from "@/lib/tools";
import { getDict, type Locale } from "@/lib/i18n";
import { trackClient } from "@/components/Analytics";


type Phase = "idle" | "submitting" | "rendering" | "preview_ready" | "unlocked" | "failed";

/** 生成器表单(PRD §3 七步流程) */
export default function Generator({
  locale,
  defaultStage = "hotel-lobby",
  defaultGenre,
}: {
  locale: Locale;
  defaultStage?: string;
  defaultGenre?: string;
}) {
  const d = getDict(locale);

  const [photo1, setPhoto1] = useState<{ file: File; url: string } | null>(null);
  const [photo2, setPhoto2] = useState<{ file: File; url: string } | null>(null);

  const [stage, setStage] = useState(defaultStage);
  const [model, setModel] = useState<ModelId>("seedance-2-0-mini");
  const [resolution, setResolution] = useState<Resolution>("720p");
  const [aspect, setAspect] = useState<Aspect>("9:16");
  const [lengthS, setLengthS] = useState(12);
  const [topic, setTopic] = useState("");
  const [consent, setConsent] = useState(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [balance, setBalance] = useState<number | null>(null);
  const [freeUsed, setFreeUsed] = useState(false);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollTick, setPollTick] = useState(0);
  const [unlockCost, setUnlockCost] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初始余额
  useEffect(() => {
    fetch("/api/renders")
      .then((r) => r.json())
      .then((d) => {
        setBalance(d.balance ?? 0);
        setFreeUsed(Boolean(d.freeRenderUsed));
      })
      .catch(() => {});
  }, []);

  // 轮询渲染状态
  useEffect(() => {
    if (phase !== "rendering" || !renderId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/renders/${renderId}`);
        const data = await res.json();
        if (cancelled) return;
        if (typeof data.balance === "number") setBalance(data.balance);
        if (data.status === "preview_ready") {
          setVideoUrl(data.previewUrl);
          setPhase("preview_ready");
          // 解锁价按降档后的实际渲染档位(免费预览强制 mini/480p/5s)
          if (typeof data.unlockCredits === "number") setUnlockCost(data.unlockCredits);
          // 埋点:看到付款框(免费预览 + 解锁按钮出现)
          trackClient("view_paywall", { model, resolution });
          return;
        }
        if (data.status === "failed") {
          setError(data.errorCode ?? "render_failed");
          setPhase("failed");
          return;
        }
      } catch {
        /* 网络抖动,继续轮询 */
      }
      if (!cancelled) timerRef.current = setTimeout(poll, 2500);
    };

    timerRef.current = setTimeout(poll, 1500);
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, renderId, pollTick, model, resolution]);

  const cost = creditsFor(model, resolution, lengthS);
  const maxLen = maxSeconds(model);

  // 切换模型时:若新模型不支持当前分辨率则回落,同时收敛时长(事件处理器内收敛,不进 effect)
  const onModelChange = useCallback((next: ModelId) => {
    setModel(next);
    if (MODELS.find((m) => m.id === next)?.credits[resolution] === null) setResolution("720p");
    if (lengthS > maxSeconds(next)) setLengthS(maxSeconds(next));
  }, [resolution, lengthS]);

  const onPick = useCallback((which: 1 | 2, file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const setter = which === 1 ? setPhoto1 : setPhoto2;
    const prev = which === 1 ? photo1 : photo2;
    if (prev) URL.revokeObjectURL(prev.url);
    setter({ file, url });
  }, [photo1, photo2]);

  const submit = useCallback(async () => {
    setError(null);
    // 埋点:点生成(PRD §15 漏斗第 4 步);有照片时记"传照片"
    trackClient("click_generate", { stage, model, resolution, aspect, lengthS });
    if (photo1 && photo2) trackClient("upload_photos", { count: 2 });
    if (!photo1 || !photo2) {
      setError(d.gen.photoRequired);
      return;
    }
    if (!consent) {
      setError(d.gen.consentRequired);
      return;
    }

    setPhase("submitting");
    const fd = new FormData();
    fd.append("photo1", photo1.file);
    fd.append("photo2", photo2.file);
    fd.append("stage", stage);
    fd.append("model", model);
    fd.append("resolution", resolution);
    fd.append("aspect", aspect);
    fd.append("lengthS", String(lengthS));
    fd.append("topic", topic);
    fd.append("genre", defaultGenre ?? "");
    fd.append("consent", "true");

    try {
      const res = await fetch("/api/renders", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "failed");
        setPhase("failed");
        return;
      }
      setBalance(data.balance);
      if (data.free) setFreeUsed(true);
      setRenderId(data.renderId);
      setPhase("rendering");
    } catch {
      setError("network_error");
      setPhase("failed");
    }
  }, [photo1, photo2, consent, stage, model, resolution, aspect, lengthS, topic, defaultGenre, d.gen]);

  const unlock = useCallback(async () => {
    if (!renderId) return;
    setPhase("submitting");
    try {
      const res = await fetch(`/api/renders/${renderId}/unlock`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "unlock_failed");
        setPhase("preview_ready");
        return;
      }
      setBalance(data.balance);
      setVideoUrl(data.finalUrl);
      setPhase("unlocked");
    } catch {
      setError("network_error");
      setPhase("preview_ready");
    }
  }, [renderId]);

  const reset = useCallback(() => {
    setPhase("idle");
    setRenderId(null);
    setVideoUrl(null);
    setError(null);
    setPollTick((t) => t + 1);
  }, []);

  return (
    <div className="card p-6 md:p-8">
      {/* 顶部:积分余额 + 免费首条提示 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-gold">{d.gen.title}</h2>
        <div className="flex items-center gap-3 text-sm">
          {balance !== null && !freeUsed ? (
            <span className="chip !text-mint">✓ {d.gen.freeBadge}</span>
          ) : freeUsed ? (
            <span className="chip">{d.gen.freeDone}</span>
          ) : null}
          <span className="chip">
            {d.gen.balance}: <strong className="text-ink">{balance ?? "—"}</strong>
          </span>
          {balance === null ? null : balance < (cost ?? 0) && phase === "idle" ? (
            <Link href="/pricing" className="text-accent underline">
              {d.gen.buyCredits}
            </Link>
          ) : null}
        </div>
      </div>

      {/* ---------- 1. 照片上传 ×2 ---------- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <PhotoSlot
          label={d.gen.photo1}
          hint={d.gen.dropHint}
          replaceLabel={d.gen.replace}
          preview={photo1?.url ?? null}
          onFile={(f) => onPick(1, f)}
        />
        <PhotoSlot
          label={d.gen.photo2}
          hint={d.gen.dropHint}
          replaceLabel={d.gen.replace}
          preview={photo2?.url ?? null}
          onFile={(f) => onPick(2, f)}
        />
      </div>
      <p className="mt-2 text-xs text-muted">{d.gen.photoHint}</p>

      {/* ---------- 2. 舞台 ---------- */}
      <h3 className="sub mt-7">{d.gen.stageTitle}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStage(s.id)}
            className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
              stage === s.id
                ? "border-accent bg-card2 text-ink"
                : "border-line bg-transparent text-muted hover:border-line hover:text-ink"
            }`}
          >
            <span className="block font-semibold">{s.label}</span>
            <span className="block text-xs opacity-70">{s.note}</span>
          </button>
        ))}
      </div>

      {/* ---------- 3. 画质与时长 ---------- */}
      <h3 className="sub mt-7">{d.gen.qualityTitle}</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">{d.gen.modelLabel}</span>
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value as ModelId)}
            className="w-full rounded-lg border border-line bg-card2 px-3 py-2 text-sm"
          >
            {MODELS.map((m, i) => (
              <option key={m.id} value={m.id}>
                {d.home.models[i]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">{d.gen.resolutionLabel}</span>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value as Resolution)}
            className="w-full rounded-lg border border-line bg-card2 px-3 py-2 text-sm"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r} disabled={MODELS.find((m) => m.id === model)?.credits[r] === null}>
                {r}
                {MODELS.find((m) => m.id === model)?.credits[r] === null ? " —" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">{d.gen.aspectLabel}</span>
          <select
            value={aspect}
            onChange={(e) => setAspect(e.target.value as Aspect)}
            className="w-full rounded-lg border border-line bg-card2 px-3 py-2 text-sm"
          >
            {ASPECTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1 flex justify-between text-xs text-muted">
          <span>{d.gen.lengthLabel}</span>
          <span>
            {lengthS} {d.gen.seconds}
          </span>
        </span>
        <input
          type="range"
          min={5}
          max={maxLen}
          step={1}
          value={Math.min(lengthS, maxLen)}
          onChange={(e) => setLengthS(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)]"
        />
      </label>

      {/* ---------- 4. 主题(可选) ---------- */}
      <h3 className="sub mt-7">{d.gen.topicTitle}</h3>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder={d.gen.topicPlaceholder}
        maxLength={120}
        className="w-full rounded-lg border border-line bg-card2 px-4 py-3 text-sm"
      />
      <p className="mt-1 text-xs text-muted">{d.gen.topicHint}</p>

      {/* ---------- 5. 权限勾选 ---------- */}
      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-[var(--color-accent)]"
        />
        <span className="text-muted">{d.gen.consent}</span>
      </label>

      {/* ---------- 6. 提交 / 状态 ---------- */}
      {phase === "idle" || phase === "submitting" ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={submit}
            disabled={phase === "submitting"}
            className="btn-primary w-full disabled:opacity-50"
          >
            {phase === "submitting" ? d.gen.rendering : d.gen.submit}
          </button>
          <div className="mt-2 text-center text-xs text-muted">
            {cost !== null ? `${cost} ${d.gen.creditUnit}` : ""}
            {cost !== null && balance !== null && balance < cost ? ` · ${d.gen.insufficient}` : ""}
          </div>
        </div>
      ) : null}

      {phase === "rendering" ? (
        <div className="mt-6 rounded-xl border border-line bg-card2 p-6 text-center">
          <div className="mx-auto mb-4 h-2 w-48 overflow-hidden rounded-full bg-line">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-gold to-accent" />
          </div>
          <div className="font-semibold">{d.gen.rendering}</div>
          <div className="mt-1 text-xs text-muted">{d.gen.renderingHint}</div>
        </div>
      ) : null}

      {phase === "preview_ready" || phase === "unlocked" ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-gold">
              {phase === "unlocked" ? d.gen.unlocked : d.gen.previewTitle}
            </h3>
            <button type="button" onClick={reset} className="text-xs text-muted underline">
              {d.gen.newVideo}
            </button>
          </div>
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              playsInline
              className="mx-auto max-h-[520px] w-auto rounded-xl border border-line"
            />
          ) : null}
          {phase === "preview_ready" ? (
            <>
              <p className="mt-3 text-center text-xs text-muted">{d.gen.previewHint}</p>
              <button type="button" onClick={unlock} className="btn-primary mt-3 w-full">
                {d.gen.unlock}
                {unlockCost !== null ? ` · ${unlockCost} ${d.gen.creditUnit}` : ""}
              </button>
            </>
          ) : (
            <a
              href={videoUrl ?? "#"}
              download
              onClick={() => trackClient("download")}
              className="btn-primary mt-3 block w-full text-center"
            >
              {d.gen.download}
            </a>
          )}
        </div>
      ) : null}

      {phase === "failed" ? (
        <div className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-6 text-center">
          <div className="font-semibold text-accent">{d.gen.failed}</div>
          <p className="mt-1 text-xs text-muted">{d.gen.failedHint}</p>
          {error ? <p className="mt-2 text-xs text-muted">{error}</p> : null}
          <button type="button" onClick={reset} className="btn-primary mt-4">
            {d.gen.retry}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ============ 照片上传槽 ============ */
function PhotoSlot({
  label,
  hint,
  replaceLabel,
  preview,
  onFile,
}: {
  label: string;
  hint: string;
  replaceLabel: string;
  preview: string | null;
  onFile: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div>
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border-2 transition ${
          drag ? "border-accent" : "border-dashed border-line"
        } ${preview ? "bg-card2" : "bg-card2/40"}`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-muted">{hint}</span>
        )}
        {preview ? (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs">
            {replaceLabel}
          </span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </div>
  );
}
