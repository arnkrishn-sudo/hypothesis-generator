import { ArrowRight, BarChart2, Trophy } from 'lucide-react'
import type { ModelResult } from '../../types/hypothesis'
import { getModelDisplayName } from '../../types/hypothesis'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface ModelComparisonMatrixProps {
  results: ModelResult[] | null
  isGenerating: boolean
  onAnalyze: (modelId: string) => void
}

export function ModelComparisonMatrix({
  results,
  isGenerating,
  onAnalyze,
}: ModelComparisonMatrixProps) {
  const topScorerModelId =
    results && results.length > 0
      ? results.reduce((best, curr) => (curr.score > best.score ? curr : best)).modelId
      : null

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <BarChart2 className="h-4 w-4 text-slate-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Model Comparison Matrix</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Sorted by review strictness — models flagging the most issues appear first
          </p>
        </div>
      </div>

      <div className="flex-1 p-6">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <LoadingSpinner />
            <p className="text-sm">Evaluating hypotheses across models...</p>
          </div>
        )}

        {!isGenerating && !results && (
          <div className="flex items-center justify-center py-16 text-center">
            <p className="text-sm text-slate-400">
              Generate hypotheses to compare coach evaluations across models.
            </p>
          </div>
        )}

        {!isGenerating && results && results.length > 0 && (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <th className="pb-3 pr-4">Model</th>
                    <th className="pb-3 pr-4">Classification</th>
                    <th className="pb-3 pr-4">Score</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.modelId} className="border-b border-slate-50 last:border-0">
                      <td className="py-4 pr-4 font-medium text-slate-800">
                        <span className="inline-flex items-center gap-2">
                          {result.modelId === topScorerModelId && (
                            <Trophy className="h-4 w-4 text-amber-500" aria-label="Top scorer" />
                          )}
                          {getModelDisplayName(result.modelId)}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge
                          label={result.classification}
                          variant={
                            result.classification === 'Strong Hypothesis'
                              ? 'strong'
                              : 'needs-improvement'
                          }
                        />
                      </td>
                      <td className="py-4 pr-4 font-medium text-slate-700">
                        {result.score} / 6
                      </td>
                      <td className="py-4">
                        <Button variant="outline" onClick={() => onAnalyze(result.modelId)}>
                          Analyze Card
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 sm:hidden">
              {results.map((result) => (
                <div
                  key={result.modelId}
                  className="rounded-lg border border-slate-100 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                      {result.modelId === topScorerModelId && (
                        <Trophy className="h-4 w-4 text-amber-500" />
                      )}
                      {getModelDisplayName(result.modelId)}
                    </span>
                    <span className="text-sm font-medium text-slate-600">
                      {result.score} / 6
                    </span>
                  </div>
                  <Badge
                    label={result.classification}
                    variant={
                      result.classification === 'Strong Hypothesis'
                        ? 'strong'
                        : 'needs-improvement'
                    }
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => onAnalyze(result.modelId)}
                  >
                    Analyze Card
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs italic text-slate-400">
              * Sorted ascending by coach score (strictest reviewers first). The trophy marks the
              highest-scoring coach. Models scoring 5/6 and above are categorized as Strong
              Hypotheses.
            </p>
          </>
        )}
      </div>
    </Card>
  )
}
