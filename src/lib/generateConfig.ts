import type {
  QuizAnswers,
  GeneratedConfig,
  RuleExplanation,
  RuleSeverity,
} from "@/types/quiz"

function sev(
  strictness: string,
  tight: RuleSeverity,
  loose: RuleSeverity
): RuleSeverity {
  if (strictness === "strict")  return tight
  if (strictness === "relaxed") return loose
  return tight
}

export function generateConfig(answers: Partial<QuizAnswers>): GeneratedConfig {
  const {
    framework  = "vanilla",
    lang       = "js",
    strictness = "moderate",
    concerns   = [],
    experience = "mixed",
  } = answers

  const isTS    = lang === "ts" || lang === "mixed"
  const isReact = framework === "react"
  const isVue   = framework === "vue"
  const isNode  = framework === "node"
  const errSev  = sev(strictness, "error", "warn")

  // ── Plugins ──────────────────────────────────────────────────
  const plugins: string[] = ["eslint"]

  if (isTS) {
    plugins.push("@typescript-eslint/eslint-plugin", "@typescript-eslint/parser")
  }
  if (isReact) {
    plugins.push("eslint-plugin-react", "eslint-plugin-react-hooks")
  }
  if (isVue) {
    plugins.push("eslint-plugin-vue", "vue-eslint-parser")
  }
  if (concerns.includes("prettier"))               plugins.push("eslint-config-prettier", "prettier")
  if (concerns.includes("imports"))                plugins.push("eslint-plugin-import")
  if (concerns.includes("a11y") && isReact)        plugins.push("eslint-plugin-jsx-a11y")
  if (concerns.includes("security"))               plugins.push("eslint-plugin-security")
  if (concerns.includes("testing"))                plugins.push("eslint-plugin-jest")

  // ── Rules ─────────────────────────────────────────────────────
  const rules: RuleExplanation[] = []

  rules.push({
    name:     "no-unused-vars",
    severity: errSev,
    desc:     "Flags variables that are declared but never used in the code.",
    why:      "Unused variables clutter your codebase and often signal logic errors or refactoring leftovers.",
    docs:     "https://eslint.org/docs/rules/no-unused-vars",
  })

  rules.push({
    name:     "no-console",
    severity: "warn",
    desc:     "Warns when console.log (or similar) calls are left in the code.",
    why:      "Debug logs should be removed before shipping — this keeps production output clean.",
    docs:     "https://eslint.org/docs/rules/no-console",
  })

  if (strictness !== "relaxed") {
    rules.push({
      name:     "eqeqeq",
      severity: errSev,
      desc:     "Requires === instead of == for all equality checks.",
      why:      "JavaScript's == has surprising type coercion rules. === prevents unintended comparisons.",
      docs:     "https://eslint.org/docs/rules/eqeqeq",
    })
    rules.push({
      name:     "no-var",
      severity: errSev,
      desc:     "Disallows var declarations in favour of let and const.",
      why:      "var has function scope and hoisting quirks. let/const are block-scoped and more predictable.",
      docs:     "https://eslint.org/docs/rules/no-var",
    })
    rules.push({
      name:     "prefer-const",
      severity: strictness === "strict" ? "error" : "warn",
      desc:     "Requires const for variables that are never reassigned after declaration.",
      why:      "Signals immutability intent clearly and prevents accidental reassignment.",
      docs:     "https://eslint.org/docs/rules/prefer-const",
    })
  }

  if (strictness === "strict") {
    rules.push({
      name:     "no-implicit-coercion",
      severity: "error",
      desc:     "Disallows shorthand type conversions like !!value or +str.",
      why:      "Explicit conversions like Boolean(value) are far more readable and intentional.",
      docs:     "https://eslint.org/docs/rules/no-implicit-coercion",
    })
  }

  if (isTS) {
    rules.push({
      name:     "@typescript-eslint/no-explicit-any",
      severity: errSev,
      desc:     "Disallows use of the any type.",
      why:      "any defeats the purpose of TypeScript. Prefer unknown or define a proper type instead.",
      docs:     "https://typescript-eslint.io/rules/no-explicit-any",
    })
    rules.push({
      name:     "@typescript-eslint/explicit-function-return-type",
      severity: strictness === "strict" ? "error" : "warn",
      desc:     "Requires explicit return types on public functions.",
      why:      "Makes function contracts clear at a glance and catches type mismatches at definition time.",
      docs:     "https://typescript-eslint.io/rules/explicit-function-return-type",
    })
    if (strictness === "strict") {
      rules.push({
        name:     "@typescript-eslint/no-non-null-assertion",
        severity: "error",
        desc:     "Disallows the non-null assertion operator (!).",
        why:      "Using ! silences the type checker without actually fixing the nullability issue.",
        docs:     "https://typescript-eslint.io/rules/no-non-null-assertion",
      })
    }
  }

  if (isReact) {
    rules.push({
      name:     "react-hooks/rules-of-hooks",
      severity: "error",
      desc:     "Enforces the Rules of Hooks — always call hooks at the top level.",
      why:      "Violating hook rules causes unpredictable state behaviour that is very hard to debug.",
      docs:     "https://reactjs.org/docs/hooks-rules.html",
    })
    rules.push({
      name:     "react-hooks/exhaustive-deps",
      severity: "warn",
      desc:     "Checks that useEffect and similar hooks list all their dependencies correctly.",
      why:      "Missing deps cause stale closures; extra deps cause unnecessary re-renders.",
      docs:     "https://reactjs.org/docs/hooks-reference.html",
    })
    if (concerns.includes("a11y")) {
      rules.push({
        name:     "jsx-a11y/alt-text",
        severity: "error",
        desc:     "Enforces alt text on <img> and other media elements.",
        why:      "Missing alt text breaks screen readers for visually impaired users.",
        docs:     "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md",
      })
      rules.push({
        name:     "jsx-a11y/anchor-is-valid",
        severity: "error",
        desc:     "Ensures <a> elements have valid href attributes.",
        why:      "Invalid anchors break keyboard navigation and assistive technology.",
        docs:     "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md",
      })
    }
  }

  if (concerns.includes("security")) {
    rules.push({
      name:     "no-eval",
      severity: "error",
      desc:     "Disallows the use of eval().",
      why:      "eval() is a critical security risk — it can execute arbitrary code from user input.",
      docs:     "https://eslint.org/docs/rules/no-eval",
    })
    rules.push({
      name:     "no-implied-eval",
      severity: "error",
      desc:     "Disallows setTimeout/setInterval with string arguments.",
      why:      "Passing strings to timers is an implicit eval() — the same security risks apply.",
      docs:     "https://eslint.org/docs/rules/no-implied-eval",
    })
  }

  if (concerns.includes("imports")) {
    rules.push({
      name:     "import/order",
      severity: "warn",
      desc:     "Enforces a consistent import ordering convention.",
      why:      "Consistent import order makes files easier to scan and reduces noisy diffs.",
      docs:     "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md",
    })
    rules.push({
      name:     "import/no-duplicates",
      severity: errSev,
      desc:     "Disallows duplicate imports from the same module.",
      why:      "Duplicate imports add confusion and potential for conflicting references.",
      docs:     "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md",
    })
  }

  if (concerns.includes("perf") && isReact) {
    rules.push({
      name:     "react/jsx-no-bind",
      severity: "warn",
      desc:     "Discourages inline arrow functions in JSX props.",
      why:      "Inline functions recreate on every render, which can hurt performance in large lists.",
      docs:     "https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md",
    })
  }

  if (concerns.includes("testing")) {
    rules.push({
      name:     "jest/no-disabled-tests",
      severity: "warn",
      desc:     "Warns about skipped tests using .skip or xit.",
      why:      "Skipped tests that are never re-enabled create false confidence in test coverage.",
      docs:     "https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-disabled-tests.md",
    })
    rules.push({
      name:     "jest/expect-expect",
      severity: "error",
      desc:     "Requires at least one expect() call in every test.",
      why:      "Tests without assertions always pass, giving a false sense of security.",
      docs:     "https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/expect-expect.md",
    })
  }

  // ── Flat config (eslint.config.js) ───────────────────────────
  const importLines: string[] = [`import js from "@eslint/js"`]
  if (isTS) {
    importLines.push(`import tsParser from "@typescript-eslint/parser"`)
    importLines.push(`import tsPlugin from "@typescript-eslint/eslint-plugin"`)
  }
  if (isReact) {
    importLines.push(`import reactPlugin from "eslint-plugin-react"`)
    importLines.push(`import reactHooks from "eslint-plugin-react-hooks"`)
  }
  if (isVue)                            importLines.push(`import vuePlugin from "eslint-plugin-vue"`)
  if (concerns.includes("prettier"))    importLines.push(`import prettierConfig from "eslint-config-prettier"`)
  if (concerns.includes("imports"))     importLines.push(`import importPlugin from "eslint-plugin-import"`)
  if (concerns.includes("a11y") && isReact) importLines.push(`import a11yPlugin from "eslint-plugin-jsx-a11y"`)
  if (concerns.includes("security"))    importLines.push(`import securityPlugin from "eslint-plugin-security"`)

  const ruleEntries = rules
    .map((r) => `      "${r.name}": "${r.severity}"`)
    .join(",\n")

  const extendsLines: string[] = ["  js.configs.recommended"]
  if (isTS)    extendsLines.push("  ...tsPlugin.configs.recommended")
  if (isReact) extendsLines.push("  reactPlugin.configs.flat.recommended")
  if (concerns.includes("prettier")) extendsLines.push("  prettierConfig")

  const parserLine   = isTS ? `    languageOptions: { parser: tsParser },\n` : ""
  const fileGlob     = isTS ? `"**/*.{ts,tsx}"` : `"**/*.{js,jsx}"`

  const flatConfig = [
    importLines.join("\n"),
    "",
    "export default [",
    extendsLines.join(",\n") + ",",
    "  {",
    `    files: [${fileGlob}],`,
    parserLine + "    rules: {",
    ruleEntries,
    "    },",
    "  },",
    "]",
  ].join("\n")

  // ── Legacy config (.eslintrc.json) ───────────────────────────
  const legacyExtends: string[] = ["eslint:recommended"]
  if (isTS)    legacyExtends.push("plugin:@typescript-eslint/recommended")
  if (isReact) legacyExtends.push("plugin:react/recommended", "plugin:react-hooks/recommended")
  if (isVue)   legacyExtends.push("plugin:vue/vue3-recommended")
  if (concerns.includes("a11y") && isReact) legacyExtends.push("plugin:jsx-a11y/recommended")
  if (concerns.includes("prettier")) legacyExtends.push("prettier")

  const legacyRules: Record<string, string> = {}
  rules.forEach((r) => { legacyRules[r.name] = r.severity })

  const legacyObj = {
    env: {
      browser: !isNode,
      node:    isNode || framework === "vanilla",
      es2022:  true,
    },
    extends: legacyExtends,
    ...(isTS ? { parser: "@typescript-eslint/parser" } : {}),
    rules: legacyRules,
  }
  const legacyConfig = JSON.stringify(legacyObj, null, 2)

  // ── Install commands ─────────────────────────────────────────
  const pkgList = plugins.join(" ")
  const installCmd = {
    npm:  `npm install -D ${pkgList}`,
    pnpm: `pnpm add -D ${pkgList}`,
    yarn: `yarn add -D ${pkgList}`,
  }

  return { flatConfig, legacyConfig, rules, plugins, installCmd }
}