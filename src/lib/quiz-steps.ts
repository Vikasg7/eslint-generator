import type { QuizStep } from "@/types/quiz";

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "framework",
    question: "What framework are you using?",
    sub: "Pick the environment your config should feel native to.",
    type: "single",
    options: [
      {
        value: "react",
        label: "React",
        desc: "Component-first apps with JSX, hooks, and client-side patterns.",
      },
      {
        value: "vue",
        label: "Vue",
        desc: "Single-file components and a rule set that respects Vue conventions.",
      },
      {
        value: "node",
        label: "Node.js",
        desc: "Server-side code, scripts, services, and tooling-heavy projects.",
      },
      {
        value: "vanilla",
        label: "Vanilla",
        desc: "Framework-free JavaScript with a clean, modern baseline.",
      },
    ],
  },
  {
    id: "lang",
    question: "JavaScript or TypeScript?",
    sub: "We’ll adjust parsers, plugin packages, and recommended presets.",
    type: "single",
    options: [
      {
        value: "ts",
        label: "TypeScript",
        desc: "Typed source files with TypeScript-aware linting rules.",
      },
      {
        value: "js",
        label: "JavaScript",
        desc: "A lean setup focused on modern JavaScript projects.",
      },
      {
        value: "mixed",
        label: "Mixed",
        desc: "Teams shipping a blend of JavaScript and TypeScript files.",
      },
    ],
  },
  {
    id: "strictness",
    question: "How strict should the rules be?",
    sub: "Choose how opinionated the generated config should feel day to day.",
    type: "single",
    options: [
      {
        value: "relaxed",
        label: "Relaxed",
        desc: "Helpful nudges without too much friction while moving fast.",
      },
      {
        value: "moderate",
        label: "Moderate",
        desc: "A strong default that catches real issues without being noisy.",
      },
      {
        value: "strict",
        label: "Strict",
        desc: "Sharper enforcement for teams that want tighter guardrails.",
      },
    ],
  },
  {
    id: "concerns",
    question: "Any specific concerns to enforce?",
    sub: "Select the extra areas you care about. Skip this step to stay minimal.",
    type: "multi",
    options: [
      {
        value: "prettier",
        label: "Prettier",
        desc: "Avoid stylistic clashes when formatting is handled elsewhere.",
      },
      {
        value: "imports",
        label: "Imports",
        desc: "Keep imports ordered, tidy, and free of accidental duplicates.",
      },
      {
        value: "a11y",
        label: "Accessibility",
        desc: "Catch common JSX accessibility misses in React interfaces.",
      },
      {
        value: "security",
        label: "Security",
        desc: "Flag risky APIs and patterns that deserve a second look.",
      },
      {
        value: "perf",
        label: "Performance",
        desc: "Discourage patterns that can create avoidable React churn.",
      },
      {
        value: "testing",
        label: "Testing",
        desc: "Include test-focused recommendations for Jest-driven projects.",
      },
    ],
  },
  {
    id: "experience",
    question: "Who is writing this code?",
    sub: "This helps frame the output for the kind of team reading the rules.",
    type: "single",
    options: [
      {
        value: "beginner",
        label: "Beginner",
        desc: "Newer developers who benefit from clear guardrails and guidance.",
      },
      {
        value: "mixed",
        label: "Mixed team",
        desc: "A balanced setup for teams with a range of experience levels.",
      },
      {
        value: "senior",
        label: "Senior",
        desc: "Experienced contributors who prefer firmer defaults and fewer surprises.",
      },
    ],
  },
];
