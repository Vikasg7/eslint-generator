"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { QUIZ_STEPS }      from "@/lib/quiz-steps"
import { encodeAnswers }   from "@/lib/encodeAnswers"
import { QuizStep }        from "@/components/QuizStep"
import type { QuizAnswers } from "@/types/quiz"

export default function HomePage() {
  const router  = useRouter()
  const [step, setStep]       = useState<number>(-1)   // -1 = hero
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})

  const currentStep = QUIZ_STEPS[step] ?? null

  function handleSelect(value: string): void {
    if (!currentStep) return
    if (currentStep.type === "multi") {
      const prev = (answers[currentStep.id] as string[] | undefined) ?? []
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
      setAnswers((a) => ({ ...a, [currentStep.id]: next }))
    } else {
      setAnswers((a) => ({ ...a, [currentStep.id]: value }))
    }
  }

  function handleNext(): void {
    if (step < QUIZ_STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      const id = encodeAnswers(answers)
      router.push(`/result/${id}`)
    }
  }

  function handleBack(): void {
    setStep((s) => Math.max(-1, s - 1))
  }

  // ── Hero ────────────────────────────────────────────────────
  if (step === -1) {
    return (
      <main className="quiz-layout">
        <header className="site-header">
          <span className="logo-mono">ESLINT GENERATOR</span>
        </header>
        <div className="hero">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="badge-dot" />
              v1.0 — no account required
            </div>

            <h1 className="hero-heading">
              ESLint config,<br />
              <em>done right.</em>
            </h1>

            <p className="hero-sub">
              Answer 5 questions. Get a tailored ESLint config with every rule
              explained — flat or legacy format, ready to paste.
            </p>

            <div className="hero-cta-row">
              <button className="btn-primary" onClick={() => setStep(0)}>
                Start the quiz →
              </button>
              <a className="btn-ghost"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">5</span>
                <span className="stat-label">questions</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">2</span>
                <span className="stat-label">output formats</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">0</span>
                <span className="stat-label">signup needed</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-glow" />

            <div className="hero-code-card">
              <div className="code-card-header">
                <span className="dot dot-r" />
                <span className="dot dot-a" />
                <span className="dot dot-g" />
                <span className="code-card-title">eslint.config.js</span>
              </div>
              <pre className="code-card-body">
                <div><span className="ck">const</span> {"{ defineConfig }"} =</div>
                <div>  <span className="cn">require</span>(<span className="cs">&quot;eslint/config&quot;</span>)</div>
                <div><span className="ck">const</span> js = <span className="cn">require</span>(<span className="cs">&quot;@eslint/js&quot;</span>)</div>
                <div><span className="ck">const</span> tseslint =</div>
                <div>  <span className="cn">require</span>(<span className="cs">&quot;typescript-eslint&quot;</span>)</div>
                <div>&nbsp;</div>
                <div>module.<span className="cn">exports</span> = <span className="cn">defineConfig</span>([</div>
                <div>  js.configs.<span className="cn">recommended</span>,</div>
                <div>  ...tseslint.configs.<span className="cn">recommended</span>,</div>
                <div>  {"{"}</div>
                <div>    rules: {"{"}</div>
                <div>      <span className="cs">&quot;no-console&quot;</span>: <span className="cp">&quot;warn&quot;</span>,</div>
                <div>      <span className="cs">&quot;eqeqeq&quot;</span>: <span className="cp">&quot;error&quot;</span>,</div>
                <div>      <span className="cs">&quot;prefer-const&quot;</span>: <span className="cp">&quot;error&quot;</span></div>
                <div>    {"}"}</div>
                <div>  {"}"}</div>
                <div>])</div>
              </pre>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ── Quiz ─────────────────────────────────────────────────────
  return (
    <main className="quiz-layout">
      <header className="site-header">
        <span className="logo-mono">ESLINT GENERATOR</span>
      </header>
      <div className="quiz-body">
        <div className="quiz-step-col">
          <QuizStep
            step={currentStep}
            stepIndex={step}
            total={QUIZ_STEPS.length}
            selected={
              (answers[currentStep.id] as string | string[]) ?? ""
            }
            onSelect={handleSelect}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </div>
    </main>
  )
}
