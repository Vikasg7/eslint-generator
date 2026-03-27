# AGENT.md — Intuitive ESLint Generator

> This document is the single source of truth for a coding agent building the
> Intuitive ESLint Generator from scratch. Read every section before writing
> any code. All product, design, and architecture decisions are locked.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Product Specification](#4-product-specification)
5. [Architecture](#5-architecture)
6. [File Structure](#6-file-structure)
7. [Type Definitions](#7-type-definitions)
8. [Core Logic](#8-core-logic)
9. [Components](#9-components)
10. [Pages & Routing](#10-pages--routing)
11. [Styles](#11-styles)
12. [Build & Deploy](#12-build--deploy)
13. [Coding Rules](#13-coding-rules)

---

## 1. Project Overview

**Name:** Intuitive ESLint Generator
**Tagline:** ESLint config, done right.
**Description:** A web app that walks any developer through a 5-question quiz
and generates a fully tailored ESLint config — with every rule explained in
plain English, an npm install command, and a shareable URL.

### Goals

- Make ESLint setup approachable for beginners, fast for experienced devs,
  and consistent for teams.
- Zero sign-up, zero backend. Everything lives in the URL.
- Ship a polished, production-grade UI that feels native to the developer
  tool ecosystem.

### Non-Goals (v1)

- No user accounts or saved configs.
- No custom rule editor — the quiz drives everything.
- No server-side config validation.

---

## 2. Tech Stack

| Layer       | Choice                          | Reason                                      |
|-------------|----------------------------------|---------------------------------------------|
| Framework   | **Next.js 14 (App Router)**     | File-based routing, RSC, Vercel zero-config |
| Language    | **TypeScript (strict)**         | Type safety across quiz → config pipeline   |
| Styling     | **CSS Modules + globals.css**   | No runtime overhead, full design control    |
| Fonts       | **next/font/google**            | Syne (display) + JetBrains Mono (code/UI)  |
| Hosting     | **Vercel**                      | Zero-config deploy from GitHub              |
| Package Mgr | **pnpm**                        | Fast, disk-efficient                        |

### Initialisation Command

```bash
pnpm create next-app@latest eslint-generator \
  --typescript \
  --app \
  --no-tailwind \
  --src-dir \
  --import-alias "@/*"
cd eslint-generator
```

### Dependencies

```bash
# Runtime — none beyond Next.js (no UI library, no state manager)

# Dev
pnpm add -D @types/node @types/react @types/react-dom typescript
```

> The app has **zero runtime npm dependencies** beyond Next.js. All config
> generation is pure TypeScript. No ESLint plugin packages are installed in
> the generator itself — they are only referenced as strings in generated
> output.

---

## 3. Design System

All design decisions are locked. Do not deviate.

### 3.1 Visual Identity

| Property    | Decision                                              |
|-------------|-------------------------------------------------------|
| Color mode  | **Dark only** — no light mode, no system toggle       |
| Vibe        | Clean & minimal — lots of whitespace, hairline borders|
| References  | Linear.app (sharp, minimal) + Google Antigravity (deep blacks, ring particles, glow) |
| Typography  | Syne (headings/display) + JetBrains Mono (code & UI labels) |

### 3.2 CSS Custom Properties

Define these in `:root` inside `globals.css`. Use them everywhere — never
hardcode hex values in components.

```css
:root {
  /* Backgrounds */
  --bg:           #080808;   /* page bg — deep near-black */
  --bg1:          #0e0e0e;   /* surface layer 1 (cards, panels) */
  --bg2:          #141414;   /* surface layer 2 (header bars) */
  --bg3:          #1a1a1a;   /* surface layer 3 (hover states) */

  /* Borders — hairline, almost invisible */
  --border:       rgba(255,255,255,0.07);
  --border-hover: rgba(255,255,255,0.14);

  /* Text */
  --text:         #f0f0f0;   /* primary */
  --text2:        #888888;   /* secondary / muted */
  --text3:        #4a4a4a;   /* tertiary / disabled */

  /* Accent — used sparingly: CTAs, active states, live dot */
  --accent:       #818CF8;   /* indigo-400 */
  --accent-dim:   rgba(129,140,248,0.12);
  --accent-glow:  rgba(129,140,248,0.25);

  /* Semantic — rule severity only */
  --green:  #34d399;  /* off / ok */
  --amber:  #fbbf24;  /* warn */
  --red:    #f87171;  /* error */

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 10px;

  /* Fonts (set via next/font CSS variables) */
  --font-display: var(--font-syne),    system-ui, sans-serif;
  --font-mono:    var(--font-jetbrains), 'Fira Code', monospace;
}
```

### 3.3 Typography Scale

| Role              | Font          | Size  | Weight | Letter-spacing |
|-------------------|---------------|-------|--------|----------------|
| Hero heading      | Syne          | 52px  | 800    | -0.03em        |
| Section heading   | Syne          | 30px  | 700    | -0.02em        |
| Question text     | Syne          | 30px  | 700    | -0.02em        |
| Body / sub-labels | system-ui     | 13px  | 400    | normal         |
| UI labels (mono)  | JetBrains Mono| 11px  | 400    | 0.06em         |
| Code output       | JetBrains Mono| 11px  | 400    | normal         |
| Step counter      | JetBrains Mono| 11px  | 400    | 0.06em         |
| Option label      | Syne          | 13px  | 600    | normal         |

### 3.4 Spacing System

Use multiples of 4px. Key values:

```
4px   — micro gap (icon to text)
8px   — tight gap (between related items)
12px  — inner padding (compact elements)
16px  — standard gap
24px  — section breathing room
32px  — large section gap
40px  — page-level padding
48px  — hero vertical rhythm
```

### 3.5 Component Patterns

**Buttons:**

```css
/* Primary — accent filled, subtle glow */
.btn-primary {
  background:    var(--accent);
  color:         #fff;
  border:        none;
  border-radius: var(--radius-md);
  padding:       11px 22px;
  font-family:   var(--font-display);
  font-size:     13px;
  font-weight:   600;
  box-shadow:    0 0 20px var(--accent-glow);
  cursor:        pointer;
  transition:    all 0.2s;
}
.btn-primary:hover   { filter: brightness(1.1); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

/* Ghost — transparent, hairline border */
.btn-ghost {
  background:    transparent;
  color:         var(--text2);
  border:        1px solid var(--border);
  border-radius: var(--radius-md);
  padding:       11px 18px;
  font-family:   system-ui, sans-serif;
  font-size:     13px;
  cursor:        pointer;
  transition:    all 0.2s;
}
.btn-ghost:hover { border-color: var(--border-hover); color: var(--text); }

/* Action (toolbar buttons) */
.action-btn {
  background:    var(--bg1);
  color:         var(--text2);
  border:        1px solid var(--border);
  border-radius: var(--radius-md);
  padding:       7px 14px;
  font-family:   var(--font-mono);
  font-size:     11px;
  cursor:        pointer;
  transition:    all 0.15s;
}
.action-btn:hover         { border-color: var(--border-hover); color: var(--text); }
.action-btn.primary       { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
```

**Cards / Blocks:**

```css
.block {
  background:    var(--bg1);
  border:        1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow:      hidden;
}
.block-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         12px 16px;
  border-bottom:   1px solid var(--border);
  background:      var(--bg2);
}
.block-title {
  font-family:     var(--font-mono);
  font-size:       11px;
  color:           var(--text2);
  letter-spacing:  0.04em;
}
```

**Severity badges:**

```css
.severity {
  font-family:   var(--font-mono);
  font-size:     9px;
  padding:       2px 7px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.03em;
  border:        1px solid;
}
.sev-error { color: var(--red);   border-color: rgba(248,113,113,0.2); background: rgba(248,113,113,0.08); }
.sev-warn  { color: var(--amber); border-color: rgba(251,191,36,0.2);  background: rgba(251,191,36,0.08);  }
.sev-off   { color: var(--text3); border-color: var(--border);         background: transparent; }
```

### 3.6 Hero — Antigravity Elements

The landing page hero must include:

1. **Pulsing ring circles** — 4 concentric rings, `border: 1px solid rgba(129,140,248,0.3)`,
   positioned top-right, animating with `@keyframes pulse-ring` (scale + opacity pulse, 4s,
   staggered `animation-delay` by 0.6s each).
2. **Radial glow** — `radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)`,
   centered behind the rings.
3. **Accent text** — hero heading contains `<em>` styled with a linear-gradient clip:
   `background: linear-gradient(135deg, #818CF8, #a5b4fc); -webkit-background-clip: text`.
4. **Badge** — `v1.0 — no account required` in monospace, with a breathing accent dot.
5. **Floating code card** — absolute-positioned, top-right of hero, showing a partial
   `eslint.config.js` with syntax highlighting via `<span>` color classes.
6. **Stats row** — 3 stats separated by 1px vertical dividers: `5 questions`,
   `2 output formats`, `0 signup needed`. Numbers in monospace.

---

## 4. Product Specification

### 4.1 Quiz Flow

5 sequential steps. State lives in React `useState`. On completion, answers are
base64-encoded and pushed to `/result/[id]`.

| Step | ID          | Type   | Question                          |
|------|-------------|--------|-----------------------------------|
| 1    | `framework` | single | What framework are you using?     |
| 2    | `lang`      | single | JavaScript or TypeScript?         |
| 3    | `strictness`| single | How strict should the rules be?   |
| 4    | `concerns`  | multi  | Any specific concerns to enforce? |
| 5    | `experience`| single | Who is writing this code?         |

**Step options:**

```
framework: react | vue | node | vanilla
lang:       ts | js | mixed
strictness: relaxed | moderate | strict
concerns:   prettier | imports | a11y | security | perf | testing  (multi-select)
experience: beginner | mixed | senior
```

**UX rules:**
- Single-select: selecting an option auto-advances the `Continue` button to enabled.
- Multi-select: `Continue` is always enabled (skip = use defaults).
- Back navigation: allowed from step 2 onwards.
- Progress bar: row of pill nodes — done (accent), active (accent 50% opacity, wider),
  upcoming (bg3).
- Step counter: `STEP 03 / 05` in monospace, uppercase.

### 4.2 Live Config Preview

A narrow code panel shown alongside the quiz. Updates on every answer change
using `useMemo(() => generateConfig(answers), [answers])`. Shows the first
18 lines of `eslint.config.js` with a `···` ellipsis if truncated.

Has a pulsing accent dot in its header labeled `LIVE PREVIEW`.

### 4.3 Result Page

URL: `/result/[id]` where `[id]` is the base64url-encoded quiz answers.

Layout: 2-column grid.

**Left column:**
- Config output block (tabbed: `eslint.config.js` / `.eslintrc.json`)
- Copy button + Download button
- Share URL bar

**Right column:**
- Install command block (npm / pnpm / yarn rows, each with copy button)
- Rules explained block (accordion, one card per rule)

**Answer summary tags** shown above the grid: framework, lang, strictness,
experience, each active concern, plus a `{n} rules` count tag in accent color.

### 4.4 Config Output — Dual Format

**`eslint.config.js` (flat config — ESLint v9+):**
- `import` statements for each required plugin
- `export default [...]` array
- Spread `...plugin.configs.recommended` for each active plugin
- Single object with `files`, optional `languageOptions: { parser }`, and `rules`

**`.eslintrc.json` (legacy format):**
- `env`, `extends` array, optional `parser`, `rules` object
- Serialised with `JSON.stringify(obj, null, 2)`

### 4.5 Rule Explanations

Every rule in the generated config has:
- `name` — the ESLint rule string (e.g. `"no-unused-vars"`)
- `severity` — `"error"` | `"warn"` | `"off"`
- `desc` — one sentence, plain English, what the rule catches
- `why` — one sentence, why it matters
- `docs` — link to official ESLint / plugin docs

Displayed as an accordion: click rule name → expands to show desc, why, docs link.

### 4.6 Install Command Generator

Three rows: `npm`, `pnpm`, `yarn`. Each row shows the full install command
and a `copy` mini-button. Command includes every plugin package needed for
the generated config.

### 4.7 Share via URL

No database. Answers are serialised to base64url and embedded in the route:

```
/result/dHMtcmVhY3QtbW9kZXJhdGU...
```

`encodeAnswers(answers)` → base64url string
`decodeAnswers(id)`      → `Partial<QuizAnswers>`

On the result page, answers are decoded from `params.id`, then passed to
`generateConfig()` to regenerate the config server-side (RSC, no hydration
needed for the config itself).

---

## 5. Architecture

### 5.1 Data Flow

```
User answers quiz
       │
       ▼
useState<Partial<QuizAnswers>>  (app/page.tsx)
       │
       ├──► generateConfig(answers)  ──► LivePreview  (updates every step)
       │
       └──► on final step: encodeAnswers(answers)
                                │
                                ▼
                     router.push(`/result/${id}`)
                                │
                                ▼
                     decodeAnswers(params.id)
                                │
                                ▼
                     generateConfig(answers)  ──► Result page (RSC)
```

### 5.2 Key Design Decisions

| Decision                  | Choice                          | Rationale                                               |
|---------------------------|----------------------------------|---------------------------------------------------------|
| State management          | React `useState` only           | No Zustand/Redux needed — quiz state is local & linear  |
| URL sharing               | base64url in route param        | Zero backend, works on Vercel Edge, infinitely shareable|
| Config generation         | Pure TS function                | Easy to test, runs in both browser and RSC              |
| No database               | Intentional                     | Simplicity; all state in URL                            |
| CSS approach              | globals.css + CSS Modules       | No Tailwind (avoids purge complexity), full token control|
| No UI library             | Intentional                     | Design is too custom; libraries would fight the tokens  |
| Result page as RSC        | Server Component                | Config regenerated on server, no client JS for the data |

### 5.3 `generateConfig` — Pure Function Contract

```
Input:  Partial<QuizAnswers>
Output: GeneratedConfig {
  flatConfig:   string   // full eslint.config.js file content
  legacyConfig: string   // full .eslintrc.json file content
  rules:        RuleExplanation[]
  plugins:      string[] // npm package names, no versions
  installCmd: {
    npm:  string
    pnpm: string
    yarn: string
  }
}
```

Must handle all partial inputs gracefully (defaults for missing fields).
Must be deterministic — same answers → same output every time.

---

## 6. File Structure

```
eslint-generator/
├── app/
│   ├── layout.tsx              # Root layout, font loading, metadata
│   ├── page.tsx                # Quiz home — "use client", all quiz state
│   ├── globals.css             # Design tokens, base styles, all CSS classes
│   └── result/
│       └── [id]/
│           └── page.tsx        # Result page — Server Component
│
├── components/
│   ├── QuizStep.tsx            # Step UI: question, options, progress, nav
│   ├── LivePreview.tsx         # Floating code panel, updates per answer
│   ├── ConfigOutput.tsx        # Tabbed code block + copy + download
│   ├── RuleExplainer.tsx       # Accordion list of rule cards
│   ├── InstallCommand.tsx      # npm/pnpm/yarn rows with copy buttons
│   └── ShareButton.tsx         # URL bar + copy link button
│
├── lib/
│   ├── quiz-steps.ts           # QUIZ_STEPS array (the 5 step definitions)
│   ├── generateConfig.ts       # Core pure function: answers → GeneratedConfig
│   └── encodeAnswers.ts        # encodeAnswers / decodeAnswers / buildShareUrl
│
├── types/
│   └── quiz.ts                 # All TypeScript types and interfaces
│
├── public/
│   └── favicon.svg             # Simple accent-colored icon
│
├── next.config.ts
├── tsconfig.json
├── package.json
└── AGENT.md                    # This file
```

---

## 7. Type Definitions

File: `types/quiz.ts`

```typescript
export type Framework  = "react" | "vue" | "node" | "vanilla"
export type Language   = "ts" | "js" | "mixed"
export type Strictness = "relaxed" | "moderate" | "strict"
export type Experience = "beginner" | "mixed" | "senior"
export type Concern    = "prettier" | "imports" | "a11y" | "security" | "perf" | "testing"

export interface QuizAnswers {
  framework:  Framework
  lang:       Language
  strictness: Strictness
  concerns:   Concern[]
  experience: Experience
}

export type RuleSeverity = "error" | "warn" | "off"

export interface RuleExplanation {
  name:     string        // ESLint rule identifier, e.g. "no-unused-vars"
  severity: RuleSeverity
  desc:     string        // plain-English: what does this rule catch?
  why:      string        // plain-English: why does this rule matter?
  docs?:    string        // URL to official docs
}

export interface GeneratedConfig {
  flatConfig:    string
  legacyConfig:  string
  rules:         RuleExplanation[]
  plugins:       string[]
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
```

---

## 8. Core Logic

### 8.1 `lib/quiz-steps.ts`

Export a `QUIZ_STEPS: QuizStep[]` array with the 5 steps defined in
§4.1. Each step maps directly to a `QuizStep` interface entry.

### 8.2 `lib/generateConfig.ts`

This is the most important file. Write it as a pure function with no
side effects. Follow this logic:

```
1. Destructure answers with safe defaults:
   framework = "vanilla", lang = "js", strictness = "moderate",
   concerns = [], experience = "mixed"

2. Derive boolean flags:
   isTS    = lang === "ts" || lang === "mixed"
   isReact = framework === "react"
   isVue   = framework === "vue"
   isNode  = framework === "node"

3. Define severity helper:
   sev(strictness, tight, loose) →
     strict   → tight
     relaxed  → loose
     moderate → tight   (moderate defaults to strict-ish)

4. Build plugins[] array — package names only:
   Always:       "eslint"
   isTS:         "@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"
   isReact:      "eslint-plugin-react", "eslint-plugin-react-hooks"
   isVue:        "eslint-plugin-vue", "vue-eslint-parser"
   prettier:     "eslint-config-prettier", "prettier"
   imports:      "eslint-plugin-import"
   a11y+react:   "eslint-plugin-jsx-a11y"
   security:     "eslint-plugin-security"
   testing:      "eslint-plugin-jest"

5. Build rules[] array — RuleExplanation objects:
   Always include:
     no-unused-vars (sev: errSev)
     no-console     (sev: "warn")
   If not relaxed:
     eqeqeq, no-var, prefer-const
   If strict:
     no-implicit-coercion
   If isTS:
     @typescript-eslint/no-explicit-any
     @typescript-eslint/explicit-function-return-type
     (strict only) @typescript-eslint/no-non-null-assertion
   If isReact:
     react-hooks/rules-of-hooks ("error" always)
     react-hooks/exhaustive-deps ("warn" always)
   If isReact + a11y:
     jsx-a11y/alt-text
   If security:
     no-eval, no-implied-eval  (both "error")
   If imports:
     import/order ("warn"), import/no-duplicates (errSev)
   If perf + react:
     react/jsx-no-bind ("warn")

6. Build flatConfig string (eslint.config.js):
   - import lines for each active plugin
   - export default [ ...extends, { files, languageOptions?, rules } ]

7. Build legacyConfig string (.eslintrc.json):
   - JSON.stringify({ env, extends, parser?, rules }, null, 2)

8. Build installCmd:
   npm:  "npm install -D " + plugins.join(" ")
   pnpm: "pnpm add -D "    + plugins.join(" ")
   yarn: "yarn add -D "    + plugins.join(" ")

9. Return { flatConfig, legacyConfig, rules, plugins, installCmd }
```

### 8.3 `lib/encodeAnswers.ts`

```typescript
// Encode — works in browser (btoa) and Node/Edge (Buffer)
encodeAnswers(answers: Partial<QuizAnswers>): string
  JSON.stringify(answers) → base64url (replace +→-, /→_, strip =)

// Decode — inverse, with try/catch returning {} on failure
decodeAnswers(id: string): Partial<QuizAnswers>

// Build full shareable URL
buildShareUrl(answers, origin?): string
  → `${origin}/result/${encodeAnswers(answers)}`
  → origin defaults to window.location.origin in browser
```

---

## 9. Components

### 9.1 `QuizStep`

**Props:**
```typescript
{
  step:      QuizStep
  stepIndex: number          // 0-based
  total:     number          // 5
  selected:  string | string[]
  onSelect:  (value: string) => void
  onBack:    () => void
  onNext:    () => void
}
```

**Renders:**
- Progress bar (pill nodes, see §3.5 patterns)
- Step counter label `STEP 03 / 05`
- Question heading + sub-label
- Options list (single → radio-style, multi → checkbox-style, same visual)
- "Select all that apply" hint for multi steps
- Back + Continue/Generate buttons

**Option item structure:**
```
[ icon-box ]  [ label + desc ]  [ radio indicator ]
```
Selected state: `border-color: var(--accent)`, `background: var(--accent-dim)`,
label color → `#a5b4fc`.

### 9.2 `LivePreview`

**Props:** `{ answers: Partial<QuizAnswers> }`

Calls `generateConfig(answers)` via `useMemo`. Shows first 18 lines of
`flatConfig` in a `<pre>` block. Has a pulsing `--accent` dot + `LIVE PREVIEW`
monospace label in its header. Positioned as `position: sticky; top: 32px`
on the quiz page.

### 9.3 `ConfigOutput`

**Props:** `{ config: GeneratedConfig }`

Two tabs: `eslint.config.js` (flat) and `.eslintrc.json` (legacy).
Tab state via `useState`. Code shown in `<pre>` with monospace font.
Two action buttons: `↓ download` (triggers Blob download) and
`copy config` (clipboard, shows `"copied!"` for 1.5s).

### 9.4 `RuleExplainer`

**Props:** `{ rules: RuleExplanation[] }`

Accordion list. Each item:
- Header row: rule name (monospace) + severity badge + chevron `▶`
- Expanded body: desc paragraph, "Why this rule?" paragraph, optional docs link
- One item open at a time (or allow multiple — either is fine)
- Chevron rotates 90° when open via CSS `transform: rotate(90deg)`

### 9.5 `InstallCommand`

**Props:** `{ installCmd: GeneratedConfig["installCmd"] }`

Three rows, one per package manager: `npm`, `pnpm`, `yarn`.
Each row: pm label (monospace, muted) + command text (truncated with ellipsis
if too long) + `copy` mini-button.

### 9.6 `ShareButton`

**Props:** `{ answers: Partial<QuizAnswers> }`

Calls `buildShareUrl(answers)` to compute URL. Shows URL in a monospace
truncated span. `copy link` button copies to clipboard with `"copied!"` feedback.

---

## 10. Pages & Routing

### 10.1 `app/layout.tsx`

```typescript
// Load fonts via next/font/google
const syne = Syne({
  subsets: ["latin"],
  weight:  ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight:  ["400", "500"],
  variable: "--font-jetbrains",
})

// Apply both className variables on <html>
// Metadata: title, description, openGraph
```

### 10.2 `app/page.tsx` — Quiz Home

`"use client"` — manages all quiz state.

```typescript
const [step, setStep]       = useState(0)
const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})

// onSelect: handles both single (overwrite) and multi (toggle array)
// onNext:   step < 4 → increment, step === 4 → encode + router.push
// onBack:   decrement step, min 0

// Layout: two-column flex
// Left:  <QuizStep ... />
// Right: <LivePreview answers={answers} />  (sticky)
```

Landing hero (shown when `step === -1` or as a separate landing section
above the quiz — agent decides, but the hero content from §3.6 must appear).

### 10.3 `app/result/[id]/page.tsx` — Result Page

Server Component (no `"use client"`).

```typescript
export default function ResultPage({ params }: { params: { id: string } }) {
  const answers = decodeAnswers(params.id)
  const config  = generateConfig(answers)
  // Render summary tags, 2-col grid with all 4 output components
}
```

2-column grid layout:
- Left: `<ConfigOutput>` + `<ShareButton>`
- Right: `<InstallCommand>` + `<RuleExplainer>`

---

## 11. Styles

All styles in `app/globals.css`. No CSS Modules needed unless a component
has a very long style block — in that case, co-locate a `.module.css` file.

### 11.1 Page-level Layouts

```css
/* Quiz page */
.quiz-layout {
  max-width:      1100px;
  margin:         0 auto;
  padding:        32px 40px;
  min-height:     100dvh;
  display:        flex;
  flex-direction: column;
}

.quiz-body {
  display:   flex;
  gap:       48px;
  flex:      1;
  margin-top: 40px;
}

.quiz-step-col  { flex: 1; max-width: 400px; }
.live-preview   { width: 240px; flex-shrink: 0; position: sticky; top: 32px; }

/* Result page */
.result-layout {
  max-width: 1100px;
  margin:    0 auto;
  padding:   28px 40px;
}

.result-grid {
  display:               grid;
  grid-template-columns: 1fr 1fr;
  gap:                   16px;
  margin-top:            24px;
}
```

### 11.2 Responsive Breakpoints

```css
@media (max-width: 768px) {
  .quiz-body        { flex-direction: column; }
  .live-preview     { display: none; }         /* hidden on mobile */
  .result-grid      { grid-template-columns: 1fr; }
  .quiz-layout,
  .result-layout    { padding: 20px; }
  .hero-code-card   { display: none; }         /* hidden on mobile */
  .hero-heading     { font-size: 36px; }
}
```

### 11.3 Animations

```css
/* Hero rings */
@keyframes pulse-ring {
  0%, 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1); }
  50%       { opacity: 0.6;  transform: translate(-50%, -50%) scale(1.02); }
}

/* Badge dot */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
```

### 11.4 Code Syntax Highlighting

No external library. Use `<span>` elements with these classes inside `<pre>`:

```css
.ck { color: #818CF8; }   /* keywords: import, export, from, default */
.cs { color: #34d399; }   /* strings */
.cn { color: #fbbf24; }   /* names / identifiers */
.cp { color: #f87171; }   /* property values / severity strings */
```

---

## 12. Build & Deploy

### 12.1 `next.config.ts`

```typescript
import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
}

export default config
```

### 12.2 `tsconfig.json` (key settings)

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### 12.3 Vercel Deploy

1. Push to GitHub.
2. Import repo in Vercel dashboard.
3. Framework preset: **Next.js** (auto-detected).
4. No environment variables needed.
5. Deploy. Done.

Every push to `main` auto-deploys. Preview URLs generated for every PR.

### 12.4 Build Verification Checklist

Before marking the build complete, verify:

- [ ] `pnpm build` completes with zero errors and zero type errors
- [ ] Quiz completes all 5 steps without console errors
- [ ] Navigating to `/result/[id]` with a valid encoded ID renders the result
- [ ] Navigating to `/result/invalid` renders gracefully (empty config, not crash)
- [ ] Copy buttons copy the correct text to clipboard
- [ ] Download button downloads the correct file with the correct filename
- [ ] Share URL copied from `<ShareButton>` decodes back to the same answers
- [ ] Live preview updates on every step change
- [ ] All 3 install command rows show the correct packages
- [ ] Rule accordion expands and collapses correctly
- [ ] Page is readable and functional at 375px viewport width
- [ ] `pnpm lint` passes (ironic for an ESLint tool)

---

## 13. Coding Rules

The agent must follow these rules when writing all code.

### 13.1 TypeScript

- `strict: true` — no `any`, no non-null assertions (`!`) without comment
- All function parameters and return types explicitly typed
- Use `type` for unions/primitives, `interface` for object shapes
- No `as` casts unless decoding external data (e.g. `JSON.parse`)

### 13.2 React / Next.js

- Mark components `"use client"` only when they use hooks or browser APIs
- Prefer Server Components for the result page — config generation needs
  no interactivity
- `useRouter` / `useState` / `useMemo` — no other hooks needed
- No `useEffect` for data fetching — use RSC or `useMemo`
- Props interfaces defined in the same file as the component

### 13.3 CSS

- Every color value must reference a CSS custom property — never hardcode hex
- No inline `style` attributes except for dynamic values (e.g. animation delays)
- No `!important`
- Class names: lowercase hyphen-kebab — e.g. `.quiz-step`, `.live-preview`
- Avoid deep nesting — max 2 levels of selector specificity

### 13.4 Files

- One component per file
- File name matches exported component name (PascalCase for components,
  camelCase for lib files)
- No barrel `index.ts` files — import directly from the file path
- No default exports except for Next.js page and layout files

### 13.5 Code Quality

- No `console.log` left in production code
- `generateConfig` must be a pure function — no mutation of inputs
- `encodeAnswers` / `decodeAnswers` must be inverses — round-trip test mentally
- Handle all edge cases in `decodeAnswers` with try/catch returning `{}`
- Every component must render without crashing when passed empty/partial props

### 13.6 Commit Convention

```
feat:  new feature
fix:   bug fix
style: CSS / visual changes
refactor: code restructure, no behaviour change
chore: config, deps, tooling
```

---

*End of AGENT.md. All decisions are locked. Build exactly what is specified here.*