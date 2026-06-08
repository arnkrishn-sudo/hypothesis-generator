import { Copy, Trophy } from 'lucide-react'
import type { ModelResult } from '../../types/hypothesis'
import { getModelDisplayName } from '../../types/hypothesis'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { CoachClassificationLine } from './CoachClassificationLine'
import { HighlightedRewrite } from './HighlightedRewrite'

interface RecommendedHypothesisCardProps {
  result: ModelResult
  isImprovedExpanded: boolean
  onToggleImproved: () => void
  onCopy: (text: string) => void
}

export function RecommendedHypothesisCard({
  result,
  isImprovedExpanded,
  onToggleImproved,
  onCopy,
}: RecommendedHypothesisCardProps) {
  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="flex items-center gap-2 border-b border-primary/10 bg-primary/5 px-6 py-5">
        <Trophy className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-base font-semibold text-text-primary">Recommended Hypothesis</h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            Top coach score — {getModelDisplayName(result.modelId)} ({result.score} / 6)
          </p>
        </div>
      </div>

      <div className="space-y-4 px-6 py-6">
        <div>
          <p className="mb-2 text-sm font-bold text-text-primary">1. Classification (visual):</p>
          <CoachClassificationLine classification={result.classification} />
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Generated Hypothesis
          </p>
          <p className="rounded-lg border border-black/5 bg-bg-main/30 p-4 text-sm leading-relaxed text-text-primary">
            {result.generatedHypothesis}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => onCopy(result.generatedHypothesis)}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          {result.improvedHypothesis && (
            <Button variant="outline" onClick={onToggleImproved}>
              {isImprovedExpanded ? 'Hide Improved Version' : 'Show Improved Version'}
            </Button>
          )}
        </div>

        {isImprovedExpanded && result.improvedHypothesis && (
          <div>
            <p className="mb-2 text-sm font-bold text-text-primary">
              4. Suggested rewrite (If / Then / Because):
            </p>
            <HighlightedRewrite text={result.improvedHypothesis} />
          </div>
        )}
      </div>
    </Card>
  )
}
