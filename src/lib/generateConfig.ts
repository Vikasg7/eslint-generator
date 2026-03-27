import type {
  GeneratedConfig,
  QuizAnswers,
  RuleExplanation,
  RuleSeverity,
  Strictness,
} from "@/types/quiz"

type JsonPrimitive = boolean | null | number | string
type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

interface JsonObject {
  [key: string]: JsonValue
}

interface NormalizedAnswers {
  framework: QuizAnswers["framework"]
  lang: QuizAnswers["lang"]
  strictness: QuizAnswers["strictness"]
  concerns: QuizAnswers["concerns"]
  experience: QuizAnswers["experience"]
}

const ESLINT_RULE_DOCS = "https://eslint.org/docs/latest/rules"
const TYPESCRIPT_RULE_DOCS = "https://typescript-eslint.io/rules"
const REACT_HOOKS_DOCS =
  "https://react.dev/reference/eslint-plugin-react-hooks/lints"
const REACT_PLUGIN_DOCS =
  "https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules"
const JSX_A11Y_DOCS =
  "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules"
const IMPORT_PLUGIN_DOCS =
  "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules"

function coreRuleDoc(ruleName: string): string {
  return `${ESLINT_RULE_DOCS}/${ruleName}`
}

function tsRuleDoc(ruleName: string): string {
  const normalized = ruleName.replace("@typescript-eslint/", "")
  return `${TYPESCRIPT_RULE_DOCS}/${normalized}`
}

function reactHooksRuleDoc(ruleName: string): string {
  const normalized = ruleName.replace("react-hooks/", "")
  return `${REACT_HOOKS_DOCS}/${normalized}`
}

function reactRuleDoc(ruleName: string): string {
  const normalized = ruleName.replace("react/", "")
  return `${REACT_PLUGIN_DOCS}/${normalized}.md`
}

function jsxA11yRuleDoc(ruleName: string): string {
  const normalized = ruleName.replace("jsx-a11y/", "")
  return `${JSX_A11Y_DOCS}/${normalized}.md`
}

function importRuleDoc(ruleName: string): string {
  const normalized = ruleName.replace("import/", "")
  return `${IMPORT_PLUGIN_DOCS}/${normalized}.md`
}

function sev(
  strictness: Strictness,
  tight: RuleSeverity,
  loose: RuleSeverity
): RuleSeverity {
  if (strictness === "relaxed") return loose
  return tight
}

function normalizeAnswers(answers: Partial<QuizAnswers>): NormalizedAnswers {
  return {
    framework: answers.framework ?? "vanilla",
    lang: answers.lang ?? "js",
    strictness: answers.strictness ?? "moderate",
    concerns: answers.concerns ?? [],
    experience: answers.experience ?? "mixed",
  }
}

function addPackage(packages: string[], name: string): void {
  if (!packages.includes(name)) {
    packages.push(name)
  }
}

function addRule(
  rules: RuleExplanation[],
  ruleConfig: Record<string, JsonValue>,
  name: string,
  value: JsonValue,
  severity: RuleSeverity,
  desc: string,
  why: string,
  docs?: string
): void {
  rules.push({ name, severity, desc, why, docs })
  ruleConfig[name] = value
}

function formatJsValue(value: JsonValue, indent = 0): string {
  const indentText = "  ".repeat(indent)
  const nextIndent = "  ".repeat(indent + 1)

  if (typeof value === "string") {
    return JSON.stringify(value)
  }

  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return String(value)
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]"
    }

    const items = value
      .map((item) => `${nextIndent}${formatJsValue(item, indent + 1)}`)
      .join(",\n")

    return `[\n${items}\n${indentText}]`
  }

  const entries = Object.entries(value)

  if (entries.length === 0) {
    return "{}"
  }

  const formattedEntries = entries
    .map(
      ([key, entryValue]) =>
        `${nextIndent}${JSON.stringify(key)}: ${formatJsValue(entryValue, indent + 1)}`
    )
    .join(",\n")

  return `{\n${formattedEntries}\n${indentText}}`
}

