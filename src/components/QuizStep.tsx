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

      <div className="option-list">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            className={["option", isSelected(opt.value) ? "selected" : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(opt.value)}
          >
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
          <button className="btn-ghost" onClick={onBack}>
            ← back
          </button>
        ) : (
          <span />
        )}
        <button
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