import type {
  Concern,
  Experience,
  Framework,
  Language,
  QuizAnswers,
  Strictness,
} from "@/types/quiz";

function isFramework(value: unknown): value is Framework {
  return (
    value === "react" ||
    value === "vue" ||
    value === "node" ||
    value === "vanilla"
  );
}

function isLanguage(value: unknown): value is Language {
  return value === "ts" || value === "js" || value === "mixed";
}

function isStrictness(value: unknown): value is Strictness {
  return value === "relaxed" || value === "moderate" || value === "strict";
}

function isExperience(value: unknown): value is Experience {
  return value === "beginner" || value === "mixed" || value === "senior";
}

function isConcern(value: unknown): value is Concern {
  return (
    value === "prettier" ||
    value === "imports" ||
    value === "a11y" ||
    value === "security" ||
    value === "perf" ||
    value === "testing"
  );
}

function toBase64(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8").toString("base64");
  }

  const bytes = new TextEncoder().encode(input);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function fromBase64(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "base64").toString("utf8");
  }

  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function toBase64Url(input: string): string {
  return toBase64(input)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : `${normalized}${"=".repeat(4 - padding)}`;

  return fromBase64(padded);
}

export function encodeAnswers(answers: Partial<QuizAnswers>): string {
  return toBase64Url(JSON.stringify(answers));
}

export function decodeAnswers(id: string): Partial<QuizAnswers> {
  try {
    const decoded = fromBase64Url(id);
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    const answers: Partial<QuizAnswers> = {};

    if (isFramework(parsed.framework)) {
      answers.framework = parsed.framework;
    }

    if (isLanguage(parsed.lang)) {
      answers.lang = parsed.lang;
    }

    if (isStrictness(parsed.strictness)) {
      answers.strictness = parsed.strictness;
    }

    if (Array.isArray(parsed.concerns)) {
      const concerns = parsed.concerns.filter((value) => isConcern(value));

      answers.concerns = concerns;
    }

    if (isExperience(parsed.experience)) {
      answers.experience = parsed.experience;
    }

    return answers;
  } catch {
    return {};
  }
}

export function buildShareUrl(
  answers: Partial<QuizAnswers>,
  origin?: string,
): string {
  const resolvedOrigin =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : "");
  const resultPath = `/result/${encodeAnswers(answers)}`;

  return resolvedOrigin ? `${resolvedOrigin}${resultPath}` : resultPath;
}
