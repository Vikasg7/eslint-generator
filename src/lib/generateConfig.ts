import type {
  Concern,
  Experience,
  Framework,
  GeneratedConfig,
  Language,
  QuizAnswers,
  RuleExplanation,
  RuleSeverity,
  Strictness,
} from "@/types/quiz";

const DEFAULT_ANSWERS: QuizAnswers = {
  framework: "vanilla",
  lang: "js",
  strictness: "moderate",
  concerns: [],
  experience: "mixed",
};

interface NormalizedAnswers {
  framework: Framework;
  lang: Language;
  strictness: Strictness;
  concerns: Concern[];
  experience: Experience;
}

function resolveSeverity(
  strictness: Strictness,
  tight: RuleSeverity,
  loose: RuleSeverity,
): RuleSeverity {
  return strictness === "relaxed" ? loose : tight;
}

function addUnique(items: string[], value: string): void {
  if (!items.includes(value)) {
    items.push(value);
  }
}

function normalizeAnswers(answers: Partial<QuizAnswers>): NormalizedAnswers {
  return {
    framework: answers.framework ?? DEFAULT_ANSWERS.framework,
    lang: answers.lang ?? DEFAULT_ANSWERS.lang,
    strictness: answers.strictness ?? DEFAULT_ANSWERS.strictness,
    concerns: answers.concerns ?? DEFAULT_ANSWERS.concerns,
    experience: answers.experience ?? DEFAULT_ANSWERS.experience,
  };
}

function buildFilesList(
  framework: Framework,
  lang: Language,
): string[] {
  const isTS = lang === "ts" || lang === "mixed";

  if (framework === "react") {
    return isTS ? ["**/*.{js,jsx,ts,tsx}"] : ["**/*.{js,jsx}"];
  }

  if (framework === "vue") {
    return isTS ? ["**/*.{js,mjs,cjs,ts,vue}"] : ["**/*.{js,mjs,cjs,vue}"];
  }

  if (framework === "node") {
    return isTS ? ["**/*.{js,cjs,mjs,ts}"] : ["**/*.{js,cjs,mjs}"];
  }

  return isTS ? ["**/*.{js,mjs,cjs,ts}"] : ["**/*.{js,mjs,cjs}"];
}

function indentJson(input: Record<string, RuleSeverity>): string {
  return JSON.stringify(input, null, 2).replace(/\n/g, "\n    ");
}

