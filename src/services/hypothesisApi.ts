import type { HypothesisInput, ModelResult } from '../types/hypothesis'
import { buildHypothesisFromTemplate } from '../utils/buildHypothesisFromTemplate'
import { getMockResultsForModels } from './mockData'

const MOCK_DELAY_MS = 1200

export async function generateHypotheses(
  input: HypothesisInput,
  selectedModels: string[],
): Promise<ModelResult[]> {
  const generatedHypothesis = buildHypothesisFromTemplate(input)

  // MVP: return mocked coach results with simulated latency
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
  return getMockResultsForModels(selectedModels, generatedHypothesis)

  // TODO: replace with API Gateway call when backend is ready
  // const apiUrl = import.meta.env.VITE_HYPOTHESIS_API_URL
  // if (!apiUrl) throw new Error('VITE_HYPOTHESIS_API_URL is not configured')
  //
  // const response = await fetch(`${apiUrl}/hypothesis/generate`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ input, selectedModels }),
  // })
  //
  // if (!response.ok) {
  //   throw new Error(`API error: ${response.status} ${response.statusText}`)
  // }
  //
  // const data = (await response.json()) as { results: ModelResult[] }
  // return data.results.sort((a, b) => b.score - a.score)
}
