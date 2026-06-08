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
      className={`scroll-mt-6 transition-shadow ${isActive ? 'ring-2 ring-primary/30' : ''}`}
    >
      <div className="border-b border-black/5 bg-bg-main/10 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-text-primary">
              {getModelDisplayName(result.modelId)}
            </h3>
            <span className="text-xs text-text-secondary">— Coach Output</span>
          </div>
          <span className="text-xs font-medium text-text-secondary">
            Coach score: {result.score} / 6
          </span>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Generated Hypothesis
          </p>
          <p className="rounded-lg border border-black/5 bg-bg-main/30 p-4 text-sm leading-relaxed text-text-primary">
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