function buildCodeFiles(
  framework: QuizAnswers["framework"],
  lang: QuizAnswers["lang"]
): string[] {
  const extensions = ["js", "mjs", "cjs"]

  if (framework === "react") {
    extensions.push("jsx")
  }

  if (lang === "ts" || lang === "mixed") {
    extensions.push("ts", "mts", "cts")
    if (framework === "react") {
      extensions.push("tsx")
    }
  }

  if (framework === "vue") {
    extensions.push("vue")
  }

  return [`**/*.{${extensions.join(",")}}`]
}

function buildTestFiles(): string[] {
  return [
    "**/*.test.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
    "**/*.spec.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
    "**/__tests__/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
  ]
}

function buildLegacyExtends(
  answers: NormalizedAnswers,
  usesPrettier: boolean,
  usesImports: boolean,
  usesA11y: boolean,
  usesSecurity: boolean,
  usesTesting: boolean,
  isTS: boolean,
  isReact: boolean,
  isVue: boolean
): string[] {
  const legacyExtends = ["eslint:recommended"]

  if (isTS) {
    legacyExtends.push("plugin:@typescript-eslint/recommended")
    if (answers.strictness === "strict") {
      legacyExtends.push("plugin:@typescript-eslint/strict")
    }
  }

  if (isReact) {
    legacyExtends.push("plugin:react/recommended", "plugin:react/jsx-runtime")
    legacyExtends.push("plugin:react-hooks/recommended")
  }

  if (isVue) {
    legacyExtends.push("plugin:vue/recommended")
  }

  if (usesImports) {
    legacyExtends.push("plugin:import/recommended")
  }

  if (usesA11y && isReact) {
    legacyExtends.push("plugin:jsx-a11y/recommended")
  }

  if (usesSecurity) {
    legacyExtends.push("plugin:security/recommended-legacy")
  }

  if (usesTesting) {
    legacyExtends.push("plugin:jest/recommended")
  }

  if (usesPrettier) {
    legacyExtends.push("prettier")
  }

  return legacyExtends
}

