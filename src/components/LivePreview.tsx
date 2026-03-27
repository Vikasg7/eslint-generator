"use client"
import { useMemo } from "react"
import { generateConfig } from "@/lib/generateConfig"
import type { QuizAnswers } from "@/types/quiz"

interface Props {
  answers: Partial<QuizAnswers>
}

export function LivePreview({ answers }: Props) {
  const config = useMemo(() => generateConfig(answers), [answers])
  const lines  = config.flatConfig.split("\n")
  const preview = lines.slice(0, 18)
  const hasMore = lines.length > 18

  return (
    <aside className="live-preview">
      <div className="preview-header">
        <span className="preview-dot" />
        <span className="preview-title">LIVE PREVIEW</span>
      </div>
      <pre className="preview-body">
        {preview.map((line, i) => (
          <div key={i} className="preview-line">
            {line || " "}
          </div>
        ))}
        {hasMore && <div className="preview-line muted">  ···</div>}
      </pre>
    </aside>
  )
}