export function generateConfig(
  answers: Partial<QuizAnswers>,
): GeneratedConfig {
  const { framework, lang, strictness, concerns, experience } =
    normalizeAnswers(answers);
  const isTS = lang === "ts" || lang === "mixed";
  const isReact = framework === "react";
  const isVue = framework === "vue";
  const isNode = framework === "node";
  const hasPrettier = concerns.includes("prettier");
  const hasImports = concerns.includes("imports");
  const hasA11y = concerns.includes("a11y");
  const hasSecurity = concerns.includes("security");
  const hasPerf = concerns.includes("perf");
  const hasTesting = concerns.includes("testing");
  const plugins: string[] = ["eslint"];
  const rules: RuleExplanation[] = [];
  const ruleMap: Record<string, RuleSeverity> = {};
  const errSev = resolveSeverity(strictness, "error", "warn");

  void experience;

  const addRule = (
    name: string,
    severity: RuleSeverity,
    desc: string,
    why: string,
    docs: string,
  ): void => {
    ruleMap[name] = severity;
    rules.push({
      name,
      severity,
      desc,
      why,
      docs,
    });
  };

  if (isTS) {
    addUnique(plugins, "@typescript-eslint/eslint-plugin");
    addUnique(plugins, "@typescript-eslint/parser");
  }

  if (isReact) {
    addUnique(plugins, "eslint-plugin-react");
    addUnique(plugins, "eslint-plugin-react-hooks");
  }

  if (isVue) {
    addUnique(plugins, "eslint-plugin-vue");
    addUnique(plugins, "vue-eslint-parser");
  }

  if (hasPrettier) {
    addUnique(plugins, "eslint-config-prettier");
    addUnique(plugins, "prettier");
  }

  if (hasImports) {
    addUnique(plugins, "eslint-plugin-import");
  }

  if (isReact && hasA11y) {
    addUnique(plugins, "eslint-plugin-jsx-a11y");
  }

  if (hasSecurity) {
    addUnique(plugins, "eslint-plugin-security");
  }

  if (hasTesting) {
    addUnique(plugins, "eslint-plugin-jest");
  }

  addRule(
    "no-unused-vars",
    errSev,
    "Catches variables, arguments, and imports that are declared but never used.",
    "Unused code adds noise and often hides bugs or unfinished refactors.",
    "https://eslint.org/docs/latest/rules/no-unused-vars",
  );
  addRule(
    "no-console",
    "warn",
    "Flags stray console calls that can slip into committed application code.",
    "It keeps logs intentional instead of accidentally shipping debug output.",
    "https://eslint.org/docs/latest/rules/no-console",
  );

  if (strictness !== "relaxed") {
    addRule(
      "eqeqeq",
      errSev,
      "Requires strict equality checks instead of the coercive == and != operators.",
      "Strict comparisons avoid surprising type coercion at runtime.",
      "https://eslint.org/docs/latest/rules/eqeqeq",
    );
    addRule(
      "no-var",
      errSev,
      "Prevents var declarations in favor of modern block-scoped bindings.",
      "let and const avoid hoisting confusion and accidental scope leaks.",
      "https://eslint.org/docs/latest/rules/no-var",
    );
    addRule(
      "prefer-const",
      errSev,
      "Encourages const when a variable is never reassigned after declaration.",
      "Immutability makes intent clearer and reduces accidental mutations.",
      "https://eslint.org/docs/latest/rules/prefer-const",
    );
  }

  if (strictness === "strict") {
    addRule(
      "no-implicit-coercion",
      "error",
      "Rejects shorthand coercion tricks like !!foo or +value when they reduce clarity.",
      "Explicit conversions are easier to read and safer for teammates to maintain.",
      "https://eslint.org/docs/latest/rules/no-implicit-coercion",
    );
  }

  if (isTS) {
    addRule(
      "@typescript-eslint/no-explicit-any",
      errSev,
      "Warns when values are typed as any and lose TypeScript's safety net.",
      "Keeping types specific helps tooling catch issues before they ship.",
      "https://typescript-eslint.io/rules/no-explicit-any/",
    );
    addRule(
      "@typescript-eslint/explicit-function-return-type",
      errSev,
      "Requires function return types to be written out where clarity matters most.",
      "Explicit returns help teams understand public APIs and avoid accidental widening.",
      "https://typescript-eslint.io/rules/explicit-function-return-type/",
    );

    if (strictness === "strict") {
      addRule(
        "@typescript-eslint/no-non-null-assertion",
        "error",
        "Prevents the non-null assertion operator from bypassing possible null checks.",
        "It nudges you toward safer control flow instead of silencing uncertainty.",
        "https://typescript-eslint.io/rules/no-non-null-assertion/",
      );
    }
  }

  if (isReact) {
    addRule(
      "react-hooks/rules-of-hooks",
      "error",
      "Enforces the rules of Hooks so React state and effects stay predictable.",
      "Incorrect hook usage can break render ordering in subtle, hard-to-debug ways.",
      "https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks",
    );
    addRule(
      "react-hooks/exhaustive-deps",
      "warn",
      "Checks dependency arrays so effects stay in sync with the values they use.",
      "Missing dependencies can create stale state and inconsistent side effects.",
      "https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps",
    );
  }

  if (isReact && hasA11y) {
    addRule(
      "jsx-a11y/alt-text",
      errSev,
      "Ensures images and similar elements include meaningful alternative text.",
      "Accessible markup makes interfaces usable for assistive technologies.",
      "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md",
    );
  }

  if (hasSecurity) {
    addRule(
      "no-eval",
      "error",
      "Blocks eval calls that execute arbitrary strings as code.",
      "Dynamic code execution creates security risks and makes behavior harder to reason about.",
      "https://eslint.org/docs/latest/rules/no-eval",
    );
    addRule(
      "no-implied-eval",
      "error",
      "Prevents string-based timers and similar patterns that behave like eval.",
      "Avoiding implicit evaluation reduces injection risk and keeps code paths explicit.",
      "https://eslint.org/docs/latest/rules/no-implied-eval",
    );
  }

  if (hasImports) {
    addRule(
      "import/order",
      "warn",
      "Encourages a consistent import order so files scan cleanly from the top.",
      "Predictable import structure makes large modules easier to review and maintain.",
      "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md",
    );
    addRule(
      "import/no-duplicates",
      errSev,
      "Flags repeated imports from the same module in a single file.",
      "Duplicate imports add clutter and can hide accidental merge leftovers.",
      "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md",
    );
  }

  if (hasPerf && isReact) {
    addRule(
      "react/jsx-no-bind",
      "warn",
      "Discourages creating new function instances inline inside JSX props.",
      "Stable references can reduce unnecessary renders in heavily reused components.",
      "https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md",
    );
  }

  const importLines: string[] = [];
  const spreadLines: string[] = [];
  const pluginEntries: string[] = [];
  const files = buildFilesList(framework, lang);

  if (isTS) {
    importLines.push(
      'import tseslint from "@typescript-eslint/eslint-plugin";',
      'import tsParser from "@typescript-eslint/parser";',
    );
    spreadLines.push("  tseslint.configs.recommended,");
    pluginEntries.push('"@typescript-eslint": tseslint');
  }

  if (isReact) {
    importLines.push(
      'import reactPlugin from "eslint-plugin-react";',
      'import reactHooks from "eslint-plugin-react-hooks";',
    );
    spreadLines.push(
      "  reactPlugin.configs.flat.recommended,",
      "  reactHooks.configs.recommended,",
    );
    pluginEntries.push('react: reactPlugin', '"react-hooks": reactHooks');
  }

  if (isVue) {
    importLines.push(
      'import vuePlugin from "eslint-plugin-vue";',
      'import vueParser from "vue-eslint-parser";',
    );
    spreadLines.push('  ...vuePlugin.configs["flat/recommended"],');
    pluginEntries.push('vue: vuePlugin');
  }

  if (hasPrettier) {
    importLines.push('import prettierConfig from "eslint-config-prettier";');
    spreadLines.push("  prettierConfig,");
  }

  if (hasImports) {
    importLines.push('import importPlugin from "eslint-plugin-import";');
    spreadLines.push("  importPlugin.flatConfigs.recommended,");
    pluginEntries.push('import: importPlugin');
  }

  if (isReact && hasA11y) {
    importLines.push('import jsxA11y from "eslint-plugin-jsx-a11y";');
    spreadLines.push("  jsxA11y.flatConfigs.recommended,");
    pluginEntries.push('"jsx-a11y": jsxA11y');
  }

  if (hasSecurity) {
    importLines.push('import securityPlugin from "eslint-plugin-security";');
    spreadLines.push("  securityPlugin.configs.recommended,");
    pluginEntries.push('security: securityPlugin');
  }

  if (hasTesting) {
    importLines.push('import jestPlugin from "eslint-plugin-jest";');
    spreadLines.push('  jestPlugin.configs["flat/recommended"],');
    pluginEntries.push('jest: jestPlugin');
  }

  const configObjectLines: string[] = [
    "  {",
    `    files: ${JSON.stringify(files)},`,
  ];

  if (isTS || isVue) {
    configObjectLines.push("    languageOptions: {");
    configObjectLines.push('      ecmaVersion: "latest",');
    configObjectLines.push('      sourceType: "module",');

    if (isVue) {
      configObjectLines.push("      parser: vueParser,");

      if (isTS) {
        configObjectLines.push("      parserOptions: {");
        configObjectLines.push("        parser: tsParser,");
        configObjectLines.push("      },");
      }
    } else if (isTS) {
      configObjectLines.push("      parser: tsParser,");
    }

    configObjectLines.push("    },");
  }

  if (pluginEntries.length > 0) {
    configObjectLines.push("    plugins: {");
    pluginEntries.forEach((entry) => {
      configObjectLines.push(`      ${entry},`);
    });
    configObjectLines.push("    },");
  }

  configObjectLines.push(`    rules: ${indentJson(ruleMap)}`);
  configObjectLines.push("  },");

  const flatConfigSections: string[] = [];

  if (importLines.length > 0) {
    flatConfigSections.push(importLines.join("\n"));
  }

  flatConfigSections.push(
    [
      "export default [",
      ...spreadLines,
      ...configObjectLines,
      "];",
    ].join("\n"),
  );

  const flatConfig = flatConfigSections.join("\n\n");

  const legacyExtends: string[] = [];

  if (isTS) {
    legacyExtends.push("plugin:@typescript-eslint/recommended");
  }

  if (isReact) {
    legacyExtends.push(
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
    );
  }

  if (isVue) {
    legacyExtends.push("plugin:vue/vue3-recommended");
  }

  if (hasImports) {
    legacyExtends.push("plugin:import/recommended");
  }

  if (isReact && hasA11y) {
    legacyExtends.push("plugin:jsx-a11y/recommended");
  }

  if (hasSecurity) {
    legacyExtends.push("plugin:security/recommended");
  }

  if (hasTesting) {
    legacyExtends.push("plugin:jest/recommended");
  }

  if (hasPrettier) {
    legacyExtends.push("prettier");
  }

  const legacyConfigObject: {
    env: Record<string, boolean>;
    extends: string[];
    parser?: string;
    parserOptions?: Record<string, string>;
    rules: Record<string, RuleSeverity>;
  } = {
    env: {
      browser: !isNode,
      es2022: true,
      jest: hasTesting,
      node: isNode,
    },
    extends: legacyExtends,
    rules: ruleMap,
  };

  if (isVue) {
    legacyConfigObject.parser = "vue-eslint-parser";

    if (isTS) {
      legacyConfigObject.parserOptions = {
        parser: "@typescript-eslint/parser",
      };
    }
  } else if (isTS) {
    legacyConfigObject.parser = "@typescript-eslint/parser";
  }

  const legacyConfig = JSON.stringify(legacyConfigObject, null, 2);

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
  };
}
