# Intuitive ESLint Generator

Intuitive ESLint Generator is a polished Next.js app that helps developers build an ESLint configuration by answering a short quiz. It generates both modern flat config output and legacy `.eslintrc.json`, explains every included rule in plain English, builds install commands, and creates a shareable URL for the exact result.

The project is designed to work as a static site on GitHub Pages.

## Highlights

- 5-step quiz flow with single-select and multi-select questions
- Generates `eslint.config.js` and `.eslintrc.json`
- Explains every generated rule with severity, reasoning, and docs links
- Builds npm, pnpm, and yarn install commands
- Shareable result URLs with zero backend
- Dark, developer-tool-inspired UI
- Static export compatible with GitHub Pages

## Tech Stack

- Next.js App Router
- TypeScript
- Pure CSS with global design tokens
- `next/font/google` for Syne and JetBrains Mono
- No runtime dependencies beyond Next.js, React, and React DOM

## How It Works

1. The user answers the quiz.
2. The app encodes the answers into a compact base64url string.
3. The result page decodes the answers client-side.
4. A pure TypeScript generator builds the config text, install commands, and rule explanations.

Because GitHub Pages is a static host, shared results use a query-parameter URL:

```text
/result?id=eyJmcmFtZXdvcmsiOiJyZWFjdCIsImxhbmciOiJ0cyIsLi4ufQ
```

This keeps sharing working without requiring dynamic server routes.

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Type-check the app:

```bash
pnpm exec tsc --noEmit
```

Create a production build:

```bash
pnpm build
```

## GitHub Pages Deployment

This repo is configured for GitHub Pages with:

- `output: "export"` in `next.config.ts`
- automatic `basePath` handling for project pages
- a GitHub Actions workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)

### Enable Pages in GitHub

1. Push the repository to GitHub.
2. Open the repository settings.
3. Go to `Settings` -> `Pages`.
4. Set the source to `GitHub Actions`.
5. Push to `main` or run the workflow manually.

The workflow will:

1. install dependencies
2. build the static export
3. upload the generated `out/` directory
4. deploy it to GitHub Pages

### Base Path Behavior

If the site is deployed as a project page, for example:

```text
https://vikasg7.github.io/eslint-generator/
```

the build automatically uses `/eslint-generator` as the base path during GitHub Actions.

If the site is deployed as a user/org root site such as:

```text
https://vikasg7.github.io/
```

no base path is added.

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    result/page.tsx
    globals.css
  components/
    ConfigOutput.tsx
    InstallCommand.tsx
    QuizStep.tsx
    RuleExplainer.tsx
    ShareButton.tsx
  lib/
    encodeAnswers.ts
    generateConfig.ts
    quiz-steps.ts
  types/
    quiz.ts
```

## Notes

- The config generator is pure and deterministic.
- The result page is static-host friendly and does not rely on a backend.
- The app targets the latest ESLint rule docs for core rule links.

## License

Use and adapt freely for your own projects unless you want to add a specific license file later.