function buildFlatConfigString(
  answers: NormalizedAnswers,
  rulesObject: Record<string, JsonValue>
): string {
  const isTS = answers.lang === "ts" || answers.lang === "mixed"
  const isReact = answers.framework === "react"
  const isVue = answers.framework === "vue"
  const usesPrettier = answers.concerns.includes("prettier")
  const usesImports = answers.concerns.includes("imports")
  const usesA11y = answers.concerns.includes("a11y") && isReact
  const usesSecurity = answers.concerns.includes("security")
  const usesTesting = answers.concerns.includes("testing")

  const imports = [
    'const { defineConfig } = require("eslint/config")',
    'const js = require("@eslint/js")',
  ]

  if (isTS) {
    imports.push('const tseslint = require("typescript-eslint")')
  }

  if (isReact) {
    imports.push('const reactPlugin = require("eslint-plugin-react")')
    imports.push('const reactHooks = require("eslint-plugin-react-hooks")')
  }

  if (isVue) {
    imports.push('const vuePlugin = require("eslint-plugin-vue")')
    imports.push('const vueParser = require("vue-eslint-parser")')
  }

  if (usesImports) {
    imports.push('const importPlugin = require("eslint-plugin-import")')
  }

  if (usesA11y) {
    imports.push('const jsxA11y = require("eslint-plugin-jsx-a11y")')
  }

  if (usesSecurity) {
    imports.push('const securityPlugin = require("eslint-plugin-security")')
  }

  if (usesTesting) {
    imports.push('const jestPlugin = require("eslint-plugin-jest")')
  }

  if (usesPrettier) {
    imports.push('const prettierConfig = require("eslint-config-prettier/flat")')
  }

  const codeFiles = buildCodeFiles(answers.framework, answers.lang)
  const configEntries = ["js.configs.recommended"]

  if (isTS) {
    configEntries.push("...tseslint.configs.recommended")
    if (answers.strictness === "strict") {
      configEntries.push("...tseslint.configs.strict")
    }
  }

  if (isReact) {
    configEntries.push("reactPlugin.configs.flat.recommended")
    configEntries.push('reactPlugin.configs.flat["jsx-runtime"]')
  }

  if (isVue) {
    configEntries.push('...vuePlugin.configs["flat/recommended"]')
  }

  if (usesImports) {
    configEntries.push("importPlugin.flatConfigs.recommended")
  }

  if (usesSecurity) {
    configEntries.push("securityPlugin.configs.recommended")
  }

  if (usesPrettier) {
    configEntries.push("prettierConfig")
  }

  if (usesA11y) {
    configEntries.push(`{
  files: ${formatJsValue(codeFiles)},
  ...jsxA11y.flatConfigs.recommended,
}`)
  }

  if (usesTesting) {
    configEntries.push(`{
  files: ${formatJsValue(buildTestFiles())},
  ...jestPlugin.configs["flat/recommended"],
}`)
  }

  if (isVue) {
    configEntries.push(`{
  files: ["**/*.vue"],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"${isTS ? ",\n      parser: tseslint.parser" : ""}
    }
  }
}`)
  }

  const plugins: string[] = []

  if (isTS) {
    plugins.push('"@typescript-eslint": tseslint.plugin')
  }

  if (isReact) {
    plugins.push('react: reactPlugin', '"react-hooks": reactHooks')
  }

  if (isVue) {
    plugins.push("vue: vuePlugin")
  }

  if (usesImports) {
    plugins.push("import: importPlugin")
  }

  if (usesA11y) {
    plugins.push('"jsx-a11y": jsxA11y')
  }

  if (usesSecurity) {
    plugins.push("security: securityPlugin")
  }

  const languageOptions: JsonObject = {
    ecmaVersion: "latest",
    sourceType: "module",
  }

  if (isReact) {
    languageOptions.parserOptions = {
      ecmaFeatures: {
        jsx: true,
      },
    }
  }

  const settings: JsonObject = {}

  if (isReact) {
    settings.react = {
      version: "detect",
    }
  }

  const blockLines = [
    "{",
    `  files: ${formatJsValue(codeFiles)},`,
    `  languageOptions: ${formatJsValue(languageOptions, 1).replace(/\n/g, "\n  ")},`,
  ]

  if (plugins.length > 0) {
    blockLines.push("  plugins: {")
    for (const pluginLine of plugins) {
      blockLines.push(`    ${pluginLine},`)
    }
    blockLines.push("  },")
  }

  if (Object.keys(settings).length > 0) {
    blockLines.push(`  settings: ${formatJsValue(settings, 1).replace(/\n/g, "\n  ")},`)
  }

  blockLines.push(`  rules: ${formatJsValue(rulesObject, 1).replace(/\n/g, "\n  ")}`)
  blockLines.push("}")

  configEntries.push(blockLines.join("\n"))

  return `${imports.join("\n")}

module.exports = defineConfig([
${configEntries.map((entry) => `  ${entry}`).join(",\n")}
])
`
}

