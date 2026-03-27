"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { LivePreview } from "@/components/LivePreview";
import { QuizStep } from "@/components/QuizStep";
import { encodeAnswers } from "@/lib/encodeAnswers";
import { QUIZ_STEPS } from "@/lib/quiz-steps";
import type {
  Concern,
  Experience,
  Framework,
  Language,
  QuizAnswers,
  Strictness,
} from "@/types/quiz";

function isFramework(value: string): value is Framework {
  return (
    value === "react" ||
    value === "vue" ||
    value === "node" ||
    value === "vanilla"
  );
}

function isLanguage(value: string): value is Language {
  return value === "ts" || value === "js" || value === "mixed";
}

function isStrictness(value: string): value is Strictness {
  return value === "relaxed" || value === "moderate" || value === "strict";
}

function isConcern(value: string): value is Concern {
  return (
    value === "prettier" ||
    value === "imports" ||
    value === "a11y" ||
    value === "security" ||
    value === "perf" ||
    value === "testing"
  );
}

function isExperience(value: string): value is Experience {
  return value === "beginner" || value === "mixed" || value === "senior";
}

function getSelectedValue(
  stepId: keyof QuizAnswers,
  answers: Partial<QuizAnswers>,
): string | string[] {
  if (stepId === "concerns") {
    return answers.concerns ?? [];
  }

  const value = answers[stepId];

  return typeof value === "string" ? value : "";
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const activeStep = QUIZ_STEPS[step];

  const handleSelect = (value: string): void => {
    if (!activeStep) {
      return;
    }

    setAnswers((current) => {
      switch (activeStep.id) {
        case "framework":
          return isFramework(value) ? { ...current, framework: value } : current;
        case "lang":
          return isLanguage(value) ? { ...current, lang: value } : current;
        case "strictness":
          return isStrictness(value) ? { ...current, strictness: value } : current;
        case "experience":
          return isExperience(value) ? { ...current, experience: value } : current;
        case "concerns": {
          if (!isConcern(value)) {
            return current;
          }

          const currentConcerns = current.concerns ?? [];
          const nextConcerns = currentConcerns.includes(value)
            ? currentConcerns.filter((concern) => concern !== value)
            : [...currentConcerns, value];

          return {
            ...current,
            concerns: nextConcerns,
          };
        }
      }
    });
  };

  const handleNext = (): void => {
    if (step < QUIZ_STEPS.length - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    const id = encodeAnswers(answers);

    startTransition(() => {
      router.push(`/result/${id}`);
    });
  };

  const handleBack = (): void => {
    setStep((currentStep) => Math.max(0, currentStep - 1));
  };

  if (step === -1) {
    return (
      <main className="quiz-layout">
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="rings" aria-hidden="true">
            {[0, 1, 2, 3].map((ring) => (
              <span
                key={`ring-${ring + 1}`}
                className={`ring ring-${ring + 1}`}
                style={{ animationDelay: `${ring * 0.6}s` }}
              />
            ))}
          </div>

          <div className="hero-copy">
            <div className="hero-badge">
              <span className="badge-dot" aria-hidden="true" />
              <span>v1.0 — no account required</span>
            </div>

            <h1 className="hero-heading">
              ESLint config, <em>done right.</em>
            </h1>

            <p className="hero-sub">
              Answer five quick questions and get a tailored ESLint setup with
              plain-English rule explanations, install commands, and a URL you can share
              with your team.
            </p>

            <div className="hero-cta-row">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(0)}
              >
                Start the quiz →
              </button>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost hero-link-btn"
              >
                View on GitHub
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">5</span>
                <span className="hero-stat-label">QUESTIONS</span>
              </div>
              <span className="hero-divider" aria-hidden="true" />
              <div className="hero-stat">
                <span className="hero-stat-number">2</span>
                <span className="hero-stat-label">OUTPUT FORMATS</span>
              </div>
              <span className="hero-divider" aria-hidden="true" />
              <div className="hero-stat">
                <span className="hero-stat-number">0</span>
                <span className="hero-stat-label">SIGNUP NEEDED</span>
              </div>
            </div>
          </div>

          <div className="hero-code-card">
            <div className="hero-code-top">
              <div className="window-dots" aria-hidden="true">
                <span className="window-dot window-dot-red" />
                <span className="window-dot window-dot-amber" />
                <span className="window-dot window-dot-green" />
              </div>
              <span className="hero-code-title">eslint.config.js</span>
            </div>
            <pre className="hero-code-pre" aria-label="Example eslint config">
              <span className="ck">import</span> <span className="cn">tseslint</span>{" "}
              <span className="ck">from</span> <span className="cs">"@typescript-eslint/eslint-plugin"</span>
              {"\n"}
              <span className="ck">import</span> <span className="cn">reactPlugin</span>{" "}
              <span className="ck">from</span> <span className="cs">"eslint-plugin-react"</span>
              {"\n\n"}
              <span className="ck">export</span> <span className="ck">default</span> [
              {"\n"}  <span className="cn">tseslint</span>.<span className="cn">configs</span>.
              <span className="cn">recommended</span>,
              {"\n"}  <span className="cn">reactPlugin</span>.<span className="cn">configs</span>.
              <span className="cn">flat</span>.<span className="cn">recommended</span>,
              {"\n"}  {"{"}
              {"\n"}    <span className="cn">rules</span>: {"{"}
              {"\n"}      <span className="cs">"no-unused-vars"</span>: <span className="cp">"error"</span>,
              {"\n"}      <span className="cs">"react-hooks/rules-of-hooks"</span>: <span className="cp">"error"</span>,
              {"\n"}    {"}"}
              {"\n"}  {"}"}
              {"\n"}];
            </pre>
          </div>
        </section>
      </main>
    );
  }

  if (!activeStep) {
    return null;
  }

  return (
    <main className="quiz-layout">
      <div className="quiz-body">
        <div className="quiz-step-col">
          <QuizStep
            step={activeStep}
            stepIndex={step}
            total={QUIZ_STEPS.length}
            selected={getSelectedValue(activeStep.id, answers)}
            onSelect={handleSelect}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
        <LivePreview answers={answers} />
      </div>
    </main>
  );
}
