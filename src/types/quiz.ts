export type Framework  = "react" | "vue" | "node" | "vanilla"
export type Language   = "ts" | "js" | "mixed"
export type Strictness = "relaxed" | "moderate" | "strict"
export type Experience = "beginner" | "mixed" | "senior"
export type Concern    =
  | "prettier"
  | "imports"
  | "a11y"
  | "security"
  | "perf"
  | "testing"
  | "promises"
  | "cleanup"
  | "maintainability"

export interface QuizAnswers {
  framework:  Framework
  lang:       Language
  strictness: Strictness
  concerns:   Concern[]
  experience: Experience
}

export type RuleSeverity = "error" | "warn" | "off"

export interface RuleExplanation {
  name:     string
  severity: RuleSeverity
  desc:     string
  why:      string
  docs?:    string
}

export interface GeneratedConfig {
  flatConfig:   string
  legacyConfig: string
  rules:        RuleExplanation[]
  plugins:      string[]
  installCmd: {
    npm:  string
    pnpm: string
    yarn: string
  }
}

export interface QuizStep {
  id:       keyof QuizAnswers
  question: string
  sub:      string
  type:     "single" | "multi"
  options:  { value: string; label: string; desc: string }[]
}
