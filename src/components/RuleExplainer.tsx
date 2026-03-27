"use client";

import { useState } from "react";

import type { RuleExplanation } from "@/types/quiz";

interface RuleExplainerProps {
  rules: RuleExplanation[];
}

function getSeverityClass(severity: RuleExplanation["severity"]): string {
  if (severity === "error") {
    return "sev-error";
  }

  if (severity === "warn") {
    return "sev-warn";
  }

  return "sev-off";
}

export function RuleExplainer({ rules }: RuleExplainerProps) {
  const [openRule, setOpenRule] = useState<string | null>(
    rules[0]?.name ?? null,
  );

  return (
    <section className="block">
      <div className="block-header">
        <span className="block-title">RULES EXPLAINED</span>
      </div>
      <div className="rule-list">
        {rules.map((rule) => {
          const isOpen = openRule === rule.name;

          return (
            <article key={rule.name} className="rule-item">
              <button
                type="button"
                className="rule-row"
                onClick={() => setOpenRule(isOpen ? null : rule.name)}
              >
                <span className="rule-left">
                  <span className="rule-name">{rule.name}</span>
                  <span className={`severity ${getSeverityClass(rule.severity)}`}>
                    {rule.severity}
                  </span>
                </span>
                <span
                  className={`rule-chevron${isOpen ? " open" : ""}`}
                  aria-hidden="true"
                >
                  ▶
                </span>
              </button>

              {isOpen ? (
                <div className="rule-body">
                  <p>{rule.desc}</p>
                  <p>
                    <span className="rule-body-label">Why this rule?</span> {rule.why}
                  </p>
                  {rule.docs ? (
                    <a
                      className="rule-link"
                      href={rule.docs}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read the docs →
                    </a>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
