"use client";

/** 全局错误边界(生产兜底:白屏替代为品牌化错误页 + 重试) */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center">
      <div className="font-display text-5xl text-accent">Oops</div>
      <p className="mt-4 max-w-md text-muted">
        Something went wrong on our side — please try again.
        如果页面持续出错,请通过工单联系我们。
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-8">
        Retry / 重试
      </button>
    </div>
  );
}
