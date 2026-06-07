export interface RubricItem {
  criterion: string
  passed: boolean
  comment: string
}

export interface ParsedCoachResult {
  classification: 'Strong Hypothesis' | 'Needs Improvement'
  score: number
  rubric: RubricItem[]
  suggestions: string[]
  improvedHypothesis?: string
  alternativeMechanisms?: string[]
}

const RUBRIC_LABELS = [
  'X – Clear change',
  'X – Located/contextualized change',
  'Y – Observable outcome',
  'Direction stated',
  'Z – Reasoning mechanism',
  'Measurement leakage',
] as const

export function parseCoachResponse(raw: string): ParsedCoachResult {
  const classification = /strong hypothesis/i.test(raw)
    ? 'Strong Hypothesis'
    : 'Needs Improvement'

  const rubric: RubricItem[] = RUBRIC_LABELS.map((criterion) => {
    const escaped = criterion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`${escaped}[:\\s]+(Pass|Needs work|None detected|Present)[^\\n]*`, 'i')
    const match = raw.match(regex)
    const line = match?.[0] ?? ''
    const passed =
      /pass/i.test(line) ||
      /none detected/i.test(line) ||
      (!/needs work/i.test(line) && !/present/i.test(line) && classification === 'Strong Hypothesis')

    const comment = line.replace(/^[^:]*:\s*/i, '').trim() || 'No comment provided.'

    return { criterion, passed, comment }
  })

  const score = rubric.filter((r) => r.passed).length

  const feedbackSection = raw.match(
    /coaching feedback[:\s]*([\s\S]*?)(?=suggested rewrite|alternative|$)/i,
  )
  const suggestions = (feedbackSection?.[1] ?? '')
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)

  const rewriteMatch = raw.match(
    /suggested rewrite[^:]*:?\s*([\s\S]*?)(?=alternative|$)/i,
  )
  const improvedHypothesis = rewriteMatch?.[1]?.trim().split('\n')[0]

  const altMatch = raw.match(/alternative[^:]*:?\s*([\s\S]*?)$/i)
  const alternativeMechanisms = (altMatch?.[1] ?? '')
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 2)

  return {
    classification,
    score,
    rubric,
    suggestions: suggestions.length > 0 ? suggestions : ['Review coach output for details.'],
    improvedHypothesis,
    alternativeMechanisms:
      alternativeMechanisms.length > 0 ? alternativeMechanisms : undefined,
  }
}
