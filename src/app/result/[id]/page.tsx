import Link from "next/link"
import { decodeAnswers }   from "@/lib/encodeAnswers"
import { generateConfig }  from "@/lib/generateConfig"
import { ConfigOutput }    from "@/components/ConfigOutput"
import { RuleExplainer }   from "@/components/RuleExplainer"
import { InstallCommand }  from "@/components/InstallCommand"
import { ShareButton }     from "@/components/ShareButton"

interface Props {
  params: Promise<{ id: string }> | { id: string }
}

const LABEL_MAP: Record<string, string> = {
  react: "React", vue: "Vue", node: "Node.js", vanilla: "Vanilla JS",
  ts: "TypeScript", js: "JavaScript", mixed: "TS + JS",
  relaxed: "Relaxed", moderate: "Moderate", strict: "Strict",
  beginner: "Beginners", senior: "Senior devs",
  prettier: "Prettier", imports: "Import order",
  a11y: "Accessibility", security: "Security",
  perf: "Performance", testing: "Testing",
  promises: "Promise safety",
  cleanup: "Cleanup",
  maintainability: "Maintainability",
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  const answers = decodeAnswers(id)
  const config  = generateConfig(answers)

  const tags: string[] = [
    answers.framework  ? (LABEL_MAP[answers.framework]  ?? answers.framework)  : "",
    answers.lang       ? (LABEL_MAP[answers.lang]       ?? answers.lang)       : "",
    answers.strictness ? (LABEL_MAP[answers.strictness] ?? answers.strictness) : "",
    answers.experience ? (LABEL_MAP[answers.experience] ?? answers.experience) : "",
    ...(answers.concerns ?? []).map((c) => LABEL_MAP[c] ?? c),
  ].filter(Boolean)

  return (
    <main className="result-layout">
      <header className="site-header result-topbar">
        <span className="logo-mono">ESLINT GENERATOR</span>
        <Link href="/" className="back-link">← back to quiz</Link>
      </header>

      <div className="tags-row">
        {tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        <span className="tag tag-accent">{config.rules.length} rules</span>
      </div>

      <div className="result-grid">
        <div className="result-col">
          <ConfigOutput config={config} />
          <ShareButton  answers={answers} />
        </div>
        <div className="result-col">
          <InstallCommand installCmd={config.installCmd} />
          <RuleExplainer  rules={config.rules} />
        </div>
      </div>
    </main>
  )
}
