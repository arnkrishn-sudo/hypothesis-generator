export interface HypothesisInput {
  targetAudience: string
  location: string
  proposedChange: string
  userProblem: string
  expectedOutcome: string
  direction: string
  reasoning: string
  decisionMetric?: string
  guardrailMetric?: string
  notes?: string
}

export function buildHypothesisFromTemplate(input: HypothesisInput): string {
  const audienceClause = input.targetAudience.trim()
    ? ` for ${input.targetAudience.trim()}`
    : ''

  const direction = input.direction.trim().toLowerCase()
  let yClause = `${input.expectedOutcome.trim()} will ${direction}`

  if (input.decisionMetric?.trim()) {
    yClause += `, measured by ${input.decisionMetric.trim()}`
  }

  return `If ${input.proposedChange.trim()} at ${input.location.trim()}${audienceClause}, then ${yClause}, because ${input.reasoning.trim()}.`
}
