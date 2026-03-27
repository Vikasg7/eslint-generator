import type { QuizAnswers } from "@/types/quiz"

export function encodeAnswers(answers: Partial<QuizAnswers>): string {
  const json = JSON.stringify(answers)
  let b64: string
  if (typeof btoa !== "undefined") {
    b64 = btoa(json)
  } else {
    b64 = Buffer.from(json, "utf-8").toString("base64")
  }
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export function decodeAnswers(id: string): Partial<QuizAnswers> {
  try {
    const base64 = id.replace(/-/g, "+").replace(/_/g, "/")
    const padded  = base64 + "==".slice(0, (4 - (base64.length % 4)) % 4)
    let json: string
    if (typeof atob !== "undefined") {
      json = atob(padded)
    } else {
      json = Buffer.from(padded, "base64").toString("utf-8")
    }
    return JSON.parse(json) as Partial<QuizAnswers>
  } catch {
    return {}
  }
}

export function buildShareUrl(
  answers: Partial<QuizAnswers>,
  origin?: string
): string {
  const id   = encodeAnswers(answers)
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "")
  return `${base}/result/${id}`
}