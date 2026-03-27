"use client"
import { useState } from "react"
import { buildShareUrl } from "@/lib/encodeAnswers"
import type { QuizAnswers } from "@/types/quiz"

interface Props {
  answers: Partial<QuizAnswers>
}

export function ShareButton({ answers }: Props) {
  const [copied, setCopied] = useState(false)
  const url = buildShareUrl(answers)

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="share-bar">
      <span className="share-label">share</span>
      <span className="share-url" title={url}>{url}</span>
      <button className="action-btn" onClick={handleCopy}>
        {copied ? "copied!" : "copy link"}
      </button>
    </div>
  )
}