import Link from "next/link";

import { ConfigOutput } from "@/components/ConfigOutput";
import { InstallCommand } from "@/components/InstallCommand";
import { RuleExplainer } from "@/components/RuleExplainer";
import { ShareButton } from "@/components/ShareButton";
import { decodeAnswers } from "@/lib/encodeAnswers";
import { generateConfig } from "@/lib/generateConfig";

interface ResultPageProps {
  params: Promise<{ id: string }> | { id: string };
}

function formatAnswerTag(value: string): string {
  if (value === "ts") {
    return "TypeScript";
  }

  if (value === "js") {
    return "JavaScript";
  }

  if (value === "mixed") {
    return "Mixed";
  }

  if (value === "vanilla") {
    return "Vanilla";
  }

  if (value === "node") {
    return "Node";
  }

  if (value === "a11y") {
    return "A11y";
  }

  if (value === "perf") {
    return "Performance";
  }

  if (value === "prettier") {
    return "Prettier";
  }

  if (value === "imports") {
    return "Imports";
  }

  if (value === "security") {
    return "Security";
  }

  if (value === "testing") {
    return "Testing";
  }

  if (value === "beginner") {
    return "Beginner";
  }

  if (value === "senior") {
    return "Senior";
  }

  if (value === "relaxed") {
    return "Relaxed";
  }

  if (value === "moderate") {
    return "Moderate";
  }

  if (value === "strict") {
    return "Strict";
  }

  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const answers = decodeAnswers(id);
  const config = generateConfig(answers);
  const summaryTags = [
    answers.framework ? formatAnswerTag(answers.framework) : null,
    answers.lang ? formatAnswerTag(answers.lang) : null,
    answers.strictness ? formatAnswerTag(answers.strictness) : null,
    answers.experience ? formatAnswerTag(answers.experience) : null,
    ...(answers.concerns ?? []).map((concern) => formatAnswerTag(concern)),
  ].filter((value): value is string => Boolean(value));

  return (
    <main className="result-layout">
      <div className="result-top">
        <Link href="/" className="result-back">
          ← back to quiz
        </Link>
        <div className="result-copy">
          <span className="result-eyebrow">RESULT</span>
          <h1 className="result-title">Your ESLint config is ready.</h1>
        </div>
      </div>

      <div className="tags-row">
        {summaryTags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        <span className="tag tag-accent">{config.rules.length} rules</span>
      </div>

      <div className="result-grid">
        <div className="result-column">
          <ConfigOutput config={config} />
          <ShareButton answers={answers} />
        </div>
        <div className="result-column">
          <InstallCommand installCmd={config.installCmd} />
          <RuleExplainer rules={config.rules} />
        </div>
      </div>
    </main>
  );
}
