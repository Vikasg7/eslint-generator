"use client";

import { useState } from "react";

import { buildShareUrl } from "@/lib/encodeAnswers";
import type { QuizAnswers } from "@/types/quiz";

interface ShareButtonProps {
  answers: Partial<QuizAnswers>;
}

export function ShareButton({ answers }: ShareButtonProps) {
  const [copyLabel, setCopyLabel] = useState("copy link");
  const sharePath = buildShareUrl(answers, "");

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(buildShareUrl(answers));
    setCopyLabel("copied!");

    window.setTimeout(() => {
      setCopyLabel("copy link");
    }, 1500);
  };

  return (
    <section className="block">
      <div className="block-header">
        <span className="block-title">SHARE URL</span>
      </div>
      <div className="share-bar">
        <span className="share-url" title={sharePath}>
          {sharePath}
        </span>
        <button
          type="button"
          className="action-btn primary"
          onClick={handleCopy}
        >
          {copyLabel}
        </button>
      </div>
    </section>
  );
}
