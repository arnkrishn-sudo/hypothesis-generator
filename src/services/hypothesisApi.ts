import type { HypothesisInput, ModelResult } from '../types/hypothesis'
import { buildHypothesisFromTemplate } from '../utils/buildHypothesisFromTemplate'
import { getMockResultsForModels } from './mockData'

const MOCK_DELAY_MS = 1200

export async function generateHypotheses(
  input: HypothesisInput,
  selectedModels: string[],
): Promise<ModelResult[]> {
  const apiUrl = import.meta.env.VITE_HYPOTHESIS_API_URL

  if (apiUrl) {
    const response = await fetch(`${apiUrl}/hypothesis/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, selectedModels }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const detail =
        typeof errorBody === 'object' && errorBody && 'error' in errorBody
          ? String((errorBody as { error?: string }).error)
          : response.statusText
      throw new Error(`API error: ${response.status} ${detail}`)
    }

    const data = (await response.json()) as { results: ModelResult[] }
    return data.results.sort((a, b) => b.score - a.score)
  }

  // Local fallback when VITE_HYPOTHESIS_API_URL is not set
  const generatedHypothesis = buildHypothesisFromTemplate(input)
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
  return getMockResultsForModels(selectedModels, generatedHypothesis)
}
