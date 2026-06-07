import { Sparkles } from 'lucide-react'
import type { ModelResult } from '../../types/hypothesis'
import { getModelDisplayName } from '../../types/hypothesis'
import { Card } from '../ui/Card'
import { CoachBulletList } from './CoachBulletList'
import { CoachClassificationLine } from './CoachClassificationLine'
import { CoachSection } from './CoachSection'
import { HighlightedRewrite } from './HighlightedRewrite'
import { RubricScorecard } from './RubricScorecard'

interface ModelAnalysisCardProps {
  result: ModelResult
  isActive: boolean
}

export function ModelAnalysisCard({ result, isActive }: ModelAnalysisCardProps) {
  return (
    <Card
      id={`analysis-card-${result.modelId}`}
      className={`scroll-mt-6 overflow-hidden transition-shadow ${isActive ? 'ring-2 ring-violet-300' : ''}`}
    >
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-semibold text-slate-900">
              {getModelDisplayName(result.modelId)}
            </h3>
            <span className="text-xs text-slate-400">— Coach Output</span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Coach score: {result.score} / 6
          </span>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Generated Hypothesis
          </p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {result.generatedHypothesis}
          </p>
        </div>

        <CoachSection number={1} title="Classification (visual):">
          <CoachClassificationLine classification={result.classification} />
        </CoachSection>

        <CoachSection number={2} title="Rubric scorecard:">
          <RubricScorecard rubric={result.rubric} />
        </CoachSection>

        <CoachSection number={3} title="Coaching feedback:">
          <CoachBulletList items={result.suggestions} />
        </CoachSection>

        {result.improvedHypothesis && (
          <CoachSection number={4} title="Suggested rewrite (If / Then / Because):">
            <HighlightedRewrite text={result.improvedHypothesis} />
          </CoachSection>
        )}

        {result.alternativeMechanisms && result.alternativeMechanisms.length > 0 && (
          <CoachSection number={5} title='Optional alternative "Because" mechanisms:'>
            <CoachBulletList items={result.alternativeMechanisms} />
          </CoachSection>
        )}
      </div>
    </Card>
  )
}
