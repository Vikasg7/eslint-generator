"use client"
import { useState } from "react"
import type { GeneratedConfig } from "@/types/quiz"

interface Props {
  config: GeneratedConfig
}

export function ConfigOutput({ config }: Props) {
  const [tab, setTab]       = useState<"flat" | "legacy">("flat")
  const [copied, setCopied] = useState(false)

  const content  = tab === "flat" ? config.flatConfig : config.legacyConfig
  const filename = tab === "flat" ? "eslint.config.js" : ".eslintrc.json"

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleDownload(): void {
    const blob = new Blob([content], { type: "text/plain" })
    const a    = document.createElement("a")
    a.href     = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="block config-output">
      <div className="block-header">
        <div className="tab-row">
          <button
            className={tab === "flat" ? "tab active" : "tab"}
            onClick={() => setTab("flat")}
          >
            eslint.config.js
          </button>
          <button
            className={tab === "legacy" ? "tab active" : "tab"}
            onClick={() => setTab("legacy")}
          >
            .eslintrc.json
          </button>
        </div>
        <div className="action-row">
          <button className="action-btn" onClick={handleDownload}>
            ↓ download
          </button>
          <button className="action-btn primary" onClick={handleCopy}>
            {copied ? "copied!" : "copy config"}
          </button>
        </div>
      </div>
      <pre className="code-block">{content}</pre>
    </div>
  )
}