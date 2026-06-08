import { ArrowRight, BarChart2 } from 'lucide-react'
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
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start gap-3 border-b border-black/5 bg-bg-main/10 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-main">
          <BarChart2 className="h-4 w-4 text-text-secondary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Model Comparison Matrix</h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            Sorted by review strictness — models flagging the most issues appear first
          </p>
        </div>
      </div>

      <div className="flex-1 p-6">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-secondary">
            <LoadingSpinner />
            <p className="text-sm">Evaluating hypotheses across models...</p>
          </div>
        )}

        {!isGenerating && !results && (
          <div className="flex items-center justify-center py-16 text-center">
            <p className="text-sm text-text-secondary">
              Generate hypotheses to compare coach evaluations across models.
            </p>
          </div>
        )}

        {!isGenerating && results && results.length > 0 && (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    <th className="pb-3 pr-4">Model</th>
                    <th className="pb-3 pr-4">Classification</th>
                    <th className="pb-3 pr-4">Score</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.modelId} className="border-b border-black/5 last:border-0">
                      <td className="py-4 pr-4 font-medium text-text-primary">
                        {getModelDisplayName(result.modelId)}
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
                      <td className="py-4 pr-4 font-medium text-text-primary">
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
                  className="space-y-3 rounded-lg border border-black/5 bg-bg-main/30 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-primary">
                      {getModelDisplayName(result.modelId)}
                    </span>
                    <span className="text-sm font-medium text-text-secondary">
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

            <p className="mt-4 text-xs italic text-text-secondary">
              * Sorted ascending by coach score (strictest reviewers first). Models scoring 5/6
              and above are categorized as Strong Hypotheses.
            </p>
          </>
        )}
      </div>
    </Card>
  )
}
