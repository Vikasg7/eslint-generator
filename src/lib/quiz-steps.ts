import type { QuizStep } from "@/types/quiz"

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "framework",
    question: "What framework are you using?",
    sub: "Determines which plugins and parser rules we include.",
    type: "single",
    options: [
      { value: "react",   label: "React",             desc: "Hooks rules, JSX, component patterns" },
      { value: "vue",     label: "Vue",               desc: "Vue 3, Composition API" },
      { value: "node",    label: "Node.js",           desc: "Server-side, CommonJS or ESM" },
      { value: "vanilla", label: "Vanilla JS / Other",desc: "No framework-specific rules" },
    ],
  },
  {
    id: "lang",
    question: "JavaScript or TypeScript?",
    sub: "TypeScript unlocks type-aware linting rules.",
    type: "single",
    options: [
      { value: "ts",    label: "TypeScript",              desc: "@typescript-eslint parser + rules" },
      { value: "js",    label: "JavaScript only",         desc: "Standard ESLint parser" },
      { value: "mixed", label: "Both (.ts and .js files)", desc: "Dual config per extension" },
    ],
  },
  {
    id: "strictness",
    question: "How strict should the rules be?",
    sub: "Sets the default severity level across the config.",
    type: "single",
    options: [
      { value: "relaxed",  label: "Relaxed",  desc: "Warnings only — good for prototypes" },
      { value: "moderate", label: "Moderate", desc: "Balanced — recommended for most teams" },
      { value: "strict",   label: "Strict",   desc: "Most rules as errors — zero tolerance" },
    ],
  },
  {
    id: "concerns",
    question: "Any specific concerns to enforce?",
    sub: "Select all that apply — targeted rules added for each.",
    type: "multi",
    options: [
      { value: "prettier",  label: "Code formatting", desc: "Prettier integration" },
      { value: "imports",   label: "Import order",    desc: "eslint-plugin-import" },
      { value: "a11y",      label: "Accessibility",   desc: "jsx-a11y (React only)" },
      { value: "security",  label: "Security",        desc: "eslint-plugin-security" },
      { value: "perf",      label: "Performance",     desc: "Avoid common perf traps" },
      { value: "testing",   label: "Testing",         desc: "jest / vitest rules" },
    ],
  },
  {
    id: "experience",
    question: "Who is writing this code?",
    sub: "Adjusts how helpful vs. restrictive the config feels.",
    type: "single",
    options: [
      { value: "beginner", label: "Beginners / learners",   desc: "More explanatory, fewer gotchas" },
      { value: "mixed",    label: "Mixed team",             desc: "Balanced for all levels" },
      { value: "senior",   label: "Experienced developers", desc: "Full strict, no hand-holding" },
    ],
  },
]