"use client"
import type { QuizStep as QuizStepType } from "@/types/quiz"

interface Props {
  step:      QuizStepType
  stepIndex: number
  total:     number
  selected:  string | string[]
  onSelect:  (value: string) => void
  onNext:    () => void
  onBack:    () => void
}

function getOptionMark(value: string): string {
  const tokens: Record<string, string> = {
    react: "RE",
    vue: "VU",
    node: "ND",
    vanilla: "JS",
    ts: "TS",
    js: "JS",
    mixed: "MX",
    relaxed: "01",
    moderate: "02",
    strict: "03",
    prettier: "PR",
    imports: "IM",
    a11y: "AX",
    security: "SC",
    perf: "PF",
    testing: "TS",
    promises: "PM",
    cleanup: "CL",
    maintainability: "MT",
    beginner: "JR",
    senior: "SR",
  }

  return tokens[value] ?? "•"
}

export function QuizStep({
  step,
  stepIndex,
  total,
  selected,
  onSelect,
  onNext,
  onBack,
}: Props) {
  const isMulti    = step.type === "multi"
  const selectedArr = Array.isArray(selected)
    ? selected
    : selected
    ? [selected]
    : []
  const canContinue = isMulti || selectedArr.length > 0
  const optionListClassName = isMulti ? "option-list option-grid" : "option-list"

  const isSelected = (val: string) =>
    isMulti ? selectedArr.includes(val) : selectedArr[0] === val

  return (
    <div className="quiz-step">
      {/* Progress track */}
      <div className="progress-track">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={[
              "progress-node",
              i < stepIndex  ? "done"   : "",
              i === stepIndex ? "active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>

      <p className="step-label">
        STEP {String(stepIndex + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </p>
      <h2 className="question">{step.question}</h2>
      <p className="question-sub">{step.sub}</p>

      <div className={optionListClassName}>
        {step.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={["option", isSelected(opt.value) ? "selected" : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(opt.value)}
          >
            <span className="option-icon">{getOptionMark(opt.value)}</span>
            <div className="option-text">
              <span className="option-label">{opt.label}</span>
              <span className="option-desc">{opt.desc}</span>
            </div>
            <div className="option-indicator">
              {isSelected(opt.value) && <div className="option-indicator-dot" />}
            </div>
          </button>
        ))}
      </div>

      {isMulti && (
        <p className="hint">Select all that apply — skip to use defaults</p>
      )}

      <div className="nav-row">
        {stepIndex > 0 ? (
          <button type="button" className="btn-ghost" onClick={onBack}>
            ← back
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={onNext}
          disabled={!canContinue}
        >
          {stepIndex === total - 1 ? "Generate config →" : "Continue →"}
        </button>
      </div>
    </div>
  )
}
