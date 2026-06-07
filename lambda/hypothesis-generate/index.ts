import { buildHypothesisFromTemplate, type HypothesisInput } from './buildHypothesisFromTemplate'
import { parseCoachResponse } from './parseCoachResponse'
import {
  HYPOTHESIS_COACH_SYSTEM_PROMPT,
  buildCoachUserMessage,
} from '../prompts/hypothesis-coach'

const VALID_MODEL_IDS = new Set([
  'amazon.nova-pro-v1:0',
  'anthropic.claude-3-sonnet-20240229-v1:0',
  'anthropic.claude-3-haiku-20240307-v1:0',
  'cohere.command-r-plus-v1:0',
  'meta.llama3-8b-instruct-v1:0',
  'openai.gpt-oss-20b-1:0',
  'google.gemma-3-4b-it',
  'qwen.qwen3-vl-235b-a22b',
])

interface GenerateRequest {
  input: HypothesisInput
  selectedModels: string[]
}

// TODO: implement Bedrock Converse call
async function invokeCoach(modelId: string, hypothesis: string): Promise<string> {
  void modelId
  void HYPOTHESIS_COACH_SYSTEM_PROMPT
  void buildCoachUserMessage(hypothesis)
  throw new Error('Bedrock coach invocation not yet implemented')
}

export async function handler(event: { body?: string }) {
  try {
    const body = JSON.parse(event.body ?? '{}') as GenerateRequest
    const { input, selectedModels } = body

    if (!input || !selectedModels?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'input and selectedModels are required' }),
      }
    }

    const invalid = selectedModels.filter((id) => !VALID_MODEL_IDS.has(id))
    if (invalid.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Invalid model IDs: ${invalid.join(', ')}` }),
      }
    }

    const generatedHypothesis = buildHypothesisFromTemplate(input)

    const results = await Promise.all(
      selectedModels.map(async (modelId) => {
        const coachRaw = await invokeCoach(modelId, generatedHypothesis)
        const parsed = parseCoachResponse(coachRaw)
        return {
          modelId,
          generatedHypothesis,
          ...parsed,
        }
      }),
    )

    results.sort((a, b) => b.score - a.score)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results }),
    }
  } catch (error) {
    console.error('hypothesis-generate error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
