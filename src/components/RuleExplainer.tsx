"use client"
import { useState } from "react"
import type { RuleExplanation } from "@/types/quiz"

interface Props {
  rules: RuleExplanation[]
}

export function RuleExplainer({ rules }: Props) {
  const [open, setOpen] = useState<string | null>(null)

  function toggle(name: string): void {
    setOpen(open === name ? null : name)
  }

  function severityClass(sev: string): string {
    if (sev === "error") return "sev-error"
    if (sev === "warn")  return "sev-warn"
    return "sev-off"
  }

  return (
    <div className="block rule-explainer">
      <div className="block-header">
        <span className="block-title">RULES EXPLAINED</span>
        <span className="rule-count">{rules.length} rules</span>
      </div>
      {rules.map((rule) => (
        <div key={rule.name} className="rule-item">
          <button className="rule-row" onClick={() => toggle(rule.name)}>
            <span className="rule-name">{rule.name}</span>
            <span className={`severity ${severityClass(rule.severity)}`}>
              {rule.severity}
            </span>
            <span className={`chevron ${open === rule.name ? "open" : ""}`}>
              ▶
            </span>
          </button>
          {open === rule.name && (
            <div className="rule-body">
              <p>{rule.desc}</p>
              <p className="rule-why">
                <strong>Why this rule?</strong> {rule.why}
              </p>
              {rule.docs && (
                <a className="rule-docs"
                  href={rule.docs}
                  target="_blank"
                  rel="noreferrer"
                >
                  ESLint docs →
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}