export function generateConfig(
  answers: Partial<QuizAnswers>
): GeneratedConfig {
  const normalized = normalizeAnswers(answers)

  const isTS = normalized.lang === "ts" || normalized.lang === "mixed"
  const isReact = normalized.framework === "react"
  const isVue = normalized.framework === "vue"
  const isNode = normalized.framework === "node"

  const usesPrettier = normalized.concerns.includes("prettier")
  const usesImports = normalized.concerns.includes("imports")
  const usesA11y = normalized.concerns.includes("a11y") && isReact
  const usesSecurity = normalized.concerns.includes("security")
  const usesPerf = normalized.concerns.includes("perf")
  const usesTesting = normalized.concerns.includes("testing")
  const usesPromises = normalized.concerns.includes("promises")
  const usesCleanup = normalized.concerns.includes("cleanup")
  const usesMaintainability = normalized.concerns.includes("maintainability")

  const errSev = sev(normalized.strictness, "error", "warn")
  const rules: RuleExplanation[] = []
  const ruleConfig: Record<string, JsonValue> = {}
  const plugins: string[] = []

  addPackage(plugins, "eslint")
  addPackage(plugins, "@eslint/js")

  if (isTS) {
    addPackage(plugins, "typescript")
    addPackage(plugins, "typescript-eslint")
    addPackage(plugins, "@typescript-eslint/eslint-plugin")
    addPackage(plugins, "@typescript-eslint/parser")
  }

  if (isReact) {
    addPackage(plugins, "eslint-plugin-react")
    addPackage(plugins, "eslint-plugin-react-hooks")
  }

  if (isVue) {
    addPackage(plugins, "eslint-plugin-vue")
    addPackage(plugins, "vue-eslint-parser")
  }

  if (usesPrettier) {
    addPackage(plugins, "eslint-config-prettier")
    addPackage(plugins, "prettier")
  }

  if (usesImports) {
    addPackage(plugins, "eslint-plugin-import")
  }

  if (usesA11y) {
    addPackage(plugins, "eslint-plugin-jsx-a11y")
  }

  if (usesSecurity) {
    addPackage(plugins, "eslint-plugin-security")
  }

  if (usesTesting) {
    addPackage(plugins, "eslint-plugin-jest")
  }

  if (isTS) {
    addRule(
      rules,
      ruleConfig,
      "no-unused-vars",
      "off",
      "off",
      "Turns off the core unused-variable rule when TypeScript is active.",
      "TypeScript projects should rely on the TypeScript-aware version to avoid duplicate or incorrect reports.",
      coreRuleDoc("no-unused-vars")
    )

    addRule(
      rules,
      ruleConfig,
      "@typescript-eslint/no-unused-vars",
      [
        errSev,
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      errSev,
      "Flags variables, parameters, and caught errors that are never used in TypeScript code.",
      "The TypeScript-aware version avoids false positives that the base ESLint rule can produce in typed codebases.",
      tsRuleDoc("@typescript-eslint/no-unused-vars")
    )
  } else {
    addRule(
      rules,
      ruleConfig,
      "no-unused-vars",
      [
        errSev,
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      errSev,
      "Flags variables, parameters, and caught errors that are never used.",
      "Unused bindings usually signal dead code, incomplete refactors, or mistakes that are easy to miss in review.",
      coreRuleDoc("no-unused-vars")
    )
  }

  addRule(
    rules,
    ruleConfig,
    "no-console",
    "warn",
    "warn",
    "Warns when debug logging is left in the code.",
    "Console statements are useful during development, but they often create noisy output in production code.",
    coreRuleDoc("no-console")
  )

  if (normalized.strictness !== "relaxed") {
    addRule(
      rules,
      ruleConfig,
      "eqeqeq",
      errSev,
      errSev,
      "Requires strict equality operators instead of loose equality.",
      "Strict comparisons avoid coercion edge cases that can hide subtle bugs.",
      coreRuleDoc("eqeqeq")
    )

    addRule(
      rules,
      ruleConfig,
      "no-var",
      errSev,
      errSev,
      "Disallows `var` in favor of block-scoped declarations.",
      "Using `let` and `const` avoids accidental hoisting and scope confusion.",
      coreRuleDoc("no-var")
    )

    addRule(
      rules,
      ruleConfig,
      "prefer-const",
      errSev,
      errSev,
      "Requires `const` when a variable is never reassigned.",
      "Immutable declarations make code easier to read and prevent accidental mutation.",
      coreRuleDoc("prefer-const")
    )
  }

  if (normalized.strictness === "strict") {
    addRule(
      rules,
      ruleConfig,
      "no-implicit-coercion",
      "error",
      "error",
      "Disallows shorthand coercions such as `!!value` or `+value` when they obscure intent.",
      "Explicit conversions are clearer to reviewers and reduce surprising behavior.",
      coreRuleDoc("no-implicit-coercion")
    )
  }

  if (isTS) {
    addRule(
      rules,
      ruleConfig,
      "@typescript-eslint/no-explicit-any",
      sev(normalized.strictness, "error", "warn"),
      sev(normalized.strictness, "error", "warn"),
      "Warns when `any` is used instead of a safer type.",
      "Avoiding `any` preserves the value of TypeScript and keeps type errors discoverable earlier.",
      tsRuleDoc("@typescript-eslint/no-explicit-any")
    )

    const functionReturnSeverity: RuleSeverity =
      normalized.strictness === "strict" ? "error" : "warn"

    addRule(
      rules,
      ruleConfig,
      "@typescript-eslint/explicit-function-return-type",
      functionReturnSeverity,
      functionReturnSeverity,
      "Requires function return types to be written explicitly.",
      "Explicit return types make public APIs easier to understand and help catch accidental inference changes.",
      tsRuleDoc("@typescript-eslint/explicit-function-return-type")
    )

    if (normalized.strictness === "strict") {
      addRule(
        rules,
        ruleConfig,
        "@typescript-eslint/no-non-null-assertion",
        "error",
        "error",
        "Disallows the non-null assertion operator.",
        "Non-null assertions can silence real nullability bugs instead of fixing them.",
        tsRuleDoc("@typescript-eslint/no-non-null-assertion")
      )
    }
  }

  if (isReact) {
    addRule(
      rules,
      ruleConfig,
      "react-hooks/rules-of-hooks",
      "error",
      "error",
      "Enforces that Hooks are only called in valid React component and Hook locations.",
      "Breaking the Hook call order causes state to attach to the wrong values and leads to hard-to-debug runtime bugs.",
      reactHooksRuleDoc("react-hooks/rules-of-hooks")
    )

    addRule(
      rules,
      ruleConfig,
      "react-hooks/exhaustive-deps",
      "warn",
      "warn",
      "Checks that Hook dependency arrays include every value they use.",
      "Missing dependencies are a common source of stale state and effects that fail to rerun when data changes.",
      reactHooksRuleDoc("react-hooks/exhaustive-deps")
    )
  }

  if (usesA11y) {
    addRule(
      rules,
      ruleConfig,
      "jsx-a11y/alt-text",
      errSev,
      errSev,
      "Requires meaningful alternative text on images and similar content.",
      "Accessible text alternatives help screen-reader users understand non-text content.",
      jsxA11yRuleDoc("jsx-a11y/alt-text")
    )
  }

  if (usesSecurity) {
    addRule(
      rules,
      ruleConfig,
      "no-eval",
      "error",
      "error",
      "Disallows direct use of `eval()`.",
      "Executing dynamically constructed code creates serious security and maintainability risks.",
      coreRuleDoc("no-eval")
    )

    addRule(
      rules,
      ruleConfig,
      "no-implied-eval",
      "error",
      "error",
      "Disallows APIs that behave like `eval`, such as passing strings to timers.",
      "Indirect evaluation paths create the same class of security and debugging problems as `eval()` itself.",
      coreRuleDoc("no-implied-eval")
    )
  }

  if (usesImports) {
    addRule(
      rules,
      ruleConfig,
      "import/order",
      [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
        },
      ],
      "warn",
      "Encourages a consistent ordering for import statements.",
      "A predictable import layout makes files easier to scan and reduces noisy merge conflicts.",
      importRuleDoc("import/order")
    )

    addRule(
      rules,
      ruleConfig,
      "import/no-duplicates",
      errSev,
      errSev,
      "Disallows importing the same module more than once in a file.",
      "Duplicate imports create clutter and can hide accidental inconsistencies in how a module is used.",
      importRuleDoc("import/no-duplicates")
    )
  }

  if (usesPerf && isReact) {
    addRule(
      rules,
      ruleConfig,
      "react/jsx-no-bind",
      "warn",
      "warn",
      "Warns when new function values are created inline in JSX props.",
      "Repeatedly creating new callback identities can cause avoidable rerenders in component trees.",
      reactRuleDoc("react/jsx-no-bind")
    )
  }

  if (usesPromises) {
    addRule(
      rules,
      ruleConfig,
      "no-async-promise-executor",
      "error",
      "error",
      "Disallows using an async function as a Promise executor.",
      "Async executors can lose thrown errors and make Promise control flow much harder to reason about.",
      coreRuleDoc("no-async-promise-executor")
    )

    addRule(
      rules,
      ruleConfig,
      "no-promise-executor-return",
      sev(normalized.strictness, "error", "warn"),
      sev(normalized.strictness, "error", "warn"),
      "Disallows returning a value from a Promise executor function.",
      "Return values inside Promise executors are ignored, which usually points to a mistaken async pattern.",
      coreRuleDoc("no-promise-executor-return")
    )
  }

  if (usesCleanup) {
    addRule(
      rules,
      ruleConfig,
      "no-debugger",
      "error",
      "error",
      "Disallows `debugger` statements from being committed.",
      "Leftover breakpoints interrupt runtime behavior and are almost always accidental in shared code.",
      coreRuleDoc("no-debugger")
    )

    addRule(
      rules,
      ruleConfig,
      "no-alert",
      sev(normalized.strictness, "error", "warn"),
      sev(normalized.strictness, "error", "warn"),
      "Warns when `alert`, `confirm`, or `prompt` are used.",
      "Blocking browser dialogs usually signal temporary debugging or a rough UX that should be replaced.",
      coreRuleDoc("no-alert")
    )
  }

  if (usesMaintainability) {
    addRule(
      rules,
      ruleConfig,
      "curly",
      "error",
      "error",
      "Requires braces around control statements such as `if` and `while`.",
      "Mandatory braces reduce review mistakes and prevent bugs when a single-line branch grows later.",
      coreRuleDoc("curly")
    )

    addRule(
      rules,
      ruleConfig,
      "default-case-last",
      "error",
      "error",
      "Requires the default clause in switch statements to appear last.",
      "A consistent switch structure makes branching logic easier to scan and less error-prone.",
      coreRuleDoc("default-case-last")
    )
  }

  const legacyConfigObject: JsonObject = {
    env: {
      browser: !isNode,
      es2024: true,
      node: isNode || usesTesting,
      ...(usesTesting ? { "jest/globals": true } : {}),
    },
    extends: buildLegacyExtends(
      normalized,
      usesPrettier,
      usesImports,
      usesA11y,
      usesSecurity,
      usesTesting,
      isTS,
      isReact,
      isVue
    ),
    rules: ruleConfig,
  }

  if (isVue) {
    legacyConfigObject.parser = "vue-eslint-parser"
    legacyConfigObject.parserOptions = {
      ecmaVersion: "latest",
      sourceType: "module",
      ...(isTS ? { parser: "@typescript-eslint/parser" } : {}),
      ...(isReact ? { ecmaFeatures: { jsx: true } } : {}),
    }
  } else if (isTS) {
    legacyConfigObject.parser = "@typescript-eslint/parser"
    legacyConfigObject.parserOptions = {
      ecmaVersion: "latest",
      sourceType: "module",
      ...(isReact ? { ecmaFeatures: { jsx: true } } : {}),
    }
  } else if (isReact) {
    legacyConfigObject.parserOptions = {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    }
  }

  if (isReact) {
    legacyConfigObject.settings = {
      react: {
        version: "detect",
      },
    }
  }

  const flatConfig = buildFlatConfigString(normalized, ruleConfig)
  const legacyConfig = `${JSON.stringify(legacyConfigObject, null, 2)}\n`

  return {
    flatConfig,
    legacyConfig,
    rules,
    plugins,
    installCmd: {
      npm: `npm install -D ${plugins.join(" ")}`,
      pnpm: `pnpm add -D ${plugins.join(" ")}`,
      yarn: `yarn add -D ${plugins.join(" ")}`,
    },
  }
}
