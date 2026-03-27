"use client";

import { useMemo } from "react";

import { generateConfig } from "@/lib/generateConfig";
import type { QuizAnswers } from "@/types/quiz";

interface LivePreviewProps {
  answers: Partial<QuizAnswers>;
}

export function LivePreview({ answers }: LivePreviewProps) {
  const previewLines = useMemo(() => {
    const lines = generateConfig(answers).flatConfig.split("\n");
    const truncated = lines.slice(0, 18);

    if (lines.length > 18) {
      truncated.push("···");
    }

    return truncated.join("\n");
  }, [answers]);

  return (
    <aside className="block live-preview">
      <div className="block-header preview-header">
        <div className="preview-status">
          <span className="preview-dot" aria-hidden="true" />
          <span className="block-title">LIVE PREVIEW</span>
        </div>
      </div>
      <pre className="preview-body">{previewLines}</pre>
    </aside>
  );
}
