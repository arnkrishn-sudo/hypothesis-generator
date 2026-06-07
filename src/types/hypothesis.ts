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

export interface RubricItem {
  criterion: string
  passed: boolean
  comment: string
}

export interface ModelResult {
  modelId: string
  generatedHypothesis: string
  classification: 'Strong Hypothesis' | 'Needs Improvement'
  score: number
  rubric: RubricItem[]
  suggestions: string[]
  improvedHypothesis?: string
  alternativeMechanisms?: string[]
}

export interface BedrockModel {
  modelId: string
  displayName: string
}

export const BEDROCK_MODEL_POOL: BedrockModel[] = [
  { modelId: 'amazon.nova-pro-v1:0', displayName: 'Amazon Nova Pro' },
  { modelId: 'amazon.nova-lite-v1:0', displayName: 'Amazon Nova Lite' },
  { modelId: 'mistral.mistral-large-3-675b-instruct', displayName: 'Mistral Large 3' },
  { modelId: 'meta.llama3-70b-instruct-v1:0', displayName: 'Llama 3 70B Instruct' },
  { modelId: 'meta.llama3-8b-instruct-v1:0', displayName: 'Llama 3 8B Instruct' },
  { modelId: 'openai.gpt-oss-20b-1:0', displayName: 'OpenAI GPT OSS 20B' },
  { modelId: 'google.gemma-3-4b-it', displayName: 'Google Gemma 3 4B' },
  { modelId: 'qwen.qwen3-vl-235b-a22b', displayName: 'Qwen3 VL 235B' },
]

export const DIRECTION_OPTIONS = ['Increase', 'Decrease', 'Shift'] as const

export const RUBRIC_CRITERIA = [
  'X – Clear change',
  'X – Located/contextualized change',
  'Y – Observable outcome',
  'Direction stated',
  'Z – Reasoning mechanism',
  'Measurement leakage',
] as const

export const DEFAULT_FORM_VALUES: HypothesisInput = {
  targetAudience: 'Expired premium trial users',
  location: 'Account Dashboard upgrade pop-up banner',
  proposedChange:
    'Add a prominent 15% discount code badge paired with 3 core value-add bullets pointing to Premium benefits (offline downloads, ad-free listening, unlimited skips). The banner will include a countdown timer showing days remaining in the promotional window.',
  userProblem:
    'Expired trial users hesitate to upgrade because they do not clearly see the ongoing value of Premium beyond the trial experience. The current banner lacks urgency and does not articulate specific benefits that address their friction points.',
  expectedOutcome: 'Premium subscription conversion rate',
  direction: 'Increase',
  reasoning:
    'A time-limited discount combined with explicit benefit reminders reduces price sensitivity and clarifies value, which should motivate users who already experienced Premium features during trial to resubscribe.',
  decisionMetric: '',
  guardrailMetric: '',
  notes: '',
}

export const DEFAULT_SELECTED_MODELS = BEDROCK_MODEL_POOL.map((m) => m.modelId)

export function getModelDisplayName(modelId: string): string {
  return BEDROCK_MODEL_POOL.find((m) => m.modelId === modelId)?.displayName ?? modelId
}

export function classifyScore(score: number): ModelResult['classification'] {
  return score >= 5 ? 'Strong Hypothesis' : 'Needs Improvement'
}
