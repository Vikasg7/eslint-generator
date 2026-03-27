"use client"
import { useState } from "react"
import type { GeneratedConfig } from "@/types/quiz"

interface Props {
  installCmd: GeneratedConfig["installCmd"]
}

type PM = "npm" | "pnpm" | "yarn"

export function InstallCommand({ installCmd }: Props) {
  const [copiedPm, setCopiedPm] = useState<PM | null>(null)

  async function copy(pm: PM): Promise<void> {
    await navigator.clipboard.writeText(installCmd[pm])
    setCopiedPm(pm)
    setTimeout(() => setCopiedPm(null), 1500)
  }

  return (
    <div className="block install-section">
      <div className="block-header">
        <span className="block-title">INSTALL COMMAND</span>
      </div>
      <div className="install-list">
        {(["npm", "pnpm", "yarn"] as PM[]).map((pm) => (
          <div key={pm} className="install-row">
            <span className="pm-label">{pm}</span>
            <span className="install-cmd">{installCmd[pm]}</span>
            <button className="copy-mini" onClick={() => copy(pm)}>
              {copiedPm === pm ? "✓" : "copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}