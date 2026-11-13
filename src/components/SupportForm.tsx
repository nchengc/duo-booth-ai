"use client";

import { useCallback, useState } from "react";

/** 工单提交表单(PRD §18:客服政策化 —— AI 按政策判断) */
export default function SupportForm({
  title,
  subject,
  body,
  send,
  sent,
}: {
  title: string;
  subject: string;
  body: string;
  send: string;
  sent: string;
}) {
  const [subjectV, setSubjectV] = useState("");
  const [bodyV, setBodyV] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = useCallback(async () => {
    if (!subjectV.trim() || !bodyV.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject: subjectV, body: bodyV }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }, [subjectV, bodyV]);

  if (state === "sent") {
    return (
      <div className="mt-8 rounded-xl border border-line bg-card2 p-6 text-center text-sm">
        ✅ {sent}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="sub">{title}</h2>
      <input
        type="text"
        value={subjectV}
        onChange={(e) => setSubjectV(e.target.value)}
        maxLength={120}
        placeholder={subject}
        className="mt-3 w-full rounded-lg border border-line bg-card2 px-4 py-3 text-sm"
      />
      <textarea
        value={bodyV}
        onChange={(e) => setBodyV(e.target.value)}
        maxLength={2000}
        rows={5}
        placeholder={body}
        className="mt-3 w-full rounded-lg border border-line bg-card2 px-4 py-3 text-sm"
      />
      <button
        type="button"
        onClick={submit}
        disabled={state === "sending" || !subjectV.trim() || !bodyV.trim()}
        className="btn-primary mt-3 disabled:opacity-50"
      >
        {state === "sending" ? "…" : send}
      </button>
      {state === "error" ? <p className="mt-2 text-xs text-accent">network_error</p> : null}
    </div>
  );
}
