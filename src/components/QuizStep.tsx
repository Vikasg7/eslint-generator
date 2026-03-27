import type { QuizStep as QuizStepType } from "@/types/quiz";

interface QuizStepProps {
  step: QuizStepType;
  stepIndex: number;
  total: number;
  selected: string | string[];
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

function getOptionMark(stepId: QuizStepType["id"], value: string): string {
  if (stepId === "framework") {
    if (value === "react") {
      return "RE";
    }

    if (value === "vue") {
      return "VU";
    }

    if (value === "node") {
      return "ND";
    }

    return "JS";
  }

  if (stepId === "lang") {
    if (value === "ts") {
      return "TS";
    }

    if (value === "mixed") {
      return "MX";
    }

    return "JS";
  }

  if (stepId === "strictness") {
    if (value === "relaxed") {
      return "01";
    }

    if (value === "moderate") {
      return "02";
    }

    return "03";
  }

  if (stepId === "experience") {
    if (value === "beginner") {
      return "JR";
    }

    if (value === "senior") {
      return "SR";
    }

    return "TM";
  }

  if (value === "prettier") {
    return "PR";
  }

  if (value === "imports") {
    return "IM";
  }

  if (value === "a11y") {
    return "AX";
  }

  if (value === "security") {
    return "SC";
  }

  if (value === "perf") {
    return "PF";
  }

  return "TS";
}

export function QuizStep({
  step,
  stepIndex,
  total,
  selected,
  onSelect,
  onBack,
  onNext,
}: QuizStepProps) {
  const selectedValues = Array.isArray(selected) ? selected : [];
  const hasSelection =
    step.type === "multi" ||
    (typeof selected === "string" && selected.length > 0);

  return (
    <section className="quiz-step">
      <div className="site-header">
        <span className="site-logo">ESLINT GENERATOR</span>
        <div className="progress-track" aria-label="Quiz progress">
          {Array.from({ length: total }, (_, index) => {
            const state =
              index < stepIndex
                ? "done"
                : index === stepIndex
                  ? "active"
                  : "upcoming";

            return (
              <span
                key={`progress-${index + 1}`}
                className={`progress-node ${state}`}
              />
            );
          })}
        </div>
      </div>

      <p className="step-label">
        STEP {String(stepIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h1 className="question">{step.question}</h1>
      <p className="question-sub">{step.sub}</p>

      {step.type === "multi" ? (
        <p className="multi-hint">Select all that apply</p>
      ) : null}

      <div
        className="option-list"
        role={step.type === "single" ? "radiogroup" : undefined}
      >
        {step.options.map((option) => {
          const isSelected =
            step.type === "multi"
              ? selectedValues.includes(option.value)
              : selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`option${isSelected ? " selected" : ""}`}
              onClick={() => onSelect(option.value)}
              role={step.type === "single" ? "radio" : "checkbox"}
              aria-checked={isSelected}
            >
              <span className="option-icon">{getOptionMark(step.id, option.value)}</span>
              <span className="option-copy">
                <strong>{option.label}</strong>
                <span>{option.desc}</span>
              </span>
              <span className="option-indicator" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="quiz-footer">
        {stepIndex > 0 ? (
          <button type="button" className="btn-ghost" onClick={onBack}>
            ← Back
          </button>
        ) : (
          <span className="quiz-footer-spacer" />
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={onNext}
          disabled={!hasSelection}
        >
          {stepIndex === total - 1 ? "Generate config →" : "Continue →"}
        </button>
      </div>
    </section>
  );
}
