import type { ModelResult, RubricItem } from '../types/hypothesis'
import { RUBRIC_CRITERIA, classifyScore } from '../types/hypothesis'

interface MockCoachResult {
  modelId: string
  score: number
  suggestions: string[]
  improvedHypothesis: string
  alternativeMechanisms?: string[]
}

function buildRubric(passedCount: number): RubricItem[] {
  const comments: Record<string, { pass: string; fail: string }> = {
    'X – Clear change': {
      pass: 'The variant change is specific and actionable.',
      fail: '"Changing the banner" does not specify what about the banner is changing.',
    },
    'X – Located/contextualized change': {
      pass: 'Audience and journey step are clearly stated.',
      fail: 'No page, screen, journey step, or audience is identified.',
    },
    'Y – Observable outcome': {
      pass: 'Outcome can be measured through user behavior.',
      fail: '"Engagement" is broad and not directly observable as written.',
    },
    'Direction stated': {
      pass: '"Increase" clearly states the direction of change.',
      fail: 'Direction is implied but not clearly stated.',
    },
    'Z – Reasoning mechanism': {
      pass: 'Causal mechanism linking change to outcome is articulated.',
      fail: 'No explanation of why the change should affect behavior.',
    },
    'Measurement leakage': {
      pass: '',
      fail: 'Decision or guardrail metrics appear inside the hypothesis.',
    },
  }

  return RUBRIC_CRITERIA.map((criterion, i) => {
    const passed = i < passedCount
    return {
      criterion,
      passed,
      comment: passed ? comments[criterion].pass : comments[criterion].fail,
    }
  })
}

function toModelResult(coach: MockCoachResult, generatedHypothesis: string): ModelResult {
  return {
    modelId: coach.modelId,
    generatedHypothesis,
    score: coach.score,
    classification: classifyScore(coach.score),
    rubric: buildRubric(coach.score),
    suggestions: coach.suggestions,
    improvedHypothesis: coach.improvedHypothesis,
    alternativeMechanisms: coach.alternativeMechanisms,
  }
}

const MOCK_COACH_RESULTS: MockCoachResult[] = [
  {
    modelId: 'anthropic.claude-sonnet-4-5-20250929-v1:0',
    score: 6,
    suggestions: [
      'Consider specifying the promotional window duration in the hypothesis.',
      'Ensure the countdown timer behavior is described as part of the variant.',
    ],
    improvedHypothesis:
      'If we add a 15% discount badge, three Premium benefit bullets, and a promotional countdown timer to the Account Dashboard upgrade pop-up banner for expired premium trial users, then premium subscription conversion rate will increase, because reduced price sensitivity and renewed value clarity motivate users who already experienced Premium during trial to resubscribe before the offer expires.',
    alternativeMechanisms: [
      'Social proof mechanism: showing number of users who upgraded this week',
      'Loss aversion mechanism: highlighting features users lose without Premium',
    ],
  },
  {
    modelId: 'amazon.nova-pro-v1:0',
    score: 5,
    suggestions: [
      'Tighten the causal mechanism by naming specific Premium benefits.',
      'Confirm the countdown timer is described as part of the variant change.',
    ],
    improvedHypothesis:
      'If we add a 15% discount badge, three Premium benefit bullets, and a countdown timer to the Account Dashboard upgrade pop-up banner for expired premium trial users, then premium subscription conversion rate will increase, because affordability cues and feature reminders reduce upgrade hesitation after trial expiration.',
  },
  {
    modelId: 'meta.llama3-70b-instruct-v1:0',
    score: 5,
    suggestions: [
      'Strengthen the causal mechanism by naming specific benefits.',
      'Lead with audience and location in the opening clause.',
    ],
    improvedHypothesis:
      'If we present a 15% discount badge with three Premium benefit bullets on the Account Dashboard upgrade pop-up banner for expired premium trial users, then premium subscription conversion rate will increase, because promotional pricing and explicit benefit reminders address value uncertainty after trial expiration.',
    alternativeMechanisms: [
      'Anchoring mechanism: showing original price struck through next to discounted price',
    ],
  },
  {
    modelId: 'anthropic.claude-haiku-4-5-20251001-v1:0',
    score: 4,
    suggestions: [
      'Ensure audience is named explicitly in the If clause.',
      'Verify the outcome is stated as an observable behavior change.',
      'Describe the countdown timer as part of the variant.',
    ],
    improvedHypothesis:
      'If we add a 15% discount badge with Premium benefit bullets and a countdown timer to the Account Dashboard upgrade pop-up banner for expired premium trial users, then premium subscription conversion rate will increase, because clearer value communication and promotional urgency reduce post-trial upgrade hesitation.',
  },
  {
    modelId: 'meta.llama3-8b-instruct-v1:0',
    score: 4,
    suggestions: [
      'Replace vague phrasing with specific variant UI details.',
      'State the journey step and audience in the hypothesis opening.',
      'Articulate a stronger causal mechanism beyond general motivation claims.',
    ],
    improvedHypothesis:
      'If we display a 15% discount badge and three Premium benefit bullets on the Account Dashboard upgrade pop-up banner for expired premium trial users, then premium subscription conversion rate will increase, because explicit pricing incentive and feature reminders address uncertainty about ongoing Premium value.',
  },
  {
    modelId: 'openai.gpt-oss-20b-1:0',
    score: 3,
    suggestions: [
      'Define the specific UI changes in the variant.',
      'Name the exact location (Account Dashboard pop-up banner).',
      'Replace generic reasoning with a hypothesis-specific causal mechanism.',
      'State measurable outcome and direction explicitly.',
    ],
    improvedHypothesis:
      'If we add a 15% discount badge and Premium benefit bullets to the Account Dashboard upgrade pop-up banner for expired premium trial users, then premium subscription conversion rate will increase, because targeted promotional messaging reduces price friction for users already familiar with Premium features.',
  },
  {
    modelId: 'google.gemma-3-4b-it',
    score: 3,
    suggestions: [
      'Use full hypothesis structure: audience, location, change, outcome, direction, reasoning.',
      'Avoid overly generic causal claims.',
      'Include benefit bullets and countdown timer in the variant description.',
    ],
    improvedHypothesis:
      'If we [BANNER ELEMENT] on [PAGE/SCREEN] for [AUDIENCE], then [OUTCOME] will increase, because [MECHANISM].',
    alternativeMechanisms: [
      'Because it reduces cognitive effort required to evaluate the upgrade decision.',
      'Because it increases the salience of Premium benefits at the moment of decision.',
    ],
  },
  {
    modelId: 'qwen.qwen3-vl-235b-a22b',
    score: 2,
    suggestions: [
      'Specify target audience (expired premium trial users).',
      'Describe the exact variant change with UI details.',
      'State location, observable outcome, and direction.',
      'Provide a causal mechanism linking change to behavior change.',
    ],
    improvedHypothesis:
      'If we [CHANGE DETAIL] on [PAGE/SCREEN] for [AUDIENCE], then [OUTCOME] will increase, because [MECHANISM].',
    alternativeMechanisms: [
      'Because it reduces cognitive effort required to understand the upgrade value.',
      'Because it increases the visibility of time-sensitive promotional urgency.',
    ],
  },
]

export function getMockResultsForModels(
  selectedModels: string[],
  generatedHypothesis: string,
): ModelResult[] {
  return MOCK_COACH_RESULTS.filter((r) => selectedModels.includes(r.modelId))
    .map((coach) => toModelResult(coach, generatedHypothesis))
    .sort((a, b) => b.score - a.score)
}
